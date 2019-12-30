"use strict";

const express = require("express");
const shopify = require("./shopify.js");

// Express App
const app = express();

/* Shopify API Calls*/

//Test for API up and running
app.get("/", (req, res) => {
  res.status(200).send("Cabinet Datawarehouse Backend Up and Running!");
});

//Pull customer data from Shopify API and create JSON file
app.get("/shopify_customers", (req, res) => {
  let data = shopify.customerPull();
  console.log(data);
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
const port = process.env.PORT || 8000;
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

module.exports = app;
