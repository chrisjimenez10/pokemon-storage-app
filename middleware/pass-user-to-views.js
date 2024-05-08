const passUserToView = async (req, res, next)=>{
    res.locals.user = await req.session.user ? req.session.user : null;
    next();
};

module.exports = passUserToView;