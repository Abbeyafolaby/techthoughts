import express from "express";
import expressEjsLayouts from "express-ejs-layouts";
import main from "./server/routes/main.js"
import admin from "./server/routes/admin.js"
import connectDB from "./server/config/db.js";
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";
import session from "express-session"

const app = express()
const PORT = process.env.PORT || 5000


// Connect to DB
connectDB();

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cookieParser())
app.use(session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    })
}))

app.use(express.static("public"));

// Templating Engine
app.use(expressEjsLayouts);
app.set("layout", "./layouts/main");

app.set("view engine", "ejs");

app.use("/", main)
app.use("/", admin)

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
})