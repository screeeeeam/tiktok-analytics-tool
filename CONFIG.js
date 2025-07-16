/**
 * TikTok API GASプログラム - 設定ファイル
 * このファイルで各種設定値を管理します
 */

const CONFIG = {
  // TikTok API設定
  TIKTOK: {
    CLIENT_KEY: 'YOUR_CLIENT_KEY_HERE', // TikTok for Developers で取得したClient Key
    CLIENT_SECRET: 'YOUR_CLIENT_SECRET_HERE', // TikTok for Developers で取得したClient Secret
    REDIRECT_URI: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec', // リダイレクトURI
    API_BASE_URL: 'https://open.tiktokapis.com/v2',
    AUTH_URL: 'https://www.tiktok.com/v2/auth/authorize/',
    TOKEN_URL: 'https://open.tiktokapis.com/v2/oauth/token/'
  },
  
  // Googleスプレッドシート設定
  SPREADSHEET: {
    ID: 'YOUR_SPREADSHEET_ID_HERE', // GoogleスプレッドシートのID
    SHEET_NAME: 'TikTok Analytics' // シート名（オプション）
  },
  
  // API設定
  API: {
    MAX_VIDEOS: 20, // 取得する動画の最大数
    REQUEST_DELAY: 1000, // APIリクエスト間の待機時間（ミリ秒）
    TIMEOUT: 30000 // リクエストタイムアウト（ミリ秒）
  },
  
  // 出力設定
  OUTPUT: {
    // 出力する列の設定
    COLUMNS: [
      '動画ID',
      'タイトル', 
      '説明',
      '動画時間(秒)',
      '再生数',
      'いいね数',
      'コメント数',
      'シェア数',
      'インプレッション数',
      'リーチ数',
      'エンゲージメント率(%)',
      'シェアURL',
      'カバー画像URL',
      '取得日時'
    ],
    
    // 日付フォーマット
    DATE_FORMAT: 'yyyy-MM-dd HH:mm:ss',
    
    // 自動列幅調整
    AUTO_RESIZE_COLUMNS: true
  },
  
  // ログ設定
  LOGGING: {
    ENABLE_DEBUG: true, // デバッグログを有効にする
    ENABLE_ERROR: true, // エラーログを有効にする
    ENABLE_INFO: true   // 情報ログを有効にする
  }
};

/**
 * 設定値を取得する関数
 */
function getConfig() {
  return CONFIG;
}

/**
 * 特定の設定値を取得する関数
 */
function getConfigValue(path) {
  const keys = path.split('.');
  let value = CONFIG;
  
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return null;
    }
  }
  
  return value;
}

/**
 * 設定値を検証する関数
 */
function validateConfig() {
  const errors = [];
  
  // TikTok設定の検証
  if (!CONFIG.TIKTOK.CLIENT_KEY || CONFIG.TIKTOK.CLIENT_KEY === 'YOUR_CLIENT_KEY_HERE') {
    errors.push('TikTok Client Keyが設定されていません');
  }
  
  if (!CONFIG.TIKTOK.CLIENT_SECRET || CONFIG.TIKTOK.CLIENT_SECRET === 'YOUR_CLIENT_SECRET_HERE') {
    errors.push('TikTok Client Secretが設定されていません');
  }
  
  if (!CONFIG.TIKTOK.REDIRECT_URI || CONFIG.TIKTOK.REDIRECT_URI.includes('YOUR_SCRIPT_ID')) {
    errors.push('TikTok Redirect URIが正しく設定されていません');
  }
  
  // スプレッドシート設定の検証
  if (!CONFIG.SPREADSHEET.ID || CONFIG.SPREADSHEET.ID === 'YOUR_SPREADSHEET_ID_HERE') {
    errors.push('スプレッドシートIDが設定されていません');
  }
  
  // API設定の検証
  if (CONFIG.API.MAX_VIDEOS < 1 || CONFIG.API.MAX_VIDEOS > 100) {
    errors.push('MAX_VIDEOSは1から100の間で設定してください');
  }
  
  if (CONFIG.API.REQUEST_DELAY < 0) {
    errors.push('REQUEST_DELAYは0以上の値を設定してください');
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

/**
 * 設定値を表示する関数
 */
function showConfig() {
  Logger.log('=== 現在の設定 ===');
  
  // TikTok設定
  Logger.log('TikTok設定:');
  Logger.log(`  Client Key: ${CONFIG.TIKTOK.CLIENT_KEY !== 'YOUR_CLIENT_KEY_HERE' ? '設定済み' : '未設定'}`);
  Logger.log(`  Client Secret: ${CONFIG.TIKTOK.CLIENT_SECRET !== 'YOUR_CLIENT_SECRET_HERE' ? '設定済み' : '未設定'}`);
  Logger.log(`  Redirect URI: ${CONFIG.TIKTOK.REDIRECT_URI}`);
  
  // スプレッドシート設定
  Logger.log('スプレッドシート設定:');
  Logger.log(`  ID: ${CONFIG.SPREADSHEET.ID !== 'YOUR_SPREADSHEET_ID_HERE' ? CONFIG.SPREADSHEET.ID : '未設定'}`);
  Logger.log(`  シート名: ${CONFIG.SPREADSHEET.SHEET_NAME}`);
  
  // API設定
  Logger.log('API設定:');
  Logger.log(`  最大動画数: ${CONFIG.API.MAX_VIDEOS}`);
  Logger.log(`  リクエスト間隔: ${CONFIG.API.REQUEST_DELAY}ms`);
  Logger.log(`  タイムアウト: ${CONFIG.API.TIMEOUT}ms`);
  
  // 出力設定
  Logger.log('出力設定:');
  Logger.log(`  出力列数: ${CONFIG.OUTPUT.COLUMNS.length}`);
  Logger.log(`  日付フォーマット: ${CONFIG.OUTPUT.DATE_FORMAT}`);
  Logger.log(`  自動列幅調整: ${CONFIG.OUTPUT.AUTO_RESIZE_COLUMNS ? '有効' : '無効'}`);
  
  // ログ設定
  Logger.log('ログ設定:');
  Logger.log(`  デバッグログ: ${CONFIG.LOGGING.ENABLE_DEBUG ? '有効' : '無効'}`);
  Logger.log(`  エラーログ: ${CONFIG.LOGGING.ENABLE_ERROR ? '有効' : '無効'}`);
  Logger.log(`  情報ログ: ${CONFIG.LOGGING.ENABLE_INFO ? '有効' : '無効'}`);
  
  // 設定検証
  const validation = validateConfig();
  if (validation.isValid) {
    Logger.log('✅ 設定は正常です');
  } else {
    Logger.log('❌ 設定に問題があります:');
    validation.errors.forEach(error => Logger.log(`  - ${error}`));
  }
}

/**
 * 設定をリセットする関数
 */
function resetConfig() {
  // スクリプトプロパティをクリア
  PropertiesService.getScriptProperties().deleteAllProperties();
  
  Logger.log('設定をリセットしました');
  Logger.log('CONFIG.jsファイルの値を更新してから、setConfigFromFile()を実行してください');
}

/**
 * CONFIGファイルから設定を読み込む関数
 */
function setConfigFromFile() {
  try {
    // TikTok設定
    PropertiesService.getScriptProperties().setProperty('TIKTOK_CLIENT_KEY', CONFIG.TIKTOK.CLIENT_KEY);
    PropertiesService.getScriptProperties().setProperty('TIKTOK_CLIENT_SECRET', CONFIG.TIKTOK.CLIENT_SECRET);
    PropertiesService.getScriptProperties().setProperty('TIKTOK_REDIRECT_URI', CONFIG.TIKTOK.REDIRECT_URI);
    
    // スプレッドシート設定
    PropertiesService.getScriptProperties().setProperty('SPREADSHEET_ID', CONFIG.SPREADSHEET.ID);
    PropertiesService.getScriptProperties().setProperty('SPREADSHEET_SHEET_NAME', CONFIG.SPREADSHEET.SHEET_NAME);
    
    // API設定
    PropertiesService.getScriptProperties().setProperty('API_MAX_VIDEOS', CONFIG.API.MAX_VIDEOS.toString());
    PropertiesService.getScriptProperties().setProperty('API_REQUEST_DELAY', CONFIG.API.REQUEST_DELAY.toString());
    PropertiesService.getScriptProperties().setProperty('API_TIMEOUT', CONFIG.API.TIMEOUT.toString());
    
    Logger.log('CONFIGファイルから設定を読み込みました');
    
    // 設定検証
    const validation = validateConfig();
    if (!validation.isValid) {
      Logger.log('⚠️ 設定に問題があります:');
      validation.errors.forEach(error => Logger.log(`  - ${error}`));
    }
    
  } catch (error) {
    Logger.log(`設定の読み込みエラー: ${error.toString()}`);
  }
} 