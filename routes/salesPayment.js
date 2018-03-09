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
    request.query(`SELECT * FROM dbo.vwSalesOrderPayment ORDER BY Paid, PaymentDate`)
        .then(function (recordset) {
            res.json(recordset);
        })
        .catch(function (err) {
            res.json({
                error: err
            });
            console.log(err);
        })
});
router.get('/:id(\\d+)', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query(`SELECT * FROM dbo.vwSalesOrderPayment Where SOPayID = ${req.params.id}`)
        .then(function (recordset) {
            res.json(recordset);
        })
        .catch(function (err) {
            res.json({
                error: err
            });
            console.log(err);
        })
});
router.get('/orderpays/:id(\\d+)', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query(`SELECT * FROM dbo.vwSalesOrderPayment Where SOID = ${req.params.id}`)
        .then(function (recordset) {
            res.json(recordset);
        })
        .catch(function (err) {
            res.json({
                error: err
            });
            console.log(err);
        })
});

router.post('/', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var sod = req.body;
    var request = new sql.Request(sqlcon);
    request.input('SOID', sod.SOID);
    request.input('PaymentDate', sod.PaymentDate);
    request.input('PayAmount', sod.PayAmount);
    request.input('CommisionPaymentDate', sod.CommisionPaymentDate);
    request.input('CommisionAmount', sod.CommisionAmount);
    request.input('Paid', sod.Paid);
    request.input('CommsionPaid', sod.CommsionPaid);
    request.input('UserID', sod.UserID);
    request.execute('SalesPaymentInsert', function (err, returnValue, affected) {
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

router.put('/:id', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var sod = req.body;
    var request = new sql.Request(sqlcon);
    request.input('SOPayID', req.params.id);
    request.input('PayNoteNo', sod.PayNoteNo);
    request.input('Paid', sod.Paid);
    request.input('RecDate', sod.RecDate);
    request.execute('SalesPaymentUpdate', function (err, returnValue, affected) {
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
    request.input('SOID', req.params.id);
    request.execute('SalesPaymentDelete', function (err, returnValue, affected) {
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

module.exports = router;