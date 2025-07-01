CREATE TYPE "public"."role" AS ENUM('admin', 'user');--> statement-breakpoint
ALTER TABLE "customer" ADD COLUMN "password" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "customer" ADD COLUMN "role" "role" DEFAULT 'user';--> statement-breakpoint
ALTER TABLE "customer" ADD COLUMN "is_verified" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "customer" ADD COLUMN "verification_code" varchar(10);--> statement-breakpoint
ALTER TABLE "customer" DROP COLUMN "Role";--> statement-breakpoint
ALTER TABLE "customer" DROP COLUMN "Password";--> statement-breakpoint
ALTER TABLE "customer" DROP COLUMN "IsVerified";--> statement-breakpoint
ALTER TABLE "customer" DROP COLUMN "VerificationCode";--> statement-breakpoint
DROP TYPE "public"."Role";