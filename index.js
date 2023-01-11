import { getFinvizScreen } from "node-finviz-screener";
import * as fs from 'fs';
import yahooFinance from "yahoo-finance2";

// Summary detail missing SMA 150
const queryOptions = { modules: ['price', 'summaryDetail'] };

getFinvizScreen('https://finviz.com/screener.ashx?v=111&f=cap_mid,sh_price_o10,sh_price_u50')
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
        console.log(name);
      }
    })
    // let json = JSON.stringify(data);
    // fs.writeFileSync('test.json', json, 'utf8')
  });
});

