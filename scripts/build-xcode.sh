#!/bin/bash

# Xcodeでローカルビルド&デプロイスクリプト
# Xcode Command Line Toolsが必要です
# 使い方: ./scripts/build-xcode.sh

set -e

echo "🍎 Xcodeでローカルビルドを開始します..."

# 1. ネイティブプロジェクトを生成
echo ""
echo "📦 ネイティブプロジェクトを生成中..."
npx expo prebuild --platform ios --clean

# 2. Podのインストール
echo ""
echo "📦 CocoaPodsの依存関係をインストール中..."
cd ios
pod install
cd ..

# 3. Xcodeでビルド（アーカイブ）
echo ""
echo "🔨 Xcodeでアーカイブをビルド中..."
echo "⚠️  注意: Xcodeでの署名設定が必要です"

# Xcodeプロジェクトを開く
echo ""
echo "📱 Xcodeプロジェクトを開きます..."
open ios/pernect.xcworkspace

echo ""
echo "✅ ネイティブプロジェクトの準備が完了しました！"
echo ""
echo "次のステップ（Xcodeで実行）:"
echo "1. Product > Archive を選択"
echo "2. アーカイブが完了したら Distribute App をクリック"
echo "3. App Store Connect を選択"
echo "4. Upload を選択してアップロード"
echo ""
echo "または、コマンドラインでアップロード:"
echo "  xcrun altool --upload-app -f path/to/app.ipa -t ios -u YOUR_APPLE_ID -p YOUR_APP_SPECIFIC_PASSWORD"
