import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1774770358033 implements MigrationInterface {
    name = 'Migration1774770358033'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`default_tasks\` (\`id\` varchar(36) NOT NULL, \`title\` varchar(200) NOT NULL, \`category\` enum ('shopping', 'departure') NOT NULL DEFAULT 'shopping', \`isDone\` tinyint NOT NULL DEFAULT 0, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`default_tasks\``);
    }

}
