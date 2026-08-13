-- Disable email notifications for all centrally managed IP rate-limit rules,
-- including every PATH_PATTERN row displayed under "Active auto-block rules".
--
-- Run this migration against the anhmedia.vn super-user PostgreSQL database.
-- It does not disable or delete any IP-filter rule; only email alerts are disabled.

BEGIN;

UPDATE ip_rate_limit_rules
SET
    email_alert = FALSE,
    updated_at = CURRENT_TIMESTAMP
WHERE email_alert IS DISTINCT FROM FALSE;

-- Verification result: every row should report email_alert = false.
SELECT
    id,
    rule_type,
    path_pattern,
    enabled,
    email_alert,
    email_recipient,
    updated_at
FROM ip_rate_limit_rules
ORDER BY id;

COMMIT;
