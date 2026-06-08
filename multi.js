/**
 * 臺灣證券交易所 (TWSE) OpenAPI 介接測試 MVP - 多股收集版
 */
// 替換原本的證交所網址，改用不擋機房 IP 的 FinMind 公開 API
const TWSE_API_URL = "https://api.finmindtrade.com/v4/data?dataset=TaiwanStockPriceTick";

async function fetchMultipleStocks(targetCodes) {
    console.log(`📡 [LAB] 正在從臺灣證券交易所撈取當日盤後資料...`);
    console.log(`🔍 [LAB] 預計檢索的股票清單: ${targetCodes.join(', ')}\n`);

    try {
        const response = await fetch(TWSE_API_URL);

        if (!response.ok) {
            throw new Error(`HTTP 連線失敗！狀態碼: ${response.status}`);
        }

        const stockList = await response.json();
        console.log(`✅ [LAB] 成功取得資料，目前市場總計 ${stockList.length} 檔標的。`);

        console.log(`\n==================================================`);
        console.log(`   股票名稱   |  代碼  |  今日收盤價  |  本月平均價  `);
        console.log(`--------------------------------------------------`);

        // 核心邏輯：用 .filter() 篩選出所有存在於 targetCodes 清單中的股票
        const matchedStocks = stockList.filter(stock => targetCodes.includes(stock.Code));

        // 呈現所有找到的股票
        matchedStocks.forEach(result => {
            // 對齊排版用的簡單處理
            const name = result.Name.padEnd(6, ' '); // 補全全形空格對齊
            console.log(` 📈 ${name} |  ${result.Code}  |  NT$ ${result.ClosingPrice.padEnd(6)}  |  NT$ ${result.MonthlyAveragePrice}`);
        });

        console.log(`==================================================`);

        // 提示找不到的股票
        if (matchedStocks.length < targetCodes.length) {
            const foundCodes = matchedStocks.map(s => s.Code);
            const missingCodes = targetCodes.filter(code => !foundCodes.includes(code));
            console.log(`⚠️  提示：找不到代碼 ${missingCodes.join(', ')}，請確認是否為上市個股。`);
        }

    } catch (error) {
        console.error(`💥 [LAB 錯誤] 介接流程中斷:`, error.message);
    }
}

// ========================================================
// 接收終端機參數：動態支援多支股票
// ========================================================
// process.argv.slice(2) 會把 node index.js 後面的所有參數變成一個陣列
const inputCodes = process.argv.slice(2);

if (inputCodes.length === 0) {
    console.log("💡 [提示] 未輸入代碼，預設查詢：台積電(2330)、鴻海(2317)、聯發科(2454)");
    fetchMultipleStocks(["2330", "2317", "2454"]);
} else {
    fetchMultipleStocks(inputCodes);
}