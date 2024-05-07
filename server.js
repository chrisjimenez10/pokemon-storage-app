//Import
const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
require("dotenv").config();
const router = require("./routers/fetch-api"); //Importing router (ENSURE that the path is correct to the file CONTAINING the routers: From the perspective of the root application)
const session = require("express-session");
const MongoStore = require("connect-mongo");
const authController = require("./controllers/auth");
const passUserToView = require("./middleware/pass-user-to-views");

// const Pokemon = require("./models/pokemon.js");  //We need to import as a single module if they come form the same file
// const ApiPokemon = require("./models/pokemon.js");
const { Pokemon, ApiPokemon } = require("./models/pokemon.js");


//Connect Database
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", ()=>{
    console.log(`Connected to MongoDB ${mongoose.connection.name}`);
})

//Middleware
app.use(methodOverride("_method"));
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({extended:false})); //When I included both forms in the same POST route handler, the request would not resolve and document was not created because extended was set to false - learned that when set to true it's better for parsing nested objects, part of core Node.js library, and slightly faster
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
    })
}));
app.use(passUserToView); //Pass user variable via locals object to all views templates
app.use("/", router); //Router (Start to serach for routes in the router file from the landing page "/" of the app - It did not work when I tried to indicate "/pokmeon" or "/pokemon/api")

//Start Server
const port = 4005;
app.listen(port, ()=>{
    console.log(`Listening on Port ${port}`);
});

//Routes
    //Home Show Page
app.get("/", (req, res)=>{
    res.render("home.ejs");
    // res.render("home.ejs", {
    //     user: req.session.user,
    // });
});

    //Authenication
app.use("/auth", authController);

    //Index Show Page
app.get("/pokemon", async (req, res)=>{
    const pokemonList = await Pokemon.find({}).sort({strength: "desc"});
    const pokemonArray = await ApiPokemon.find({});
    res.render("index.ejs", {
        pokemonList,
        pokemonArray,
    });
});

    //Create Pokemon Box Show Page
app.get("/pokemon/new", (req, res)=>{
    res.render("new.ejs", {});
});

    //POST Route
app.post("/pokemon/new", async (req, res)=>{
    if(req.body.evolution === "on"){
        req.body.evolution = true;
    }else{
        req.body.evolution = false;
    }
    const pokemon = await Pokemon.create(req.body);
    res.redirect("/pokemon");
});

    //Pokemon Details Show Page
app.get("/pokemon/:id", async (req, res)=>{
    const pokemon = await Pokemon.findById(req.params.id);
    res.render("show.ejs", {
        pokemon
    });
});

    //DELETE Pokemon Box Route
app.delete("/pokemon/:id", async (req, res)=>{
    await Pokemon.findByIdAndDelete(req.params.id);
    res.redirect("/pokemon");
});

    //Edit Show Page
app.get("/pokemon/:id/edit", async (req, res)=>{
    const pokemon = await Pokemon.findById(req.params.id);
    res.render("edit.ejs", {
        pokemon
    });
});

    //PUT Route
app.put("/pokemon/:id", async (req, res)=>{
    if(req.body.evolution === "on"){
        req.body.evolution = true;
    }else{
        req.body.evolution = false;
    }
    await Pokemon.findByIdAndUpdate(req.params.id, req.body);
    res.redirect(`/pokemon/${req.params.id}`);
});


