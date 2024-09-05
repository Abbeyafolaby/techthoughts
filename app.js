import express from "express";
import expressEjsLayouts from "express-ejs-layouts";
import main from "./server/routes/main.js"
import connectDB from "./server/config/db.js";

const app = express()
const PORT = process.env.PORT || 5000


// Connect to DB
connectDB();

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use(express.static("public"));

// Templating Engine
app.use(expressEjsLayouts);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

app.use("/", main)

app.listen(PORT, () => {
    console.log(`App listeing on port ${PORT}`);
    
})