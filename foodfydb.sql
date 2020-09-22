-- create and drop database
DROP DATABASE IF EXISTS foodfydb;
CREATE DATABASE foodfydb;

-- users
CREATE TABLE "users" (
    "id" SERIAL PRIMARY KEY,
    "name" text NOT NULL,
    "email" text UNIQUE NOT NULL,
    "password" text NOT NULL,
    "reset_token" text, 
    "reset_token_expires" text,
    "is_admin" boolean DEFAULT false,
    "created_at" timestamp DEFAULT (now()),
    "updated_at" timestamp DEFAULT (now())
);

CREATE TABLE "chefs" (
"id" SERIAL PRIMARY KEY,
"file_id" integer NOT NULL REFERENCES "files" (id),
"name" text NOT NULL,
"created_at" timestamp DEFAULT (now()),
"updated_at" timestamp DEFAULT (now())
);

CREATE TABLE "recipes" (
"id" SERIAL PRIMARY KEY,
"chef_id" integer NOT NULL REFERENCES "chefs"(id),
"title" text NOT NULL,
"ingredients" text[] NOT NULL,
"preparation" text[] NOT NULL,
"information" text NOT NULL,
"created_at" timestamp DEFAULT (now()),
"updated_at" timestamp DEFAULT (now())
);

-- files

CREATE TABLE "files" (
"id" SERIAL PRIMARY KEY,
"name" text NOT NULL,
"path" text NOT NULL
);

CREATE TABLE "recipe_files" (
"id" SERIAL PRIMARY KEY,
"recipe_id" integer REFERENCES recipes(id) ON DELETE CASCADE,
"file_id" integer REFERENCES files(id)
);

-- connect-pg-simple

CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)

WITH (OIDS=FALSE);
ALTER TABLE "session" 
ADD CONSTRAINT "session_pkey" 
PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- create procedure

CREATE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- auto updated_at chefs 

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON chefs
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- auto updated_at recipes  

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON recipes
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- auto updated_at users  

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- adding user_id key

ALTER TABLE recipes
ADD COLUMN user_id integer NOT NULL REFERENCES users(id)