var express = require('express');
var router = express.Router();
var sql = require('mssql');
var sqlcon = sql.globalConnection;

router.get('/', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query(`Select * From dbo.vwDashBoardCounts`)
        .then(function (recordset) {
            res.json(recordset);
        }).catch(function (err) {
            if (err) { res.json({ error: err }); console.log(err); }
        })
});

module.exports = router;