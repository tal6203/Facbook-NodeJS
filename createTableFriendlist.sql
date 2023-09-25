-- Create Table friendlist
CREATE TABLE friendlist (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE  NOT NULL,
  age INTEGER NOT NULL,
  id_user_log VARCHAR(255) NOT NULL,
  image_src VARCHAR(255) NOT NULL
);


-- If you want add friend so..
INSERT INTO friendlist (username, email, age, id_user_log, image_src)
VALUES ('Michael12', 'michael@example.com', 28, 'The id of the user who connected from Mongo', 'michael.jpg');
INSERT INTO friendlist (username, email, age, id_user_log, image_src)
VALUES ('JohnDoe36', 'john@example.com', 25, 'The id of the user who connected from Mongo', 'john.jpeg');
INSERT INTO friendlist (username, email, age, id_user_log, image_src)
VALUES ('JaneSmith78', 'jane@example.com', 30, 'The id of the user who connected from Mongo', 'jane.jpg');