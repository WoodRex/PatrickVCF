import { getFinvizScreen } from "node-finviz-screener";
import * as fs from 'fs';
import yahooFinance from "yahoo-finance2";


getFinvizScreen('https://finviz.com/screener.ashx?v=111&f=cap_mid,sh_price_o15')
.then((res) => {
  Promise.all(res.map(symbol => yahooFinance.quoteSummary(symbol)))
  .then((data) => {
    let json = JSON.stringify(data);
    fs.writeFileSync('test.json', json, 'utf8')
  });
});

