const Users = require('../models/User');
const getAllUsers = async (req, res) => {
    const users = await Users.find().select('-password').lean(); // getbyid  or find  tous les users 
    if(!users?.length) return res.status(400).json({message: 'No users found'});
    res.json(users);
} 
module.exports = {getAllUsers};