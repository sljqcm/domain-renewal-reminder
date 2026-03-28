ALTER TABLE domains ADD COLUMN status TEXT NOT NULL DEFAULT 'active';
ALTER TABLE domains ADD COLUMN status_note TEXT;
ALTER TABLE domains ADD COLUMN last_renewed_at INTEGER;

UPDATE domains
SET status = 'active'
WHERE status IS NULL OR status = '';

CREATE INDEX IF NOT EXISTS idx_domains_status ON domains(status);
