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
let shopifyAPIUrl =
  "https://" +
  shopifyAuth.username +
  ":" +
  shopifyAuth.password +
  "@cabinet-dev.myshopify.com/admin/api/2019-10/";
let customerFileName;
let orderFileName;

//Pull Shopify data from API call
const pullData = async (url, fileName) => {
  let shopifyData = await axios.get(url);
  shopifyData = CircularJSON.stringify(shopifyData);

  fileName = url.split("/");
  const date = new Date().toJSON();
  fileName = fileName[fileName.length - 1] + date;

  const file = await fs.writeFile(fileName, shopifyData, err => {
    if (err) throw err;
    console.log("File is created successfully.");
  });
};

const uploadJSON = fileName => {
  bucket.upload(fileName, (err, copiedFile, apiResponse) => {
    console.log("JSON uploaded");
  });
};

//Shopify Customer API calls

const customerPull = () => {
  pullData(shopifyAPIUrl + "customers.json", customerFileName);
};

const customerJsonUpload = () => {
  uploadJSON(fileName);
};

//Shopify Orders API calls

const orderPull = () => {
  pullData(shopifyAPIUrl + "orders.json", orderFileName);
};

const orderUploadJSON = () => {
  uploadJSON();
};

module.exports = {
  customerPull: customerPull,
  customerUploadJSON: customerUploadJSON,
  orderPull: orderPull,
  orderUploadJSON: orderUploadJSON
};
