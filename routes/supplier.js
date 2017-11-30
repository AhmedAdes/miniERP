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
    request.query("Select c.*,u.UserName From dbo.Suppliers c Join dbo.SystemUsers u on c.UserID = u.UserID")
        .then(function (result) {
            res.json(result.recordset);
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
    request.query("Select c.*,u.UserName From dbo.Suppliers c Join dbo.SystemUsers u on c.UserID = u.UserID Where SupID = '" + req.params.id + "'")
        .then(function (result) {
            res.json(result.recordset);
        })
        .catch(function (err) {
            res.json({
                error: err
            });
            console.log(err);
        })
});

router.get('/ByCountry', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query("Select Distinct Country From dbo.Suppliers")
        .then(function (result) {
            res.json(result.recordset);
        })
        .catch(function (err) {
            res.json({
                error: err
            });
            console.log(err);
        })
});

router.get('/ByArea', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query("Select Distinct Area From dbo.Suppliers")
        .then(function (result) {
            res.json(result.recordset);
        })
        .catch(function (err) {
            res.json({
                error: err
            });
            console.log(err);
        })
});

router.get('/ByPeriod/:fromDate.:toDate', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query(`Select * From dbo.Suppliers Where CreateDate Between '${req.params.fromDate}' And '${req.params.toDate}'`)
        .then(function (result) {
            console.log(recordset);
            var times = array.map(function (obj) {
                return obj.age;
            });
            times = times.filter(function (v, i) {
                return times.indexOf(v) == i;
            });
            res.json({
                supData: recordset,
                YearData: times
            });
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
    var sup = req.body;
    var request = new sql.Request(sqlcon);
    //SupName ,SupContactPerson ,Country ,Address ,Tel ,CommercialRecord ,TaxFileNo ,Email ,Website ,Contractor ,ContractDate ,ContractLength ,UserID
    request.input('SupName', sup.SupName);
    request.input('SupContactPerson', sup.SupContactPerson);
    request.input('Country', sup.Country);
    request.input('Address', sup.Address);
    request.input('Tel', sup.Tel);
    request.input('CommercialRecord', sup.CommercialRecord);
    request.input('TaxFileNo', sup.TaxFileNo);
    request.input('Email', sup.Email);
    request.input('Website', sup.Website);
    request.input('Contractor', sup.Contractor);
    request.input('ContractDate', sup.ContractDate);
    request.input('ContractLength', sup.ContractLength);
    request.input('UserID', sup.UserID);
    request.execute('SupplierInsert', function (err, result) {
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
    var brand = req.body;
    var request = new sql.Request(sqlcon);
    request.input('SupID', req.params.id);
    request.input('SupName', sup.SupName);
    request.input('SupContactPerson', sup.SupContactPerson);
    request.input('Country', sup.Country);
    request.input('Address', sup.Address);
    request.input('Tel', sup.Tel);
    request.input('CommercialRecord', sup.CommercialRecord);
    request.input('TaxFileNo', sup.TaxFileNo);
    request.input('Email', sup.Email);
    request.input('Website', sup.Website);
    request.input('Contractor', sup.Contractor);
    request.input('ContractDate', sup.ContractDate);
    request.input('ContractLength', sup.ContractLength);
    request.input('UserID', sup.UserID);
    request.execute('SupplierUpdate', function (err, result) {
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
    request.input('SupID', req.params.id);
    request.execute('SupplierDelete', function (err, result) {
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