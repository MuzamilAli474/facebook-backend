const jwt = require('jsonwebtoken');
const secretKey = '12345'

const authenticate = (req, res, next) => {
    
    const authHeader = req.headers.authorization;
// console.log(authHeader)
 
    if (!authHeader) {
        return res.status(401).json({
            message: "Not logged In."
        });
    }
 
    const token = authHeader.split(' ')[1];

 
    if (!token) {
        return res.status(401).json({
            message: "Not logged In."
        });
    }

     
    try {
        const decoded = jwt.verify(token, secretKey);
        req.userId = decoded.id;
    
        // console.log(req.userId)

        next(); 
    } catch (err) {
        return res.status(403).json({
            message: "Invalid token."
        });
    }
}


module.exports = authenticate
