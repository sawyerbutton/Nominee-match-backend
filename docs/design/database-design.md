# Nominee Match 数据库设计文档

## 1. 数据库概述

### 1.1 技术选型
- 数据库类型: PostgreSQL
- 版本要求: >= 13
- 字符集: UTF-8
- 排序规则: en_US.UTF-8

### 1.2 命名规范
- 表名: 小写字母，下划线分隔，复数形式
- 字段名: 小写字母，下划线分隔
- 主键: id
- 外键: {表名}_id
- 创建时间: created_at
- 更新时间: updated_at

## 2. 表结构设计

### 2.1 用户表 (users)
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('developer', 'client')),
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    email_verified BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT users_email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
```

### 2.2 开发者表 (developers)
```sql
CREATE TABLE developers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255),
    bio TEXT,
    hourly_rate DECIMAL(10,2) CHECK (hourly_rate >= 0),
    years_of_experience INTEGER CHECK (years_of_experience >= 0),
    availability VARCHAR(50) CHECK (availability IN ('full-time', 'part-time', 'contract')),
    rating DECIMAL(3,2) CHECK (rating >= 0 AND rating <= 5),
    total_projects INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT developers_user_id_unique UNIQUE (user_id)
);

CREATE INDEX idx_developers_user_id ON developers(user_id);
CREATE INDEX idx_developers_hourly_rate ON developers(hourly_rate);
CREATE INDEX idx_developers_rating ON developers(rating);
```

### 2.3 技能表 (skills)
```sql
CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    category VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT skills_name_unique UNIQUE (name)
);

CREATE INDEX idx_skills_category ON skills(category);
```

### 2.4 开发者技能关联表 (developer_skills)
```sql
CREATE TABLE developer_skills (
    developer_id UUID NOT NULL REFERENCES developers(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    proficiency_level INTEGER CHECK (proficiency_level >= 1 AND proficiency_level <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (developer_id, skill_id)
);

CREATE INDEX idx_developer_skills_skill_id ON developer_skills(skill_id);
```

### 2.5 项目表 (projects)
```sql
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    budget DECIMAL(10,2) CHECK (budget >= 0),
    status VARCHAR(50) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'in_progress', 'completed', 'cancelled')),
    required_skills TEXT[],
    estimated_duration VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_projects_client_id ON projects(client_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_budget ON projects(budget);
```

### 2.6 匹配表 (matches)
```sql
CREATE TABLE matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    developer_id UUID NOT NULL REFERENCES developers(id) ON DELETE CASCADE,
    match_score DECIMAL(5,2) CHECK (match_score >= 0 AND match_score <= 100),
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT matches_project_developer_unique UNIQUE (project_id, developer_id)
);

CREATE INDEX idx_matches_project_id ON matches(project_id);
CREATE INDEX idx_matches_developer_id ON matches(developer_id);
CREATE INDEX idx_matches_status ON matches(status);
```

### 2.7 支付表 (payments)
```sql
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
    payment_method VARCHAR(50),
    transaction_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_payments_match_id ON payments(match_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_created_at ON payments(created_at);
```

## 3. 视图设计

### 3.1 开发者概览视图
```sql
CREATE VIEW developer_overview AS
SELECT 
    d.id,
    u.name,
    d.title,
    d.hourly_rate,
    d.rating,
    d.total_projects,
    array_agg(DISTINCT s.name) as skills
FROM developers d
JOIN users u ON d.user_id = u.id
LEFT JOIN developer_skills ds ON d.id = ds.developer_id
LEFT JOIN skills s ON ds.skill_id = s.id
GROUP BY d.id, u.name, d.title, d.hourly_rate, d.rating, d.total_projects;
```

### 3.2 项目匹配视图
```sql
CREATE VIEW project_matches AS
SELECT 
    p.id as project_id,
    p.title as project_title,
    p.budget,
    d.id as developer_id,
    u.name as developer_name,
    m.match_score,
    m.status as match_status
FROM projects p
JOIN matches m ON p.id = m.project_id
JOIN developers d ON m.developer_id = d.id
JOIN users u ON d.user_id = u.id;
```

## 4. 索引设计

### 4.1 主键索引
- 所有表的主键字段自动创建索引

### 4.2 外键索引
- 所有外键字段创建索引

### 4.3 查询优化索引
- 常用查询字段创建索引
- 排序字段创建索引
- 过滤条件字段创建索引

## 5. 约束设计

### 5.1 主键约束
- 使用UUID作为主键
- 自动生成UUID

### 5.2 外键约束
- 级联删除
- 引用完整性检查

### 5.3 检查约束
- 数值范围检查
- 状态值检查
- 格式检查

## 6. 性能优化

### 6.1 分区策略
- 按时间范围分区
- 按状态分区

### 6.2 缓存策略
- 查询结果缓存
- 热点数据缓存

### 6.3 查询优化
- 索引优化
- 查询重写
- 统计信息更新 