const express = require("express");
const asyncHandler = require("express-async-handler");
const shopify = require("./shopify.js");

// Express App
const app = express();

/* Shopify API Calls*/

//Pull customer data from Shopify API and create JSON file
app.get("/shopify_customers", (req, res) => {
  shopify.customerPull();
  res.sendStatus(200);
});

//Upload to GCS bucket
app.get("/shopify_customers_upload", (req, res) => {
  shopify.customerUploadJSON();
  res.sendStatus(200);
});

//Pull order data from Shopify API and create JSON file
app.get("/shopify_orders", (req, res) => {
  shopify.orderPull();
  res.sendStatus(200);
});

//Upload to GCS bucket
app.get("/shopify_orders_upload", (req, res) => {
  shopify.orderUploadJSON();
  res.sendStatus(200);
});

/* END Shopify Section */

//Ingest to BigQuery
app.get("/shopify_bq", (req, res) => {
  res.sendStatus(200);
});

/* Express Server and Port */
const port = 8000;
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
