
var express = require('express');
var router = express.Router();
var sql = require('mssql');
var sqlcon = sql.globalConnection;

router.get('/', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query("Select c.*,u.UserName From dbo.MaterialCoding c Join dbo.SystemUsers u on c.UserID = u.UserID Where Category='Cloth'")
        .then(function (recordset) {
            res.json(recordset);
        }).catch(function (err) {
            if (err) { res.json({ error: err }); console.log(err); }
        })
});

router.get('/:id', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query("Select c.*,u.UserName From dbo.MaterialCoding c Join dbo.SystemUsers u on c.UserID = u.UserID Where Category='Cloth' And MaterialID = " + req.params.id)
        .then(function (recordset) {
            res.json(recordset);
        }).catch(function (err) {
            if (err) { res.json({ error: err }); console.log(err); }
        })
});

router.post('/', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var material = req.body;
    var request = new sql.Request(sqlcon);
    request.input('MaterialName', material.MaterialName);
    request.input('Category', 'Cloth');
    request.input('Onz', material.Onz);
    request.input('Color', material.Color);
    request.input('ClothLength', material.ClothLength);
    request.input('ClothWidth', material.ClothWidth);
    request.input('Unit', material.Unit);
    request.input('IndigoGrade', material.IndigoGrade);
    request.input('CottonPercent', material.CottonPercent);
    request.input('LykraPercent', material.LykraPercent);
    request.input('ShrinkPercent', material.ShrinkPercent);
    request.input('PolyesterPercent', material.PolyesterPercent);
    request.input('UserID', material.UserID);
    request.execute('MaterialCodingInsert', function (err, recordset, returnValue, affected) {
        if (err) { res.json({ error: err }); console.log(err); }
        else {
            res.json({ returnValue: returnValue, affected: affected });
        }
    });
});

router.put('/:id', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var material = req.body;
    var request = new sql.Request(sqlcon);
    request.input('MaterialID', req.params.id);
    request.input('MaterialName', material.MaterialName);
    request.input('Category', material.Category);
    request.input('Onz', material.Onz);
    request.input('Color', material.Color);
    request.input('ClothLength', material.ClothLength);
    request.input('ClothWidth', material.ClothWidth);
    request.input('Unit', material.Unit);
    request.input('IndigoGrade', material.IndigoGrade);
    request.input('CottonPercent', material.CottonPercent);
    request.input('LykraPercent', material.LykraPercent);
    request.input('ShrinkPercent', material.ShrinkPercent);
    request.input('PolyesterPercent', material.PolyesterPercent);
    request.input('UserID', material.UserID);
    request.execute('MaterialCodingUpdate', function (err, recordset, returnValue, affected) {
        if (err) { res.json({ error: err }); console.log(err); }
        else {
            res.json({ returnValue: returnValue, affected: affected });
        }
    });
});

router.delete('/:id', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.input('MaterialID', req.params.id);
    request.execute('MaterialCodingDelete', function (err, recordset, returnValue, affected) {
        if (err) { res.json({ error: err }); console.log(err); }
        else {
            res.json({ returnValue: returnValue, affected: affected });
        }
    });
});

module.exports = router;