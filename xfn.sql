SET NAMES UTF8;
DROP DATABASE IF EXISTS xfn;
CREATE DATABASE xfn CHARSET=UTF8;
USE xfn;

#管理员信息表 ：xfn_admin
CREATE TABLE xfn_admin(
    aid TINYINT PRIMARY KEY AUTO_INCREMENT,
    aname VARCHAR(32),
    apwd VARCHAR(64)
); 