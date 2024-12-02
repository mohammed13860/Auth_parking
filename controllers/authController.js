// const User = require('../models/User');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// require("dotenv").config();
// const register =async (req, res) => {
//     const { first_name, last_name, email, password } = req.body;
//     if(!first_name || !last_name || !email || !password) {
//        return res.status(400).json({ message: 'Please provide all required fields' });
//     }
//     const foundUser = await User.findOne({ email }).exec(); // check if user already exists
//     if(foundUser) {
//         return res.status('401').json({ message: 'User already exists' });
//     }
//     const hashedPassword =await bcrypt.hashSync(password, 10); // hash password
//     const user =await User.create({ first_name, last_name, email, password: hashedPassword });
//     user.save((err, user) => {
//         if(err) {
//             return res.status(500).json({ message: 'Error creating user' });
//         }
//         res.status(201).json({ message: 'User created successfully', user });
//     });
//     const accessToken = jwt.sign({
//         userInfo:{
//             id: user._id,
//         }}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
//     const refreshToken = jwt.sign({
//         userInfo:{
//             id: user._id,
//         }}, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d'
//     });
//     res.cookie('jwt', refreshToken, {
//         httpOnly: true, //accessible only by web server http
//         sameSite: 'None', //domaine name cross-site cookie
//         secure: true, //https
//         maxAge : 7 * 24 * 60 * 60 * 1000 // sqlaya nta3 refresh fi cookies 1000=1s   7days
//         });
//     res.json({ accessToken, email: user.email, first_name: user.first_name, last_name: user.last_name});
    
// };
// const login = async (req, res) => {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email }).exec();
//     if (!user) {
//         return res.status(400).json({ message: 'User not found' });
//     }
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//         return res.status(400).json({ message: 'Invalid password' });
//     }
//     const accessToken = jwt.sign({
//         userInfo:{
//             id: user._id,
//         }}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
//     const refreshToken = jwt.sign({
//         userInfo:{
//             id: user._id,
//         }}, process.env.REFRESH_TOKEN_SECRET);
//     res.cookie('jwt', refreshToken, {
//         httpOnly: true, //accessible only by web server http
//         sameSite: 'None', //domain name cross-site cookie
//         secure: true, //https
//         maxAge : 7 * 24 * 60 * 60 * 1000 // sqlaya nta3 refresh fi cookies 1000=1s   7days
//         });
//     res.json({ accessToken });
// };
// const refresh = (req, res) => {
//    const cookies = req.cookies;
//    if(!cookies?.jwt) {
//     return res.status(401).json({ message: 'No refresh token provided' });

//    }
//    const refreshToken = cookies.jwt;
//    jwt.verify(
//     refreshToken,
//     process.env.REFRESH_TOKEN_SECRET,
//     async(err, decoded) => {
//         if (err) {
//             return res.status(403).json({ message: 'Invalid refresh token' });
//         }
        
//         const foundUser = await User.findById(decoded.userInfo.id).exec();
//         if (!foundUser) {
//             return res.status(403).json({ message: 'Unauthorized' });
//         }
//         const accessToken = jwt.sign({
//             userInfo:{
//                 id: foundUser._id,
//             }}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
//         res.json({ accessToken });
//     })
// }
// module.exports = {
//     register,login,refresh,
// }
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require("dotenv").config();

const register = async (req, res) => {
    const { first_name, last_name, email, password } = req.body;
    if (!first_name || !last_name || !email || !password) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }
    const foundUser = await User.findOne({ email }).exec();
    if (foundUser) {
        return res.status(401).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ first_name, last_name, email, password: hashedPassword });
    try {
        const savedUser = await user.save();
        const accessToken = jwt.sign(
            { userInfo: { id: savedUser._id } },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1h' }
        );
        const refreshToken = jwt.sign(
            { userInfo: { id: savedUser._id } },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            sameSite: 'None',
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(201).json({
            message: 'User created successfully',
            accessToken,
            user: {
                email: savedUser.email,
                first_name: savedUser.first_name,
                last_name: savedUser.last_name
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Error creating user', error: err.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).exec();
    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid password' });
    }
    const accessToken = jwt.sign(
        { userInfo: { id: user._id } },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
    );
    const refreshToken = jwt.sign(
        { userInfo: { id: user._id } },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    );

    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        sameSite: 'None',
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({ accessToken  });
};

const refresh = (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        return res.status(401).json({ message: 'No refresh token provided' });
    }
    const refreshToken = cookies.jwt;
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid refresh token' });
            }

            const foundUser = await User.findById(decoded.userInfo.id).exec();
            if (!foundUser) {
                return res.status(403).json({ message: 'Unauthorized' });
            }

            const accessToken = jwt.sign(
                { userInfo: { id: foundUser._id } }, // هنا التعديل
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' }
            );
            res.json({ accessToken });
        }
    );
};
const logout = (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        return res.status(204).json({ message: 'No refresh token to clear' }); // No content
    }
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    res.json({ message: 'Cookie cleared' });
};
module.exports = {
    register,
    login,
    refresh,
    logout,
}; 
