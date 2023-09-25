const User = require("../models/User");
const jwt = require('jsonwebtoken');
const dal = require('../models/dal');
const logger = require('../logger/my_logger');




// handle errors
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { username: '', email: '', password: '' };
    // incorrect email
    if (err.message === 'incorrect email') {
        errors.email = 'That email is not registered';
    }
    // incorrect password
    if (err.message === 'incorrect password') {
        errors.password = 'That password is incorrect';
    }
    // duplicate email error
    if (err.code === 11000) {
        if (err.message.includes('email_1 dup key')) {
            errors.email = 'that email is already registered';
            return errors;
        }
        else {
            errors.username = 'The username already exists';
            return errors;
        }
    }
    // validation errors
    if (err.message.includes('users validation failed:')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
    }
    return errors;
}

// check errors for friendlist (PostgresSQL)
const handleErrorsForFriendlist = (err) => {
    let errors = { username: '', email: '' };
    if (err.message.includes(`duplicate key value violates unique constraint "friendlist_username_key"`)) {
        errors.username = 'The username already exists';
    }
    else if (err.message.includes(`duplicate key value violates unique constraint "friendlist_email_key"`)) {
        errors.email = 'That email is already registered';
    }
    return errors;
}


// create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({ id }, 'secret key', {
        expiresIn: maxAge
    });
};

module.exports.signup_post = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const user = await User.create({ username, email, password });
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json({ user: user._id });
        logger.info(`User registered successfully. User ID: ${user._id}`);
    }
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
        logger.error(`User registration failed. Error: ${err.message}`);
    }

}


module.exports.login_post = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({ user: user._id });
        logger.info(`User logged in successfully. User ID: ${user._id}`);
    }
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
        logger.error(`Login failed. Error: ${err.message}`);
    }
}

module.exports.best_friends_get_page = (req, res) => {
    res.render(`bestfriends`);
}

module.exports.best_friends_get_friendlist = async (req, res) => {
    try {
        const id_user = req.params.userId;
        const friendlist = await dal.getFriendsByUserId(id_user);
        friendlist && friendlist.length > 0 ? res.status(200).json({ friendlist }) : res.status(204).json({ friendlist });
        logger.info(`Successfully fetched friend list for user ID: ${id_user}`);
    } catch (e) {
        res.status(500).json({ error: 'Internal server error' });
        logger.error(`Error fetching friend list. Error: ${e.message}`);
    }
};

module.exports.get_friend_by_id = async (req, res) => {
    try {
        const userId = req.params.userId;
        const friendId = req.params.friendId;
        const result = await dal.getFriendById(userId, friendId);
        result ? res.status(200).json({ result }) : res.status(204).json({ result });
        logger.info(`Successfully fetched friend by id: ${friendId} for user ID: ${userId}`);
    } catch (e) {
        console.log(e.message);
        res.status(500).json({ error: 'Internal server error' });
        logger.error(`Error getting a friend by id ${friendId}. Error: ${e.message}`);
    }
}



module.exports.add_new_friend = async (req, res) => {
    try {
        const newFriend = req.body;
        if (!is_valid_friend(newFriend)) {
            res.status(400).json({ error: 'Values of new friend are not legal' });
            return;
        }
        const result = await dal.addFriend(newFriend);
        res.status(201).json({
            new_friend: { ...newFriend, ID: result.id }
        });
        logger.info(`New friend added successfully. Friend ID: ${result.id}`);
    } catch (err) {
        const errors = handleErrorsForFriendlist(err);
        res.status(400).json({ errors });
        logger.error(`Error adding a new friend. Error: ${err.message}`);
    }
}

function is_valid_friend(obj) {
    const result = obj.hasOwnProperty('username') && obj.hasOwnProperty('email') && obj.hasOwnProperty('age') &&
        obj.hasOwnProperty('id_user_log');

    if (!result) {
        logger.debug(`bad object was recieved. ${JSON.stringify(obj)}`);
    }

    return result;
}



module.exports.delete_best_friend = async (req, res) => {
    try {
        const result = await dal.deleteFriendById(req.params.userId, req.params.friendId);
        res.status(200).json({
            status: 'success',
            "how many deleted": result
        });
    } catch (e) {
        console.log(e.message);
        res.status(500).json({ error: 'Internal server error' });
        logger.error(`Error adding a new friend. Error: ${e.message}`);
    }
};

module.exports.update_best_friend = async (req, res) => {
    try {
        const result = await dal.updateFriendById(req.params.userId, req.params.friendId, req.body);
        res.status(200).json({
            status: 'updated',
            'how many rows updated': result
        });
    } catch (err) {
        const errors = handleErrorsForFriendlist(err);
        res.status(400).json({ errors });
        logger.error(`Error updating a friend. Error: ${err.message}`);
    }
};

module.exports.signup_get = (req, res) => {
    res.render('signup');
}

module.exports.login_get = (req, res) => {
    res.render('login');
}


module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
}