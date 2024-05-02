//Import
const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
require("dotenv").config();
// const Pokemon = require("./models/pokemon.js");
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
    const pokemonList = await Pokemon.find({}).sort({name: "asc"});
    res.render("index.ejs", {
        pokemonList,
    });
});

    //Pokedex Show Page
app.get("/pokemon/api", async (req, res)=>{
    const pokemonArray = await ApiPokemon.find();
    res.render("apishow.ejs", {
        pokemonArray
    });
})

    //Add From API
    app.post("/pokemon/api", async (req, res)=>{
        const pokedexId = req.body.pokemonId;
        const url = `https://pokeapi.co/api/v2/pokemon/${pokedexId}`;
        let pokeName;
        let pokeAbility;
        let pokeType;
        let pokeMove;
    
        const pokemonData = async (url) => {
            try {
                const response = await fetch(url);
                // console.log(response.ok); //Checking value of the property .ok of response object
                if(!response.ok){ //If the value of .ok property is false, then there was an error in fetching the data and we can throw an error to the catch block - operation ends there immediatley and goes to the catch block
                    throw new Error(`HTTP Status: ${response.status}`);
                };
                const data = await response.json();
                pokeName = data.name; //Name of Pokemon
                pokeAbility = data.abilities[0].ability.name; //First ability name in array of abilities
                pokeType = data.types[0].type.name; //First type name in array of types
                pokeMove = data.moves[1].move.name;
                const pokemon = await ApiPokemon.create({
                    apiname: pokeName,
                    apiability: pokeAbility,
                    apitype: pokeType,
                    apimove: pokeMove,
                });
                
                console.log(pokemon);
            } catch(error) {
                console.log(error);
            }
        }
        pokemonData(url);
        res.redirect("/pokemon/api");
    })







    //Create Show Page
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


//     //Add From API
// app.post("/pokemon/api/new", async (req, res)=>{
//     const pokedexId = req.body.pokemonId;
//     const url = `https://pokeapi.co/api/v2/pokemon/${pokedexId}`;
//     let pokeName;
//     let pokeAbility;
//     let pokeType;
//     let pokeMove;

//     const pokemonData = async (url) => {
//         try {
//             const response = await fetch(url);
//             // console.log(response.ok); //Checking value of the property .ok of response object
//             if(!response.ok){ //If the value of .ok property is false, then there was an error in fetching the data and we can throw an error to the catch block - operation ends there immediatley and goes to the catch block
//                 throw new Error(`HTTP Status: ${response.status}`);
//             };
//             const data = await response.json();
//             pokeName = data.name; //Name of Pokemon
//             ability = data.abilities[0].ability.name; //First ability name in array of abilities
//             type = data.types[0].type.name; //First type name in array of types
//             move = data.moves[1].move.name;
//             console.log(pokeName, ability, type, move);
//         } catch(error) {
//             console.log(error);
//         }
//     }
//     pokemonData(url);
//      const pokemon = await ApiPokemon.create({
//         apiname: pokeName,
//         apiability: pokeAbility,
//         apitype: pokeType,
//         apimove: pokeMove,
//     },{new: true});
//     console.log(pokemon)
//     res.redirect("/pokemon/api");
// })
