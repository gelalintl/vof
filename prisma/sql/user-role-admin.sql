-- Ajoute ADMIN à UserRole sans toucher aux comptes existants.
ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'ADMIN';
