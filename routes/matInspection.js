
var express = require('express');
var router = express.Router();
var sql = require('mssql');
var sqlcon = sql.globalConnection;

router.get('/', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query(`SELECT i.*, c.MaterialName, c.Unit, c.Category, s.SupName, u.UserName
FROM dbo.MaterialInspection i JOIN dbo.MaterialCoding c ON i.MaterialID = c.MaterialID
JOIN dbo.Suppliers s ON i.SupID = s.SupID JOIN dbo.SystemUsers u ON i.UserID = u.UserID`)
        .then(function (recordset) {
            res.json(recordset);
        }).catch(function (err) {
            if (err) { res.json({ error: err }); console.log(err); }
        })
});

router.get('/Pending', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query(`SELECT i.*, c.MaterialName, c.Unit, c.Category, s.SupName, u.UserName
FROM dbo.MaterialInspection i JOIN dbo.MaterialCoding c ON i.MaterialID = c.MaterialID
JOIN dbo.Suppliers s ON i.SupID = s.SupID JOIN dbo.SystemUsers u ON i.UserID = u.UserID 
WHERE i.Approved = 1 AND i.ReceivedApp = 0`)
        .then(function (recordset) {
            res.json(recordset);
        }).catch(function (err) {
            if (err) { res.json({ error: err }); console.log(err); }
        })
});

router.get('/:id(\\d+)', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query(`SELECT i.*, c.MaterialName, c.Unit, c.Category, s.SupName, u.UserName
FROM dbo.MaterialInspection i JOIN dbo.MaterialCoding c ON i.MaterialID = c.MaterialID
JOIN dbo.Suppliers s ON i.SupID = s.SupID JOIN dbo.SystemUsers u ON i.UserID = u.UserID Where InspID =${req.params.id}`)
        .then(function (recordset) {
            res.json(recordset);
        }).catch(function (err) {
            if (err) { res.json({ error: err }); console.log(err); }
        })
});



router.post('/', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var insp = req.body;
    var request = new sql.Request(sqlcon);
    //RecDate ,RecYear ,SerialNo ,ManfDate ,InvoiceNo ,InvoiceDate ,BatchNo ,QCNO ,MaterialID ,QtyReceived ,SampleQty ,UnitPrice ,TotalPrice ,Notes ,POID ,SupID ,UserID
    request.input('RecDate', insp.RecDate);
    request.input('RecYear', insp.RecYear);
    request.input('SerialNo', insp.SerialNo);
    request.input('ManfDate', insp.ManfDate);
    request.input('InvoiceNo', insp.InvoiceNo);
    request.input('InvoiceDate', insp.InvoiceDate);
    request.input('BatchNo', insp.BatchNo);
    request.input('QCNO', insp.QCNO);
    request.input('MaterialID', insp.MaterialID);
    request.input('QtyReceived', insp.QtyReceived);
    request.input('SampleQty', insp.SampleQty);
    request.input('UnitPrice', insp.UnitPrice);
    request.input('TotalPrice', insp.TotalPrice);
    request.input('Notes', insp.Notes);
    request.input('POID', insp.POID);
    request.input('SupID', insp.SupID);
    request.input('UserID', insp.UserID);
    request.execute('MaterialInspectionInsert')
        .then(function (recordset) {
            res.json({ returnValue: recordset.length +1, affected: recordset.length+1 > 0 });
        }).catch(function (err) {
            res.json({ error: err }); console.log(err);
        })
});

router.put('/:id', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var insp = req.body;
    var request = new sql.Request(sqlcon);
    request.input('InspID', req.params.id);
    request.input('RecDate', insp.RecDate);
    request.input('RecYear', insp.RecYear);
    request.input('SerialNo', insp.SerialNo);
    request.input('ManfDate', insp.ManfDate);
    request.input('InvoiceNo', insp.InvoiceNo);
    request.input('InvoiceDate', insp.InvoiceDate);
    request.input('BatchNo', insp.BatchNo);
    request.input('QCNO', insp.QCNO);
    request.input('MaterialID', insp.MaterialID);
    request.input('QtyReceived', insp.QtyReceived);
    request.input('SampleQty', insp.SampleQty);
    request.input('UnitPrice', insp.UnitPrice);
    request.input('TotalPrice', insp.TotalPrice);
    request.input('Notes', insp.Notes);
    request.input('POID', insp.POID);
    request.input('SupID', insp.SupID);
    request.input('UserID', insp.UserID);
    request.execute('MaterialInspectionUpdate')
        .then(function (recordset) {
            res.json({ returnValue: recordset.length +1, affected: recordset.length+1 > 0 });
        }).catch(function (err) {
            res.json({ error: err }); console.log(err);
        })
});

router.delete('/:id', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.input('InspID', req.params.id);
    request.execute('MaterialInspectionDelete', function (err, recordset, returnValue, affected) {
        if (err) { res.json({ error: err }); console.log(err); }
        else {
            res.json({ returnValue: returnValue, affected: affected });
        }
    });
});

router.put('/Release/:id', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var insp = req.body;
    //Approved=@Approved ,QtyApproved=@QtyApproved ,ReceivedApp=@ReceivedApp ,Reject=@Reject ,QtyReject=@QtyReject ,ReceivedRej=@ReceivedRej
    var request = new sql.Request(sqlcon);
    request.input('InspID', req.params.id);
    request.input('Approved', insp.Approved);
    request.input('QtyApproved', insp.QtyApproved);
    request.input('Reject', insp.Reject);
    request.input('QtyReject', insp.QtyReject);
    request.input('QCNO', insp.QCNO);
    request.input('Notes', insp.Notes);
    request.input('UserID', insp.UserID);
    request.execute('MaterialInspectionRelease')
        .then(function (recordset) {
            res.json({ returnValue: recordset.length +1, affected: recordset.length+1 > 0 });
        }).catch(function (err) {
            res.json({ error: err }); console.log(err);
        })
});
module.exports = router;