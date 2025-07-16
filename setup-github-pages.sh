#!/bin/bash

# TikTok Analytics Tool - GitHub Pages セットアップスクリプト
# このスクリプトは、GitHub PagesでTerms of ServiceとPrivacy Policyをホストするためのセットアップを自動化します

echo "=== TikTok Analytics Tool - GitHub Pages セットアップ ==="
echo ""

# ユーザー名の入力
read -p "GitHubユーザー名を入力してください: screeeeeam" GITHUB_USERNAME
read -p "リポジトリ名を入力してください (例: tiktok-analytics-tool): tiktok-analytics-tool" REPO_NAME

# デフォルト値の設定
if [ -z "$REPO_NAME" ]; then
    REPO_NAME="tiktok-analytics-tool"
fi

echo ""
echo "設定情報:"
echo "GitHubユーザー名: $GITHUB_USERNAME"
echo "リポジトリ名: $REPO_NAME"
echo ""

# 確認
read -p "この設定で続行しますか？ (y/N): " CONFIRM
if [[ ! $CONFIRM =~ ^[Yy]$ ]]; then
    echo "セットアップをキャンセルしました。"
    exit 1
fi

echo ""
echo "=== ファイルの更新 ==="

# HTMLファイル内のGitHub URLを更新
echo "1. Terms of Service ファイルを更新中..."
sed -i.bak "s|your-username|$GITHUB_USERNAME|g" terms-of-service.html
sed -i.bak "s|tiktok-analytics-tool|$REPO_NAME|g" terms-of-service.html

echo "2. Privacy Policy ファイルを更新中..."
sed -i.bak "s|your-username|$GITHUB_USERNAME|g" privacy-policy.html
sed -i.bak "s|tiktok-analytics-tool|$REPO_NAME|g" privacy-policy.html

echo "3. README_GITHUB_PAGES.md ファイルを更新中..."
sed -i.bak "s|your-username|$GITHUB_USERNAME|g" README_GITHUB_PAGES.md
sed -i.bak "s|tiktok-analytics-tool|$REPO_NAME|g" README_GITHUB_PAGES.md

echo ""
echo "=== セットアップ完了 ==="
echo ""
echo "以下のURLをTikTok for Developers で使用してください："
echo ""
echo "Terms of Service URL:"
echo "https://$GITHUB_USERNAME.github.io/$REPO_NAME/terms-of-service.html"
echo ""
echo "Privacy Policy URL:"
echo "https://$GITHUB_USERNAME.github.io/$REPO_NAME/privacy-policy.html"
echo ""
echo "=== 次の手順 ==="
echo "1. GitHubでリポジトリ '$REPO_NAME' を作成"
echo "2. このプロジェクトのファイルをリポジトリにアップロード"
echo "3. リポジトリのSettings > PagesでGitHub Pagesを有効化"
echo "4. 上記のURLをTikTok for Developers のアプリ登録時に設定"
echo ""
echo "バックアップファイル（.bak）は削除しても構いません。" 