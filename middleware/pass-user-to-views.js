const passUserToView = async (req, res, next)=>{
    console.log("pass-user-debg")
    res.locals.user = req.session.user ? req.session.user : null;
    next();
};

module.exports = passUserToView;