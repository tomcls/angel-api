const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")
let hashedPassword = null;
function validateToken(req, res, next) {
    //get token from request header
    const authHeader = req.headers["authorization"]
    const token = authHeader.split(" ")[1]
    //the request header contains the token "Bearer <token>", split the string and use the second value in the split array.
    if (token == null) res.sendStatus(400).send("Token not present")
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            res.status(403).send("Token invalid")
        }
        else {
            req.user = user
            next() //proceed to the next action in the calling function
        }
    }) //end of jwt.verify()
}
const hashPwd = async function () {
    hashedPassword = await bcrypt.hash("3e9af42de397cfc9387a06972c28c23a1ac", 10)
}
function generateAccessToken(user) {
    return jwt.sign(user, "3e9af42de397cfc9387a06972c28c23a1ac7e9a60fb6dc1f05295bc6057baf500672d4a13db5d04ea84bbc4c5679164a7723f3d49f516bb73dc3df6e3b768c8e", { expiresIn: "15m" })
}
// refreshTokens
let refreshTokens = []
function generateRefreshToken(user) {
    const refreshToken =
        jwt.sign(user, "3e9af42de397cfc9387a06972c28c23a1ac7e9a60fb6dc1f05295bc6057baf500672d4a13db5d04ea84bbc4c5679164a7723f3d49f516bb73dc3df6e3b768c8e", { expiresIn: "20m" })
    refreshTokens.push(refreshToken)
    return refreshToken
}

hashPwd().then(async () => {

    if (await bcrypt.compare("3e9af42de397cfc9387a06972c28c23a1ac", hashedPassword)) {
        const accessToken = generateAccessToken({ name: 'tom', email: 'tomclassius@gmail.com' })
        const refreshToken = generateRefreshToken({ name: 'tom', email: 'tomclassius@gmail.com' })
        
    } else {
        console.log("mert")
    }
});