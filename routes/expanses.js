
var express = require('express');
var router = express.Router();
var sql = require('mssql');
var sqlcon = sql.globalConnection;

router.get('/', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query("Select e.*,u.UserName From dbo.Expanses e Join dbo.SystemUsers u on e.UserID = u.UserID")
        .then(function (recordset) {
            res.json(recordset);
        }).catch(function (err) {
            if (err) { res.json({ error: err }); console.log(err); }
        })
});

router.get('/:id(//d+)', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query(`Select e.*,u.UserName From dbo.Expanses e Join dbo.SystemUsers u on e.UserID = u.UserID Where ExpanseID = $${req.params.id}`)
        .then(function (recordset) {
            res.json(recordset);
        }).catch(function (err) {
            if (err) { res.json({ error: err }); console.log(err); }
        })
});

router.post('/', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var expans = req.body;
    var request = new sql.Request(sqlcon);
    request.input('ExpanseName', expans.ExpanseName);
    request.input('ExpanseType', expans.ExpanseType);
    request.input('Amount', expans.Amount);
    request.input('ResPerson', expans.ResPerson);
    request.input('UserID', expans.UserID);
    request.execute('ExpansesInsert', function (err, recordset, returnValue, affected) {
        if (err) { res.json({ error: err }); console.log(err); }
        else {
            res.json({ returnValue: returnValue, affected: affected });
        }
    });
});

router.put('/:id', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var expans = req.body;
    var request = new sql.Request(sqlcon);
    request.input('ExpanseID', req.params.id);
    request.input('ExpanseName', expans.ExpanseName);
    request.input('ExpanseType', expans.ExpanseType);
    request.input('Amount', expans.Amount);
    request.input('ResPerson', expans.ResPerson);
    request.input('UserID', expans.UserID);
    request.execute('ExpansesUpdate', function (err, recordset, returnValue, affected) {
        if (err) { res.json({ error: err }); console.log(err); }
        else {
            res.json({ returnValue: returnValue, affected: affected });
        }
    });

});

router.delete('/:id', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.input('ExpanseID', req.params.id);
    request.execute('ExpansesDelete', function (err, recordset, returnValue, affected) {
        if (err) { res.json({ error: err }); console.log(err); }
        else {
            res.json({ returnValue: returnValue, affected: affected });
        }
    });
});

function padLeft(nr, n, str) {
    return Array(n - String(nr).length + 1).join(str || '0') + nr;
}

module.exports = router;