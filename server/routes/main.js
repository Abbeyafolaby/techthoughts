import express from "express";
import Post from "../models/Post.js"

const router = express.Router();

/* 
Note that routes can be split into controllers
check out how to do that. 
*/

//Get Home
router.get("/", async (request, response) => {
    const locals = {
        title: "techtoughts",
        description: "Simple Blog descriptions"
    }

    try {
        const data = await Post.find()
        response.render("index", { locals, data })
    } catch (error) {
        console.log(error);
        
    }

});







// About page
router.get("/about",(request, response) => {
    response.render("about")
});

export default router;