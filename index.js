import { getFinvizScreen } from "node-finviz-screener";
import yahooFinance from "yahoo-finance2";

getFinvizScreen('https://finviz.com/screener.ashx?v=111&f=cap_mid,sh_price_o10')
.then((res) => {
  Promise.all(res.map(symbol => yahooFinance.quoteSummary(symbol)))
  .then((data) => {
    console.log(data);
  });
});

