-- Tambah kolom updatedAt dengan default value
ALTER TABLE "Room" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Update nilai null di kolom education
UPDATE "Resident" 
SET education = 'UNKNOWN' 
WHERE education IS NULL;

-- Update tipe kolom dengan cara yang aman
ALTER TABLE "Room" 
ALTER COLUMN "type" TYPE VARCHAR(255) 
USING CASE 
  WHEN type::text = 'MALE' THEN 'MALE'
  WHEN type::text = 'FEMALE' THEN 'FEMALE'
  ELSE 'UNKNOWN'
END;

ALTER TABLE "Resident" 
ALTER COLUMN "education" TYPE VARCHAR(255) 
USING COALESCE(education::text, 'UNKNOWN'); 