var { request } = require('express')
var jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization')
    if(!authHeader) {
        req.isAuth = false
        return next()
    }

    const token = authHeader.split(' ')[1]

    let decodedToken;
    try {
        decodedToken = jwt.verify(token, "weliveoncesotakeadvatagofthelifethealmightyhasgivenyouandmakeadifferenceintheworld")
    }
    catch(err){
        req.isAuth = false
        return next()
    }

    if(!decodedToken){
        req.isAuth = false
        return next()
    }

    req.userId = decodedToken.userId
    req.email = decodedToken.email
    req.isAuth = true
    next()
}