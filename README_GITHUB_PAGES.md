# GitHub Pages でのホスト方法

TikTok for Developers のアプリ登録時に必要な Terms of Service URL と Privacy Policy URL を GitHub Pages でホストする方法を説明します。

## 手順

### 1. GitHub リポジトリの作成

1. GitHub で新しいリポジトリを作成（例：`tiktok-analytics-tool`）
2. 作成したリポジトリに以下のファイルをアップロード：
   - `terms-of-service.html`
   - `privacy-policy.html`
   - `README.md`
   - その他のプロジェクトファイル

### 2. GitHub Pages の設定

1. リポジトリの **Settings** タブをクリック
2. 左サイドバーの **Pages** をクリック
3. **Source** セクションで **Deploy from a branch** を選択
4. **Branch** で **main** を選択
5. **Save** をクリック

### 3. カスタムドメインの設定（オプション）

より専門的なURLにするために、カスタムドメインを設定できます：

1. **Custom domain** フィールドにドメインを入力
2. **Save** をクリック
3. DNS設定でCNAMEレコードを追加

### 4. URL の取得

設定完了後、以下のURLが利用可能になります：

- **Terms of Service URL**: `https://your-username.github.io/tiktok-analytics-tool/terms-of-service.html`
- **Privacy Policy URL**: `https://your-username.github.io/tiktok-analytics-tool/privacy-policy.html`

## TikTok for Developers での設定

### 1. アプリ登録時の設定

TikTok for Developers でアプリを登録する際に、以下のURLを設定してください：

```
Terms of Service URL: https://your-username.github.io/tiktok-analytics-tool/terms-of-service.html
Privacy Policy URL: https://your-username.github.io/tiktok-analytics-tool/privacy-policy.html
```

### 2. 注意事項

- `your-username` を実際のGitHubユーザー名に置き換えてください
- `tiktok-analytics-tool` を実際のリポジトリ名に置き換えてください
- URLは公開されている必要があります（プライベートリポジトリではGitHub Pagesが利用できません）

## ファイルのカスタマイズ

### 1. 連絡先情報の更新

両方のHTMLファイル内の以下の部分を実際の情報に更新してください：

```html
<!-- terms-of-service.html と privacy-policy.html の両方で -->
<p>GitHub Issues: <a href="https://github.com/your-username/tiktok-analytics-tool/issues" target="_blank">https://github.com/your-username/tiktok-analytics-tool/issues</a></p>
```

### 2. 日付の更新

必要に応じて、最終更新日を現在の日付に更新してください：

```html
<div class="date">最終更新日: 2024年12月19日</div>
```

## トラブルシューティング

### 1. ページが表示されない場合

- GitHub Pages の設定が正しく行われているか確認
- ファイル名が正確か確認
- ブランチが正しく選択されているか確認

### 2. スタイルが適用されない場合

- HTMLファイル内のCSSが正しく記述されているか確認
- ブラウザのキャッシュをクリア

### 3. カスタムドメインが動作しない場合

- DNS設定が正しく行われているか確認
- CNAMEレコードが正しく設定されているか確認

## セキュリティとプライバシー

### 1. 情報の保護

- 個人情報は含まれていません
- すべての情報は公開されることを前提としています
- 機密情報は含めないでください

### 2. 定期的な更新

- 法令の変更に応じて内容を更新
- サービスの変更に応じて内容を更新
- 更新日を記録

## 参考リンク

- [GitHub Pages 公式ドキュメント](https://pages.github.com/)
- [TikTok for Developers](https://developers.tiktok.com/)
- [個人情報保護法](https://www.ppc.go.jp/) 