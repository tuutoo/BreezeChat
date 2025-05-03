# —— 第一阶段：安装依赖并构建 —— 
FROM node:22-alpine AS builder

# 声明可被覆盖的镜像地址参数（默认使用淘宝镜像）
ARG NPM_REGISTRY_URL=https://registry.npmmirror.com/
# 将其写入 npm 配置
ENV NPM_CONFIG_REGISTRY=${NPM_REGISTRY_URL}

WORKDIR /app

# 复制依赖定义
COPY package*.json ./

# 安装依赖（会走国内镜像）
RUN npm ci

# 复制项目其余文件并构建
COPY . .
RUN npm run build


# —— 第二阶段：生产镜像 —— 
FROM node:22-alpine AS runner

# 保持生产环境配置
ENV NODE_ENV=production
# 继续使用同样的镜像源
ARG NPM_REGISTRY_URL
ENV NPM_CONFIG_REGISTRY=${NPM_REGISTRY_URL}

WORKDIR /app

# 拷贝构建产物
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./

EXPOSE 3000
CMD ["npm", "start"]
