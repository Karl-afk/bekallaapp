import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1774773117863 implements MigrationInterface {
    name = 'Migration1774773117863'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tasks\` ADD \`amount\` smallint NULL`);
        await queryRunner.query(`ALTER TABLE \`default_tasks\` ADD \`amount\` smallint NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`default_tasks\` DROP COLUMN \`amount\``);
        await queryRunner.query(`ALTER TABLE \`tasks\` DROP COLUMN \`amount\``);
    }

}
