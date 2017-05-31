
var express = require('express');
var router = express.Router();
var sql = require('mssql');
var sqlcon = sql.globalConnection;

router.get('/', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query(`SELECT * FROM dbo.vwFinishStoreDetails`)
        .then(function (recordset) { res.json(recordset); })
        .catch(function (err) { res.json({ error: err }); console.log(err); })
});

router.get('/Receiving/:id', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query(`SELECT * FROM dbo.vwFinishStoreDetails Where FinReceivingID = ${req.params.id}`)
        .then(function (recordset) { res.json(recordset); })
        .catch(function (err) { res.json({ error: err }); console.log(err); })
});
router.get('/Dispensing/:id', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query(`SELECT * FROM dbo.vwFinishStoreDetails Where FinDispensingID = ${req.params.id}`)
        .then(function (recordset) { res.json(recordset); })
        .catch(function (err) { res.json({ error: err }); console.log(err); })
});
router.get('/Equalize/:id', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query(`SELECT * FROM dbo.vwFinishStoreDetails Where FinEqualizeID = ${req.params.id}`)
        .then(function (recordset) { res.json(recordset); })
        .catch(function (err) { res.json({ error: err }); console.log(err); })
});
router.get('/Return/:id', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query(`SELECT * FROM dbo.vwFinishStoreDetails Where FinReturnID = ${req.params.id}`)
        .then(function (recordset) { res.json(recordset); })
        .catch(function (err) { res.json({ error: err }); console.log(err); })
});
router.get('/Reject/:id', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query(`SELECT * FROM dbo.vwFinishStoreDetails Where FinRejectID = ${req.params.id}`)
        .then(function (recordset) { res.json(recordset); })
        .catch(function (err) { res.json({ error: err }); console.log(err); })
});

router.get('/ClrStock/:id', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query(`SELECT BatchNo, SUM(Quantity) Stock FROM dbo.FinishedStoreDetails Where ColorID = ${req.params.id} GROUP BY BatchNo`)
        .then(function (recordset) { res.json(recordset); })
        .catch(function (err) { res.json({ error: err }); console.log(err); })
});

router.post('/', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var material = req.body;
    var request = new sql.Request(sqlcon);
    request.input('RecYear', material.RecYear);
    request.input('SerialNo', material.SerialNo);
    request.input('RecordDate', material.RecordDate);
    request.input('ColorID', material.ColorID);
    request.input('Quantity', material.Quantity);
    request.input('BatchNo', material.BatchNo);
    request.input('FinReceivingID', material.FinReceivingID);
    request.input('FinDispensingID', material.FinDispensingID);
    request.input('FinEqualizeID', material.FinEqualizeID);
    request.input('FinReturnID', material.FinReturnID);
    request.input('FinRejectID', material.FinRejectID);
    request.input('UserID', material.UserID);
    request.execute('FinishDetailInsert', function (err, recordset, returnValue, affected) {
        if (err) { res.json({ error: err }); console.log(err); }
        else {
            res.json({ returnValue: returnValue, affected: affected });
        }
    });
});

router.delete('/Receiving/:id', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.input('FinReceivingID', req.params.id);
    request.execute('FinishDetailDeleteReceiving', function (err, recordset, returnValue, affected) {
        if (err) { res.json({ error: err }); console.log(err); }
        else { res.json({ returnValue: returnValue, affected: affected }); }
    });
});
router.delete('/Dispensing/:id', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.input('FinDispensingID', req.params.id);
    request.execute('FinishDetailDeleteDispense', function (err, recordset, returnValue, affected) {
        if (err) { res.json({ error: err }); console.log(err); }
        else { res.json({ returnValue: returnValue, affected: affected }); }
    });
});
router.delete('/Equalize/:id', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.input('FinEqualizeID', req.params.id);
    request.execute('FinishDetailDeleteEqualize', function (err, recordset, returnValue, affected) {
        if (err) { res.json({ error: err }); console.log(err); }
        else { res.json({ returnValue: returnValue, affected: affected }); }
    });
});
router.delete('/Return/:id', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.input('FinReturnID', req.params.id);
    request.execute('FinishDetailDeleteReturn', function (err, recordset, returnValue, affected) {
        if (err) { res.json({ error: err }); console.log(err); }
        else { res.json({ returnValue: returnValue, affected: affected }); }
    });
});
router.delete('/Reject/:id', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.input('FinRejectID', req.params.id);
    request.execute('FinishDetailDeleteReject', function (err, recordset, returnValue, affected) {
        if (err) { res.json({ error: err }); console.log(err); }
        else { res.json({ returnValue: returnValue, affected: affected }); }
    });
});

module.exports = router;