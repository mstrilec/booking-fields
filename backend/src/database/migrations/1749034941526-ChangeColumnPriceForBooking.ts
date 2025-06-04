import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeColumnPriceForBooking1749034941526 implements MigrationInterface {
    name = 'ChangeColumnPriceForBooking1749034941526'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "booking" DROP COLUMN "finalPrice"`);
        await queryRunner.query(`ALTER TABLE "booking" ADD "finalPrice" numeric`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "booking" DROP COLUMN "finalPrice"`);
        await queryRunner.query(`ALTER TABLE "booking" ADD "finalPrice" integer`);
    }

}
