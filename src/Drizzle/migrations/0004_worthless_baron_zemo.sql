ALTER TABLE "customer" ADD COLUMN "IsVerified" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "customer" ADD COLUMN "VerificationCode" varchar(100);