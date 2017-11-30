/*
 * GET users listing.
 */
var express = require('express');
var router = express.Router();
var sql = require('mssql');
var jwt = require("jsonwebtoken");
var sqlcon = sql.globalPool;

router.use(function (req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers["authorization"];
    var secret = req.body.salt || req.query.salt || req.headers["salt"];
    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, secret, function (err, decoded) {
            if (err) {
                return res.status(403).send({
                    success: false,
                    message: "Failed to authenticate token."
                });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });
    } else {
        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: "No token provided."
        });
    }
});

router.get('/', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query("SELECT * FROM dbo.SystemUsers")
        .then(function (result) {
            res.json(result.recordset);
        }).catch(function (err) {
            if (err) {
                res.json({
                    error: err
                });
                console.log(err);
            }
        })
});

router.get('/:id', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query("SELECT * FROM dbo.SystemUsers Where UserID=" + req.params.id)
        .then(function (result) {
            res.json(result.recordset);
        }).catch(function (err) {
            if (err) {
                res.json({
                    error: err
                });
                console.log(err);
            }
        })
});

router.post('/', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var user = req.body;
    var request = new sql.Request(sqlcon);
    request.input("UserName", user.UserName);
    request.input("UserPass", user.Password);
    request.input('Photo', sql.Image, user.Photo === null ? null : new Buffer(user.Photo, 'base64'));
    request.input("JobClass", user.JobClass);
    request.input("Email", user.Email);
    request.input("Phone", user.Phone);
    request.execute("UserInsert", function (err, result) {
        if (err) {
            res.json({
                error: err
            });
            console.log(err);
        } else {
            res.json({
                returnValue: result.returnValue,
                affected: result.rowsAffected[0]
            });
        }
    });
});

router.put('/:id', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var user = req.body;
    var request = new sql.Request(sqlcon);
    request.input("UserID", req.params.id);
    request.input("UserName", user.UserName);
    request.input('Photo', sql.Image, user.Photo === null ? null : new Buffer(user.Photo, 'base64'));
    request.input("UserPass", user.Password);
    request.input("JobClass", user.JobClass);
    request.input("Email", user.Email);
    request.input("Phone", user.Phone);
    request.execute("UserUpdate", function (err, result) {
        if (err) {
            res.json({
                error: err
            });
            console.log(err);
        } else {
            res.json({
                returnValue: result.returnValue,
                affected: result.rowsAffected[0]
            });
        }
    });
});

router.put('/Approve/:id', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var data = req.body;
    var request = new sql.Request(sqlcon);
    request.input("UserID", data.id);
    request.input("ApproveUser", data.appuser);
    request.execute("UserApprove", function (err, result) {
        if (err) {
            res.json({
                error: err
            });
            console.log(err);
        } else {
            res.json({
                returnValue: result.returnValue,
                affected: result.rowsAffected[0]
            });
        }
    });
});
router.put('/ChangePass/:id', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    var data = req.body;
    request.input("UserID", req.params.id);
    request.input("NewPass", data.Password);
    request.execute("UserChangePass", function (err, result) {
        if (err) {
            res.json({
                error: err
            });
            console.log(err);
        } else {
            res.json({
                returnValue: result.returnValue,
                affected: result.rowsAffected[0]
            });
        }
    });
})
router.delete('/:id', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.input("UserID", req.params.id);
    request.execute("UserDelete", function (err, result) {
        if (err) {
            res.json({
                error: err
            });
            console.log(err);
        } else {
            res.json({
                returnValue: result.returnValue,
                affected: result.rowsAffected[0]
            });
        }
    });
});

module.exports = router;