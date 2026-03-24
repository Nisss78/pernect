#!/bin/bash
set -euo pipefail

# ============================================================
# Pernect Agent Service - Cloud Run Deploy Script
# ============================================================
#
# 使い方:
#   ./scripts/deploy.sh
#
# 前提条件:
#   - gcloud CLI がインストール済み & 認証済み
#   - 環境変数 OPENROUTER_API_KEY, AGENT_SERVICE_TOKEN が設定済み
#   - GCP プロジェクトが設定済み (gcloud config set project <PROJECT_ID>)
#
# コスト設計:
#   - min-instances=0: アイドル時は課金ゼロ
#   - max-instances=3: 最大3インスタンス（コスト上限制御）
#   - us-central1: 無料枠対象リージョン
#   - 512Mi/1CPU: 最小構成で十分
# ============================================================

SERVICE_NAME="pernect-agents"
REGION="us-central1"

# 環境変数チェック
if [ -z "${OPENROUTER_API_KEY:-}" ]; then
  echo "Error: OPENROUTER_API_KEY is not set"
  exit 1
fi
if [ -z "${AGENT_SERVICE_TOKEN:-}" ]; then
  echo "Error: AGENT_SERVICE_TOKEN is not set"
  exit 1
fi

echo "Deploying ${SERVICE_NAME} to Cloud Run (${REGION})..."

cd "$(dirname "$0")/.."

gcloud run deploy "${SERVICE_NAME}" \
  --source . \
  --region "${REGION}" \
  --min-instances=0 \
  --max-instances=3 \
  --memory=512Mi \
  --cpu=1 \
  --timeout=60 \
  --concurrency=10 \
  --set-env-vars="OPENROUTER_API_KEY=${OPENROUTER_API_KEY},AGENT_SERVICE_TOKEN=${AGENT_SERVICE_TOKEN}" \
  --no-allow-unauthenticated \
  --quiet

# デプロイ後のURL取得
SERVICE_URL=$(gcloud run services describe "${SERVICE_NAME}" \
  --region "${REGION}" \
  --format="value(status.url)")

echo ""
echo "=== Deploy Complete ==="
echo "Service URL: ${SERVICE_URL}"
echo ""
echo "Next steps:"
echo "  1. Convex環境変数を設定:"
echo "     npx convex env set AGENT_SERVICE_URL ${SERVICE_URL}"
echo "     npx convex env set AGENT_SERVICE_TOKEN \${AGENT_SERVICE_TOKEN}"
echo "  2. ヘルスチェック:"
echo "     curl -H \"Authorization: Bearer \${AGENT_SERVICE_TOKEN}\" ${SERVICE_URL}/api/v1/health"
echo "  3. OpenRouter月次上限を\$10に設定（ダッシュボード）"
echo "  4. GCP予算アラートを\$5に設定"
