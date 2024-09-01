const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const token = req.header("Authorization");
    

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const jwtToken = token.split(' ')[1];
        console.log('JWT Token:', jwtToken);

        // Verify the token
        const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET || 'mysecretkey123');
        console.log('Decoded Payload:', decoded);

        req.user = decoded.user;
        next();
    } catch (err) {
        console.error('Token Verification Error:', err);  // Log the entire error object
        res.status(401).json({ message: "Token is not valid", error: err.message });
    }
};

module.exports = auth;
