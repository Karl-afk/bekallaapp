import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1775484507501 implements MigrationInterface {
    name = 'Migration1775484507501'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`reminders\` (\`id\` varchar(36) NOT NULL, \`title\` varchar(200) NOT NULL, \`body\` text NULL, \`frequency\` enum ('once', 'daily', 'weekly', 'monthly', 'custom_cron') NOT NULL, \`scheduleValue\` varchar(200) NULL, \`time\` varchar(200) NOT NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`userId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`reminders\` ADD CONSTRAINT \`FK_f8e4bc520d9e692652afaf3308b\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`reminders\` DROP FOREIGN KEY \`FK_f8e4bc520d9e692652afaf3308b\``);
        await queryRunner.query(`DROP TABLE \`reminders\``);
    }

}
