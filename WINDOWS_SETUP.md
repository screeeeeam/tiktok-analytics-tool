# Windows環境でのGitHub Pagesセットアップ

このドキュメントは、Windows環境でTikTok Analytics ToolのGitHub Pagesセットアップを行う手順を説明します。

## 前提条件

1. **Git for Windows** がインストールされていること
   - [Git for Windows](https://git-scm.com/download/win) からダウンロード・インストール

2. **PowerShell** が利用可能であること（Windows 10/11では標準で利用可能）

3. **GitHubアカウント** を持っていること

## セットアップ手順

### 1. PowerShellスクリプトの実行

PowerShellを管理者として実行し、プロジェクトディレクトリに移動してスクリプトを実行します：

```powershell
# プロジェクトディレクトリに移動
cd "C:\Users\user\Documents\DevProjects\Tryup\impression_TikTokAPI"

# 実行ポリシーを確認（必要に応じて変更）
Get-ExecutionPolicy
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# PowerShellスクリプトを実行
.\setup-github-pages.ps1
```

### 2. スクリプト実行時の入力項目

スクリプト実行時に以下の情報を入力してください：

- **GitHubユーザー名**: あなたのGitHubユーザー名
- **リポジトリ名**: 作成するリポジトリの名前（例: `tiktok-analytics-tool`）

### 3. GitHub CLIのインストール（オプション）

GitHub CLIがインストールされていると、リポジトリの自動作成が可能です：

1. [GitHub CLI](https://cli.github.com/) からダウンロード
2. インストール後、認証を実行：
   ```powershell
   gh auth login
   ```

### 4. 手動でのGitHubリポジトリ作成

GitHub CLIがインストールされていない場合、手動でリポジトリを作成してください：

1. [GitHub](https://github.com/new) にアクセス
2. リポジトリ名を入力（例: `tiktok-analytics-tool`）
3. Public を選択
4. README.md を作成するにチェック
5. リポジトリを作成

### 5. GitHub Pagesの有効化

スクリプト実行後、以下の手順でGitHub Pagesを有効化してください：

1. 作成されたリポジトリの設定ページにアクセス：
   `https://github.com/[ユーザー名]/[リポジトリ名]/settings/pages`

2. Source で 'Deploy from a branch' を選択

3. Branch で 'main' を選択

4. Save をクリック

### 6. 確認

有効化後、以下のURLでアクセスできるようになります：

- メインページ: `https://[ユーザー名].github.io/[リポジトリ名]/`
- 利用規約: `https://[ユーザー名].github.io/[リポジトリ名]/terms-of-service.html`
- プライバシーポリシー: `https://[ユーザー名].github.io/[リポジトリ名]/privacy-policy.html`

## トラブルシューティング

### PowerShellの実行ポリシーエラー

```
.\setup-github-pages.ps1 : このシステムではスクリプトの実行が無効になっているため、
ファイル C:\...\setup-github-pages.ps1 を読み込むことができません。
```

**解決方法:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Gitコマンドが見つからない

```
git : 用語 'git' は、コマンドレット、関数、スクリプト ファイル、または操作可能なプログラムの名前として認識されません。
```

**解決方法:**
1. [Git for Windows](https://git-scm.com/download/win) をインストール
2. PowerShellを再起動

### GitHub CLIが見つからない

```
gh : 用語 'gh' は、コマンドレット、関数、スクリプト ファイル、または操作可能なプログラムの名前として認識されません。
```

**解決方法:**
1. [GitHub CLI](https://cli.github.com/) をインストール
2. PowerShellを再起動
3. `gh auth login` で認証を実行

### ファイルが見つからないエラー

```
エラー: 以下のファイルが見つかりません:
  - terms-of-service.html
  - privacy-policy.html
```

**解決方法:**
必要なHTMLファイルがプロジェクトディレクトリに存在することを確認してください。

## 次のステップ

セットアップ完了後、以下の手順でTikTok for Developersアプリを作成してください：

1. [TikTok for Developers](https://developers.tiktok.com/) にアクセス
2. 新しいアプリを作成
3. 以下のURLを設定：
   - Terms of Service URL: `https://[ユーザー名].github.io/[リポジトリ名]/terms-of-service.html`
   - Privacy Policy URL: `https://[ユーザー名].github.io/[リポジトリ名]/privacy-policy.html`
4. Client KeyとClient Secretを取得
5. GASプログラムの設定を完了

## 参考リンク

- [Git for Windows](https://git-scm.com/download/win)
- [GitHub CLI](https://cli.github.com/)
- [TikTok for Developers](https://developers.tiktok.com/)
- [GitHub Pages](https://pages.github.com/) 