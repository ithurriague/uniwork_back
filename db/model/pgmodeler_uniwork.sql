-- ** Database generated with pgModeler (PostgreSQL Database Modeler).
-- ** pgModeler version: 1.2.2
-- ** PostgreSQL version: 18.0
-- ** Project Site: pgmodeler.io
-- ** Model Author: ---
-- object: uniwork_ro_role | type: ROLE --
-- DROP ROLE IF EXISTS uniwork_ro_role;
CREATE ROLE uniwork_ro_role WITH 
	INHERIT;
-- ddl-end --

-- object: uniwork_wo_role | type: ROLE --
-- DROP ROLE IF EXISTS uniwork_wo_role;
CREATE ROLE uniwork_wo_role WITH 
	INHERIT;
-- ddl-end --

-- object: uniwork_backend_user | type: ROLE --
-- DROP ROLE IF EXISTS uniwork_backend_user;
CREATE ROLE uniwork_backend_user WITH 
	LOGIN;
-- ddl-end --

-- object: uniwork_rw_role | type: ROLE --
-- DROP ROLE IF EXISTS uniwork_rw_role;
CREATE ROLE uniwork_rw_role WITH 
	INHERIT
	ROLE uniwork_backend_user;
-- ddl-end --

-- object: uniwork_owner_role | type: ROLE --
-- DROP ROLE IF EXISTS uniwork_owner_role;
CREATE ROLE uniwork_owner_role WITH 
	INHERIT;
-- ddl-end --


-- ** Database creation must be performed outside a multi lined SQL file. 
-- ** These commands were put in this file only as a convenience.

-- object: uniwork | type: DATABASE --
-- DROP DATABASE IF EXISTS uniwork;
CREATE DATABASE uniwork;
-- ddl-end --


-- object: backend | type: SCHEMA --
-- DROP SCHEMA IF EXISTS backend CASCADE;
CREATE SCHEMA backend;
-- ddl-end --
ALTER SCHEMA backend OWNER TO postgres;
-- ddl-end --

SET search_path TO pg_catalog,public,backend;
-- ddl-end --

-- object: backend.users | type: TABLE --
-- DROP TABLE IF EXISTS backend.users CASCADE;
CREATE TABLE backend.users (
	id uuid NOT NULL GENERATED ALWAYS AS (gen_random_uuid()) STORED,
	roles_id integer,
	user_type text NOT NULL,
	uid text NOT NULL,
	email text NOT NULL,
	name text,
	phone text,
	picture_url text,
	university text,
	degree text,
	created_at timestamptz DEFAULT NOW(),
	CONSTRAINT users_pk PRIMARY KEY (id),
	CONSTRAINT uid_unique UNIQUE (uid),
	CONSTRAINT email_unique UNIQUE (email),
	CONSTRAINT user_type_student_organization CHECK (user_type IN ('user', 'organization'))
);
-- ddl-end --
ALTER TABLE backend.users OWNER TO uniwork_owner_role;
-- ddl-end --

-- object: backend.roles | type: TABLE --
-- DROP TABLE IF EXISTS backend.roles CASCADE;
CREATE TABLE backend.roles (
	id integer NOT NULL GENERATED ALWAYS AS IDENTITY ,
	key text NOT NULL,
	label text NOT NULL,
	CONSTRAINT roles_pk PRIMARY KEY (id),
	CONSTRAINT roles_key_unique UNIQUE (key)
);
-- ddl-end --
ALTER TABLE backend.roles OWNER TO uniwork_owner_role;
-- ddl-end --

-- object: backend.permissions | type: TABLE --
-- DROP TABLE IF EXISTS backend.permissions CASCADE;
CREATE TABLE backend.permissions (
	id integer NOT NULL GENERATED ALWAYS AS IDENTITY ,
	key text NOT NULL,
	label text NOT NULL,
	CONSTRAINT permissions_pk PRIMARY KEY (id),
	CONSTRAINT permissions_key_unique UNIQUE (key)
);
-- ddl-end --
ALTER TABLE backend.permissions OWNER TO uniwork_owner_role;
-- ddl-end --

-- object: roles_fk | type: CONSTRAINT --
-- ALTER TABLE backend.users DROP CONSTRAINT IF EXISTS roles_fk CASCADE;
ALTER TABLE backend.users ADD CONSTRAINT roles_fk FOREIGN KEY (roles_id)
REFERENCES backend.roles (id) MATCH FULL
ON DELETE SET NULL ON UPDATE CASCADE;
-- ddl-end --

-- object: backend.many_roles_has_many_permissions | type: TABLE --
-- DROP TABLE IF EXISTS backend.many_roles_has_many_permissions CASCADE;
CREATE TABLE backend.many_roles_has_many_permissions (
	id_roles integer NOT NULL,
	id_permissions integer NOT NULL,
	CONSTRAINT many_roles_has_many_permissions_pk PRIMARY KEY (id_roles,id_permissions)
);
-- ddl-end --

-- object: roles_fk | type: CONSTRAINT --
-- ALTER TABLE backend.many_roles_has_many_permissions DROP CONSTRAINT IF EXISTS roles_fk CASCADE;
ALTER TABLE backend.many_roles_has_many_permissions ADD CONSTRAINT roles_fk FOREIGN KEY (id_roles)
REFERENCES backend.roles (id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
-- ddl-end --

-- object: permissions_fk | type: CONSTRAINT --
-- ALTER TABLE backend.many_roles_has_many_permissions DROP CONSTRAINT IF EXISTS permissions_fk CASCADE;
ALTER TABLE backend.many_roles_has_many_permissions ADD CONSTRAINT permissions_fk FOREIGN KEY (id_permissions)
REFERENCES backend.permissions (id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
-- ddl-end --

-- object: backend.categories | type: TABLE --
-- DROP TABLE IF EXISTS backend.categories CASCADE;
CREATE TABLE backend.categories (
	id integer NOT NULL GENERATED ALWAYS AS IDENTITY ,
	name text NOT NULL,
	CONSTRAINT category_pk PRIMARY KEY (id)
);
-- ddl-end --
ALTER TABLE backend.categories OWNER TO uniwork_owner_role;
-- ddl-end --

-- object: backend.application_status | type: TYPE --
-- DROP TYPE IF EXISTS backend.application_status CASCADE;
CREATE TYPE backend.application_status AS
ENUM ('accepted','rejected','pending','expired');
-- ddl-end --
ALTER TYPE backend.application_status OWNER TO uniwork_owner_role;
-- ddl-end --

-- object: backend.ratings | type: TABLE --
-- DROP TABLE IF EXISTS backend.ratings CASCADE;
CREATE TABLE backend.ratings (
	id uuid NOT NULL GENERATED ALWAYS AS (gen_random_uuid()) STORED,
	applications_id uuid,
	rater_id uuid NOT NULL,
	ratee_id uuid NOT NULL,
	rater_type text NOT NULL,
	ratee_type text NOT NULL,
	stars decimal(2,1) NOT NULL,
	review text,
	created_at timestamptz NOT NULL DEFAULT NOW(),
	CONSTRAINT ratings_pk PRIMARY KEY (id),
	CONSTRAINT stars_range_step_0_5 CHECK (stars >= 0 AND stars <= 5 AND stars * 2 = floor(stars * 2)),
	CONSTRAINT rater_type_student_organization CHECK (rater_type IN ('user', 'organization')),
	CONSTRAINT ratee_type_student_organization CHECK (ratee_type IN ('user', 'organization')),
	CONSTRAINT rater_ratee_types CHECK ( (rater_type = 'student' AND ratee_type = 'organization')
 OR (rater_type = 'organization' AND ratee_type = 'student'))
);
-- ddl-end --
ALTER TABLE backend.ratings OWNER TO uniwork_owner_role;
-- ddl-end --

-- object: backend.positions | type: TABLE --
-- DROP TABLE IF EXISTS backend.positions CASCADE;
CREATE TABLE backend.positions (
	id uuid NOT NULL GENERATED ALWAYS AS (gen_random_uuid()) STORED,
	users_id uuid,
	categories_id integer,
	name text NOT NULL,
	description text,
	pay integer,
	location text,
	is_remote boolean,
	created_at timestamptz NOT NULL DEFAULT NOW(),
	updated_at timestamptz DEFAULT NOW(),
	CONSTRAINT positions_pk PRIMARY KEY (id),
	CONSTRAINT remote_check CHECK (is_remote = true OR location IS NOT NULL)
);
-- ddl-end --
ALTER TABLE backend.positions OWNER TO uniwork_owner_role;
-- ddl-end --

-- object: backend.applications | type: TABLE --
-- DROP TABLE IF EXISTS backend.applications CASCADE;
CREATE TABLE backend.applications (
	id uuid NOT NULL GENERATED ALWAYS AS (gen_random_uuid()) STORED,
	users_id uuid,
	positions_id uuid,
	status backend.application_status NOT NULL,
	created_at timestamptz NOT NULL DEFAULT NOW(),
	updated_at timestamptz DEFAULT NOW(),
	CONSTRAINT applications_pk PRIMARY KEY (id)
);
-- ddl-end --
ALTER TABLE backend.applications OWNER TO uniwork_owner_role;
-- ddl-end --

-- object: users_fk | type: CONSTRAINT --
-- ALTER TABLE backend.applications DROP CONSTRAINT IF EXISTS users_fk CASCADE;
ALTER TABLE backend.applications ADD CONSTRAINT users_fk FOREIGN KEY (users_id)
REFERENCES backend.users (id) MATCH FULL
ON DELETE SET NULL ON UPDATE CASCADE;
-- ddl-end --

-- object: positions_fk | type: CONSTRAINT --
-- ALTER TABLE backend.applications DROP CONSTRAINT IF EXISTS positions_fk CASCADE;
ALTER TABLE backend.applications ADD CONSTRAINT positions_fk FOREIGN KEY (positions_id)
REFERENCES backend.positions (id) MATCH FULL
ON DELETE SET NULL ON UPDATE CASCADE;
-- ddl-end --

-- object: applications_uq | type: CONSTRAINT --
-- ALTER TABLE backend.applications DROP CONSTRAINT IF EXISTS applications_uq CASCADE;
ALTER TABLE backend.applications ADD CONSTRAINT applications_uq UNIQUE (positions_id);
-- ddl-end --

-- object: applications_fk | type: CONSTRAINT --
-- ALTER TABLE backend.ratings DROP CONSTRAINT IF EXISTS applications_fk CASCADE;
ALTER TABLE backend.ratings ADD CONSTRAINT applications_fk FOREIGN KEY (applications_id)
REFERENCES backend.applications (id) MATCH FULL
ON DELETE SET NULL ON UPDATE CASCADE;
-- ddl-end --

-- object: categories_fk | type: CONSTRAINT --
-- ALTER TABLE backend.positions DROP CONSTRAINT IF EXISTS categories_fk CASCADE;
ALTER TABLE backend.positions ADD CONSTRAINT categories_fk FOREIGN KEY (categories_id)
REFERENCES backend.categories (id) MATCH FULL
ON DELETE SET NULL ON UPDATE CASCADE;
-- ddl-end --

-- object: positions_uq | type: CONSTRAINT --
-- ALTER TABLE backend.positions DROP CONSTRAINT IF EXISTS positions_uq CASCADE;
ALTER TABLE backend.positions ADD CONSTRAINT positions_uq UNIQUE (categories_id);
-- ddl-end --

-- object: backend.skills | type: TABLE --
-- DROP TABLE IF EXISTS backend.skills CASCADE;
CREATE TABLE backend.skills (
	id integer NOT NULL GENERATED ALWAYS AS IDENTITY ,
	key text NOT NULL,
	label text NOT NULL,
	CONSTRAINT skills_pk PRIMARY KEY (id),
	CONSTRAINT skills_key_unique UNIQUE (key)
);
-- ddl-end --
COMMENT ON TABLE backend.skills IS E'polymorphic between positions and users';
-- ddl-end --
ALTER TABLE backend.skills OWNER TO uniwork_owner_role;
-- ddl-end --

-- object: users_fk | type: CONSTRAINT --
-- ALTER TABLE backend.positions DROP CONSTRAINT IF EXISTS users_fk CASCADE;
ALTER TABLE backend.positions ADD CONSTRAINT users_fk FOREIGN KEY (users_id)
REFERENCES backend.users (id) MATCH FULL
ON DELETE SET NULL ON UPDATE CASCADE;
-- ddl-end --

-- object: backend.many_users_has_many_skills | type: TABLE --
-- DROP TABLE IF EXISTS backend.many_users_has_many_skills CASCADE;
CREATE TABLE backend.many_users_has_many_skills (
	users_id uuid NOT NULL,
	id_skills integer NOT NULL,
	expertise smallint NOT NULL,
	CONSTRAINT many_users_has_many_skills_pk PRIMARY KEY (users_id,id_skills),
	CONSTRAINT expertise_range_1_10 CHECK (expertise BETWEEN 1 AND 10)
);
-- ddl-end --

-- object: users_fk | type: CONSTRAINT --
-- ALTER TABLE backend.many_users_has_many_skills DROP CONSTRAINT IF EXISTS users_fk CASCADE;
ALTER TABLE backend.many_users_has_many_skills ADD CONSTRAINT users_fk FOREIGN KEY (users_id)
REFERENCES backend.users (id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
-- ddl-end --

-- object: skills_fk | type: CONSTRAINT --
-- ALTER TABLE backend.many_users_has_many_skills DROP CONSTRAINT IF EXISTS skills_fk CASCADE;
ALTER TABLE backend.many_users_has_many_skills ADD CONSTRAINT skills_fk FOREIGN KEY (id_skills)
REFERENCES backend.skills (id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
-- ddl-end --

-- object: backend.many_positions_has_many_skills | type: TABLE --
-- DROP TABLE IF EXISTS backend.many_positions_has_many_skills CASCADE;
CREATE TABLE backend.many_positions_has_many_skills (
	positions_id uuid NOT NULL,
	id_skills integer NOT NULL,
	importance smallint NOT NULL,
	CONSTRAINT many_positions_has_many_skills_pk PRIMARY KEY (positions_id,id_skills),
	CONSTRAINT importance_range_1_10 CHECK (importance BETWEEN 1 AND 10)
);
-- ddl-end --

-- object: positions_fk | type: CONSTRAINT --
-- ALTER TABLE backend.many_positions_has_many_skills DROP CONSTRAINT IF EXISTS positions_fk CASCADE;
ALTER TABLE backend.many_positions_has_many_skills ADD CONSTRAINT positions_fk FOREIGN KEY (positions_id)
REFERENCES backend.positions (id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
-- ddl-end --

-- object: skills_fk | type: CONSTRAINT --
-- ALTER TABLE backend.many_positions_has_many_skills DROP CONSTRAINT IF EXISTS skills_fk CASCADE;
ALTER TABLE backend.many_positions_has_many_skills ADD CONSTRAINT skills_fk FOREIGN KEY (id_skills)
REFERENCES backend.skills (id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;
-- ddl-end --

-- object: rater_id_users | type: CONSTRAINT --
-- ALTER TABLE backend.ratings DROP CONSTRAINT IF EXISTS rater_id_users CASCADE;
ALTER TABLE backend.ratings ADD CONSTRAINT rater_id_users FOREIGN KEY (rater_id)
REFERENCES backend.users (id) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: ratee_id_users | type: CONSTRAINT --
-- ALTER TABLE backend.ratings DROP CONSTRAINT IF EXISTS ratee_id_users CASCADE;
ALTER TABLE backend.ratings ADD CONSTRAINT ratee_id_users FOREIGN KEY (ratee_id)
REFERENCES backend.users (id) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: "grant_CU_3306a43357" | type: PERMISSION --
GRANT CREATE,USAGE
   ON SCHEMA backend
   TO uniwork_rw_role;

-- ddl-end --



