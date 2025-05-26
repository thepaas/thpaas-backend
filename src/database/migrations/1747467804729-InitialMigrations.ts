import { NS } from "../../common/constants";
import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigrations1747467804729 implements MigrationInterface {
    name = 'InitialMigrations1747467804729'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createSchema(NS, true);
        await queryRunner.query(`
            CREATE TYPE "tp"."users_role_enum" AS ENUM('ADMIN', 'USER')
        `);
        await queryRunner.query(`
            CREATE TYPE "tp"."users_status_enum" AS ENUM('ACTIVE', 'INACTIVE', 'PENDING')
        `);
        await queryRunner.query(`
            CREATE TABLE "tp"."users" (
                "id" SERIAL NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL,
                "email" character varying,
                "role" "tp"."users_role_enum" NOT NULL,
                "status" "tp"."users_status_enum" NOT NULL,
                "account_address" character varying,
                "socket" character varying,
                CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
                CONSTRAINT "UQ_2a4d9c9187d72eb26593379fe53" UNIQUE ("account_address"),
                CONSTRAINT "UQ_2b055cb9064991e1b9f3679a67b" UNIQUE ("socket"),
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_a77fe72e842ef7a01f243bc3e7" ON "tp"."users" ("account_address", "socket")
        `);
        await queryRunner.query(`
            CREATE TYPE "tp"."tokens_type_enum" AS ENUM('NONCE', 'REFRESH')
        `);
        await queryRunner.query(`
            CREATE TABLE "tp"."tokens" (
                "id" SERIAL NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL,
                "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "code" character varying,
                "type" "tp"."tokens_type_enum" NOT NULL,
                "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL,
                "user_id" integer NOT NULL,
                CONSTRAINT "UQ_57b0dd7af7c6a0b7d4c3fd5c464" UNIQUE ("uuid"),
                CONSTRAINT "PK_3001e89ada36263dabf1fb6210a" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_306030d9411d291750fd115857" ON "tp"."tokens" ("type", "user_id")
        `);
        await queryRunner.query(`
            ALTER TABLE "tp"."tokens"
            ADD CONSTRAINT "FK_8769073e38c365f315426554ca5" FOREIGN KEY ("user_id") REFERENCES "tp"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "tp"."tokens" DROP CONSTRAINT "FK_8769073e38c365f315426554ca5"
        `);
        await queryRunner.query(`
            DROP INDEX "tp"."IDX_306030d9411d291750fd115857"
        `);
        await queryRunner.query(`
            DROP TABLE "tp"."tokens"
        `);
        await queryRunner.query(`
            DROP TYPE "tp"."tokens_type_enum"
        `);
        await queryRunner.query(`
            DROP INDEX "tp"."IDX_a77fe72e842ef7a01f243bc3e7"
        `);
        await queryRunner.query(`
            DROP TABLE "tp"."users"
        `);
        await queryRunner.query(`
            DROP TYPE "tp"."users_status_enum"
        `);
        await queryRunner.query(`
            DROP TYPE "tp"."users_role_enum"
        `);
        await queryRunner.dropSchema(NS);
    }

}
