const express = require("express");
const app = express();
app.use(express.json());
const port = process.env.PORT;

require("./db/connection");
const router = require("./routes/route");
app.use(router);
app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Server is running on port ${port}`);
  }
});
