const finviz = require("node-finviz-screener");
const yahooFinance = require("yahoo-finance2").default;
const express = require("express");
const path = require("path");

const app = express();
const assetsRouter = require("./server/assets-router");

const queryOptions = { modules: ['price', 'summaryDetail'] };

const filteredData = [];
async function getStockData() {
  const tickets = finviz.getFinvizScreen('https://finviz.com/screener.ashx?v=111&f=cap_mid,sh_price_o10,fa_pe_u50,ta_perf_13w30o,ta_perf_26w30o,sh_avgvol_o500')
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
        let r5 = (d.price.averageDailyVolume > 800000)
        
        if (r1 && r2 && r3 && r4) {
          let buyPrice = detail.regularMarketPreviousClose;
          let obj = {
            name: name,
            buyPrice: buyPrice,
            soldPrice: (buyPrice * 1.095).toFixed(2),
            cutOff: (buyPrice * 0.93).toFixed(2)
          };
          filteredData.push(obj);
        }
      })
    });
    // Clean data
    filteredData.length = 0;
  });
};

app.use("/", express.static(path.join(__dirname, "public")));
app.use("/src", assetsRouter);

app.get("/api/v1", (req, res) => {
  res.json({
    project: "React and Express Boilerplate",
    from: "Vanaldito",
    abc: "123"
  });
});

app.get("/api/v1/screener", async (req, res) => {
  await getStockData();
  setTimeout(() => { 
    res.json(filteredData);
  }, 4000);
});

app.get("/*", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
})

const { PORT = 5000 } = process.env;

app.listen(PORT, () => {
  console.log();
  console.log(`  App running in port ${PORT}`);
  console.log();
  console.log(`  > Local: \x1b[36mhttp://localhost:\x1b[1m${PORT}/\x1b[0m`);
});
