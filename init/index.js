const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../Models/listing.js");
// const initData = require("../Models/listing");

const mongoose_url = "mongodb://localhost:27017/wanderlust";

main()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error(err);
  });
async function main() {
  await mongoose.connect(mongoose_url);
}

const inidb = async () => {
  await Listing.deleteMany({});
  await Listing.insertMany(initData.data);
  console.log("Data Imported");
};
inidb();
