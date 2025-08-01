CREATE TABLE attack_flyline (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',

    source_ip VARCHAR(45) NOT NULL COMMENT '攻击源IP',
    target_ip VARCHAR(45) NOT NULL COMMENT '受害者IP',

    source_location_name VARCHAR(100) COMMENT '攻击源位置名称（如 美国·洛杉矶）',
    source_lng DECIMAL(10, 6) NOT NULL COMMENT '攻击源经度',
    source_lat DECIMAL(10, 6) NOT NULL COMMENT '攻击源纬度',

    target_location_name VARCHAR(100) COMMENT '目标位置名称（如 中国·北京）',
    target_lng DECIMAL(10, 6) NOT NULL COMMENT '目标经度',
    target_lat DECIMAL(10, 6) NOT NULL COMMENT '目标纬度',

    attack_method VARCHAR(50) NOT NULL COMMENT '攻击形式（如 DDoS、SQL注入）',
    target_system VARCHAR(100) NOT NULL COMMENT '受攻击系统（如 Windows Server、Linux Nginx）',

    attack_time DATETIME NOT NULL COMMENT '攻击时间',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '记录创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '记录更新时间',

    INDEX idx_attack_time (attack_time),
    INDEX idx_source_ip (source_ip),
    INDEX idx_target_ip (target_ip),
    INDEX idx_attack_method (attack_method),
    INDEX idx_target_system (target_system)
) COMMENT='攻击飞线图事件记录表';
