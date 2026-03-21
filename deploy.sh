#!/usr/bin/env bash
set -e

cd /opt/apps/life.lengziyu.cn

# 1) 拉最新代码
git pull

# 2) 安装依赖（有变更时自动更新）
cnpm i

# 3) 加载环境变量
set -a
source .env
set +a

# 4) 数据库与 Prisma
npx prisma generate
npx prisma db push

# 5) 构建（更稳，避免卡死）
rm -rf .next
FAST_BUILD=1 NODE_OPTIONS="--max-old-space-size=1536" npx next build --webpack

# 6) standalone 需要带静态资源
mkdir -p .next/standalone/.next
cp -r .next/static .next/standalone/.next/
cp -r public .next/standalone/

# 7) 重启服务
pm2 restart lifeshots --update-env
pm2 save

# 8) 查看状态
pm2 status
pm2 logs lifeshots --lines 30
