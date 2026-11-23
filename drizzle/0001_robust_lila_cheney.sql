CREATE TABLE "refresh_tokens" (
	"id_token" serial PRIMARY KEY NOT NULL,
	"token" varchar(255) NOT NULL,
	"user_id" serial NOT NULL,
	"expiration_date" varchar(255) NOT NULL,
	"created_at" varchar(255) NOT NULL,
	"revoked" boolean DEFAULT false NOT NULL,
	CONSTRAINT "refresh_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_users_id_user_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id_user") ON DELETE no action ON UPDATE no action;