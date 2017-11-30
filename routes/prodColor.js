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
    request.query(`SELECT c.*,u.UserName,m.ModelCode,m.ModelName FROM dbo.ProductColorCoding c 
                JOIN dbo.SystemUsers u on c.UserID = u.UserID JOIN dbo.ProductModelCoding m ON m.ModelID = c.ModelID`)
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
    request.query(`SELECT c.*,u.UserName,m.ModelCode,m.ModelName FROM dbo.ProductColorCoding c 
                JOIN dbo.SystemUsers u on c.UserID = u.UserID JOIN dbo.ProductModelCoding m ON m.ModelID = c.ModelID
                Where c.ModelID = '${req.params.id}'`)
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
    var color = req.body;
    var request = new sql.Request(sqlcon);
    request.input('Color', color.Color);
    request.input('ColorName', color.ColorName);
    request.input('ModelID', color.ModelID);
    request.input('ModelCode', color.ModelCode);
    request.input('UserID', color.UserID);
    request.execute('ColorInsert', function (err, result) {
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

router.delete('/:id', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.input('ModelID', req.params.id);
    request.execute('ColorDelete', function (err, result) {
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

function generateColorID() {
    var request = new sql.Request(sqlcon);
    request.query("SELECT (ISNULL(MAX(ColorID), 0) + 1) as max FROM dbo.ProductModelCoding")
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
};

function padLeft(nr, n, str) {
    return Array(n - String(nr).length + 1).join(str || '0') + nr;
}

module.exports = router;