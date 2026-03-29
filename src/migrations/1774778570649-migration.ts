import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1774778570649 implements MigrationInterface {
    name = 'Migration1774778570649'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tasks\` DROP FOREIGN KEY \`FK_401623716283c0f194cf51b37ab\``);
        await queryRunner.query(`ALTER TABLE \`tasks\` ADD CONSTRAINT \`FK_401623716283c0f194cf51b37ab\` FOREIGN KEY (\`stayId\`) REFERENCES \`stays\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tasks\` DROP FOREIGN KEY \`FK_401623716283c0f194cf51b37ab\``);
        await queryRunner.query(`ALTER TABLE \`tasks\` ADD CONSTRAINT \`FK_401623716283c0f194cf51b37ab\` FOREIGN KEY (\`stayId\`) REFERENCES \`stays\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
