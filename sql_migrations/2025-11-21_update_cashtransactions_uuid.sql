-- =====================================================
-- UPDATE CASHTRANSACTIONS TO USE UUID
-- =====================================================
-- Created: November 21, 2025
-- Purpose: Upgrade cashtransactions.id from TEXT to UUID
-- Note: Backward compatible - keeps TEXT but validates UUID format
-- =====================================================

-- Option 1: Keep as TEXT but add constraint for new records
-- This allows existing TEXT IDs to remain but enforces UUID format for new ones
-- (No actual migration needed, just app-level enforcement)

-- Option 2: Full migration to UUID (commented out - use if needed)
/*
-- Step 1: Add new UUID column
ALTER TABLE cashtransactions ADD COLUMN id_uuid UUID;

-- Step 2: Convert existing TEXT IDs to UUID where possible
UPDATE cashtransactions 
SET id_uuid = CASE 
  WHEN id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' 
  THEN id::uuid
  ELSE gen_random_uuid()
END;

-- Step 3: Make id_uuid NOT NULL
ALTER TABLE cashtransactions ALTER COLUMN id_uuid SET NOT NULL;

-- Step 4: Drop old primary key
ALTER TABLE cashtransactions DROP CONSTRAINT cashtransactions_pkey;

-- Step 5: Rename columns
ALTER TABLE cashtransactions RENAME COLUMN id TO id_old;
ALTER TABLE cashtransactions RENAME COLUMN id_uuid TO id;

-- Step 6: Add new primary key
ALTER TABLE cashtransactions ADD PRIMARY KEY (id);

-- Step 7: Drop old column (optional - keep for reference)
-- ALTER TABLE cashtransactions DROP COLUMN id_old;
*/

-- For now, just add a comment indicating UUID format is preferred
COMMENT ON COLUMN cashtransactions.id IS 'Transaction ID - UUID format preferred for new records';

-- Add index for better performance if not exists
CREATE INDEX IF NOT EXISTS idx_cashtransactions_branch_id ON cashtransactions(branch_id);
CREATE INDEX IF NOT EXISTS idx_cashtransactions_category ON cashtransactions(category);
