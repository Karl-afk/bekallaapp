"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration1774709123879 = void 0;
class Migration1774709123879 {
    name = 'Migration1774709123879';
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE \`tasks\` (\`id\` varchar(36) NOT NULL, \`title\` varchar(200) NOT NULL, \`category\` enum ('shopping', 'departure') NOT NULL DEFAULT 'shopping', \`isDone\` tinyint NOT NULL DEFAULT 0, \`stayId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`stays\` (\`id\` varchar(36) NOT NULL, \`title\` varchar(200) NOT NULL, \`startDate\` date NOT NULL, \`endDate\` date NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(200) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`push_subscriptions\` (\`id\` varchar(36) NOT NULL, \`subscription\` json NOT NULL, \`active\` tinyint NOT NULL DEFAULT 1, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`tasks\` ADD CONSTRAINT \`FK_401623716283c0f194cf51b37ab\` FOREIGN KEY (\`stayId\`) REFERENCES \`stays\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`tasks\` DROP FOREIGN KEY \`FK_401623716283c0f194cf51b37ab\``);
        await queryRunner.query(`DROP TABLE \`push_subscriptions\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP TABLE \`stays\``);
        await queryRunner.query(`DROP TABLE \`tasks\``);
    }
}
exports.Migration1774709123879 = Migration1774709123879;
