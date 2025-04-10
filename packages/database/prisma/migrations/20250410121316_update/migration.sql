-- DropIndex
DROP INDEX "job_job_id_key";

-- AlterTable
ALTER TABLE "job_profile_scraping_error" ADD COLUMN     "error_details" JSONB;