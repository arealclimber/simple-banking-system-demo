# 多階段構建 - 構建階段
FROM node:20-alpine AS builder

WORKDIR /app

# 複製 package 文件
COPY package*.json ./

# 安裝依賴
RUN npm ci

# 複製源代碼
COPY . .

# 構建應用
RUN npm run build

# 生產階段
FROM node:20-slim AS production

WORKDIR /app

# 複製 package 文件
COPY package*.json ./

# 只安裝生產依賴，跳過 prepare 腳本
RUN npm ci --omit=dev --ignore-scripts

# 從構建階段複製構建結果
COPY --from=builder /app/dist ./dist

# 暴露端口
EXPOSE 3000

# 啟動應用
CMD ["node", "dist/src/main.js"] 
