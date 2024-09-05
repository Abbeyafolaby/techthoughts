import express from "express";
import Post from "../models/Post.js"

const router = express.Router();

/* 
Note that routes can be split into controllers
check out how to do that. 
*/

//Get Home
router.get("/", async (request, response) => {
    try {
        const locals = {
            title: "techtoughts",
            description: "Simple Blog descriptions"
        }

        let perPage = 5;
        let page = request.query.page || 1;
    
        const data = await Post.aggregate([ { $sort: { createdAt: -1 } } ])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec();
    
        // Count is deprecated - please use countDocuments
        // const count = await Post.count();
        const count = await Post.countDocuments({});
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);
    
        response.render('index', { 
            locals,
            data,
            current: page,
            nextPage: hasNextPage ? nextPage : null,
            currentRoute: '/'
    });

    } catch (error) {
        console.log(error);
        
    }
});

/**
 * GET /
 * Post :id
*/
router.get('/post/:id', async (request, response) => {
    try {
    let slug = request.params.id;

    const data = await Post.findById({ _id: slug });

    const locals = {
    title: data.title,
    description: "Simple Blog created with NodeJs, Express & MongoDb.",
    }

    response.render('post', { 
    locals,
    data,
    currentRoute: `/post/${slug}`
    });
} catch (error) {
    console.log(error);
}

});

/**
 * Post /
 * Post :id
*/
router.post("/search", async (request, response) => {

    try {
        const locals = {
            title: "Search",
            description: "Simple Blog created with NodeJs, Express & MongoDb.",
        }

        let searchTerm = request.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

    const data = await Post.find({
        $or: [
            { title: { $regex: new RegExp(searchNoSpecialChar, 'i') }},
            { body: { $regex: new RegExp(searchNoSpecialChar, 'i') }}
        ]
        });

        response.render('search', { 
            locals,
            data,
            currentRoute: "/"
            });
    } catch (error) {
        console.log(error);
        
    }
});



// About page
router.get("/about",(request, response) => {
    response.render("about")
});

export default router;