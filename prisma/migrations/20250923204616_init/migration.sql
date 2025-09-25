-- CreateEnum
CREATE TYPE "public"."ItemType" AS ENUM ('pipe', 'tobacco', 'accessory');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "last_login" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."pipes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "material" TEXT NOT NULL,
    "shape" TEXT NOT NULL,
    "finish" TEXT NOT NULL,
    "filter_type" TEXT NOT NULL,
    "stem_material" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "observations" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "pipes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tobaccos" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "blend_type" TEXT NOT NULL,
    "contents" TEXT NOT NULL,
    "cut" TEXT NOT NULL,
    "strength" INTEGER NOT NULL,
    "room_note" INTEGER NOT NULL,
    "taste" INTEGER NOT NULL,
    "observations" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "tobaccos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."accessories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "observations" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "accessories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."images" (
    "id" TEXT NOT NULL,
    "item_id" TEXT NOT NULL,
    "item_type" "public"."ItemType" NOT NULL,
    "filename" TEXT NOT NULL,
    "original_name" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,
    "mime_type" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "alt_text" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ratings" (
    "id" TEXT NOT NULL,
    "item_id" TEXT NOT NULL,
    "item_type" "public"."ItemType" NOT NULL,
    "session_id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip_address" TEXT,

    CONSTRAINT "ratings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."comments" (
    "id" TEXT NOT NULL,
    "item_id" TEXT NOT NULL,
    "item_type" "public"."ItemType" NOT NULL,
    "content" TEXT NOT NULL,
    "author_name" TEXT,
    "session_id" TEXT NOT NULL,
    "is_approved" BOOLEAN NOT NULL DEFAULT false,
    "moderated_by" TEXT,
    "moderated_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip_address" TEXT,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "images_filename_key" ON "public"."images"("filename");

-- CreateIndex
CREATE UNIQUE INDEX "images_item_id_item_type_is_featured_key" ON "public"."images"("item_id", "item_type", "is_featured");

-- CreateIndex
CREATE UNIQUE INDEX "ratings_item_id_item_type_session_id_key" ON "public"."ratings"("item_id", "item_type", "session_id");

-- AddForeignKey
ALTER TABLE "public"."images" ADD CONSTRAINT "image_pipe_fk" FOREIGN KEY ("item_id") REFERENCES "public"."pipes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."images" ADD CONSTRAINT "image_tobacco_fk" FOREIGN KEY ("item_id") REFERENCES "public"."tobaccos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."images" ADD CONSTRAINT "image_accessory_fk" FOREIGN KEY ("item_id") REFERENCES "public"."accessories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ratings" ADD CONSTRAINT "rating_pipe_fk" FOREIGN KEY ("item_id") REFERENCES "public"."pipes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ratings" ADD CONSTRAINT "rating_tobacco_fk" FOREIGN KEY ("item_id") REFERENCES "public"."tobaccos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ratings" ADD CONSTRAINT "rating_accessory_fk" FOREIGN KEY ("item_id") REFERENCES "public"."accessories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comments" ADD CONSTRAINT "comment_moderator_fk" FOREIGN KEY ("moderated_by") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comments" ADD CONSTRAINT "comment_pipe_fk" FOREIGN KEY ("item_id") REFERENCES "public"."pipes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comments" ADD CONSTRAINT "comment_tobacco_fk" FOREIGN KEY ("item_id") REFERENCES "public"."tobaccos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comments" ADD CONSTRAINT "comment_accessory_fk" FOREIGN KEY ("item_id") REFERENCES "public"."accessories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
