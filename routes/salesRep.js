
var express = require('express');
var router = express.Router();
var sql = require('mssql');
var Promise = require('bluebird');
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

router.get('/Plan/:id(\\d+).:year(\\d+)', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query(`;with  MonthRecursive as (
        select 1 as MonthDate ,1 as [level]
        union all
        select 1 + [level], [level]+1 from  
        MonthRecursive where 1 + [level] <= 12)
        SELECT ${req.params.id} SalesRepID,${req.params.year} TargetYear, MonthDate TargetMonth, DATENAME(MONTH, DATEFROMPARTS(${req.params.year},MonthDate, 1)) MonthName, 
        ISNULL((SELECT MonthQty FROM dbo.SalesRepTarget WHERE SalesRepID=${req.params.id} AND TargetYear=${req.params.year} AND TargetMonth=m.MonthDate),0) AS MonthQty, 
        (SELECT SalesPerson FROM dbo.SalesRep WHERE SalesRepID=${req.params.id}) SalesPerson
        FROM MonthRecursive m `)
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
router.post('/Plan', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var srep = req.body.rep;
    var yplans = req.body.target;

    var conf = require('../SQLConfig');
    var connection = new sql.Connection(conf.config);

    connection.connect().then(function () {
        var trans = new sql.Transaction(connection);
        trans.begin()
            .then(function () {
                var promises = [];
                var request = trans.request();
                request.input('SalesRepID', srep);
                request.input('TargetYear', yplans[0].TargetYear);
                promises.push(request.execute('SalesTargetDelete'));

                promises.push(Promise.map(yplans, function (mplan) {
                    var request = trans.request();
                    request.input('SalesRepID', mplan.SalesRepID);
                    request.input('TargetYear', mplan.TargetYear);
                    request.input('TargetMonth', mplan.TargetMonth);
                    request.input('MonthQty', mplan.MonthQty);
                    return request.execute('SalesTargetInsert')
                }));

                Promise.all(promises)
                    .then(function (recordset) {
                        trans.commit().then(function () {
                            res.json({ returnValue: 1, affected: 1 });
                        }).catch(function (err) {
                            trans.rollback();
                            res.json({ error: err }); console.log(err);
                        })
                    }).catch(function (err) {
                        trans.rollback();
                        console.log('Transaction Rolled Back');
                        res.json({ error: err }); console.log(err);
                    })
            }).catch(function (err) {
                trans.rollback();
                res.json({ error: err }); console.log(err);
            })
    }).catch(function (err) {
        res.json({ error: err }); console.log(err); connection.close();
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