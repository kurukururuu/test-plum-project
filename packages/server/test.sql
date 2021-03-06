PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE `_knex_migrations` (`id` integer not null primary key autoincrement, `name` varchar(255), `batch` integer, `migration_time` datetime);
INSERT INTO _knex_migrations VALUES(1,'v1.0.0.ts',1,1574411189343);
CREATE TABLE `_knex_migrations_lock` (`index` integer not null primary key autoincrement, `is_locked` integer);
INSERT INTO _knex_migrations_lock VALUES(1,0);
CREATE TABLE `User` (`id` integer not null primary key autoincrement, `createdAt` datetime default CURRENT_TIMESTAMP, `deleted` boolean default '0', `email` varchar(255), `password` varchar(255), `name` varchar(255), `role` varchar(255));
INSERT INTO User VALUES(1,'2019-11-22 08:29:23',0,'admin@todo.app','$2b$10$Eqkt/rQeQClVBP1DH8pype9TgVAZkzb.ly1B/S1L0CfYL8Ju63i52','Todo Admin','Admin');
CREATE TABLE `Todo` (`id` integer not null primary key autoincrement, `createdAt` datetime default CURRENT_TIMESTAMP, `deleted` boolean default '0', `todo` varchar(255), `userId` bigint, `completed` boolean default '0', foreign key(`userId`) references `User`(`id`));
DELETE FROM sqlite_sequence;
INSERT INTO sqlite_sequence VALUES('_knex_migrations_lock',1);
INSERT INTO sqlite_sequence VALUES('_knex_migrations',1);
INSERT INTO sqlite_sequence VALUES('User',1);
COMMIT;
