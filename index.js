/**
 * 臺灣證券交易所 (TWSE) OpenAPI 介接測試 MVP
 * 核心邏輯：Fetch 網路請求 -> JSON 解析 -> 陣列邏輯篩選 -> 終端機視覺化輸出
 */

// 證交所官方端點：上市個股日收盤價及月平均價（免 API Key）
const TWSE_API_URL = "https://openapi.twse.com.tw/v1/exchangeReport/STOCK_DAY_AVG_ALL";

async function fetchStockPrice(targetCode) {
    console.log(`📡 [LAB] 正在從臺灣證券交易所撈取當日盤後資料...`);

    try {
        // 1. 發送網路請求 (Node.js 18+ 內建 fetch)
        const response = await fetch(TWSE_API_URL);

        // 2. 檢查 HTTP 狀態碼
        if (!response.ok) {
            throw new Error(`HTTP 連線失敗！狀態碼: ${response.status}`);
        }

        // 3. 解析 JSON 資料 (證交所回傳格式為包含所有個股物件的 Array)
        const stockList = await response.json();
        
        console.log(`✅ [LAB] 成功取得資料，目前市場總計 ${stockList.length} 檔標的。`);
        console.log(`🔍 [LAB] 正在檢索股票代碼: ${targetCode} ...\n`);

        // 4. 商業邏輯篩選：尋找匹配的股票代碼
        const result = stockList.find(stock => stock.Code === targetCode);

        // 5. MVP 成果呈現
        if (result) {
            console.log(`=================================`);
            console.log(`📈 股票名稱  : ${result.Name}`);
            console.log(`🆔 股票代碼  : ${result.Code}`);
            console.log(`💰 今日收盤價 : NT$ ${result.ClosingPrice}`);
            console.log(`📊 本月平均價 : NT$ ${result.MonthlyAveragePrice}`);
            console.log(`=================================`);
        } else {
            console.log(`⚠️  [提示] 找不到代碼為 "${targetCode}" 的股票，請確認是否為上市個股（例如：2330）。`);
        }

    } catch (error) {
        // 6. 異常處理 (Exception Handling)
        console.error(`💥 [LAB 錯誤] 介接流程中斷:`, error.message);
    }
}

// 執行測試：此處以「台積電 (2330)」作為 MVP 驗證標的
fetchStockPrice("2330");
fetchStockPrice("2303");