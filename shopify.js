const fs = require("fs");
const axios = require("axios");
const CircularJSON = require("circular-json");

/*Config Section*/
// GCP Cloud Storage Configs
const { Storage } = require("@google-cloud/storage");
const projectId = "cabinet-datawarehouse";
const keyFilename = "./dw-auth.json";
const storage = new Storage({ projectId, keyFilename });
const shopifyOrderBucket = "wearecabinet_shopify_order";
const shopifyCustomerBucket = "wearecabinet_shopify_customer";
const folderJSON = __dirname + "/tmp/";

// Shopify Configs
const shopify = require("./shopify_auth.js");
let shopifyAPIUrl = shopify.url;

/*End Configs*/

//Pull Shopify data from API call
const pullData = async (url, bucketName) => {
  let shopifyData = await axios.get(url);
  shopifyData = CircularJSON.stringify(shopifyData);

  let fileName = url.split("/");
  const date = new Date().toJSON().split("T")[0];
  fileName = fileName[fileName.length - 1].split(".")[0] + "-" + date + ".json";

  console.log(fileName);

  await fs.writeFile(folderJSON + fileName, shopifyData, err => {
    if (err) throw err;
    console.log("File is created successfully.");
  });
};

//GCS Bucket Upload Function
const uploadJSON = async (bucketName, bucketType) => {
  const bucket = storage.bucket(bucketName);
  let fileName;

  fs.readdir(folderJSON, (err, files) => {
    fileName =
      folderJSON + files.filter(fileName => fileName.startsWith(bucketType))[0];

    bucket.upload(fileName, (err, copiedFile, apiResponse) => {
      console.log("JSON uploaded");
    });
  });
};

//Shopify Customer API calls
const customerPull = () => {
  pullData(shopifyAPIUrl + "customers.json", shopifyCustomerBucket);
};
const customerUploadJSON = () => {
  uploadJSON(shopifyCustomerBucket, "customers");
};

//Shopify Orders API calls
const orderPull = () => {
  pullData(shopifyAPIUrl + "orders.json");
};
const orderUploadJSON = () => {
  uploadJSON(shopifyOrderBucket, "orders");
};

module.exports = {
  customerPull: customerPull,
  customerUploadJSON: customerUploadJSON,
  orderPull: orderPull,
  orderUploadJSON: orderUploadJSON
};
