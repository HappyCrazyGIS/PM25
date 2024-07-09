/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50724
Source Host           : localhost:3306
Source Database       : db_traffic

Target Server Type    : MYSQL
Target Server Version : 50724
File Encoding         : 65001

Date: 2022-12-16 18:48:43
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for gg_event
-- ----------------------------
DROP TABLE IF EXISTS `gg_event`;
CREATE TABLE `gg_event` (
  `event_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '事件id',
  `user_id` int(11) NOT NULL COMMENT '外键,对应用户id',
  `event_type` varchar(50) COLLATE utf8_bin DEFAULT NULL COMMENT '事件类型',
  `event_addr` varchar(50) COLLATE utf8_bin DEFAULT NULL COMMENT '事件发生具体的地址',
  `event_mark` varchar(50) COLLATE utf8_bin DEFAULT NULL COMMENT '事件发生地址旁边的建筑标识，方便快速确认事件位置',
  `event_time` datetime DEFAULT NULL COMMENT '事件发生的时间信息',
  `event_desc` varchar(255) COLLATE utf8_bin DEFAULT NULL COMMENT '时间描述',
  `event_status` int(11) DEFAULT '0' COMMENT '事件的处理状态,0表示未处理,1和2表示已处理,1代表忽略,2代表通过',
  PRIMARY KEY (`event_id`) USING BTREE,
  KEY `user_id` (`user_id`) USING BTREE,
  CONSTRAINT `gg_event_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `gg_user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8 COLLATE=utf8_bin ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of gg_event
-- ----------------------------
INSERT INTO `gg_event` VALUES ('2', '1', '碰撞', '光谷', '光谷软件园', '2022-11-20 21:20:35', '光谷软件园2路发生交通碰撞', '1');
INSERT INTO `gg_event` VALUES ('3', '1', '拥堵', '光谷软件园', '拿铁公寓', '2022-11-20 21:27:12', '拿铁公寓光谷软件园2路发生交通拥堵', '1');
INSERT INTO `gg_event` VALUES ('4', '1', '刮擦', '雄楚大道', '湖北邮电大学', '2022-11-20 22:24:55', '雄楚大道,湖北邮电大学附近发生车辆刮擦!!!', '2');
INSERT INTO `gg_event` VALUES ('9', '1', '翻车', '关山大道', '光谷新世界酒店', '2022-11-20 23:06:41', '发生翻车事故', '1');
INSERT INTO `gg_event` VALUES ('10', '1', '刮擦', '关山大道', '武汉保利广场', '2022-11-20 23:09:24', '发生车辆刮擦', '1');
INSERT INTO `gg_event` VALUES ('11', '1', '失火', '光谷大道', '未知', '2022-11-22 14:23:59', '失火', '2');
INSERT INTO `gg_event` VALUES ('12', '1', '拥堵', '光谷大道', '光谷软件园A2', '2022-11-22 14:25:05', '光谷软件园发生道路拥堵', '0');
INSERT INTO `gg_event` VALUES ('13', '1', '拥堵', '江夏大道', '庙山立交桥', '2022-11-22 15:54:53', '发生交通拥堵', '1');
INSERT INTO `gg_event` VALUES ('14', '1', '翻车', '南湖大道', '中天世纪大酒店', '2022-11-22 15:57:08', '发生车辆翻车事故', '0');
INSERT INTO `gg_event` VALUES ('15', '1', '拥堵', '雄楚大道', '十字路口', '2022-11-22 15:58:48', '交通拥堵', '0');
INSERT INTO `gg_event` VALUES ('16', '1', '拥堵', '关山大道2路', '光谷软件园', '2022-11-26 16:51:39', '发生拥堵', '0');
INSERT INTO `gg_event` VALUES ('17', '1', '刮擦', '无', '光谷', '2022-11-26 17:44:56', '刮擦', '0');
INSERT INTO `gg_event` VALUES ('18', '18', '翻车', '雄楚大道', '杨家湾', '2022-11-26 20:53:28', '发生翻车事故', '0');

-- ----------------------------
-- Table structure for gg_notice
-- ----------------------------
DROP TABLE IF EXISTS `gg_notice`;
CREATE TABLE `gg_notice` (
  `notice_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '唯一标识',
  `user_id` int(11) DEFAULT NULL,
  `notice_title` varchar(255) COLLATE utf8_bin DEFAULT NULL COMMENT '公告标题',
  `notice_content` varchar(255) COLLATE utf8_bin DEFAULT NULL COMMENT '公告内容',
  `notice_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '公告发布时间',
  PRIMARY KEY (`notice_id`) USING BTREE,
  KEY `user_id` (`user_id`) USING BTREE,
  CONSTRAINT `gg_notice_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `gg_user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8 COLLATE=utf8_bin ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of gg_notice
-- ----------------------------
INSERT INTO `gg_notice` VALUES ('1', '2', '第一条公告', '卡塔尔 0 : 2 厄瓜多尔', '2022-11-21 09:54:53');
INSERT INTO `gg_notice` VALUES ('2', '2', '第二条公告', '周末加班！！！', '2022-11-21 10:30:27');
INSERT INTO `gg_notice` VALUES ('3', '2', '第三条公告', '改样式真麻烦！！！', '2022-11-21 11:49:07');
INSERT INTO `gg_notice` VALUES ('4', '2', '第四条公告', '测试分页...', '2022-11-21 11:50:10');
INSERT INTO `gg_notice` VALUES ('5', '2', '第五条公告', '分页测试数据', '2022-11-21 12:08:58');
INSERT INTO `gg_notice` VALUES ('6', '2', '第六条公告', '还是分页测试数据', '2022-11-21 12:09:02');
INSERT INTO `gg_notice` VALUES ('7', '2', 'test', '1111', '2022-11-22 14:44:19');
INSERT INTO `gg_notice` VALUES ('8', '2', '公告', '请拨打123456', '2022-11-22 14:48:02');
INSERT INTO `gg_notice` VALUES ('9', '2', '233', '332', '2022-11-22 14:53:42');
INSERT INTO `gg_notice` VALUES ('10', '2', '222', '3333', '2022-11-22 14:55:51');
INSERT INTO `gg_notice` VALUES ('11', '2', 'aaa', 'dadada', '2022-11-22 14:59:43');
INSERT INTO `gg_notice` VALUES ('12', '2', 'wwww', 'aaaaaa', '2022-11-22 15:05:14');
INSERT INTO `gg_notice` VALUES ('13', '2', 'jjjj', 'jjhhhh', '2022-11-22 15:06:09');
INSERT INTO `gg_notice` VALUES ('14', '2', 'waaaa', 'dadada', '2022-11-22 15:06:33');
INSERT INTO `gg_notice` VALUES ('15', '2', '111', '1111', '2022-11-22 15:07:17');
INSERT INTO `gg_notice` VALUES ('16', '2', '122', '111122', '2022-11-22 15:07:27');
INSERT INTO `gg_notice` VALUES ('17', '2', '232', '648', '2022-11-22 15:30:22');
INSERT INTO `gg_notice` VALUES ('18', '2', '6666', '555', '2022-11-22 15:32:27');
INSERT INTO `gg_notice` VALUES ('19', '2', '111', '1111', '2022-11-22 15:32:51');
INSERT INTO `gg_notice` VALUES ('20', '2', 'wwwww', 'wwww', '2022-11-22 15:34:14');
INSERT INTO `gg_notice` VALUES ('21', '2', 'aaa', 'dadada', '2022-11-22 15:36:40');
INSERT INTO `gg_notice` VALUES ('22', '2', 'ddd', 'daadad', '2022-11-22 15:37:00');
INSERT INTO `gg_notice` VALUES ('23', '2', 'ss', 'sss', '2022-11-22 15:37:13');
INSERT INTO `gg_notice` VALUES ('24', '2', 'ffff', 'adada', '2022-11-22 15:38:26');
INSERT INTO `gg_notice` VALUES ('25', '2', 'wwww', 'wadadada', '2022-11-22 15:38:36');
INSERT INTO `gg_notice` VALUES ('26', '2', 'ad q', 'eqe', '2022-11-22 15:38:56');
INSERT INTO `gg_notice` VALUES ('27', '2', 'adadad', 'dasdasdad', '2022-11-22 15:44:12');
INSERT INTO `gg_notice` VALUES ('28', '2', 'dadadada', 'daadad', '2022-11-22 15:47:48');
INSERT INTO `gg_notice` VALUES ('29', '2', 'dadadada', 'daadad', '2022-11-22 15:48:04');
INSERT INTO `gg_notice` VALUES ('30', '2', 'kgkgh', 'gkghkg', '2022-11-22 15:49:07');
INSERT INTO `gg_notice` VALUES ('31', '2', '24252', '452424', '2022-11-22 15:54:30');
INSERT INTO `gg_notice` VALUES ('32', '10', '公告', '大家注意...', '2022-11-23 18:29:21');
INSERT INTO `gg_notice` VALUES ('33', '10', '公告', '请注意...', '2022-11-23 18:39:32');
INSERT INTO `gg_notice` VALUES ('34', '10', '通知', '封路', '2022-11-24 09:55:43');
INSERT INTO `gg_notice` VALUES ('35', '10', '哈哈哈', '哈哈哈哈哈哈哈', '2022-11-24 23:33:01');
INSERT INTO `gg_notice` VALUES ('36', '10', '通知', '大家请注意...', '2022-11-25 14:28:53');
INSERT INTO `gg_notice` VALUES ('37', '10', '光谷天地', '做核酸', '2022-11-25 14:32:09');
INSERT INTO `gg_notice` VALUES ('38', '10', '大家请注意', '做不完了', '2022-11-25 20:40:02');
INSERT INTO `gg_notice` VALUES ('39', '10', '拿铁公寓', '请各位居民按时进行核酸检测！！！', '2022-11-25 22:14:47');
INSERT INTO `gg_notice` VALUES ('40', '16', '气温预告', '下周降温，请注意保暖！！！', '2022-11-25 23:30:14');

-- ----------------------------
-- Table structure for gg_user
-- ----------------------------
DROP TABLE IF EXISTS `gg_user`;
CREATE TABLE `gg_user` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键,id',
  `username` varchar(50) COLLATE utf8_bin NOT NULL COMMENT '用户名',
  `password` varchar(255) COLLATE utf8_bin NOT NULL COMMENT '密码',
  `type` varchar(20) COLLATE utf8_bin DEFAULT 'common' COMMENT 'admin,traffic,common',
  `onlinestatus` int(11) NOT NULL DEFAULT '0' COMMENT '0表示已登录,1表示未登录,默认为0',
  `del` int(11) NOT NULL DEFAULT '1' COMMENT '0表示用户被删除,1表示用户未被删除,默认为1',
  `avatar_url` varchar(255) COLLATE utf8_bin DEFAULT NULL COMMENT '头像地址',
  PRIMARY KEY (`user_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8 COLLATE=utf8_bin ROW_FORMAT=DYNAMIC;

-- ----------------------------
-- Records of gg_user
-- ----------------------------
INSERT INTO `gg_user` VALUES ('1', 'simple', '$2a$10$pqoIYnzf51FQnB2xygo2lulXsTvnwf9GlRB3lGxtFpnvbXZ4lgV7G', 'traffic', '1', '1', 'images/uploads/2a8721335d9a441cde3476f29e04949a');
INSERT INTO `gg_user` VALUES ('2', '测试', '$2a$10$Uxc8twZdfZPWji7qsxlW9u3SaPvm9REYs/FMcdAJ61mJYCkTHJSMu', 'common', '1', '1', null);
INSERT INTO `gg_user` VALUES ('3', '游客1', '$2a$10$Cp19P2vnztrY4aE5tMacKuFGVsmGNOmzZ4HT1vw1TWfmJis1B0qUe', 'common', '1', '1', null);
INSERT INTO `gg_user` VALUES ('4', '游客2', '$2a$10$poACdT1.a2c4DZoGesdHneU5uK6/YVRHB4xukE4ZNOfjPR8r6xBUm', 'common', '0', '1', null);
INSERT INTO `gg_user` VALUES ('5', '游客3', '$2a$10$naG7xQ1lvXKwCEAaYMHB8.h5yP4t4hsJpO.I2Cc0Naoizq0yEtxZK', 'common', '0', '1', null);
INSERT INTO `gg_user` VALUES ('6', 'zjf', '$2a$10$.EGL9/.OVXoLm8Ja.0hgnO2UXE4OWy2j5zadSTefqB9y5MZvyf3jG', 'traffic', '1', '1', null);
INSERT INTO `gg_user` VALUES ('7', '游客4', '$2a$10$nZqI8c8HeHmrydaiMaoFHe4eqxdRAcCD5M.f/sLGW60nLnPVXeogC', 'common', '0', '1', null);
INSERT INTO `gg_user` VALUES ('8', '游客5', '$2a$10$39T2KdhH6se/yvPUyWgCtuM.9O5H6GAFE96ZGQC0mk1lUmxzOOkQC', 'common', '1', '1', null);
INSERT INTO `gg_user` VALUES ('9', '游客6', '$2a$10$sMUq0eK1o0TrEC77Zcy0Juyf88zNiXSAEik6rIPx51yxZibrU8.3u', 'common', '1', '1', 'images/uploads/190ddc73f67ccbdc7f4eb5c3e8e4c72e');
INSERT INTO `gg_user` VALUES ('10', 'admin', '$2a$10$a4aAO7ReHR0vD1Ru0yac6OzELgY4LwDmrjiYDoZ5iCkA9hmw7OX1K', 'admin', '0', '1', 'images/uploads/1228294dca325bb1edc8438a2b8a6f40');
INSERT INTO `gg_user` VALUES ('11', 'zwh', '$2a$10$3mAQBNJ9wZY7q4SWUjhcPeMKqUezJJSIV4rfcIHhCNU/c1aqM.rAS', 'traffic', '1', '1', null);
INSERT INTO `gg_user` VALUES ('12', '游客7', '$2a$10$JzjVmeFhPjeXrGEJgpbVKuXAFEd.g6dloMQk0uBPIcbxVUuXStpAG', 'common', '0', '1', null);
INSERT INTO `gg_user` VALUES ('13', '游客8', '$2a$10$tbZaujaH.e1JH6WP6YkLGO.IAgz/HxAbobBBrnERCQpQ20gg.lcOy', 'common', '0', '1', null);
INSERT INTO `gg_user` VALUES ('14', '游客9', '$2a$10$.35gCoyjgsaf0tznGWkqeeb/404MHAduM7SNzdM4vltXj4cGR1A.G', 'common', '0', '1', 'images/uploads/9fd805fd6e69a07d1ee66ab3b8108c7a');
INSERT INTO `gg_user` VALUES ('15', '游客10', '$2a$10$MBty2RFkNovKYC6zUBiLH.9BEp7BSFxvewoaeTj2NGJbXqd..CUbq', 'common', '0', '1', null);
INSERT INTO `gg_user` VALUES ('16', 'beganing', '$2a$10$V01YauXBlIdbp5lsemGx3uX2qvELIzxDHi0mhwzOPnT778n/zkh6u', 'traffic', '0', '1', 'images/uploads/df4566636499f3a2a84541eac14671a8');
INSERT INTO `gg_user` VALUES ('17', '游客11', '$2a$10$L1Ye3N1dyuyzJFoHVCijge/ZNodedH7cyQu73S3PNyDbNXO3/F9Ea', 'common', '0', '1', null);
INSERT INTO `gg_user` VALUES ('18', '游客12', '$2a$10$1SeB/Y4IqVUqVazSU.d/D.6FQvi6bK/FQuJW6uOxcSmwzFV50m6R2', 'common', '0', '1', null);
INSERT INTO `gg_user` VALUES ('19', '游客13', '$2a$10$xqvSvxL3itQ4M6dAzh4ZH.ZwY0FAV44CqZvuKmG4wrXOZWtE0I2hu', 'common', '0', '1', 'images/uploads/9903cb1af8f3aa73e2fe37407a616c5c');
INSERT INTO `gg_user` VALUES ('20', '游客14', '$2a$10$zlnBBonv5NaXZZFk1S7UMO6p0nWNuogfghN14XxMLV71298d88fgG', 'common', '0', '1', null);
INSERT INTO `gg_user` VALUES ('21', '游客15', '$2a$10$IJ5x35mCO.zymGXsQgl9mORoqYZq0CGUpWmWe55wEtRTs6DW0Wr5G', 'common', '0', '1', 'images/uploads/e25e44dc845c3437619ec4f9e63a7823');
INSERT INTO `gg_user` VALUES ('22', '游客16', '$2a$10$hLw0gJ9EhcyBiIajB26y8usfm4zLG5y4Ns0qBtE.KDcB.kZfWm/RK', 'common', '0', '1', 'images/uploads/ba33b8c72980aa38db9b5fc614d20a13');
INSERT INTO `gg_user` VALUES ('23', '测试17', '$2a$10$CDDOc51fehC6cnCKd9jLZO6PuGjbJL452628N4dCkC4W6HIj1nXQi', 'common', '0', '1', null);
