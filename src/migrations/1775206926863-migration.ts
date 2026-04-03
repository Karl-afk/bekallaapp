import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1775206926863 implements MigrationInterface {
    name = 'Migration1775206926863'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`reminder\` (\`id\` varchar(36) NOT NULL, \`title\` varchar(255) NOT NULL, \`body\` varchar(255) NULL, \`frequency\` enum ('once', 'daily', 'weekly', 'monthly', 'custom_cron') NOT NULL, \`scheduleValue\` varchar(255) NULL, \`time\` varchar(255) NOT NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`userId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`push_subscriptions\` DROP COLUMN \`endpoint\``);
        await queryRunner.query(`ALTER TABLE \`reminder\` ADD CONSTRAINT \`FK_c4cc144b2a558182ac6d869d2a4\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`reminder\` DROP FOREIGN KEY \`FK_c4cc144b2a558182ac6d869d2a4\``);
        await queryRunner.query(`ALTER TABLE \`push_subscriptions\` ADD \`endpoint\` varchar(255) NOT NULL`);
        await queryRunner.query(`DROP TABLE \`reminder\``);
    }

}
