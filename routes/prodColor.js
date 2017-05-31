
var express = require('express');
var router = express.Router();
var sql = require('mssql');
var sqlcon = sql.globalConnection;

router.get('/', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query(`SELECT c.*,u.UserName,m.ModelCode,m.ModelName FROM dbo.ProductColorCoding c 
                JOIN dbo.SystemUsers u on c.UserID = u.UserID JOIN dbo.ProductModelCoding m ON m.ModelID = c.ModelID`)
        .then(function (recordset) {
            res.json(recordset);
        }).catch(function (err) {
            if (err) { res.json({ error: err }); console.log(err); }
        })
});

router.get('/:id', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query(`SELECT c.*,u.UserName,m.ModelCode,m.ModelName FROM dbo.ProductColorCoding c 
                JOIN dbo.SystemUsers u on c.UserID = u.UserID JOIN dbo.ProductModelCoding m ON m.ModelID = c.ModelID
                Where c.ModelID = '${req.params.id}'`)
        .then(function (recordset) {
            res.json(recordset);
        }).catch(function (err) {
            if (err) { res.json({ error: err }); console.log(err); }
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
    request.execute('ColorInsert', function (err, recordset, returnValue, affected) {
        if (err) { res.json({ error: err }); console.log(err); }
        else {
            res.json({ returnValue: returnValue, affected: affected });
        }
    });
});

router.delete('/:id', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.input('ModelID', req.params.id);
    request.execute('ColorDelete', function (err, recordset, returnValue, affected) {
        if (err) { res.json({ error: err }); console.log(err); }
        else {
            res.json({ returnValue: returnValue, affected: affected });
        }
    });
});

function generateColorID() {
    var request = new sql.Request(sqlcon);
    request.query("SELECT (ISNULL(MAX(ColorID), 0) + 1) as max FROM dbo.ProductModelCoding")
        .then(function (recordset) {
            res.json(recordset);
        }).catch(function (err) {
            if (err) { res.json({ error: err }); console.log(err); }
        })
};

function padLeft(nr, n, str) {
    return Array(n - String(nr).length + 1).join(str || '0') + nr;
}

module.exports = router;