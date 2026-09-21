-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('user', 'astrologer', 'admin');

-- CreateEnum
CREATE TYPE "BadgeType" AS ENUM ('verified_pro', 'top_rated');

-- CreateEnum
CREATE TYPE "BadgeGrantedVia" AS ENUM ('application', 'platform_direct');

-- CreateEnum
CREATE TYPE "BadgeApplicationStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "PostType" AS ENUM ('text', 'image', 'video');

-- CreateEnum
CREATE TYPE "SessionType" AS ENUM ('private', 'group', 'kahve_fali_live');

-- CreateEnum
CREATE TYPE "PaymentModel" AS ENUM ('bundled', 'a_la_carte');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('scheduled', 'completed', 'cancelled', 'no_show');

-- CreateEnum
CREATE TYPE "KahveFaliStatus" AS ENUM ('pending', 'delivered');

-- CreateEnum
CREATE TYPE "WalletTransactionType" AS ENUM ('topup', 'spend', 'refund', 'referral_bonus');

-- CreateEnum
CREATE TYPE "SubscriptionTier" AS ENUM ('free', 'premium', 'premium_credit');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('active', 'cancelled', 'past_due');

-- CreateEnum
CREATE TYPE "FraudSignalEntityType" AS ENUM ('rating', 'session', 'referral_invite');

-- CreateEnum
CREATE TYPE "FraudSignalStatus" AS ENUM ('flagged', 'reviewed', 'cleared');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "password_hash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'user',
    "email_verified_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profiles" (
    "user_id" TEXT NOT NULL,
    "birth_date" TIMESTAMP(3),
    "birth_time" TEXT,
    "birth_place" TEXT,
    "sun_sign" TEXT,
    "natal_chart_data" JSONB,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "astrologer_profiles" (
    "user_id" TEXT NOT NULL,
    "bio" TEXT,
    "specialties" TEXT[],
    "languages" TEXT[],
    "sessions_completed" INTEGER NOT NULL DEFAULT 0,
    "avg_rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "rating_count" INTEGER NOT NULL DEFAULT 0,
    "follower_count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "astrologer_profiles_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "badges" (
    "id" TEXT NOT NULL,
    "astrologer_id" TEXT NOT NULL,
    "type" "BadgeType" NOT NULL,
    "granted_via" "BadgeGrantedVia" NOT NULL,
    "granted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revoked_at" TIMESTAMP(3),

    CONSTRAINT "badges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "badge_applications" (
    "id" TEXT NOT NULL,
    "astrologer_id" TEXT NOT NULL,
    "answers" JSONB NOT NULL,
    "status" "BadgeApplicationStatus" NOT NULL DEFAULT 'pending',
    "reviewer_id" TEXT,
    "decision_reason" TEXT,
    "reapply_after" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "badge_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "follows" (
    "follower_user_id" TEXT NOT NULL,
    "astrologer_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "follows_pkey" PRIMARY KEY ("follower_user_id","astrologer_id")
);

-- CreateTable
CREATE TABLE "posts" (
    "id" TEXT NOT NULL,
    "astrologer_id" TEXT NOT NULL,
    "type" "PostType" NOT NULL,
    "body" TEXT,
    "media_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "type" "SessionType" NOT NULL,
    "astrologer_id" TEXT NOT NULL,
    "scheduled_at" TIMESTAMP(3) NOT NULL,
    "duration_minutes" INTEGER NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "payment_model" "PaymentModel" NOT NULL,
    "status" "SessionStatus" NOT NULL DEFAULT 'scheduled',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session_participants" (
    "session_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "joined_at" TIMESTAMP(3),
    "left_at" TIMESTAMP(3),

    CONSTRAINT "session_participants_pkey" PRIMARY KEY ("session_id","user_id")
);

-- CreateTable
CREATE TABLE "kahve_fali_orders" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "astrologer_id" TEXT NOT NULL,
    "photo_url" TEXT NOT NULL,
    "status" "KahveFaliStatus" NOT NULL DEFAULT 'pending',
    "interpretation_text" TEXT,
    "ordered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "delivered_at" TIMESTAMP(3),
    "sla_deadline" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kahve_fali_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ratings" (
    "id" TEXT NOT NULL,
    "session_id" TEXT,
    "kahve_fali_order_id" TEXT,
    "rater_user_id" TEXT NOT NULL,
    "astrologer_id" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "review_text" TEXT,
    "eligible" BOOLEAN NOT NULL DEFAULT true,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ratings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wallet_accounts" (
    "user_id" TEXT NOT NULL,
    "balance" DECIMAL(10,2) NOT NULL DEFAULT 0,

    CONSTRAINT "wallet_accounts_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "wallet_transactions" (
    "id" TEXT NOT NULL,
    "wallet_id" TEXT NOT NULL,
    "type" "WalletTransactionType" NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "related_session_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wallet_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "tier" "SubscriptionTier" NOT NULL DEFAULT 'free',
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'active',
    "renewal_date" TIMESTAMP(3),

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "referral_invites" (
    "id" TEXT NOT NULL,
    "astrologer_id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "invited_user_id" TEXT,
    "converted_at" TIMESTAMP(3),
    "reward_issued" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "referral_invites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fraud_signals" (
    "id" TEXT NOT NULL,
    "related_entity_type" "FraudSignalEntityType" NOT NULL,
    "related_entity_id" TEXT NOT NULL,
    "signal_type" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "status" "FraudSignalStatus" NOT NULL DEFAULT 'flagged',
    "reviewed_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fraud_signals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_user_id_key" ON "subscriptions"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "referral_invites_code_key" ON "referral_invites"("code");

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "astrologer_profiles" ADD CONSTRAINT "astrologer_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "badges" ADD CONSTRAINT "badges_astrologer_id_fkey" FOREIGN KEY ("astrologer_id") REFERENCES "astrologer_profiles"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "badge_applications" ADD CONSTRAINT "badge_applications_astrologer_id_fkey" FOREIGN KEY ("astrologer_id") REFERENCES "astrologer_profiles"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "badge_applications" ADD CONSTRAINT "badge_applications_reviewer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follows" ADD CONSTRAINT "follows_follower_user_id_fkey" FOREIGN KEY ("follower_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follows" ADD CONSTRAINT "follows_astrologer_id_fkey" FOREIGN KEY ("astrologer_id") REFERENCES "astrologer_profiles"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_astrologer_id_fkey" FOREIGN KEY ("astrologer_id") REFERENCES "astrologer_profiles"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_astrologer_id_fkey" FOREIGN KEY ("astrologer_id") REFERENCES "astrologer_profiles"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_participants" ADD CONSTRAINT "session_participants_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_participants" ADD CONSTRAINT "session_participants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kahve_fali_orders" ADD CONSTRAINT "kahve_fali_orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kahve_fali_orders" ADD CONSTRAINT "kahve_fali_orders_astrologer_id_fkey" FOREIGN KEY ("astrologer_id") REFERENCES "astrologer_profiles"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_kahve_fali_order_id_fkey" FOREIGN KEY ("kahve_fali_order_id") REFERENCES "kahve_fali_orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_rater_user_id_fkey" FOREIGN KEY ("rater_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_astrologer_id_fkey" FOREIGN KEY ("astrologer_id") REFERENCES "astrologer_profiles"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallet_accounts" ADD CONSTRAINT "wallet_accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallet_transactions" ADD CONSTRAINT "wallet_transactions_wallet_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "wallet_accounts"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referral_invites" ADD CONSTRAINT "referral_invites_astrologer_id_fkey" FOREIGN KEY ("astrologer_id") REFERENCES "astrologer_profiles"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
