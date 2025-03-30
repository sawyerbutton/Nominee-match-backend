# Nominee Match Backend

Nominee Match后端服务是一个基于NestJS框架构建的RESTful API服务，为前端提供强大的后端支持。该服务集成了Web3技术，支持区块链支付和智能合约交互。

## 功能特性

### 1. 用户认证与授权
- JWT基于的身份认证
- 基于角色的访问控制(RBAC)
- 用户会话管理
- 密码加密存储
- Web3钱包认证集成

### 2. 开发者管理
- 开发者资料CRUD
- 技能标签管理
- 项目经验管理
- 工作偏好设置
- 区块链信誉系统集成

### 3. 智能匹配系统
- 基于机器学习的匹配算法
- 技能匹配度计算
- 项目需求分析
- 实时匹配推荐
- 智能合约自动匹配

### 4. 支付系统集成
- 支付网关集成
- 订单管理
- 交易记录
- 支付状态追踪
- 加密货币支付支持
  - ETH支付
  - ERC20代币支付
  - 多链支持
- 智能合约支付
- 支付状态链上验证

### 5. Web3功能
- 智能合约集成
  - 项目发布合约
  - 支付托管合约
  - 信誉评分合约
- 区块链事件监听
- 交易状态追踪
- Gas费用估算
- 多链支持
  - Ethereum
  - Polygon
  - BSC
- Web3钱包集成
  - MetaMask
  - WalletConnect
  - Coinbase Wallet

## 技术栈

- **框架**: NestJS
- **语言**: TypeScript
- **数据库**: PostgreSQL
- **ORM**: TypeORM
- **认证**: JWT
- **API文档**: Swagger
- **测试**: Jest
- **包管理器**: pnpm
- **Web3技术**:
  - Web3.js
  - Ethers.js
  - Hardhat
  - OpenZeppelin
  - IPFS

## 项目结构

```
src/
├── developers/        # 开发者模块
├── matching/         # 匹配系统模块
├── payments/         # 支付系统模块
├── profiles/         # 用户档案模块
├── web3/            # Web3集成模块
│   ├── contracts/   # 智能合约
│   ├── services/    # Web3服务
│   └── utils/       # Web3工具
├── app.module.ts     # 主模块
└── main.ts          # 应用入口
```

## 开发环境设置

1. 安装依赖
```bash
pnpm install
```

2. 配置环境变量
```bash
cp .env.example .env
# 编辑.env文件配置必要的环境变量
# 包括Web3相关配置：
# - WEB3_PROVIDER_URL
# - CONTRACT_ADDRESSES
# - PRIVATE_KEY
# - IPFS_GATEWAY
```

3. 启动开发服务器
```bash
pnpm start:dev
```

4. 构建生产版本
```bash
pnpm build
```

5. 运行测试
```bash
pnpm test
```

6. 部署智能合约
```bash
pnpm deploy:contracts
```

## API文档

启动服务后访问 `http://localhost:3000/api` 查看Swagger API文档。

## 数据库设计

### 主要数据表
- users
- developers
- skills
- projects
- matches
- payments
- transactions
- blockchain_transactions
- smart_contract_events

## 安全特性

- HTTPS加密
- JWT认证
- 请求速率限制
- CORS配置
- 输入验证
- XSS防护
- CSRF防护
- Web3安全
  - 智能合约审计
  - 私钥管理
  - 交易签名验证
  - 重放攻击防护

## 性能优化

- 数据库索引优化
- 缓存策略
- 请求压缩
- 连接池管理
- 异步处理
- Web3优化
  - 节点连接池
  - 事件监听优化
  - Gas费用优化
  - 批量交易处理

## 监控与日志

- 请求日志
- 错误追踪
- 性能监控
- 资源使用监控
- 区块链监控
  - 交易状态
  - Gas费用
  - 合约事件
  - 节点健康

## 部署

### 环境要求
- Node.js >= 16
- PostgreSQL >= 13
- PM2 (推荐用于生产环境)
- Web3节点访问
- IPFS节点

### 部署步骤
1. 构建项目
```bash
pnpm build
```

2. 部署智能合约
```bash
pnpm deploy:contracts
```

3. 启动服务
```bash
pnpm start:prod
```

## 贡献指南

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建Pull Request

## 许可证

MIT License
