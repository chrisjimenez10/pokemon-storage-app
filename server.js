//Import
const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
require("dotenv").config();
const Pokemon = require("./models/pokemon.js");

//Connect Database
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", ()=>{
    console.log(`Connected to MongoDB ${mongoose.connection.name}`);
})

//Middleware
app.use(methodOverride("_method"));
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({extended:false}));

//Start Server
const port = 4005;
app.listen(port, ()=>{
    console.log(`Listening on Port ${port}`);
});

//Routes
app.get("/", (req, res)=>{
    res.render("home.ejs");
});

    //Index Show Page
app.get("/pokemon", async (req, res)=>{
    const pokemonList = await Pokemon.find({});
    res.render("index.ejs", {
        pokemonList
    });
});

    //Create Show Page
app.get("/pokemon/new", (req, res)=>{
    res.render("new.ejs", {});
});

    //POST Route
app.post("/pokemon", async (req, res)=>{
    if(req.body.evolution === "on"){
        req.body.evolution = true;
    }else{
        req.body.evolution = false;
    }
    if(req.body.pokeball === ""){
        req.body.pokeball = "Normal Pokeball";
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

    //DELETE Route
app.delete("/pokemon/:id", async (req, res)=>{
    await Pokemon.findByIdAndDelete(req.params.id);
    res.redirect("/pokemon");
})

    //Edit Show Page
app.get("/pokemon/:id/edit", async (req, res)=>{
    const pokemon = await Pokemon.findById(req.params.id);
    res.render("edit.ejs", {
        pokemon
    });
})

app.put("/pokemon/:id", async (req, res)=>{
    if(req.body.evolution === "on"){
        req.body.evolution = true;
    }else{
        req.body.evolution = false;
    }
    await Pokemon.findByIdAndUpdate(req.params.id, req.body);
    res.redirect(`/pokemon/${req.params.id}`);
})
