const db = require('../../db/models/usersModel');

const cookieController = {};

cookieController.setCookie = (req, res, next) => {
    res.cookie('test', 'cookie')
    console.log('cookie created!')
    return next()
}
//can't set this until they successfully log in and we can access their id
cookieController.setSSID = (req, res, next) => {
    //need to set res.locals.user in verify user
    const { user_id } = res.locals.user;
    res.cookie('SSID', user_id, { httpOnly: true });
    return next()
}

module.exports = cookieController