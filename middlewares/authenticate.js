const jwt = require('jsonwebtoken');
const secretKey = 'shhhhh1212121';  



const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization; 

    if (!authHeader) {
        return res.status(401).json({ message: "Token not provided" });
    }

    const token = authHeader.split(' ')[1]; 
    if (!token) {
        return res.status(401).json({ message: "invalid token" });
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;
        
        next(); 
    } catch (err) {
        const errorMessage = err.name === "TokenExpiredError" 
            ? "Token has expired" 
            : "Invalid token";
        return res.status(401).json({ message: errorMessage });
    }
};

module.exports = authenticate;

