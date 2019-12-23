const fs = require("fs");
const axios = require("axios");
const CircularJSON = require("circular-json");

const { Storage } = require("@google-cloud/storage");
// GCP Cloud Storage Configs
const projectId = "cabinet-datawarehouse";
const keyFilename = "./dw-auth.json";
const storage = new Storage({ projectId, keyFilename });
const bucketName = "wearecabinet_shopify_customer_json";
const bucket = storage.bucket(bucketName);

// Shopify Configs
const shopifyAuth = require("./shopify_auth.js");

const customer_url =
  "https://" +
  shopifyAuth.username +
  ":" +
  shopifyAuth.password +
  "@cabinet-dev.myshopify.com/admin/api/2019-10/customers.json";
//Pull shopify data from API call
const pullData = async () => {
  let shopifyData = await axios.get(customer_url);
  shopifyData = CircularJSON.stringify(shopifyData);

  const file = await fs.writeFile(
    "shopify_customers.json",
    shopifyData,
    err => {
      if (err) throw err;
      console.log("File is created successfully.");
    }
  );
};

const jsonUpload = () => {
  bucket.upload("shopify_customers.json", (err, copiedFile, apiResponse) => {
    console.log("json uploaded");
  });
};

module.exports = {
  pullData: pullData,
  jsonUpload: jsonUpload
};
