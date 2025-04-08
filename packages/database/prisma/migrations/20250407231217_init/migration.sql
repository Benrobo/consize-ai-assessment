-- CreateTable
CREATE TABLE "job" (
    "id" TEXT NOT NULL,
    "job_id" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "job_type" TEXT,
    "company_name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "budget" TEXT,
    "date_posted" TIMESTAMP(3),
    "short_description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "source" TEXT NOT NULL,
    "details" JSONB,
    "details_status" TEXT NOT NULL DEFAULT 'queued',
    "details_job_retries" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_profile" (
    "id" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "pages" INTEGER NOT NULL,
    "sources" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_profile_scraping_progress" (
    "id" TEXT NOT NULL,
    "profile_id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "page" INTEGER NOT NULL DEFAULT 1,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "error" TEXT,
    "error_page" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_profile_scraping_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_profile_scraping_error" (
    "id" TEXT NOT NULL,
    "job_id" TEXT NOT NULL,
    "job_type" TEXT NOT NULL,
    "page" INTEGER,
    "error_message" TEXT NOT NULL,
    "occurred_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "job_profile_scraping_error_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "job_job_id_key" ON "job"("job_id");

-- CreateIndex
CREATE INDEX "job_job_id_idx" ON "job"("job_id");

-- CreateIndex
CREATE INDEX "job_status_details_status_idx" ON "job"("status", "details_status");

-- CreateIndex
CREATE INDEX "job_source_created_at_idx" ON "job"("source", "created_at");

-- CreateIndex
CREATE INDEX "job_profile_query_id_idx" ON "job_profile"("query", "id");

-- CreateIndex
CREATE INDEX "job_profile_status_created_at_idx" ON "job_profile"("status", "created_at");

-- CreateIndex
CREATE INDEX "job_profile_query_location_idx" ON "job_profile"("query", "location");

-- CreateIndex
CREATE INDEX "job_profile_scraping_progress_id_profile_id_idx" ON "job_profile_scraping_progress"("id", "profile_id");

-- CreateIndex
CREATE INDEX "job_profile_scraping_progress_profile_id_status_idx" ON "job_profile_scraping_progress"("profile_id", "status");

-- CreateIndex
CREATE INDEX "job_profile_scraping_progress_status_created_at_idx" ON "job_profile_scraping_progress"("status", "created_at");

-- AddForeignKey
ALTER TABLE "job_profile_scraping_progress" ADD CONSTRAINT "job_profile_scraping_progress_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "job_profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_profile_scraping_error" ADD CONSTRAINT "job_profile_scraping_error_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
