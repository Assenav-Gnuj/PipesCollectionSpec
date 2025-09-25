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
ALTER TABLE "public"."comments" ADD CONSTRAINT "comment_pipe_fk" FOREIGN KEY ("item_id") REFERENCES "public"."pipes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comments" ADD CONSTRAINT "comment_tobacco_fk" FOREIGN KEY ("item_id") REFERENCES "public"."tobaccos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comments" ADD CONSTRAINT "comment_accessory_fk" FOREIGN KEY ("item_id") REFERENCES "public"."accessories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
