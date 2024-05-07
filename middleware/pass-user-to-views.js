const passUserToView = async (req, res, next)=>{
    res.locals.user = req.session.user ? req.session.user : null;
    req.session.save(()=>{
        
    }); //debug attempt for AWS
    next();
};

module.exports = passUserToView;