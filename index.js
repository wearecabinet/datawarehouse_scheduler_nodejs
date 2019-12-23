const express = require("express");
const asyncHandler = require("express-async-handler");
const shopify = require("./shopify.js");

// Express App
const app = express();

//Pull data from Shopify API and create JSON file
app.get(
  "/shopify_customers",
  asyncHandler(async (req, res) => {
    await shopify.pullData();
    res.sendStatus(200);
  })
);

//Upload to bucket - store JSON in Cloud Storage
app.get("/shopify_customers_upload", (req, res) => {
  shopify.jsonUpload();
  res.sendStatus(200);
});

//Ingest to BigQuery
app.get("/shopify_bq", (req, res) => {
  res.sendStatus(200);
});

/* Express Server and Port */
const port = 8000;
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
