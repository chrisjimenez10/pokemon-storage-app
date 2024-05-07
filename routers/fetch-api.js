//Import
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
require("dotenv").config();
const isSignedIn = require("../middleware/is-signed-in.js");
const { Pokemon, ApiPokemon } = require("../models/pokemon.js"); //NOTE: Important to import ALL the neccessary modules and packages that we need for any operation INSIDE the route handlers and functions in this file

//Set up variable to hold built-in Router() method for express
const router = express.Router();

//API Pokemon Routes
    //Add Pokedex Show page
router.get("/pokemon/new/api", isSignedIn, (req, res)=>{
    res.render("new-api.ejs");
});

    //Add From API
router.post("/pokemon/api", isSignedIn, async (req, res)=>{
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

    //Api Pokemon Details Show Page
router.get("/pokemon/api/:id", async (req, res)=>{
    const apiPokemon = await ApiPokemon.findById(req.params.id);
    res.render("apishow.ejs", {
        apiPokemon,
    });
});

    //DELETE Api Pokemon Route
router.delete("/pokemon/api/:id", isSignedIn, async (req, res)=>{
    await ApiPokemon.findByIdAndDelete(req.params.id);
    res.redirect("/pokemon");
});

//Export
module.exports = router;
