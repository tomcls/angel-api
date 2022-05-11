const User = require("../models/users");

checkDuplicateUsernameOrEmail = async (req, res, next) => {
  
    const u = new User();
    const user = await u.find({email:req.body.username})
  
    if (user) {
        res.status(400).send({
        message: "Failed! Username is already in use!"
        });
        return;
    }
    next();
};
const verifySignUp = {
  checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail
};
module.exports = verifySignUp;