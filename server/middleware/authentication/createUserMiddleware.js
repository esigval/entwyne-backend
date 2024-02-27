// createUserMiddleware.js
import bcrypt from 'bcrypt';
import User from '../../models/userModel.js';

export const createUserMiddleware = async (req, res, next) => {
    try {
        console.log('Request body:', req.body);
        const { password, ...otherData } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Hashed password:', hashedPassword);
        const user = await User.create({ ...otherData, password: hashedPassword });
        console.log('User Created');
        
        // Exclude the password from the response
        const { password: _, ...userDataWithoutPassword } = user;
        
        req.userData = userDataWithoutPassword;
        req.password = password;
        req.email = user.email;
        next();
    } catch (error) {
        console.log('Error:', error);
        res.status(500).json({ message: error.message });
    }
};