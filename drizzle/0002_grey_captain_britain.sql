ALTER TABLE "refresh_tokens" ALTER COLUMN "user_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "refresh_tokens" ALTER COLUMN "expiration_date" SET DATA TYPE timestamp;--> statement-breakpoint
ALTER TABLE "refresh_tokens" ALTER COLUMN "created_at" SET DATA TYPE timestamp;