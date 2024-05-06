const passUserToView = (req, res, next)=>{
    res.locals.user = req.session.user ? req.session.user : "debug";
    next();
};

module.exports = passUserToView;