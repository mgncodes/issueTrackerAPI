// const redisClient = require('../redisConn');

// function generateRefreshToken (un) {
//     const refreshToken = jwt.sign({ sub: un }, process.env.JWT_REFRESH_KEY, { expiresIn: process.env.JWT_REFRESH_EXP });
//     return refreshToken;
// }

// exports.getToken = (req, res, next) => {
//     const un = req.userData.sub;
//     const accessToken = jwt.sign({ sub: un }, process.env.JWT_ACCESS_KEY, { expiresIn: process.env.JWT_ACCESS_EXP });
//     const refreshToken = generateRefreshToken(un);
//     return res.json({
//         success: true,
//         data: { accessToken, refreshToken }
//     });
// };

function verifyToken(req, res, next) {
    try {
        let token = req.headers["x-access-token"];
        if (!token) {
            return res.status(403).json({ 
                success: false,
                error: "No token provided!" 
            });
        }
        jwt.verify(token, process.env.JWT_ACCESS_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json({ 
                    success: false,
                    error: "Unauthorized!" 
                });
            }
            req.userId = decoded.id;
            next();
        });
    } catch (err) {
        console.error(`Error in verifytoken: ${err}`);
        return res.status(401).json({
            success: false,
            error: err
        });
    }
};

// exports.verifyRefreshToken = (req, res, next) => {
//     if (req.body.token === null) {
//         console.log(`Auth Failed. Token Invalid.`);
//         return res.status(401).json({
//             success: false,
//             error: 'Auth Failed.'
//         })
//     } try {
//         const decoded = jwt.verify(req.body.token, process.env.JWT_REFRESH_KEY);
//         req.userData = decoded;
//         next();
//     } catch (err) {
//         console.log(`Error in verifyRefreshToken: ${err}`);
//         return res.status(401).json({
//             success: false,
//             error: 'Auth Failed.'
//         });
//     }
// };

module.exports = { verifyToken: verifyToken };