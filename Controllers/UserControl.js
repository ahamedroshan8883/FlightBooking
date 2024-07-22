const CustomAPIError = require("../ErrorHandler/CustomAPIError");
const UserModel = require("../Model/UserModel");
const jwt = require('jsonwebtoken');
require("dotenv").config();

const signup = async (data, callback) => {
    if (data.role === "") {
        data.role = "user";
    }
    console.log(data);
    const { email, mobileno, username, password } = data;
    if (email === "" || mobileno === "" || username === "" || password === "") {
        return callback(new CustomAPIError('Certain details are missing'), 500);
    } else {
        try {
            const Existingemail = await UserModel.findOne({ email: email });
            if (!Existingemail) {
                await UserModel.create(data);
                return callback(null, 'Successfully account registered');
            } else {
                return callback(new CustomAPIError('This email id is already existed'), 500);
            }
        } catch (error) {
            return callback(new CustomAPIError(error.message), 500);
        }
    }
};

const signin = async (data, callback) => {
    const { email, password } = data;
    try {
        const user = await UserModel.findOne({ email: email, password: password });
        if (!user) {
            return callback(new CustomAPIError("Invalid email/password"), 401);
        } else {
            const { email, username, role, mobileno } = user;
            const token = jwt.sign({ email, username, role, mobileno }, process.env.JSON_SECRETKEY, { expiresIn: '18000s' });
            return callback(null, token);
        }
    } catch (error) {
        return callback(new CustomAPIError(error.message), 500);
    }
};

const jstcheck = async (data, callback) => {
    const user = data;
    try {
        return callback(null, user);
    } catch (error) {
        return callback(new CustomAPIError(error.message), 500);
    }
};

module.exports = { signup, signin, jstcheck };
