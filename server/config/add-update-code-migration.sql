-- Migration script to add update_code column to existing audits table
-- Run this if you have an existing database

-- Add the update_code column
ALTER TABLE audits 
ADD COLUMN update_code VARCHAR(4) UNIQUE AFTER pdf_path;

-- Generate unique update codes for existing records
-- This stored procedure will generate unique 4-digit codes for all existing audits
DELIMITER $$

CREATE PROCEDURE generate_update_codes()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE audit_id INT;
    DECLARE new_code VARCHAR(4);
    DECLARE code_exists INT;
    DECLARE cur CURSOR FOR SELECT id FROM audits WHERE update_code IS NULL;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    OPEN cur;

    read_loop: LOOP
        FETCH cur INTO audit_id;
        IF done THEN
            LEAVE read_loop;
        END IF;

        -- Generate unique code for this audit
        generate_code: LOOP
            SET new_code = LPAD(FLOOR(1000 + RAND() * 9000), 4, '0');
            SELECT COUNT(*) INTO code_exists FROM audits WHERE update_code = new_code;
            
            IF code_exists = 0 THEN
                UPDATE audits SET update_code = new_code WHERE id = audit_id;
                LEAVE generate_code;
            END IF;
        END LOOP;
    END LOOP;

    CLOSE cur;
END$$

DELIMITER ;

-- Execute the procedure
CALL generate_update_codes();

-- Drop the procedure after use
DROP PROCEDURE generate_update_codes;

-- Make update_code NOT NULL after all codes are generated
ALTER TABLE audits 
MODIFY COLUMN update_code VARCHAR(4) UNIQUE NOT NULL;

-- Verify the migration
SELECT COUNT(*) as total_audits, COUNT(update_code) as audits_with_codes 
FROM audits;
