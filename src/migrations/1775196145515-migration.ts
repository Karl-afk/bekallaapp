import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1775196145515 implements MigrationInterface {
  name = 'Migration1775196145515';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`push_subscriptions\` ADD \`userId\` varchar(36) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`push_subscriptions\` ADD CONSTRAINT \`FK_4cc061875e9eecc311a94b3e431\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`push_subscriptions\` DROP FOREIGN KEY \`FK_4cc061875e9eecc311a94b3e431\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`push_subscriptions\` DROP COLUMN \`userId\``,
    );
  }
}
