# Banking API Makefile
# 提供開發和生產環境的 Docker 操作命令

# 變數定義
IMAGE_NAME = banking-api
CONTAINER_NAME = banking-api-container
PORT = 3001

# 預設目標
.PHONY: help
help: ## 顯示幫助信息
	@echo "Banking API Docker 操作命令："
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# 開發環境命令
.PHONY: dev
dev: ## 啟動開發環境（watch 模式）
	npm run start:dev

.PHONY: dev-docker
dev-docker: build ## 使用 Docker 啟動開發環境
	docker run -d -p $(PORT):3000 --name $(CONTAINER_NAME)-dev $(IMAGE_NAME):latest
	@echo "開發環境已啟動在 http://localhost:$(PORT)"
	@echo "API 文檔: http://localhost:$(PORT)/api"
	@echo "健康檢查: http://localhost:$(PORT)/health"

# 生產環境命令
.PHONY: prod
prod: build ## 構建並啟動生產環境
	@echo "停止並移除現有容器..."
	@docker stop $(CONTAINER_NAME) 2>/dev/null || true
	@docker rm $(CONTAINER_NAME) 2>/dev/null || true
	@echo "啟動生產容器..."
	docker run -d -p $(PORT):3000 --name $(CONTAINER_NAME) $(IMAGE_NAME):latest
	@echo "等待應用啟動..."
	@sleep 3
	@echo "生產環境已啟動在 http://localhost:$(PORT)"

# Docker 相關命令
.PHONY: build
build: ## 構建 Docker 鏡像
	docker build -t $(IMAGE_NAME):latest .

.PHONY: build-no-cache
build-no-cache: ## 強制重新構建 Docker 鏡像（無快取）
	docker build --no-cache -t $(IMAGE_NAME):latest .

# 測試命令
.PHONY: test
test: ## 運行所有測試
	npm run test

.PHONY: test-e2e
test-e2e: ## 運行端對端測試
	npm run test:e2e

.PHONY: test-docker
test-docker: prod ## 測試 Docker 生產環境
	@echo "測試健康檢查端點..."
	@curl -f http://localhost:$(PORT)/health || (echo "健康檢查失敗" && exit 1)
	@echo "✅ 健康檢查通過"

# 清理命令
.PHONY: clean
clean: ## 停止並移除容器
	@docker stop $(CONTAINER_NAME) 2>/dev/null || true
	@docker stop $(CONTAINER_NAME)-dev 2>/dev/null || true
	@docker rm $(CONTAINER_NAME) 2>/dev/null || true
	@docker rm $(CONTAINER_NAME)-dev 2>/dev/null || true
	@echo "容器已清理"

.PHONY: clean-all
clean-all: clean ## 清理容器和鏡像
	@docker rmi $(IMAGE_NAME):latest 2>/dev/null || true
	@echo "鏡像已清理"

# 查看狀態
.PHONY: status
status: ## 查看 Docker 容器狀態
	@echo "=== Docker 容器狀態 ==="
	@docker ps -a --filter name=$(CONTAINER_NAME)
	@echo ""
	@echo "=== Docker 鏡像 ==="
	@docker images $(IMAGE_NAME)

.PHONY: logs
logs: ## 查看容器日誌
	docker logs -f $(CONTAINER_NAME)

# 開發工具
.PHONY: lint
lint: ## 運行代碼檢查
	npm run lint

.PHONY: format
format: ## 格式化代碼
	npm run format

# 安裝依賴
.PHONY: install
install: ## 安裝 npm 依賴
	npm install 
