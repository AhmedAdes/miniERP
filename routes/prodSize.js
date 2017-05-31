
var express = require('express');
var router = express.Router();
var sql = require('mssql');
var sqlcon = sql.globalConnection;

router.get('/', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query(`SELECT Selected =CAST(0 AS BIT),Size = size, QuntPerDozen=NULL, ModelId = 0 FROM dbo.Sizes c`)
        .then(function (recordset) {
            res.json(recordset);
        }).catch(function (err) {
            if (err) { res.json({ error: err }); console.log(err); }
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
            if (err) { res.json({ error: err }); console.log(err); }
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
    request.execute('ProdSizeInsert', function (err, recordset, returnValue, affected) {
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
    request.execute('ProdSizeDelete', function (err, recordset, returnValue, affected) {
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