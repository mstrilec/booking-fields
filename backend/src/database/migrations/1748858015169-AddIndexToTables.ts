import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIndexToTables1748858015169 implements MigrationInterface {
    name = 'AddIndexToTables1748858015169'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "IDX_user_registration_date" ON "user" ("registrationDate") `);
        await queryRunner.query(`CREATE INDEX "IDX_user_role" ON "user" ("role") `);
        await queryRunner.query(`CREATE INDEX "IDX_user_email" ON "user" ("email") `);
        await queryRunner.query(`CREATE INDEX "IDX_comment_field_created_at" ON "comment" ("fieldId", "createdAt") `);
        await queryRunner.query(`CREATE INDEX "IDX_comment_created_at" ON "comment" ("createdAt") `);
        await queryRunner.query(`CREATE INDEX "IDX_comment_field_id" ON "comment" ("fieldId") `);
        await queryRunner.query(`CREATE INDEX "IDX_comment_user_id" ON "comment" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_field_location" ON "field" ("location") `);
        await queryRunner.query(`CREATE INDEX "IDX_field_price_rating" ON "field" ("price", "rating") `);
        await queryRunner.query(`CREATE INDEX "IDX_field_rating" ON "field" ("rating") `);
        await queryRunner.query(`CREATE INDEX "IDX_field_price" ON "field" ("price") `);
        await queryRunner.query(`CREATE INDEX "IDX_field_name" ON "field" ("name") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_field_place_id" ON "field" ("placeId") `);
        await queryRunner.query(`CREATE INDEX "IDX_booking_time_range" ON "booking" ("startTime", "endTime") `);
        await queryRunner.query(`CREATE INDEX "IDX_booking_field_time_range" ON "booking" ("fieldId", "startTime", "endTime") `);
        await queryRunner.query(`CREATE INDEX "IDX_booking_user_status" ON "booking" ("userId", "status") `);
        await queryRunner.query(`CREATE INDEX "IDX_booking_field_status" ON "booking" ("fieldId", "status") `);
        await queryRunner.query(`CREATE INDEX "IDX_booking_created_at" ON "booking" ("createdAt") `);
        await queryRunner.query(`CREATE INDEX "IDX_booking_end_time" ON "booking" ("endTime") `);
        await queryRunner.query(`CREATE INDEX "IDX_booking_start_time" ON "booking" ("startTime") `);
        await queryRunner.query(`CREATE INDEX "IDX_booking_status" ON "booking" ("status") `);
        await queryRunner.query(`CREATE INDEX "IDX_booking_field_id" ON "booking" ("fieldId") `);
        await queryRunner.query(`CREATE INDEX "IDX_booking_user_id" ON "booking" ("userId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_booking_user_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_booking_field_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_booking_status"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_booking_start_time"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_booking_end_time"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_booking_created_at"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_booking_field_status"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_booking_user_status"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_booking_field_time_range"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_booking_time_range"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_field_place_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_field_name"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_field_price"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_field_rating"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_field_price_rating"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_field_location"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_comment_user_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_comment_field_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_comment_created_at"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_comment_field_created_at"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_user_email"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_user_role"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_user_registration_date"`);
    }

}
