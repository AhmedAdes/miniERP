var express = require("express");
var router = express.Router();
var sql = require("mssql");
var jwt = require("jsonwebtoken");
var sqlcon = sql.globalConnection;

router.post("/", function (req, res, next) {
  res.setHeader("Content-Type", "application/json");
  var user = req.body;
  var request = new sql.Request(sqlcon);
  request.input("LoginName", user.LoginName);
  request.input("UserPass", user.UserPass);
  request.execute("AuthenticateUser", function (err, ret) {
    if (err) {
      res.json({
        error: err
      });
      console.log(err);
    } else {
      if (ret[0][0].Error) {
        res.json({
          error: ret[0][0].Error
        });
        console.log(ret[0][0].Error);
      } else {
        console.log(ret)
        const payload = {
          admin: ret[0][0].UserName
        };
        var token = jwt.sign(payload, ret[0][0].Salt, {
          expiresIn: 86400, // expires in 86400 sec = 1440 min = 24 hours
          algorithm: 'HS384'
        });
        // console.log(token)
        // console.log(ret.recordset[0].Salt)
        res.json({
          user: ret[0],
          tkn: token,
          salt: ret[0][0].Salt
        });
      }
    }
  });
});

module.exports = router;