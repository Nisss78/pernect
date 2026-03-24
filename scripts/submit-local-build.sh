#!/bin/bash

# ローカルビルドしたipaファイルを自動的にApp Store Connectに提出するスクリプト

set -e

echo "📦 ローカルビルドのipaファイルを検索中..."

# 最新のipaファイルを見つける
IPA_FILE=$(find . -maxdepth 1 -name "build-*.ipa" -type f | sort -r | head -1)

if [ -z "$IPA_FILE" ]; then
    echo "❌ ipaファイルが見つかりません。先にビルドを実行してください。"
    exit 1
fi

echo "✅ 見つかりました: $IPA_FILE"
echo ""

# 絶対パスに変換
ABSOLUTE_PATH=$(cd "$(dirname "$IPA_FILE")" && pwd)/$(basename "$IPA_FILE")

echo "📤 App Store Connectに提出中..."
echo "パス: $ABSOLUTE_PATH"
echo ""

# EAS Submitを実行（パスを直接指定）
eas submit --platform ios --path "$ABSOLUTE_PATH"

echo ""
echo "✅ 提出が完了しました！"
echo "App Store Connect (https://appstoreconnect.apple.com) でTestFlightの処理状況を確認できます。"
