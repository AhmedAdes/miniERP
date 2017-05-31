
var express = require('express');
var router = express.Router();
var sql = require('mssql');
var sqlcon = sql.globalConnection;

router.get('/', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query("Select c.*,u.UserName From dbo.Customers c Join dbo.SystemUsers u on c.UserID = u.UserID")
        .then(function (recordset) { res.json(recordset); })
        .catch(function (err) { res.json({ error: err }); console.log(err); })
});

router.get('/:id(\\d+)', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query("Select c.*,u.UserName From dbo.Customers c Join dbo.SystemUsers u on c.UserID = u.UserID Where CustID = '" + req.params.id + "'")
        .then(function (recordset) { res.json(recordset); })
        .catch(function (err) { res.json({ error: err }); console.log(err); })
});

router.get('/ByCountry', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query("Select Country, COUNT(CustID) CustCount From dbo.Customers GROUP BY Country")
        .then(function (recordset) { res.json(recordset); })
        .catch(function (err) { res.json({ error: err }); console.log(err); })
});

router.get('/ByArea', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query("Select Country, Area, COUNT(CustID) CustCount From dbo.Customers GROUP BY Country, Area")
        .then(function (recordset) { res.json(recordset); })
        .catch(function (err) { res.json({ error: err }); console.log(err); })
});

router.get('/ByPeriod/:fromDate.:toDate', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query(`Select * From dbo.Customers Where CreateDate Between '${req.params.fromDate}' And '${req.params.toDate}'`)
        .then(function (recordset) { console.log(recordset); 
            var times = array.map(function(obj) { return obj.age; }); 
            times = times.filter(function(v,i) { return times.indexOf(v) == i; });
            res.json({ custData: recordset ,YearData: times});})
        .catch(function (err) { res.json({ error: err }); console.log(err); })
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
    request.input('UserID', cust.UserID);
    request.execute('CustomerInsert', function (err, recordset, returnValue, affected) {
        if (err) { res.json({ error: err }); console.log(err); }
        else {
            res.json({ returnValue: returnValue, affected: affected });
        }
    });
});

router.put('/:id', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var brand = req.body;
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
    request.input('UserID', cust.UserID);
    request.execute('CustomerUpdate', function (err, recordset, returnValue, affected) {
        if (err) { res.json({ error: err }); console.log(err); }
        else {
            res.json({ returnValue: returnValue, affected: affected });
        }
    });

});

router.delete('/:id', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.input('CustID', req.params.id);
    request.execute('CustomerDelete', function (err, recordset, returnValue, affected) {
        if (err) { res.json({ error: err }); console.log(err); }
        else {
            res.json({ returnValue: returnValue, affected: affected });
        }
    });
});

module.exports = router;