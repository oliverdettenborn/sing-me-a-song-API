require("dotenv").config();

module.exports = {
  development: {
    url: process.env.DB_LOCAL_URL,
  },
  test: {
    url: process.env.DB_LOCAL_URL,
  },
  production: {
    url: process.env.DATABASE_URL,
  },
};
