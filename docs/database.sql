-- Create database user
CREATE USER messenger WITH PASSWORD 'password';

-- Create database
CREATE DATABASE messenger WITH OWNER = messenger;

-- Create users table
CREATE TABLE users
(
    id serial NOT NULL,
    login varchar(32) NOT NULL,
    password varchar(32) NOT NULL,
    name varchar(32) NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE users OWNER to messenger;

-- Create users
INSERT INTO users(login, password, name)
	VALUES ('user1', 'password', 'user1'), ('user2', 'password', 'user2');

-- Create dialogs table
CREATE TABLE dialogs
(
    id serial NOT NULL,
    users integer[] NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE dialogs OWNER to messenger;

-- Create messages table
CREATE TABLE messages
(
    id serial NOT NULL,
    dialog_id integer NOT NULL,
    user_id integer NOT NULL,
    date timestamp with time zone NOT NULL,
    text text,
    attachmentId integer,
    PRIMARY KEY (id)
);

ALTER TABLE messages OWNER to messenger;

-- Create attachments table
CREATE TABLE attachments
(
    id serial NOT NULL,
    path varchar NOT NULL,
    dialog_id integer NOT NULL,
    PRIMARY KEY (id)
);

ALTER TABLE attachments OWNER to messenger;