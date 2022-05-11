const jwt = require("jsonwebtoken")
const User = require("../models/users");
//AUTHENTICATE LOGIN AND RETURN JWT TOKEN
// accessTokens
function generateAccessToken(user) {
    return jwt.sign(user, process.env.API_SECRET, { expiresIn: "15m" })
}
// refreshTokens
let refreshTokens = []
function generateRefreshToken(user) {
    const refreshToken =
        jwt.sign(user, process.env.API_SECRET, { expiresIn: "20m" })
    refreshTokens.push(refreshToken)
    return refreshToken
}

app.post("/login", async (req, res) => {
    const u = new User();
    const user = await u.find({ email: req.body.username })
    //check to see if the user exists in the list of registered users
    if (user == null) res.status(404).send("User does not exist!")
    //if user does not exist, send a 400 response
    if (await bcrypt.compare(req.body.password, user.password)) {
        const accessToken = generateAccessToken({ user: req.body.name })
        const refreshToken = generateRefreshToken({ user: req.body.name })
        res.json({ accessToken: accessToken, refreshToken: refreshToken })
    }
    else {
        res.status(401).send("Password Incorrect!")
    }
});