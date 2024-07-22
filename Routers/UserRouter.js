const express = require('express');
const { signup, signin, jstcheck } = require('../Controllers/UserControl');
const authMiddleware = require('../Middleware/authMiddleware');

const UserRouter = express.Router();

UserRouter.post('/signup',signup);
UserRouter.get('/signin',signin);
UserRouter.get('/jstcheck',authMiddleware,jstcheck);

module.exports=UserRouter;