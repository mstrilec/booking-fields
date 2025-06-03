import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateRatingFields1748601094570 implements MigrationInterface {
    name = 'UpdateRatingFields1748601094570'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "field" DROP COLUMN "rating"`);
        await queryRunner.query(`ALTER TABLE "field" ADD "rating" numeric(3,2)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "field" DROP COLUMN "rating"`);
        await queryRunner.query(`ALTER TABLE "field" ADD "rating" integer`);
    }

}
