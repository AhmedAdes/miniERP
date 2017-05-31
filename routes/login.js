var express = require('express');
var router = express.Router();
var sql = require('mssql');
var sqlcon = sql.globalConnection;


router.post('/', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var user = req.body;
    var request = new sql.Request(sqlcon);
    request.input("LoginName", user.LoginName);
    request.input("UserPass", user.UserPass);
    request.execute("AuthenticateUser", function (err, recordset, returnValue) {
        if (err) { res.json({ error: err }); console.log(err); }
        else {
            res.json(recordset);
        }
    });
});



module.exports = router;