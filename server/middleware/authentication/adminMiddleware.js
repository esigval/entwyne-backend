export const isAdminMiddleware = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    jwt.verify(token, currentConfig.SESSION_SECRET, (err, decoded) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to authenticate token' });
        }

        // if everything is good, save the decoded token to the request for use in other routes
        req.userId = decoded.id;

        // check if the user is an admin
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'User is not an admin' });
        }

        next();
    });
};