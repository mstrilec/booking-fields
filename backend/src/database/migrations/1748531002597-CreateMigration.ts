import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateMigration1748531002597 implements MigrationInterface {
    name = 'CreateMigration1748531002597'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "field" ADD "name" character varying NOT NULL DEFAULT 'Unnamed Field'`);
        await queryRunner.query(`ALTER TABLE "field" ADD "address" character varying`);
        await queryRunner.query(`ALTER TABLE "field" ADD "location" jsonb`);
        await queryRunner.query(`ALTER TABLE "field" ADD "website" character varying`);
        await queryRunner.query(`ALTER TABLE "field" ADD "reviews" jsonb`);
        await queryRunner.query(`ALTER TABLE "field" ADD "photos" jsonb`);
        await queryRunner.query(`ALTER TABLE "field" ADD "rating" integer`);
        await queryRunner.query(`ALTER TABLE "field" ADD "userRatingTotal" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "field" DROP COLUMN "userRatingTotal"`);
        await queryRunner.query(`ALTER TABLE "field" DROP COLUMN "rating"`);
        await queryRunner.query(`ALTER TABLE "field" DROP COLUMN "photos"`);
        await queryRunner.query(`ALTER TABLE "field" DROP COLUMN "reviews"`);
        await queryRunner.query(`ALTER TABLE "field" DROP COLUMN "website"`);
        await queryRunner.query(`ALTER TABLE "field" DROP COLUMN "location"`);
        await queryRunner.query(`ALTER TABLE "field" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "field" DROP COLUMN "name"`);
    }

}
