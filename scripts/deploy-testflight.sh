#!/bin/bash

# TestFlightへのビルド&デプロイ自動化スクリプト
# 使い方: ./scripts/deploy-testflight.sh [local|cloud]

set -e  # エラーで停止

BUILD_TYPE=${1:-cloud}  # デフォルトはクラウドビルド

echo "🚀 TestFlightデプロイを開始します..."
echo "ビルドタイプ: $BUILD_TYPE"

# バージョン確認
VERSION=$(node -p "require('./app.json').expo.version")
echo "📦 現在のバージョン: $VERSION"

# 1. Convexのスキーマをデプロイ（必要に応じて）
echo ""
echo "📡 Convexバックエンドの状態を確認中..."
if command -v convex &> /dev/null; then
    echo "Convexが検出されました。必要に応じて 'npx convex deploy' を実行してください。"
fi

# 2. ビルド実行
echo ""
echo "🔨 iOSアプリをビルド中..."

if [ "$BUILD_TYPE" = "local" ]; then
    echo "⚠️  ローカルビルドを実行します（Dockerが必要です）..."
    eas build --local --platform ios --profile production-local
else
    echo "☁️  クラウドビルドを実行します..."
    eas build --platform ios --profile production --non-interactive
fi

# ビルド成功を確認
if [ $? -ne 0 ]; then
    echo "❌ ビルドに失敗しました"
    exit 1
fi

echo "✅ ビルドが完了しました！"

# 3. App Store Connectに提出
echo ""
echo "📤 App Store Connectに提出中..."
eas submit --platform ios --latest --non-interactive

# 提出成功を確認
if [ $? -ne 0 ]; then
    echo "❌ 提出に失敗しました"
    exit 1
fi

echo ""
echo "✅ TestFlightへのデプロイが完了しました！"
echo "🎉 App Store Connectで確認してください: https://appstoreconnect.apple.com/"
echo ""
echo "次のステップ:"
echo "1. App Store Connect > My Apps > pernect > TestFlight"
echo "2. テスターを追加して招待"
echo "3. テストを開始"
