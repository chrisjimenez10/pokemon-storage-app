//Middleware to plug into routes to protect them and allow only signed-in users
const isSignedIn = (req, res, next)=>{
    if(req.session.user) return next();
    res.redirect("/auth/sign-in");
};

module.exports = isSignedIn;