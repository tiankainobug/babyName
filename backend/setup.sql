-- 创建数据库
CREATE DATABASE IF NOT EXISTS baby_name CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 使用数据库
USE baby_name;

-- 创建用户表（如果JPA自动创建失败时手动执行）
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    openid VARCHAR(255) UNIQUE NOT NULL COMMENT '微信openid',
    nickname VARCHAR(255) COMMENT '用户昵称',
    avatar VARCHAR(500) COMMENT '用户头像URL',
    login_type ENUM('WECHAT', 'NORMAL') NOT NULL DEFAULT 'WECHAT' COMMENT '登录类型',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_openid (openid),
    INDEX idx_login_type (login_type),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 插入测试数据（可选）
INSERT IGNORE INTO users (openid, nickname, avatar, login_type) VALUES 
('test_openid_1', '测试用户1', '', 'WECHAT'),
('test_openid_2', '测试用户2', '', 'WECHAT');

-- 查看表结构
DESCRIBE users;

-- 查看数据
SELECT * FROM users LIMIT 5;






