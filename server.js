//Import
const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
require("dotenv").config();
// const Pokemon = require("./models/pokemon.js");  //We need to import as a single module if they come form the same file
// const ApiPokemon = require("./models/pokemon.js");
const { Pokemon, ApiPokemon } = require("./models/pokemon.js")


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

//Start Server
const port = 4005;
app.listen(port, ()=>{
    console.log(`Listening on Port ${port}`);
});

//Routes
    //Home Show Page
app.get("/", (req, res)=>{
    res.render("home.ejs");
});

    //Index Show Page
app.get("/pokemon", async (req, res)=>{
    const pokemonList = await Pokemon.find({}).sort({strength: "desc"});
    const pokemonArray = await ApiPokemon.find({}).sort({apiname: "asc"});
    res.render("index.ejs", {
        pokemonList,
        pokemonArray,
    });
});

    //Create Pokemon Box Show Page
app.get("/pokemon/new", (req, res)=>{
    res.render("new.ejs", {});
});

    //Add Pokedex Show Page
app.get("/pokemon/new/api", (req, res)=>{
    res.render("new-api.ejs");
});

    //Add From API
app.post("/pokemon/api", async (req, res)=>{
    const pokedexId = req.body.pokemonId;
    const url = `https://pokeapi.co/api/v2/pokemon/${pokedexId}`;
    let pokeName;
    let pokeAbility;
    let pokeType;
    let pokeMove;
    let pokeImage;

    const pokemonData = async (url) => {
        try {
            const response = await fetch(url);
            if(!response.ok){ //If the value of .ok property is false, then there was an error in fetching the data and we can throw an error to the catch block - operation ends there immediatley and goes to the catch block
                throw new Error(`HTTP Status: ${response.status}`);
            };
            const data = await response.json();
            pokeName = data.name; //Name of Pokemon
            pokeAbility = data.abilities[0].ability.name; //First ability name in array of abilities
            pokeType = data.types[0].type.name; //First type name in array of types
            pokeMove = data.moves[1].move.name; //Second move name in array of moves
            pokeImage = data.sprites.other.dream_world.front_default; //Image (only pokemon 1-649 have this type of image)
            const pokemon = await ApiPokemon.create({
                apiname: pokeName,
                apiability: pokeAbility,
                apitype: pokeType,
                apimove: pokeMove,
                apiimage: pokeImage
            });
            res.redirect("/pokemon"); //I initially had res.redirect() outside of the async function, but I had to refresh the browser to see the udpated database - Learned that it had to go inside the async function where the document is created and stored in the database, so that the redirection occurs AFTER the document is created and stored (Outside, it redirected before the document was actually created and stored - hence the need to refresh browser)
            console.log(pokemon);
        } catch(error) {
            console.log(error);
        }
    }
    pokemonData(url);
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

    //Api Pokemon Details Show Page
app.get("/pokemon/api/:id", async (req, res)=>{
    const apiPokemon = await ApiPokemon.findById(req.params.id);
    res.render("apishow.ejs", {
        apiPokemon,
    });
});

    //DELETE Pokemon Box Route
app.delete("/pokemon/:id", async (req, res)=>{
    await Pokemon.findByIdAndDelete(req.params.id);
    res.redirect("/pokemon");
});

    //DELETE Api Pokemon Route
app.delete("/pokemon/api/:id", async (req, res)=>{
    await ApiPokemon.findByIdAndDelete(req.params.id);
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


