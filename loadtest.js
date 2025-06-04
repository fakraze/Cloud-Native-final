import http from 'k6/http';
import { sleep } from 'k6';
import { check } from 'k6';

export const options = {
  stages: [
    { duration: '20s', target: 50 },   // 快速加壓，初始探測
    { duration: '1m',  target: 100 },   // 中壓穩定期
    { duration: '2m',  target: 300 },  // 高壓期：模擬尖峰
    { duration: '30s', target: 0 },     // 降壓
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<1000'],
  },
};

export default function () {
  // 隨機餐廳 ID（模擬參數）
  const id = Math.floor(Math.random() * 10) + 1;

  // 1. 抓前端首頁（模擬 HTML 載入）
  http.get('http://13.218.27.133/dev/frontend/');

  // 2. 後端 GET APIs（模擬餐廳列表）
  http.get(`http://13.218.27.133/dev/backend/api/`);
  http.get(`http://13.218.27.133/dev/backend/api/restaurant`);;

    // const res = http.get('http://13.218.27.133/dev/backend/api/restaurant');
    // if (__ITER < 20) {
    //     console.log(`🔍 [Iteration ${__ITER}] /api/restaurant response status: ${res.status}`);
    // }


  // 每個使用者每 200ms 打完一輪請求
  sleep(0.2);
}
