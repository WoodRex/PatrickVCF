const finviz = require("finviz-screener");
const yahooFinance = require("yahoo-finance2").default;
const path = require("path");
const express = require("express");

const app = express();
const assetsRouter = require("./server/assets-router");

const queryOptions = { modules: ['price', 'summaryDetail'] };

let yahooData = [];
let filteredData = [];

const getStockData = async () => {
  // Clean data first
  filteredData.length = 0;
  yahooData.length = 0;

  const tickets = await finviz()
    .averageVolume('Over 500K')
    .marketCap('Mid ($2bln to $10bln)')
    .price('Over $10')
    .pe('Under 50')
    .performance('Quarter +30%')
    .performance2('Half +20%')
    .scan();

    for (let ticket of tickets)
      yahooData.push(await yahooFinance.quoteSummary(ticket, queryOptions));
    
    yahooData.map((data) => {
      let name = data.price.symbol;
      let detail = data.summaryDetail;

      // Requirement
      let r1 = (detail.regularMarketPreviousClose > detail.fiftyDayAverage);
      let r2 = (detail.fiftyDayAverage > detail.twoHundredDayAverage);
      let r3 = ((detail.regularMarketPreviousClose - detail.fiftyTwoWeekLow)/detail.regularMarketPreviousClose) > 0.25;
      let r4 = (((detail.regularMarketPreviousClose - detail.fiftyTwoWeekHigh)/detail.regularMarketPreviousClose) < 0.15) 
        && (((detail.regularMarketPreviousClose - detail.fiftyTwoWeekHigh)/detail.regularMarketPreviousClose) > -0.15);
      
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
  });
};


app.use("/", express.static(path.join(__dirname, "public")));
app.use("/src", assetsRouter);

app.get("/api/v1/screener", async (req, res) => {
  await getStockData();
  setTimeout(() => { 
    res.json(filteredData);
  }, 10000);
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
