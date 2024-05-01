//Import
const mongoose = require("mongoose");

//Schema
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
        default: "Normal Pokeball",
    },
    evolution: {
        type: Boolean,
        required: true,
    },
});

//Model
const Pokemon = mongoose.model("Pokemon", PokemonSchema);

//Export Model
module.exports = Pokemon;