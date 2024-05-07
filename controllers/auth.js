//Import
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

//Routes
    //Sign-Up Show Page
router.get("/sign-up", (req, res)=>{
    res.render("auth/sign-up.ejs");
});

    //Create User Route
router.post("/sign-up", async (req, res)=>{
    const userInDatabase = await User.findOne({username: req.body.username});
    if(userInDatabase){
        return res.send("Username already taken");
    }
    if(req.body.password !== req.body.confirmPassword){
        return res.send("Password and Confirm Password must match");
    }
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    req.body.password = hashedPassword;
    const user = await User.create(req.body);
    req.session.user = {
        username: user.username,
    };
    req.session.save(()=>{
        res.redirect("/");
    });
});

    //Sign-In Show Page
router.get("/sign-in", (req, res)=>{
    res.render("auth/sign-in.ejs");
});

    //Sign-In Route
router.post("/sign-in", async (req, res)=>{
    const userInDatabase = await User.findOne({username: req.body.username});
    if(!userInDatabase){
        return res.send("Login Failed, Please try again.");
    }
    const validPassword = bcrypt.compareSync(req.body.password, userInDatabase.password);
    if(!validPassword){
        return res.send("Login Failed, Please try again.");
    }
    req.session.user = {
        username: userInDatabase.username,
    };
    req.session.save(()=>{
        res.redirect("/");
    });
});

    //Sign-Out from Session
router.get("/sign-out", (req, res)=>{
    req.session.destroy(()=>{
        res.redirect("/");
    });
});

module.exports = router;