/*
 * GET users listing.
 */
var express = require('express');
var router = express.Router();
var sql = require('mssql');
var sqlcon = sql.globalConnection;

router.get('/', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query("SELECT * FROM dbo.SystemUsers")
        .then(function (recordset) {
            res.json(recordset);
        }).catch(function (err) {
            if (err) { res.json({ error: err }); console.log(err); }
        })
});

router.get('/:id', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query("SELECT * FROM dbo.SystemUsers Where UserID=" + req.params.id)
        .then(function (recordset) {
            res.json(recordset);
        }).catch(function (err) {
            if (err) { res.json({ error: err }); console.log(err); }
        })
});

router.post('/', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var user = req.body;
    var request = new sql.Request(sqlcon);
    request.input("UserName", user.UserName);
    request.input("LoginName", user.LoginName);
    request.input("UserPass", user.UserPass);
    request.input("JobClass", user.JobClass);
    request.input("DirectManager", user.DirectManager);
    request.execute("UserInsert", function (err, recordset, returnValue, affected) {
        if (err) { res.json({ error: err }); console.log(err); }
        else {
            res.json({ returnValue: returnValue, affected: affected });
        }
    });
});

router.put('/:id', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var user = req.body;
    var request = new sql.Request(sqlcon);
    request.input("UserID", req.params.id);
    request.input("UserName", user.UserName);
    request.input("LoginName", user.LoginName);
    request.input("UserPass", user.UserPass);
    request.input("JobClass", user.JobClass);
    request.execute("UserUpdate", function (err, recordset, returnValue, affected) {
        if (err) { res.json({ error: err }); console.log(err); }
        else {
            res.json({ returnValue: returnValue, affected: affected });
        }
    });
});

router.put('/Approve/:id', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var data = req.body;
    var request = new sql.Request(sqlcon);
    request.input("UserID", data.id);
    request.input("ApproveUser", data.appuser);
    request.execute("UserApprove", function (err, recordset, returnValue, affected) {
        if (err) { res.json({ error: err }); console.log(err); }
        else {
            res.json({ returnValue: returnValue, affected: affected });
        }
    });
});

router.delete('/:id', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.input("UserID", req.params.id);
    request.execute("UserDelete", function (err, recordset, returnValue, affected) {
        if (err) { res.json({ error: err }); console.log(err); }
        else {
            res.json({ returnValue: returnValue, affected: affected });
        }
    });
});

module.exports = router;