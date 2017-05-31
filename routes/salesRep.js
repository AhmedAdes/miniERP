
var express = require('express');
var router = express.Router();
var sql = require('mssql');
var sqlcon = sql.globalConnection;

router.get('/', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query("Select * From dbo.SalesRep")
        .then(function (recordset) { res.json(recordset); })
        .catch(function (err) { res.json({ error: err }); console.log(err); })
});

router.get('/:id(\\d+)', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query("Select * From dbo.SalesRep Where SalesRepID = " + req.params.id)
        .then(function (recordset) { res.json(recordset); })
        .catch(function (err) { res.json({ error: err }); console.log(err); })
});

router.post('/', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var srep = req.body;
    var request = new sql.Request(sqlcon);
    request.input('SalesPerson', srep.SalesPerson);
    request.input('Tel', srep.Tel);
    request.execute('SalesRepInsert', function (err, recordset, returnValue, affected) {
        if (err) { res.json({ error: err }); console.log(err); }
        else {
            res.json({ returnValue: returnValue, affected: affected });
        }
    });
});

router.put('/:id', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var srep = req.body;
    var request = new sql.Request(sqlcon);
    request.input('SalesRepID', req.params.id);
    request.input('SalesPerson', srep.SalesPerson);
    request.input('Tel', srep.Tel);
    request.execute('SalesRepUpdate', function (err, recordset, returnValue, affected) {
        if (err) { res.json({ error: err }); console.log(err); }
        else {
            res.json({ returnValue: returnValue, affected: affected });
        }
    });

});

router.delete('/:id', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.input('SalesRepID', req.params.id);
    request.execute('SalesRepDelete', function (err, recordset, returnValue, affected) {
        if (err) { res.json({ error: err }); console.log(err); }
        else {
            res.json({ returnValue: returnValue, affected: affected });
        }
    });
});

module.exports = router;