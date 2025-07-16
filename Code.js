/**
 * TikTok APIを使用して動画のインプレッションを取得するGASプログラム
 * 
 * 必要な設定:
 * 1. TikTok for Developers でアプリを作成
 * 2. アクセストークンを取得
 * 3. スプレッドシートのIDを設定
 */

// CONFIGファイルから設定を取得
const CONFIG = getConfig();

/**
 * メイン実行関数
 */
function main() {
  try {
    // アクセストークンを取得（環境変数またはプロパティから）
    const accessToken = getAccessToken();
    
    if (!accessToken) {
      throw new Error('アクセストークンが設定されていません。getAccessToken()関数を確認してください。');
    }
    
    // 自分の投稿動画を取得
    const videos = getMyVideos(accessToken);
    
    // 各動画のインプレッション情報を取得
    const videoStats = getVideoStats(accessToken, videos);
    
    // スプレッドシートに結果を出力
    outputToSpreadsheet(videoStats);
    
    Logger.log('処理が完了しました。');
    
  } catch (error) {
    Logger.log('エラーが発生しました: ' + error.toString());
  }
}

/**
 * アクセストークンを取得
 * スクリプトプロパティから取得し、期限切れの場合は更新を試行
 */
function getAccessToken() {
  // スクリプトプロパティから取得
  const accessToken = PropertiesService.getScriptProperties().getProperty('TIKTOK_ACCESS_TOKEN');
  
  if (!accessToken) {
    Logger.log('アクセストークンが設定されていません。setConfigFromFile()を実行してから認証フローを開始してください。');
    return null;
  }
  
  // トークンの有効期限をチェック
  const tokenExpiry = PropertiesService.getScriptProperties().getProperty('TIKTOK_TOKEN_EXPIRY');
  if (tokenExpiry && new Date() > new Date(tokenExpiry)) {
    Logger.log('アクセストークンの有効期限が切れています。refreshAccessToken()を実行してください。');
    return null;
  }
  
  return accessToken;
}

/**
 * 自分の投稿動画一覧を取得
 */
function getMyVideos(accessToken) {
  const url = `${CONFIG.TIKTOK.API_BASE_URL}/video/query/`;
  
  const payload = {
    fields: ['id', 'title', 'cover_image_url', 'video_description', 'duration', 'height', 'width', 'share_url', 'comment_count', 'like_count', 'share_count', 'view_count'],
    max_count: CONFIG.API.MAX_VIDEOS // 取得する動画数
  };
  
  const options = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    payload: JSON.stringify(payload)
  };
  
  try {
    const response = UrlFetchApp.fetch(url, options);
    const data = JSON.parse(response.getContentText());
    
    if (data.error) {
      throw new Error(`API エラー: ${data.error.message}`);
    }
    
    return data.data.videos || [];
    
  } catch (error) {
    Logger.log('動画取得エラー: ' + error.toString());
    return [];
  }
}

/**
 * 動画の詳細統計情報を取得
 */
function getVideoStats(accessToken, videos) {
  const videoStats = [];
  
  for (const video of videos) {
    try {
      const stats = getVideoAnalytics(accessToken, video.id);
      videoStats.push({
        id: video.id,
        title: video.title || 'タイトルなし',
        description: video.video_description || '',
        duration: video.duration,
        view_count: video.view_count || 0,
        like_count: video.like_count || 0,
        comment_count: video.comment_count || 0,
        share_count: video.share_count || 0,
        share_url: video.share_url,
        cover_image_url: video.cover_image_url,
        // 詳細統計情報
        impressions: stats.impressions || 0,
        reach: stats.reach || 0,
        engagement_rate: stats.engagement_rate || 0,
        created_time: new Date().toISOString()
      });
      
      // API制限を考慮して少し待機
      Utilities.sleep(CONFIG.API.REQUEST_DELAY);
      
    } catch (error) {
      Logger.log(`動画 ${video.id} の統計取得エラー: ${error.toString()}`);
    }
  }
  
  return videoStats;
}

/**
 * 個別動画の分析データを取得
 */
function getVideoAnalytics(accessToken, videoId) {
  const url = `${CONFIG.TIKTOK.API_BASE_URL}/video/analytics/`;
  
  const payload = {
    video_id: videoId,
    fields: ['impressions', 'reach', 'engagement_rate', 'play_count', 'unique_viewer_count']
  };
  
  const options = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    payload: JSON.stringify(payload)
  };
  
  try {
    const response = UrlFetchApp.fetch(url, options);
    const data = JSON.parse(response.getContentText());
    
    if (data.error) {
      throw new Error(`分析API エラー: ${data.error.message}`);
    }
    
    return data.data || {};
    
  } catch (error) {
    Logger.log(`動画 ${videoId} の分析取得エラー: ${error.toString()}`);
    return {};
  }
}

/**
 * 結果をスプレッドシートに出力
 */
function outputToSpreadsheet(videoStats) {
  if (videoStats.length === 0) {
    Logger.log('出力するデータがありません。');
    return;
  }
  
  try {
    const spreadsheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET.ID);
    const sheet = spreadsheet.getActiveSheet();
    
    // ヘッダー行を設定
    const headers = CONFIG.OUTPUT.COLUMNS;
    
    // ヘッダーを書き込み
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    // データを準備
    const data = videoStats.map(video => [
      video.id,
      video.title,
      video.description,
      video.duration,
      video.view_count,
      video.like_count,
      video.comment_count,
      video.share_count,
      video.impressions,
      video.reach,
      video.engagement_rate,
      video.share_url,
      video.cover_image_url,
      video.created_time
    ]);
    
    // データを書き込み
    if (data.length > 0) {
      sheet.getRange(2, 1, data.length, headers.length).setValues(data);
    }
    
    // 列幅を自動調整
    if (CONFIG.OUTPUT.AUTO_RESIZE_COLUMNS) {
      sheet.autoResizeColumns(1, headers.length);
    }
    
    Logger.log(`${data.length}件の動画データをスプレッドシートに出力しました。`);
    
  } catch (error) {
    Logger.log('スプレッドシート出力エラー: ' + error.toString());
  }
}

/**
 * Client KeyとClient Secretを設定する関数
 * 初回実行時に使用してください
 */
function setClientCredentials() {
  const clientKey = CONFIG.TIKTOK.CLIENT_KEY;
  const clientSecret = CONFIG.TIKTOK.CLIENT_SECRET;
  const redirectUri = CONFIG.TIKTOK.REDIRECT_URI;
  
  PropertiesService.getScriptProperties().setProperty('TIKTOK_CLIENT_KEY', clientKey);
  PropertiesService.getScriptProperties().setProperty('TIKTOK_CLIENT_SECRET', clientSecret);
  PropertiesService.getScriptProperties().setProperty('TIKTOK_REDIRECT_URI', redirectUri);
  
  Logger.log('Client KeyとClient Secretを設定しました。');
  Logger.log('認証URLを生成します...');
  
  // 認証URLを生成
  generateAuthUrl();
}

/**
 * 認証URLを生成する関数
 */
function generateAuthUrl() {
  const clientKey = PropertiesService.getScriptProperties().getProperty('TIKTOK_CLIENT_KEY');
  const redirectUri = PropertiesService.getScriptProperties().getProperty('TIKTOK_REDIRECT_URI');
  
  if (!clientKey || !redirectUri) {
    Logger.log('Client KeyまたはRedirect URIが設定されていません。setConfigFromFile()を実行してください。');
    return;
  }
  
  const state = Utilities.getUuid(); // セキュリティ用のランダム文字列
  PropertiesService.getScriptProperties().setProperty('TIKTOK_AUTH_STATE', state);
  
  const authUrl = `${CONFIG.TIKTOK.AUTH_URL}?client_key=${clientKey}&scope=user.info.basic,video.list,video.analytics&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`;
  
  Logger.log('=== 認証URL ===');
  Logger.log(authUrl);
  Logger.log('');
  Logger.log('このURLにアクセスして認証を完了してください。');
  Logger.log('認証後、リダイレクトされたURLのcodeパラメータをコピーして、exchangeCodeForToken()関数で使用してください。');
}

/**
 * 認証コードをアクセストークンと交換する関数
 */
function exchangeCodeForToken(authCode) {
  const clientKey = PropertiesService.getScriptProperties().getProperty('TIKTOK_CLIENT_KEY');
  const clientSecret = PropertiesService.getScriptProperties().getProperty('TIKTOK_CLIENT_SECRET');
  const redirectUri = PropertiesService.getScriptProperties().getProperty('TIKTOK_REDIRECT_URI');
  
  if (!clientKey || !clientSecret || !redirectUri) {
    Logger.log('Client Key、Client Secret、またはRedirect URIが設定されていません。');
    return false;
  }
  
  try {
    const payload = {
      client_key: clientKey,
      client_secret: clientSecret,
      code: authCode,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri
    };
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cache-Control': 'no-cache'
      },
      payload: buildFormData(payload)
    };
    
    const response = UrlFetchApp.fetch(CONFIG.TIKTOK.TOKEN_URL, options);
    const data = JSON.parse(response.getContentText());
    
    if (data.error) {
      Logger.log(`トークン取得エラー: ${data.error.message}`);
      return false;
    }
    
    // アクセストークンを保存
    PropertiesService.getScriptProperties().setProperty('TIKTOK_ACCESS_TOKEN', data.access_token);
    PropertiesService.getScriptProperties().setProperty('TIKTOK_REFRESH_TOKEN', data.refresh_token);
    
    // 有効期限を設定（現在時刻 + expires_in秒）
    const expiryDate = new Date();
    expiryDate.setSeconds(expiryDate.getSeconds() + data.expires_in);
    PropertiesService.getScriptProperties().setProperty('TIKTOK_TOKEN_EXPIRY', expiryDate.toISOString());
    
    Logger.log('アクセストークンを正常に取得しました。');
    Logger.log(`有効期限: ${expiryDate.toLocaleString('ja-JP')}`);
    
    return true;
    
  } catch (error) {
    Logger.log(`トークン取得エラー: ${error.toString()}`);
    return false;
  }
}

/**
 * リフレッシュトークンを使用してアクセストークンを更新する関数
 */
function refreshAccessToken() {
  const clientKey = PropertiesService.getScriptProperties().getProperty('TIKTOK_CLIENT_KEY');
  const clientSecret = PropertiesService.getScriptProperties().getProperty('TIKTOK_CLIENT_SECRET');
  const refreshToken = PropertiesService.getScriptProperties().getProperty('TIKTOK_REFRESH_TOKEN');
  
  if (!clientKey || !clientSecret || !refreshToken) {
    Logger.log('Client Key、Client Secret、またはRefresh Tokenが設定されていません。');
    return false;
  }
  
  try {
    const payload = {
      client_key: clientKey,
      client_secret: clientSecret,
      grant_type: 'refresh_token',
      refresh_token: refreshToken
    };
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cache-Control': 'no-cache'
      },
      payload: buildFormData(payload)
    };
    
    const response = UrlFetchApp.fetch(CONFIG.TIKTOK.TOKEN_URL, options);
    const data = JSON.parse(response.getContentText());
    
    if (data.error) {
      Logger.log(`トークン更新エラー: ${data.error.message}`);
      return false;
    }
    
    // 新しいアクセストークンを保存
    PropertiesService.getScriptProperties().setProperty('TIKTOK_ACCESS_TOKEN', data.access_token);
    
    // 新しいリフレッシュトークンがあれば保存
    if (data.refresh_token) {
      PropertiesService.getScriptProperties().setProperty('TIKTOK_REFRESH_TOKEN', data.refresh_token);
    }
    
    // 有効期限を設定
    const expiryDate = new Date();
    expiryDate.setSeconds(expiryDate.getSeconds() + data.expires_in);
    PropertiesService.getScriptProperties().setProperty('TIKTOK_TOKEN_EXPIRY', expiryDate.toISOString());
    
    Logger.log('アクセストークンを正常に更新しました。');
    Logger.log(`新しい有効期限: ${expiryDate.toLocaleString('ja-JP')}`);
    
    return true;
    
  } catch (error) {
    Logger.log(`トークン更新エラー: ${error.toString()}`);
    return false;
  }
}

/**
 * フォームデータを構築するヘルパー関数
 */
function buildFormData(data) {
  const params = [];
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      params.push(`${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`);
    }
  }
  return params.join('&');
}

/**
 * スプレッドシートIDを設定する関数
 */
function setSpreadsheetId() {
  const spreadsheetId = CONFIG.SPREADSHEET.ID; // CONFIGから取得
  PropertiesService.getScriptProperties().setProperty('SPREADSHEET_ID', spreadsheetId);
  Logger.log('スプレッドシートIDを設定しました。');
}

/**
 * 設定を確認する関数
 */
function checkSettings() {
  const clientKey = PropertiesService.getScriptProperties().getProperty('TIKTOK_CLIENT_KEY');
  const clientSecret = PropertiesService.getScriptProperties().getProperty('TIKTOK_CLIENT_SECRET');
  const accessToken = getAccessToken();
  const spreadsheetId = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID') || CONFIG.SPREADSHEET.ID;
  
  Logger.log('=== 設定確認 ===');
  Logger.log(`Client Key: ${clientKey ? '設定済み' : '未設定'}`);
  Logger.log(`Client Secret: ${clientSecret ? '設定済み' : '未設定'}`);
  Logger.log(`アクセストークン: ${accessToken ? '設定済み' : '未設定'}`);
  Logger.log(`スプレッドシートID: ${spreadsheetId !== 'YOUR_SPREADSHEET_ID_HERE' ? '設定済み' : '未設定'}`);
  
  if (accessToken) {
    const tokenExpiry = PropertiesService.getScriptProperties().getProperty('TIKTOK_TOKEN_EXPIRY');
    if (tokenExpiry) {
      const expiryDate = new Date(tokenExpiry);
      Logger.log(`トークン有効期限: ${expiryDate.toLocaleString('ja-JP')}`);
      
      if (new Date() > expiryDate) {
        Logger.log('⚠️ トークンの有効期限が切れています。refreshAccessToken()を実行してください。');
      }
    }
  }
  
  if (!clientKey || !clientSecret || !accessToken || spreadsheetId === 'YOUR_SPREADSHEET_ID_HERE') {
    Logger.log('設定が不完全です。setClientCredentials()とsetSpreadsheetId()を実行してください。');
  } else {
    Logger.log('設定は完了しています。');
  }
} 