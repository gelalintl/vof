-- Passe UserRole à SUPERADMIN, REDACTEUR, COMPTABLE.
-- ADMIN et EDITOR deviennent REDACTEUR. Sans effet si EDITOR a déjà disparu.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_enum
    JOIN pg_type ON pg_enum.enumtypid = pg_type.oid
    WHERE pg_type.typname = 'UserRole'
      AND pg_enum.enumlabel = 'EDITOR'
  ) THEN
    RETURN;
  END IF;

  EXECUTE 'CREATE TYPE "UserRole_new" AS ENUM (''SUPERADMIN'', ''REDACTEUR'', ''COMPTABLE'')';
  EXECUTE 'ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT';
  EXECUTE $sql$
    ALTER TABLE "User"
    ALTER COLUMN "role" TYPE "UserRole_new"
    USING (
      CASE WHEN "role"::text = 'SUPERADMIN' THEN 'SUPERADMIN' ELSE 'REDACTEUR' END
    )::"UserRole_new"
  $sql$;
  EXECUTE 'DROP TYPE "UserRole"';
  EXECUTE 'ALTER TYPE "UserRole_new" RENAME TO "UserRole"';
  EXECUTE 'ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT ''REDACTEUR''';
END $$;
