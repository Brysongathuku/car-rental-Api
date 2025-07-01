CREATE TYPE "public"."Role" AS ENUM('customer', 'admin', 'manager');--> statement-breakpoint
ALTER TABLE "customer" ADD COLUMN "Role" "Role" DEFAULT 'customer';