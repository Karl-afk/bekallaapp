import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1774709123879 implements MigrationInterface {
    name = 'Migration1774709123879'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`tasks\` (\`id\` varchar(36) NOT NULL, \`title\` varchar(200) NOT NULL, \`category\` enum ('shopping', 'departure') NOT NULL DEFAULT 'shopping', \`isDone\` tinyint NOT NULL DEFAULT 0, \`stayId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`stays\` (\`id\` varchar(36) NOT NULL, \`title\` varchar(200) NOT NULL, \`startDate\` date NOT NULL, \`endDate\` date NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(200) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`push_subscriptions\` (\`id\` varchar(36) NOT NULL, \`subscription\` json NOT NULL, \`active\` tinyint NOT NULL DEFAULT 1, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`tasks\` ADD CONSTRAINT \`FK_401623716283c0f194cf51b37ab\` FOREIGN KEY (\`stayId\`) REFERENCES \`stays\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tasks\` DROP FOREIGN KEY \`FK_401623716283c0f194cf51b37ab\``);
        await queryRunner.query(`DROP TABLE \`push_subscriptions\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP TABLE \`stays\``);
        await queryRunner.query(`DROP TABLE \`tasks\``);
    }

}
