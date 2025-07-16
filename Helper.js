/**
 * TikTok API GASプログラム - ヘルパー関数
 * 設定とトラブルシューティングを支援する関数群
 */

/**
 * 完全なセットアップを一度に行う関数
 */
function completeSetup() {
  Logger.log('=== 完全セットアップ開始 ===');
  
  // 1. 設定確認
  checkSettings();
  
  // 2. Client KeyとClient Secret設定（ユーザーが手動で設定する必要があります）
  Logger.log('Client KeyとClient Secretを設定してください:');
  Logger.log('1. TikTok for Developers でアプリを作成');
  Logger.log('2. Client KeyとClient Secretを取得');
  Logger.log('3. setClientCredentials() 関数内の値を実際の値に置き換え');
  Logger.log('4. setClientCredentials() を実行');
  
  // 3. 認証フロー
  Logger.log('認証フローを実行してください:');
  Logger.log('1. generateAuthUrl() で認証URLを生成');
  Logger.log('2. 生成されたURLにアクセスして認証を完了');
  Logger.log('3. リダイレクトされたURLのcodeパラメータをコピー');
  Logger.log('4. exchangeCodeForToken(code) でアクセストークンを取得');
  
  // 4. スプレッドシートID設定（ユーザーが手動で設定する必要があります）
  Logger.log('スプレッドシートIDを設定してください:');
  Logger.log('1. Googleスプレッドシートを新規作成');
  Logger.log('2. URLからスプレッドシートIDをコピー');
  Logger.log('3. setSpreadsheetId() 関数内の YOUR_SPREADSHEET_ID_HERE を実際のIDに置き換え');
  Logger.log('4. setSpreadsheetId() を実行');
  
  Logger.log('=== セットアップ手順完了 ===');
}

/**
 * API接続テスト
 */
function testApiConnection() {
  const accessToken = getAccessToken();
  
  if (!accessToken) {
    Logger.log('エラー: アクセストークンが設定されていません');
    return false;
  }
  
  try {
    const url = `${TIKTOK_API_BASE_URL}/user/info/`;
    
    const options = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    };
    
    const response = UrlFetchApp.fetch(url, options);
    const data = JSON.parse(response.getContentText());
    
    if (data.error) {
      Logger.log(`API接続エラー: ${data.error.message}`);
      return false;
    }
    
    Logger.log('API接続テスト成功');
    Logger.log(`ユーザー情報: ${JSON.stringify(data.data, null, 2)}`);
    return true;
    
  } catch (error) {
    Logger.log(`API接続テストエラー: ${error.toString()}`);
    return false;
  }
}

/**
 * スプレッドシート接続テスト
 */
function testSpreadsheetConnection() {
  const spreadsheetId = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID') || SPREADSHEET_ID;
  
  if (spreadsheetId === 'YOUR_SPREADSHEET_ID_HERE') {
    Logger.log('エラー: スプレッドシートIDが設定されていません');
    return false;
  }
  
  try {
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    const sheet = spreadsheet.getActiveSheet();
    
    // テストデータを書き込み
    const testData = [
      ['テスト', 'データ', '接続確認'],
      [new Date().toISOString(), '成功', 'OK']
    ];
    
    sheet.getRange(1, 1, 2, 3).setValues(testData);
    
    Logger.log('スプレッドシート接続テスト成功');
    
    // テストデータを削除
    sheet.getRange(1, 1, 2, 3).clear();
    
    return true;
    
  } catch (error) {
    Logger.log(`スプレッドシート接続テストエラー: ${error.toString()}`);
    return false;
  }
}

/**
 * 全体的なテスト実行
 */
function runAllTests() {
  Logger.log('=== 全テスト実行開始 ===');
  
  const results = {
    settings: false,
    api: false,
    spreadsheet: false
  };
  
  // 設定確認
  try {
    checkSettings();
    results.settings = true;
  } catch (error) {
    Logger.log(`設定テスト失敗: ${error.toString()}`);
  }
  
  // API接続テスト
  results.api = testApiConnection();
  
  // スプレッドシート接続テスト
  results.spreadsheet = testSpreadsheetConnection();
  
  // 結果サマリー
  Logger.log('=== テスト結果サマリー ===');
  Logger.log(`設定: ${results.settings ? 'OK' : 'NG'}`);
  Logger.log(`API接続: ${results.api ? 'OK' : 'NG'}`);
  Logger.log(`スプレッドシート: ${results.spreadsheet ? 'OK' : 'NG'}`);
  
  if (results.settings && results.api && results.spreadsheet) {
    Logger.log('すべてのテストが成功しました。main()を実行できます。');
  } else {
    Logger.log('一部のテストが失敗しました。設定を確認してください。');
  }
  
  return results;
}

/**
 * アクセストークンの有効性をチェック
 */
function validateAccessToken() {
  const accessToken = getAccessToken();
  
  if (!accessToken) {
    Logger.log('アクセストークンが設定されていません');
    return false;
  }
  
  // トークンの有効期限をチェック
  const tokenExpiry = PropertiesService.getScriptProperties().getProperty('TIKTOK_TOKEN_EXPIRY');
  if (tokenExpiry && new Date() > new Date(tokenExpiry)) {
    Logger.log('アクセストークンの有効期限が切れています');
    return false;
  }
  
  Logger.log('アクセストークンは有効です');
  return true;
}

/**
 * 設定をリセット
 */
function resetSettings() {
  PropertiesService.getScriptProperties().deleteProperty('TIKTOK_ACCESS_TOKEN');
  PropertiesService.getScriptProperties().deleteProperty('TIKTOK_REFRESH_TOKEN');
  PropertiesService.getScriptProperties().deleteProperty('TIKTOK_TOKEN_EXPIRY');
  PropertiesService.getScriptProperties().deleteProperty('TIKTOK_CLIENT_KEY');
  PropertiesService.getScriptProperties().deleteProperty('TIKTOK_CLIENT_SECRET');
  PropertiesService.getScriptProperties().deleteProperty('TIKTOK_REDIRECT_URI');
  PropertiesService.getScriptProperties().deleteProperty('TIKTOK_AUTH_STATE');
  PropertiesService.getScriptProperties().deleteProperty('SPREADSHEET_ID');
  
  Logger.log('設定をリセットしました');
}

/**
 * 現在の設定を表示
 */
function showCurrentSettings() {
  const clientKey = PropertiesService.getScriptProperties().getProperty('TIKTOK_CLIENT_KEY');
  const clientSecret = PropertiesService.getScriptProperties().getProperty('TIKTOK_CLIENT_SECRET');
  const accessToken = getAccessToken();
  const refreshToken = PropertiesService.getScriptProperties().getProperty('TIKTOK_REFRESH_TOKEN');
  const tokenExpiry = PropertiesService.getScriptProperties().getProperty('TIKTOK_TOKEN_EXPIRY');
  const spreadsheetId = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID') || SPREADSHEET_ID;
  
  Logger.log('=== 現在の設定 ===');
  Logger.log(`Client Key: ${clientKey ? '設定済み' : '未設定'}`);
  Logger.log(`Client Secret: ${clientSecret ? '設定済み' : '未設定'}`);
  Logger.log(`アクセストークン: ${accessToken ? '設定済み' : '未設定'}`);
  Logger.log(`リフレッシュトークン: ${refreshToken ? '設定済み' : '未設定'}`);
  Logger.log(`スプレッドシートID: ${spreadsheetId !== 'YOUR_SPREADSHEET_ID_HERE' ? spreadsheetId : '未設定'}`);
  
  if (accessToken) {
    Logger.log(`アクセストークン形式: ${accessToken.substring(0, 10)}...`);
  }
  
  if (tokenExpiry) {
    const expiryDate = new Date(tokenExpiry);
    Logger.log(`トークン有効期限: ${expiryDate.toLocaleString('ja-JP')}`);
    
    if (new Date() > expiryDate) {
      Logger.log('⚠️ トークンの有効期限が切れています');
    }
  }
}

/**
 * サンプルデータでスプレッドシートをテスト
 */
function testWithSampleData() {
  const sampleData = [
    {
      id: 'sample_video_1',
      title: 'サンプル動画1',
      description: 'これはテスト用のサンプルデータです',
      duration: 30,
      view_count: 1000,
      like_count: 100,
      comment_count: 20,
      share_count: 50,
      share_url: 'https://www.tiktok.com/@user/video/sample1',
      cover_image_url: 'https://example.com/cover1.jpg',
      impressions: 5000,
      reach: 3000,
      engagement_rate: 3.4,
      created_time: new Date().toISOString()
    },
    {
      id: 'sample_video_2',
      title: 'サンプル動画2',
      description: '2つ目のテスト用サンプルデータ',
      duration: 45,
      view_count: 2000,
      like_count: 200,
      comment_count: 30,
      share_count: 80,
      share_url: 'https://www.tiktok.com/@user/video/sample2',
      cover_image_url: 'https://example.com/cover2.jpg',
      impressions: 8000,
      reach: 5000,
      engagement_rate: 4.2,
      created_time: new Date().toISOString()
    }
  ];
  
  try {
    outputToSpreadsheet(sampleData);
    Logger.log('サンプルデータの出力テストが成功しました');
  } catch (error) {
    Logger.log(`サンプルデータ出力エラー: ${error.toString()}`);
  }
}

/**
 * ヘルプメッセージを表示
 */
function showHelp() {
  Logger.log('=== TikTok API GASプログラム ヘルプ ===');
  Logger.log('');
  Logger.log('利用可能な関数:');
  Logger.log('1. completeSetup() - 完全セットアップガイド');
  Logger.log('2. checkSettings() - 設定確認');
  Logger.log('3. setClientCredentials() - Client Key/Secret設定');
  Logger.log('4. generateAuthUrl() - 認証URL生成');
  Logger.log('5. exchangeCodeForToken(code) - 認証コードをトークンに交換');
  Logger.log('6. refreshAccessToken() - アクセストークン更新');
  Logger.log('7. setSpreadsheetId() - スプレッドシートID設定');
  Logger.log('8. testApiConnection() - API接続テスト');
  Logger.log('9. testSpreadsheetConnection() - スプレッドシート接続テスト');
  Logger.log('10. runAllTests() - 全テスト実行');
  Logger.log('11. validateAccessToken() - アクセストークン検証');
  Logger.log('12. resetSettings() - 設定リセット');
  Logger.log('13. showCurrentSettings() - 現在の設定表示');
  Logger.log('14. testWithSampleData() - サンプルデータテスト');
  Logger.log('15. main() - メイン実行');
  Logger.log('');
  Logger.log('初回セットアップ手順:');
  Logger.log('1. completeSetup() を実行');
  Logger.log('2. TikTok for Developers でアプリを作成');
  Logger.log('3. Client KeyとClient Secretを取得');
  Logger.log('4. setClientCredentials() で認証情報を設定');
  Logger.log('5. generateAuthUrl() で認証URLを生成');
  Logger.log('6. 認証URLにアクセスして認証を完了');
  Logger.log('7. exchangeCodeForToken(code) でアクセストークンを取得');
  Logger.log('8. Googleスプレッドシートを作成');
  Logger.log('9. setSpreadsheetId() でスプレッドシートIDを設定');
  Logger.log('10. runAllTests() でテスト実行');
  Logger.log('11. main() でメイン実行');
} 