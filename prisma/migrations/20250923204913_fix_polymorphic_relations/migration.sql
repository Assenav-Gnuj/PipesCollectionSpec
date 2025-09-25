-- DropForeignKey
ALTER TABLE "public"."comments" DROP CONSTRAINT "comment_accessory_fk";

-- DropForeignKey
ALTER TABLE "public"."comments" DROP CONSTRAINT "comment_pipe_fk";

-- DropForeignKey
ALTER TABLE "public"."comments" DROP CONSTRAINT "comment_tobacco_fk";

-- DropForeignKey
ALTER TABLE "public"."images" DROP CONSTRAINT "image_accessory_fk";

-- DropForeignKey
ALTER TABLE "public"."images" DROP CONSTRAINT "image_pipe_fk";

-- DropForeignKey
ALTER TABLE "public"."images" DROP CONSTRAINT "image_tobacco_fk";

-- DropForeignKey
ALTER TABLE "public"."ratings" DROP CONSTRAINT "rating_accessory_fk";

-- DropForeignKey
ALTER TABLE "public"."ratings" DROP CONSTRAINT "rating_pipe_fk";

-- DropForeignKey
ALTER TABLE "public"."ratings" DROP CONSTRAINT "rating_tobacco_fk";
