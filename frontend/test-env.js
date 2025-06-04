// 測試環境變數
console.log('=== 環境變數測試 ===');
console.log('VITE_API_URL:', process.env.VITE_API_URL || '❌ 未設定');
console.log('VITE_BASE_PATH:', process.env.VITE_BASE_PATH || '❌ 未設定');
console.log('BUILD_MODE:', process.env.BUILD_MODE || '❌ 未設定');
console.log('NODE_ENV:', process.env.NODE_ENV || '❌ 未設定');
console.log('所有環境變數:', Object.keys(process.env).filter(key => key.startsWith('VITE_') || key === 'BUILD_MODE').map(key => `${key}=${process.env[key]}`));
console.log('=====================');

// 檢查必要的環境變數
const requiredVars = ['VITE_API_URL', 'VITE_BASE_PATH'];
const missingVars = requiredVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.log('⚠️  警告：以下環境變數未設定:', missingVars.join(', '));
  console.log('✅ 但繼續執行 build...');
} else {
  console.log('✅ 所有必要環境變數都已設定');
}

// 正常結束，不要因為環境變數問題而失敗
process.exit(0);
