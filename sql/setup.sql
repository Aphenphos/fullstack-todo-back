-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`
DROP TABLE IF EXISTS users CASCADE;
drop table if exists todos CASCADE;

CREATE TABLE users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email VARCHAR NOT NULL UNIQUE,
  password_hash VARCHAR NOT NULL
);

create table todos (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  task text,
  done boolean default(false),
  user_id BIGINT not NULL,
  foreign key (user_id) references users(id)
)