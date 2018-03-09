var express = require('express');
var router = express.Router();
var sql = require('mssql');
var jwt = require("jsonwebtoken");
var sqlcon = sql.globalConnection;

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
    request.query(`SELECT Selected =CAST(0 AS BIT),Size = size, QuntPerDozen=NULL, ModelId = 0 FROM dbo.Sizes c`)
        .then(function (recordset) {
            res.json(recordset);
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
    request.query(`SELECT CAST(ISNULL(p.ProdSizeID, 0) AS BIT) Selected ,Size, p.QuntPerDozen, p.ModelID FROM dbo.Sizes s 
                LEFT JOIN dbo.ProductSizes p ON p.SizeID = s.SizeID And p.ModelID = '${req.params.id}'`)
        .then(function (recordset) {
            res.json(recordset);
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
    var size = req.body;
    var request = new sql.Request(sqlcon);
    console.log(size);
    request.input('SizeID', size.Size);
    request.input('QuntPerDozen', size.QuntPerDozen);
    request.input('ModelID', size.ModelID);
    request.input('UserID', size.UserID);
    request.execute('ProdSizeInsert', function (err, returnValue, affected) {
        if (err) {
            res.json({
                error: err
            });
            console.log(err);
        } else {
            res.json({
                returnValue: returnValue,
                affected: affected
            });
        }
    });
});

router.delete('/:id', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.input('ModelID', req.params.id);
    request.execute('ProdSizeDelete', function (err, returnValue, affected) {
        if (err) {
            res.json({
                error: err
            });
            console.log(err);
        } else {
            res.json({
                returnValue: returnValue,
                affected: affected
            });
        }
    });
});

function generateColorID() {
    var request = new sql.Request(sqlcon);
    request.query("SELECT (ISNULL(MAX(ColorID), 0) + 1) as max FROM dbo.ProductModelCoding")
        .then(function (recordset) {
            res.json(recordset);
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