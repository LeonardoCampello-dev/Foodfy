-- CREATE AND DROP DATABASE
DROP DATABASE IF EXISTS foodfydb;
CREATE DATABASE foodfydb;

CREATE TABLE "files" (
"id" SERIAL PRIMARY KEY,
"name" text NOT NULL,
"path" text NOT NULL
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

CREATE TABLE "recipe_files" (
"id" SERIAL PRIMARY KEY,
"recipe_id" integer REFERENCES recipes(id) ON DELETE CASCADE,
"file_id" integer REFERENCES files(id)
);

-- CREATE PROCEDURE 

CREATE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- AUTO updated_at CHEFS 

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON chefs
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- AUTO updated_at RECIPES  

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON recipes
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();