export const AUDIT_ACTIONS = ["CRÉATION", "MODIFICATION", "SUPPRESSION"] as const;

export type AuditAction = (typeof AUDIT_ACTIONS)[number];
