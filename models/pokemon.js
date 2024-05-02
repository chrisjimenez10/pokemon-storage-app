//Import
const mongoose = require("mongoose");

//Schemas
const PokemonSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    strength: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    ability: {
        type: String,
        required: true,
    },
    move: {
        type: String,
        required: true,
    },
    pokeball: {
        type: String,
        required: true,
    },
    evolution: {
        type: Boolean,
        required: true,
    },
});

const ApiPokemonSchema = new mongoose.Schema({
    apiname: {
        type: String,
    },
    apiability: {
        type: String,
    },
    apitype: {
        type: String,
    },
    apimove: {
        type: String,
    },
})

//Models
const Pokemon = mongoose.model("Pokemon", PokemonSchema);
const ApiPokemon = mongoose.model("Api_Pokemon", ApiPokemonSchema);

//Export Model
    //I tried to export both schemas separately, but learned that we can only export ONE module per file- so we either export the module as an OBJECT of however many things we want to export or create separate files
module.exports = {
    Pokemon: Pokemon,
    ApiPokemon: ApiPokemon
} 
