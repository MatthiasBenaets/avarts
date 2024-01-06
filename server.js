import express from "express";
import {handler} from "./build/handler.js"

const app = express();
const PORT = 8080;

app.get("/health-check", (req, res) => {
  res.send({
    message: "Server up",
    status: 200,
  });
});

app.use(handler);

app.listen(8080, () => {
  // console.log("server is running on port: ", PORT)
})
