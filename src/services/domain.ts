/**
 * Domain Management Service
 * Handles domain record CRUD operations
 */

import { Domain, DomainInput, DomainFilters, ApiResponse, DomainStatus } from '../types';
import { validateDomainInput, isValidDomainStatus } from '../utils/validation';
import { calculateExpiryDate, calculateReminderDate, dateToTimestamp, timestampToDate } from '../utils/date';

export class DomainService {
  constructor(private db: D1Database) {}

  private normalizeOptionalText(value: unknown, maxLength: number): string | null {
    if (typeof value !== 'string') {
      return null;
    }

    const trimmed = value.trim();
    if (!trimmed) {
      return null;
    }

    return trimmed.slice(0, maxLength);
  }

  private normalizeStatusNote(note: unknown): string | null {
    return this.normalizeOptionalText(note, 500);
  }

  private normalizeOwner(owner: unknown): string | null {
    return this.normalizeOptionalText(owner, 120);
  }

  private normalizeTimestamp(value: unknown): number | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    if (value instanceof Date) {
      return dateToTimestamp(value);
    }

    if (typeof value === 'number' && Number.isFinite(value)) {
      return Math.floor(value);
    }

    return null;
  }

  private calculateReminderDaysOffset(expiryDate: Date, reminderStartDate: Date): number {
    const diff = expiryDate.getTime() - reminderStartDate.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  /**
   * Batch add multiple domains
   */
  async batchAddDomains(
    userId: string,
    inputs: DomainInput[]
  ): Promise<ApiResponse<{ successCount: number; failedCount: number; errors: Array<{ index: number; domain: string; error: string }> }>> {
    const results = {
      successCount: 0,
      failedCount: 0,
      errors: [] as Array<{ index: number; domain: string; error: string }>,
    };

    try {
      // Prepare all statements
      const statements: D1PreparedStatement[] = [];
      const now = Math.floor(Date.now() / 1000);

      for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i];

        // Validate input
        const validation = validateDomainInput(input);
        if (!validation.valid) {
          results.failedCount++;
          results.errors.push({
            index: i,
            domain: input.domainAddress,
            error: validation.errors?.join(', ') || 'Validation failed',
          });
          continue;
        }

        // Calculate dates
        const expiryDate = calculateExpiryDate(input.registrationDate, input.usagePeriodYears);
        const reminderStartDate = calculateReminderDate(expiryDate, input.reminderDaysOffset);
        const domainId = crypto.randomUUID();

        // Add to batch
        statements.push(
          this.db
            .prepare(
              `INSERT INTO domains (
                id, user_id, domain_address, renewal_url, registration_date,
                usage_period_years, expiry_date, reminder_days_offset, reminder_start_date,
                reminder_email, reminder_count, reminders_sent, created_at, updated_at
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)`
            )
            .bind(
              domainId,
              userId,
              input.domainAddress,
              input.renewalUrl,
              dateToTimestamp(input.registrationDate),
              input.usagePeriodYears,
              dateToTimestamp(expiryDate),
              input.reminderDaysOffset,
              dateToTimestamp(reminderStartDate),
              input.reminderEmail,
              input.reminderCount,
              now,
              now
            )
        );
      }

      // Execute batch
      if (statements.length > 0) {
        await this.db.batch(statements);
        results.successCount = statements.length;
      }

      return {
        success: true,
        data: results,
        message: `Batch import completed: ${results.successCount} succeeded, ${results.failedCount} failed`,
      };
    } catch (error) {
      console.error('Batch add domains error:', error);
      return {
        success: false,
        error: {
          code: 'BATCH_ADD_FAILED',
          message: 'Failed to batch add domains',
        },
      };
    }
  }

  /**
   * Add a new domain record
   */
  async addDomain(userId: string, input: DomainInput): Promise<ApiResponse<{ domainId: string }>> {
    try {
      // Validate input
      const validation = validateDomainInput(input);
      if (!validation.valid) {
        return {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid domain input',
            details: validation.errors,
          },
        };
      }

      // Calculate dates
      const expiryDate = calculateExpiryDate(input.registrationDate, input.usagePeriodYears);
      const reminderStartDate = calculateReminderDate(expiryDate, input.reminderDaysOffset);

      // Create domain record
      const domainId = crypto.randomUUID();
      const now = Math.floor(Date.now() / 1000);

      await this.db
        .prepare(
          `INSERT INTO domains (
            id, user_id, domain_address, renewal_url, registration_date,
            usage_period_years, expiry_date, reminder_days_offset, reminder_start_date,
            reminder_email, reminder_count, reminders_sent, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)`
        )
        .bind(
          domainId,
          userId,
          input.domainAddress,
          input.renewalUrl,
          dateToTimestamp(input.registrationDate),
          input.usagePeriodYears,
          dateToTimestamp(expiryDate),
          input.reminderDaysOffset,
          dateToTimestamp(reminderStartDate),
          input.reminderEmail,
          input.reminderCount,
          now,
          now
        )
        .run();

      return {
        success: true,
        data: { domainId },
        message: 'Domain added successfully',
      };
    } catch (error) {
      console.error('Add domain error:', error);
      return {
        success: false,
        error: {
          code: 'ADD_DOMAIN_FAILED',
          message: 'Failed to add domain',
        },
      };
    }
  }
  /**
   * Update a domain record
   */
  async updateDomain(
    userId: string,
    domainId: string,
    updates: Partial<DomainInput> & {
      reminderStartDate?: number | Date;
      status?: DomainStatus;
      statusNote?: string | null;
      owner?: string | null;
      processedAt?: number | Date | null;
    }
  ): Promise<ApiResponse> {
    try {
      // Get existing domain
      const existing = await this.db
        .prepare('SELECT * FROM domains WHERE id = ? AND user_id = ?')
        .bind(domainId, userId)
        .first<any>();

      if (!existing) {
        return {
          success: false,
          error: {
            code: 'DOMAIN_NOT_FOUND',
            message: 'Domain not found',
          },
        };
      }

      // Merge updates with existing data
      const merged = {
        domainAddress: updates.domainAddress || existing.domain_address,
        renewalUrl: updates.renewalUrl || existing.renewal_url,
        registrationDate: updates.registrationDate
          ? updates.registrationDate
          : new Date(existing.registration_date * 1000),
        usagePeriodYears: updates.usagePeriodYears ?? existing.usage_period_years,
        reminderDaysOffset: updates.reminderDaysOffset ?? existing.reminder_days_offset,
        reminderEmail: updates.reminderEmail || existing.reminder_email,
        reminderCount: updates.reminderCount ?? existing.reminder_count,
      };

      // Validate merged data
      const validation = validateDomainInput(merged);
      if (!validation.valid) {
        return {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid domain input',
            details: validation.errors,
          },
        };
      }

      // Recalculate expiry date first. Reminder date can either be derived from offset
      // or explicitly overridden by the edit form.
      const expiryDate = calculateExpiryDate(merged.registrationDate, merged.usagePeriodYears);
      const manualReminderStartDate =
        updates.reminderStartDate !== undefined
          ? updates.reminderStartDate instanceof Date
            ? updates.reminderStartDate
            : new Date(updates.reminderStartDate * 1000)
          : null;

      const reminderStartDate = manualReminderStartDate || calculateReminderDate(expiryDate, merged.reminderDaysOffset);
      const reminderDaysOffset = manualReminderStartDate
        ? this.calculateReminderDaysOffset(expiryDate, reminderStartDate)
        : merged.reminderDaysOffset;

      if (reminderDaysOffset < 1 || reminderDaysOffset > 365) {
        return {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Reminder start date must be between 1 and 365 days before expiry',
          },
        };
      }

      const nextStatus = updates.status ?? ((existing.status as DomainStatus | null) || 'active');
      if (!isValidDomainStatus(nextStatus)) {
        return {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid domain status',
          },
        };
      }

      const statusNote =
        updates.statusNote !== undefined ? this.normalizeStatusNote(updates.statusNote) : this.normalizeStatusNote(existing.status_note);
      const owner = updates.owner !== undefined ? this.normalizeOwner(updates.owner) : this.normalizeOwner(existing.owner);

      const now = Math.floor(Date.now() / 1000);
      const manualProcessedAt =
        updates.processedAt !== undefined ? this.normalizeTimestamp(updates.processedAt) : existing.processed_at ?? null;
      let processedAt = manualProcessedAt;

      if (nextStatus === 'handled') {
        processedAt = manualProcessedAt ?? now;
      } else if (updates.status !== undefined) {
        processedAt = null;
      }

      await this.db
        .prepare(
          `UPDATE domains SET
            domain_address = ?, renewal_url = ?, registration_date = ?,
            usage_period_years = ?, expiry_date = ?, reminder_days_offset = ?,
            reminder_start_date = ?, reminder_email = ?, reminder_count = ?,
            status = ?, status_note = ?, owner = ?, processed_at = ?,
            updated_at = ?
          WHERE id = ? AND user_id = ?`
        )
        .bind(
          merged.domainAddress,
          merged.renewalUrl,
          dateToTimestamp(merged.registrationDate),
          merged.usagePeriodYears,
          dateToTimestamp(expiryDate),
          reminderDaysOffset,
          dateToTimestamp(reminderStartDate),
          merged.reminderEmail,
          merged.reminderCount,
          nextStatus,
          statusNote,
          owner,
          processedAt,
          now,
          domainId,
          userId
        )
        .run();

      return {
        success: true,
        message: 'Domain updated successfully',
      };
    } catch (error) {
      console.error('Update domain error:', error);
      return {
        success: false,
        error: {
          code: 'UPDATE_DOMAIN_FAILED',
          message: 'Failed to update domain',
        },
      };
    }
  }

  /**
   * Delete a domain record
   */
  async deleteDomain(userId: string, domainId: string): Promise<ApiResponse> {
    try {
      const result = await this.db
        .prepare('DELETE FROM domains WHERE id = ? AND user_id = ?')
        .bind(domainId, userId)
        .run();

      if (result.meta.changes === 0) {
        return {
          success: false,
          error: {
            code: 'DOMAIN_NOT_FOUND',
            message: 'Domain not found',
          },
        };
      }

      return {
        success: true,
        message: 'Domain deleted successfully',
      };
    } catch (error) {
      console.error('Delete domain error:', error);
      return {
        success: false,
        error: {
          code: 'DELETE_DOMAIN_FAILED',
          message: 'Failed to delete domain',
        },
      };
    }
  }

  async renewDomain(
    userId: string,
    domainId: string
  ): Promise<ApiResponse<{ previousExpiryDate: number; nextExpiryDate: number }>> {
    try {
      const existing = await this.db
        .prepare('SELECT * FROM domains WHERE id = ? AND user_id = ?')
        .bind(domainId, userId)
        .first<Domain>();

      if (!existing) {
        return {
          success: false,
          error: {
            code: 'DOMAIN_NOT_FOUND',
            message: 'Domain not found',
          },
        };
      }

      const previousExpiryDate = existing.expiry_date;
      const nextRegistrationDate = timestampToDate(existing.expiry_date);
      const nextExpiryDate = calculateExpiryDate(nextRegistrationDate, existing.usage_period_years);
      const nextReminderStartDate = calculateReminderDate(nextExpiryDate, existing.reminder_days_offset);
      const now = Math.floor(Date.now() / 1000);

      await this.db
        .prepare(
          `UPDATE domains SET
            registration_date = ?,
            expiry_date = ?,
            reminder_start_date = ?,
            reminders_sent = 0,
            status = 'active',
            status_note = NULL,
            processed_at = ?,
            last_renewed_at = ?,
            updated_at = ?
          WHERE id = ? AND user_id = ?`
        )
        .bind(
          dateToTimestamp(nextRegistrationDate),
          dateToTimestamp(nextExpiryDate),
          dateToTimestamp(nextReminderStartDate),
          now,
          now,
          now,
          domainId,
          userId
        )
        .run();

      return {
        success: true,
        data: {
          previousExpiryDate,
          nextExpiryDate: dateToTimestamp(nextExpiryDate),
        },
        message: 'Domain renewed successfully',
      };
    } catch (error) {
      console.error('Renew domain error:', error);
      return {
        success: false,
        error: {
          code: 'RENEW_DOMAIN_FAILED',
          message: 'Failed to renew domain',
        },
      };
    }
  }

  /**
   * Get user's domains with optional filters and pagination
   */
  async getUserDomains(
    userId: string, 
    filters?: DomainFilters,
    page: number = 1,
    pageSize: number = 20
  ): Promise<ApiResponse<{
    domains: Domain[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }>> {
    try {
      let countQuery = 'SELECT COUNT(*) as count FROM domains WHERE user_id = ?';
      let query = 'SELECT * FROM domains WHERE user_id = ?';
      const params: any[] = [userId];
      const countParams: any[] = [userId];

      if (filters?.renewalUrl) {
        query += ' AND renewal_url = ?';
        countQuery += ' AND renewal_url = ?';
        params.push(filters.renewalUrl);
        countParams.push(filters.renewalUrl);
      }

      if (filters?.usagePeriodYears) {
        query += ' AND usage_period_years = ?';
        countQuery += ' AND usage_period_years = ?';
        params.push(filters.usagePeriodYears);
        countParams.push(filters.usagePeriodYears);
      }

      if (filters?.reminderCount) {
        query += ' AND reminder_count = ?';
        countQuery += ' AND reminder_count = ?';
        params.push(filters.reminderCount);
        countParams.push(filters.reminderCount);
      }

      if (filters?.status) {
        query += ' AND status = ?';
        countQuery += ' AND status = ?';
        params.push(filters.status);
        countParams.push(filters.status);
      }

      // Get total count
      const countResult = await this.db
        .prepare(countQuery)
        .bind(...countParams)
        .first<{ count: number }>();

      const total = countResult?.count || 0;
      const totalPages = Math.ceil(total / pageSize);

      // Get paginated results
      query += ' ORDER BY expiry_date ASC LIMIT ? OFFSET ?';
      const offset = (page - 1) * pageSize;
      params.push(pageSize, offset);

      const result = await this.db.prepare(query).bind(...params).all();

      return {
        success: true,
        data: {
          domains: result.results as Domain[],
          total,
          page,
          pageSize,
          totalPages,
        },
      };
    } catch (error) {
      console.error('Get domains error:', error);
      return {
        success: false,
        error: {
          code: 'GET_DOMAINS_FAILED',
          message: 'Failed to get domains',
        },
      };
    }
  }

  /**
   * Group domains by renewal URL
   */
  async groupByRenewalUrl(userId: string): Promise<ApiResponse<Record<string, Domain[]>>> {
    try {
      const result = await this.db
        .prepare('SELECT * FROM domains WHERE user_id = ? ORDER BY renewal_url, expiry_date')
        .bind(userId)
        .all();

      const grouped: Record<string, Domain[]> = {};

      for (const domain of result.results as Domain[]) {
        if (!grouped[domain.renewal_url]) {
          grouped[domain.renewal_url] = [];
        }
        grouped[domain.renewal_url].push(domain);
      }

      return {
        success: true,
        data: grouped,
      };
    } catch (error) {
      console.error('Group domains error:', error);
      return {
        success: false,
        error: {
          code: 'GROUP_DOMAINS_FAILED',
          message: 'Failed to group domains',
        },
      };
    }
  }
}
