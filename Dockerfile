# —— 第一阶段：安装依赖并构建 —— 
FROM node:22-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json（如果有的话）
COPY package*.json ./

# 安装依赖
RUN npm ci

# 复制项目其余文件
COPY . .

# 构建生产版本
RUN npm run build


# —— 第二阶段：生产镜像 —— 
FROM node:22-alpine AS runner

# 设置 NODE_ENV，自动安装仅生产依赖
ENV NODE_ENV=production

WORKDIR /app

# 复制构建产物和必要文件
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./


# 暴露端口（与你在 next.config.js 或启动时使用的保持一致）
EXPOSE 3000

# 默认启动命令
CMD ["npm", "start"]