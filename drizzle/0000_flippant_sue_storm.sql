CREATE TABLE "users" (
	"id_user" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"is_admin" boolean NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
