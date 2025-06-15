const access = (req, res, next) => {
    if (req.body.isAdmin) {
        next();
    } else {
        res.status(403).json({ msg: "You are not authorised" });
    }
};

module.exports = {
    access
};