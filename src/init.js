// require("dotenv").config();
import "regenerator-runtime";
import "dotenv/config";
import "./db";
import "./models/Video";
import "./models/User";
import "./models/Comment";
import app from "./server";

const PORT = process.env.PORT || 3600;

const handleListening = () =>
   console.log(`β Server listening on port http://localhost:${PORT} π`);
//

app.listen(PORT, handleListening);
// app.listen(ν¬νΈλλ², μ½λ°±ν¨μ);
