import { getFinvizScreen } from "node-finviz-screener";
import * as fs from 'fs';
import yahooFinance from "yahoo-finance2";

// Summary detail missing SMA 150
const queryOptions = { modules: ['price', 'summaryDetail'] };

getFinvizScreen('https://finviz.com/screener.ashx?v=111&f=cap_mid,sh_price_o10,sh_price_u80,ta_perf_13w30o,ta_perf_26w30o,sh_avgvol_o500')
.then((res) => {
  Promise.all(res.map(symbol => yahooFinance.quoteSummary(symbol, queryOptions)))
  .then((data) => {
    data.map((d) => {
      let name = d.price.symbol;
      let detail = d.summaryDetail;

      let r1 = (detail.regularMarketPreviousClose > detail.fiftyDayAverage);
      let r2 = (detail.fiftyDayAverage > detail.twoHundredDayAverage);
      let r3 = ((detail.regularMarketPreviousClose - detail.fiftyTwoWeekLow)/detail.regularMarketPreviousClose) > 0.25;
      let r4 = (((detail.regularMarketPreviousClose - detail.fiftyTwoWeekHigh)/detail.regularMarketPreviousClose) < 0.15) 
        && (((detail.regularMarketPreviousClose - detail.fiftyTwoWeekHigh)/detail.regularMarketPreviousClose) > -0.15);
      
      if (r1 && r2 && r3 && r4) {
        let oPrice = detail.regularMarketPreviousClose
        console.log(
          name,
          "Buy: ",
          oPrice.toFixed(2),
          "Sold L1: ",
          (oPrice * 1.1).toFixed(2),
          "Sold L2: ",
          (oPrice * 1.2).toFixed(2),
          "Cut Out: ",
          (oPrice * 0.93).toFixed(2)
        );
      }
    })
    // let json = JSON.stringify(data);
    // fs.writeFileSync('test.json', json, 'utf8')
  });
});


