ALTER TABLE domains ADD COLUMN owner TEXT;
ALTER TABLE domains ADD COLUMN processed_at INTEGER;

CREATE INDEX IF NOT EXISTS idx_domains_processed_at ON domains(processed_at);
