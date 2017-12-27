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
    request.query(`Select * FROM dbo.vwCustomer`)
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
    request.query(`Select * FROM dbo.vwCustomer Where CustID = ${req.params.id}`)
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

router.get('/UserCustomers/:id(\\d+)', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query(`Select * FROM dbo.vwCustomer Where UserID = ${req.params.id}`)
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
router.get('/ByCountry', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query("Select Country, COUNT(CustID) CustCount From dbo.Customers GROUP BY Country")
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

router.get('/ByArea', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query("Select Country, Area, COUNT(CustID) CustCount From dbo.Customers GROUP BY Country, Area")
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

router.get('/ByPeriod/:fromDate.:toDate', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query(`Select * From dbo.Customers Where CreateDate Between '${req.params.fromDate}' And '${req.params.toDate}'`)
        .then(function (recordset) {
            var times = array.map(function (obj) {
                return obj.age;
            });
            times = times.filter(function (v, i) {
                return times.indexOf(v) == i;
            });
            res.json({
                custData: recordset,
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

router.get('/topCust/:fromDate.:toDate', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query(`SELECT TOP 5 CustID, CustName, SUM(GrandTotal) GT, SUM(SumQty) Quantity
                FROM vwSalesOrderHeader h 
                WHERE SODate Between '${req.params.fromDate}' And '${req.params.toDate}'
                GROUP BY CustID, Custname ORDER BY GT DESC`)
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


router.get('/SalesCusts', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query(`SELECT * FROM dbo.Customers WHERE CustID IN (SELECT CustID FROM dbo.SalesOrderHeader)`)
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

router.get('/repNewCusts/:id.:fromDate.:toDate', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query(`Select c.CustID ,ISNULL(c.CustName, '') CustName,c.CustType ,c.Country ,c.Address ,c.Tel ,c.Email ,c.Website ,
                    c.UserID ,c.CreateDate ,c.Area ,ISNULL(c.ContactPerson, '') ContactPerson,u.UserName 
                    FROM dbo.Customers c Join dbo.SystemUsers u on c.UserID = u.UserID
                    Where c.UserID = ${req.params.id} AND CAST(c.CreateDate AS DATE) BETWEEN '${req.params.fromDate}' And '${req.params.toDate}'`)
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
    var cust = req.body;
    var request = new sql.Request(sqlcon);
    request.input('CustName', cust.CustName);
    request.input('CustType', cust.CustType);
    request.input('Country', cust.Country);
    request.input('Address', cust.Address);
    request.input('Tel', cust.Tel);
    request.input('Email', cust.Email);
    request.input('Website', cust.Website);
    request.input('ContactPerson', cust.ContactPerson);
    request.input('Area', cust.Area);
    request.input('RegionID', cust.RegionID);
    request.input('ProvinceID', cust.ProvinceID);
    request.input('UserID', cust.UserID);
    request.execute('CustomerInsert', function (err, returnValue, affected) {
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
    var cust = req.body;
    var request = new sql.Request(sqlcon);
    request.input('CustID', req.params.id);
    request.input('CustName', cust.CustName);
    request.input('CustType', cust.CustType);
    request.input('Country', cust.Country);
    request.input('Address', cust.Address);
    request.input('Tel', cust.Tel);
    request.input('Email', cust.Email);
    request.input('Website', cust.Website);
    request.input('ContactPerson', cust.ContactPerson);
    request.input('Area', cust.Area);
    request.input('RegionID', cust.RegionID);
    request.input('ProvinceID', cust.ProvinceID);
    request.input('UserID', cust.UserID);
    request.execute('CustomerUpdate', function (err, returnValue, affected) {
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
    request.input('CustID', req.params.id);
    request.execute('CustomerDelete', function (err, returnValue, affected) {
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