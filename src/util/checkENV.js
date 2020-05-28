module.exports = () => {
  if (process.env.NODE_ENV == "production") {
    console.log("🚀 Running in Production!");
    require("dotenv").config({
      path: ".env.prod",
    });
  } else {
    console.log("🚧 Running in Development Mode!");
    require("dotenv").config({
      path: ".env.dev",
    });
  }
};
