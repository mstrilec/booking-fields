import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPriceColumnToBooking1749034276809 implements MigrationInterface {
    name = 'AddPriceColumnToBooking1749034276809'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "booking" ADD "finalPrice" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "booking" DROP COLUMN "finalPrice"`);
    }

}
