# koa-test-middleware

Koa Test Middleware is a easy background system demo using Koa + handlebars templates + RESTful API + MySQL. 

### Database schema

```
CREATE TABLE `et_answer` (
  `answer_id` int(11) NOT NULL AUTO_INCREMENT,
  `question_id` int(11) NOT NULL,
  `answer_des` varchar(15000) DEFAULT '',
  `answer` varchar(5000) NOT NULL DEFAULT '',
  `answer_st` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`answer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `et_question` (
  `question_id` int(11) NOT NULL AUTO_INCREMENT,
  `use_case` varchar(6000) DEFAULT NULL,
  `title` varchar(100) NOT NULL,
  `description` varchar(6000) DEFAULT '',
  `difficulty` int(11) NOT NULL,
  PRIMARY KEY (`question_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `et_question_tag` (
  `question_tag_id` int(11) NOT NULL AUTO_INCREMENT,
  `question_id` int(11) NOT NULL,
  `tag_id` int(11) NOT NULL,
  PRIMARY KEY (`question_tag_id`),
  KEY `question_id` (`question_id`),
  KEY `tag_id` (`tag_id`),
  CONSTRAINT `et_question_tag_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `et_question` (`question_id`),
  CONSTRAINT `et_question_tag_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `et_tag` (`tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `et_question_type` (
  `question_type_id` int(11) NOT NULL AUTO_INCREMENT,
  `question_id` int(11) NOT NULL,
  `type_id` int(11) NOT NULL,
  PRIMARY KEY (`question_type_id`),
  KEY `question_id` (`question_id`),
  KEY `type_id` (`type_id`),
  CONSTRAINT `et_question_type_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `et_question` (`question_id`),
  CONSTRAINT `et_question_type_ibfk_2` FOREIGN KEY (`type_id`) REFERENCES `et_type` (`type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `et_tag` (
  `tag_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  PRIMARY KEY (`tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `et_type` (
  `type_id` int(11) NOT NULL AUTO_INCREMENT,
  `topic` varchar(30) NOT NULL DEFAULT '',
  PRIMARY KEY (`type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `User` (
  `UserId` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Firstname` text,
  `Lastname` text,
  `Email` text NOT NULL,
  `Password` text,
  `ApiToken` text,
  `Role` text,
  PRIMARY KEY (`UserId`),
  UNIQUE KEY `Email` (`Email`(24))
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

```


