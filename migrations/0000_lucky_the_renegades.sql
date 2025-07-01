CREATE TABLE "admin_balance_actions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"admin_id" integer NOT NULL,
	"action" text NOT NULL,
	"amount" numeric(18, 2) NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"reason" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "crypto_assets" (
	"id" serial PRIMARY KEY NOT NULL,
	"symbol" text NOT NULL,
	"name" text NOT NULL,
	"current_price" numeric(18, 2) NOT NULL,
	"price_change_24h" numeric(5, 2) NOT NULL,
	"market_cap" numeric(18, 2),
	"volume_24h" numeric(18, 2),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "crypto_assets_symbol_unique" UNIQUE("symbol")
);
--> statement-breakpoint
CREATE TABLE "holdings" (
	"id" serial PRIMARY KEY NOT NULL,
	"portfolio_id" integer NOT NULL,
	"symbol" text NOT NULL,
	"name" text NOT NULL,
	"amount" numeric(18, 8) NOT NULL,
	"average_price" numeric(18, 2) NOT NULL,
	"current_price" numeric(18, 2) NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "portfolios" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"total_balance" numeric(18, 8) DEFAULT '0',
	"total_value" numeric(18, 2) DEFAULT '0',
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"type" text NOT NULL,
	"symbol" text NOT NULL,
	"amount" numeric(18, 8) NOT NULL,
	"price" numeric(18, 2) NOT NULL,
	"fee" numeric(18, 2) DEFAULT '0',
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"address" text,
	"is_verified" boolean DEFAULT false,
	"is_admin" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "admin_balance_actions" ADD CONSTRAINT "admin_balance_actions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "admin_balance_actions" ADD CONSTRAINT "admin_balance_actions_admin_id_users_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "holdings" ADD CONSTRAINT "holdings_portfolio_id_portfolios_id_fk" FOREIGN KEY ("portfolio_id") REFERENCES "public"."portfolios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portfolios" ADD CONSTRAINT "portfolios_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;