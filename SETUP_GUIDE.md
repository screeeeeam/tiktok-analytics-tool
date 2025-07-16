# TikTok API GASプログラム - セットアップガイド

## 概要

このプログラムは、TikTok公式APIを使用して自分の投稿動画のインプレッション数やその他の統計情報を取得し、Googleスプレッドシートに出力するGoogle Apps Script (GAS) プログラムです。

## ファイル構成

```
impression_TikTokAPI/
├── Code.gs          # メインのGASコード
├── Helper.gs        # ヘルパー関数群
├── README.md        # 基本的な使用方法
└── SETUP_GUIDE.md   # このファイル（詳細セットアップガイド）
```

## セットアップ手順（詳細版）

### ステップ1: TikTok for Developers でアプリを作成

1. [TikTok for Developers](https://developers.tiktok.com/) にアクセス
2. アカウントを作成またはログイン
3. 「Create App」をクリック
4. アプリ情報を入力：
   - App Name: 任意の名前（例：「My TikTok Analytics」）
   - App Description: アプリの説明
   - Category: 「Other」を選択
5. 「Submit」をクリック

### ステップ2: 必要な権限を設定

1. 作成したアプリのダッシュボードに移動
2. 「Permissions」タブをクリック
3. 以下の権限を有効化：
   - `video.list` - 動画一覧の取得
   - `video.analytics` - 動画分析データの取得
   - `user.info.basic` - ユーザー基本情報の取得

### ステップ3: Client KeyとClient Secretを取得

1. 「App Info」タブをクリック
2. Client KeyとClient Secretをコピーして保存
3. これらの値は後でOAuth認証フローで使用します

### ステップ4: OAuth認証フローを実行

1. Google Apps Script で `setClientCredentials()` を実行してClient KeyとClient Secretを設定
2. `generateAuthUrl()` を実行して認証URLを生成
3. 生成されたURLにアクセスしてTikTokアカウントで認証を完了
4. リダイレクトされたURLのcodeパラメータをコピー
5. `exchangeCodeForToken('YOUR_AUTH_CODE')` を実行してアクセストークンを取得

### ステップ4: Google Apps Script プロジェクトを作成

1. [Google Apps Script](https://script.google.com/) にアクセス
2. 「新しいプロジェクト」をクリック
3. プロジェクト名を「TikTok Analytics」などに変更
4. `Code.gs` の内容をコピー&ペースト
5. 「ファイル」→「新規作成」→「スクリプト」で `Helper.gs` を作成
6. `Helper.gs` の内容をコピー&ペースト

### ステップ5: Client KeyとClient Secretを設定

1. `Code.gs` の `setClientCredentials()` 関数を編集
2. `YOUR_CLIENT_KEY_HERE` と `YOUR_CLIENT_SECRET_HERE` を実際の値に置き換え
3. `YOUR_SCRIPT_ID` を実際のGoogle Apps ScriptのIDに置き換え
4. 関数を実行（実行ボタンをクリック）

```javascript
function setClientCredentials() {
  const clientKey = 'your_client_key_here'; // 実際のClient Key
  const clientSecret = 'your_client_secret_here'; // 実際のClient Secret
  const redirectUri = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec'; // リダイレクトURI
  
  PropertiesService.getScriptProperties().setProperty('TIKTOK_CLIENT_KEY', clientKey);
  PropertiesService.getScriptProperties().setProperty('TIKTOK_CLIENT_SECRET', clientSecret);
  PropertiesService.getScriptProperties().setProperty('TIKTOK_REDIRECT_URI', redirectUri);
  
  Logger.log('Client KeyとClient Secretを設定しました。');
}
```

### ステップ6: 認証URLを生成

1. `generateAuthUrl()` 関数を実行
2. ログに表示された認証URLをコピー
3. ブラウザでそのURLにアクセス
4. TikTokアカウントでログインして認証を完了
5. リダイレクトされたURLのcodeパラメータをコピー

### ステップ7: アクセストークンを取得

1. `exchangeCodeForToken('YOUR_AUTH_CODE')` を実行
2. `YOUR_AUTH_CODE` を実際の認証コードに置き換え
3. アクセストークンが正常に取得されることを確認

### ステップ8: Googleスプレッドシートを作成

1. [Google Sheets](https://sheets.google.com/) にアクセス
2. 新しいスプレッドシートを作成
3. スプレッドシート名を「TikTok Analytics」などに変更
4. URLからスプレッドシートIDをコピー：
   - URL例：`https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit`
   - ID部分：`1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`

### ステップ9: スプレッドシートIDを設定

1. `Code.gs` の `setSpreadsheetId()` 関数を編集
2. `YOUR_SPREADSHEET_ID_HERE` を実際のスプレッドシートIDに置き換え
3. 関数を実行

```javascript
function setSpreadsheetId() {
  const spreadsheetId = '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms'; // 実際のID
  
  PropertiesService.getScriptProperties().setProperty('SPREADSHEET_ID', spreadsheetId);
  Logger.log('スプレッドシートIDを設定しました。');
}
```

### ステップ10: テスト実行

1. `Helper.gs` の `runAllTests()` 関数を実行
2. すべてのテストが成功することを確認
3. エラーがある場合は、エラーメッセージを確認して修正

### ステップ11: メイン実行

1. `Code.gs` の `main()` 関数を実行
2. 実行ログで処理状況を確認
3. スプレッドシートにデータが出力されることを確認

## トラブルシューティング

### よくあるエラーと解決方法

#### 1. 「Client Keyが設定されていません」エラー

**原因**: Client KeyとClient Secretが正しく設定されていない

**解決方法**:
1. `setClientCredentials()` 関数が正しく実行されているか確認
2. Client KeyとClient Secretが正しくコピーされているか確認
3. `showCurrentSettings()` で設定状況を確認

#### 2. 「アクセストークンが設定されていません」エラー

**原因**: OAuth認証フローが正しく完了していない

**解決方法**:
1. `generateAuthUrl()` で認証URLを生成
2. 認証URLにアクセスして認証を完了
3. `exchangeCodeForToken(code)` でアクセストークンを取得
4. `showCurrentSettings()` で設定状況を確認

#### 2. 「API接続エラー」エラー

**原因**: TikTok APIへの接続に失敗

**解決方法**:
1. アクセストークンが有効か確認
2. TikTok for Developers でアプリの権限が正しく設定されているか確認
3. ネットワーク接続を確認

#### 3. 「スプレッドシート接続エラー」エラー

**原因**: Googleスプレッドシートへのアクセスに失敗

**解決方法**:
1. スプレッドシートIDが正しく設定されているか確認
2. スプレッドシートが削除されていないか確認
3. Googleアカウントの権限を確認

#### 4. 「権限エラー」エラー

**原因**: TikTok APIの権限が不足

**解決方法**:
1. TikTok for Developers でアプリの権限を確認
2. 必要な権限（`video.list`, `video.analytics`, `user.info.basic`）が有効化されているか確認
3. 新しいアクセストークンを取得（`refreshAccessToken()` または再認証）

### デバッグ方法

#### 1. ログの確認方法

1. Google Apps Script エディタで「実行」→「実行ログ」を選択
2. エラーメッセージや処理状況を確認

#### 2. 段階的テスト

1. `testApiConnection()` - API接続テスト
2. `testSpreadsheetConnection()` - スプレッドシート接続テスト
3. `testWithSampleData()` - サンプルデータテスト
4. `runAllTests()` - 全テスト実行

#### 3. 設定確認

1. `showCurrentSettings()` - 現在の設定表示
2. `checkSettings()` - 設定確認
3. `validateAccessToken()` - アクセストークン検証

## カスタマイズ

### 取得動画数の変更

`Code.gs` の `getMyVideos()` 関数内の `max_count` を変更：

```javascript
const payload = {
  fields: [...],
  max_count: 50 // この値を変更
};
```

### 出力項目の追加

`outputToSpreadsheet()` 関数内のヘッダー配列とデータ配列を修正：

```javascript
const headers = [
  '動画ID', 'タイトル', '説明', '動画時間(秒)', 
  '再生数', 'いいね数', 'コメント数', 'シェア数',
  'インプレッション数', 'リーチ数', 'エンゲージメント率(%)',
  'シェアURL', 'カバー画像URL', '取得日時',
  '新しい項目' // 追加
];
```

### 自動実行の設定

1. Google Apps Script エディタで「トリガー」をクリック
2. 「トリガーを追加」をクリック
3. 設定：
   - 実行する関数: `main`
   - 実行するデプロイ: `Head`
   - イベントのソース: `時間主導型`
   - 時間ベースのトリガーのタイプ: `日次` または `週次`


## 注意事項

### API制限
- TikTok APIには1日あたりのリクエスト制限があります
- プログラム内でAPI制限を考慮して1秒間の待機時間を設けています

### アクセストークンの有効期限
- アクセストークンには有効期限があります
- 期限が切れた場合は新しいトークンを生成して再設定してください

### データの更新頻度
- リアルタイムではなく、APIから取得可能な最新データが出力されます
- 定期的な実行を推奨します

## サポート

問題が発生した場合は、以下を確認してください：

1. [TikTok for Developers ドキュメント](https://developers.tiktok.com/doc/)
2. [Google Apps Script ドキュメント](https://developers.google.com/apps-script)
3. 実行ログのエラーメッセージ
4. このセットアップガイドのトラブルシューティングセクション 