var express = require("express");
var router = express.Router();
var sql = require("mssql");
var jwt = require("jsonwebtoken");
var sqlcon = sql.globalConnection;
var Promise = require("bluebird");

router.use(function(req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers["authorization"];
  var secret = req.body.salt || req.query.salt || req.headers["salt"];
  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, secret, function(err, decoded) {
      if (err) {
        return res.status(403).send({
          success: false,
          message: "Failed to authenticate token."
        });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });
  } else {
    // if there is no token
    // return an error
    return res.status(403).send({
      success: false,
      message: "No token provided."
    });
  }
});

router.get("/", function(req, res, next) {
  res.setHeader("Content-Type", "application/json");
  var request = new sql.Request(sqlcon);
  request
    .query(
      `SELECT fr.*, st1.StoreType AS FromStoreName, st2.StoreType AS ToStoreName, u.UserName, 
      (SELECT SUM(ABS(Quantity))/2 FROM dbo.FinishedStoreDetails WHERE FinTransferID = fr.FinTransferID GROUP BY FinTransferID) SumQty 
      FROM dbo.FinishedTransfer fr JOIN dbo.SystemUsers u ON u.UserID = fr.UserID
      JOIN dbo.StoreTypes st1 ON fr.FromStoreID = st1.StoreTypeID
      JOIN dbo.StoreTypes st2 ON fr.ToStoreID = st2.StoreTypeID`
    )
    .then(function(recordset) {
      res.json(recordset);
    })
    .catch(function(err) {
      if (err) {
        res.json({
          error: err
        });
        console.log(err);
      }
    });
});
router.get("/:id", function(req, res, next) {
  res.setHeader("Content-Type", "application/json");
  var request = new sql.Request(sqlcon);
  request
    .query(
      `SELECT fr.*, u.UserName FROM dbo.FinishedTransfer fr JOIN dbo.SystemUsers u ON u.UserID = fr.UserID Where fr.FinTransferID = ${req.params.id}`
    )
    .then(function(recordset) {
      res.json(recordset);
    })
    .catch(function(err) {
      if (err) {
        res.json({
          error: err
        });
        console.log(err);
      }
    });
});
router.get("/SearchModel/:model", function(req, res, next) {
  res.setHeader("Content-Type", "application/json");
  var request = new sql.Request(sqlcon);
  request
    .query(
      `SELECT fr.*, u.UserName, (SELECT SUM(ABS(Quantity))/2 FROM dbo.FinishedStoreDetails WHERE FinTransferID = fr.FinTransferID GROUP BY FinTransferID) SumQty
    FROM dbo.FinishedTransfer fr JOIN dbo.SystemUsers u ON u.UserID = fr.UserID
    WHERE fr.FinTransferID IN (SELECT DISTINCT FinTransferID FROM dbo.vwFinishStoreDetails WHERE ModelID = ${
      req.params.model
    } AND FinTransferID IS NOT NULL)`
    )
    .then(function(recordset) {
      res.json(recordset);
    })
    .catch(function(err) {
      if (err) {
        res.json({
          error: err
        });
        console.log(err);
      }
    });
});
router.post("/", function(req, res, next) {
  res.setHeader("Content-Type", "application/json");
  var finTrns = req.body.master;
  var details = req.body.details;
  var finTrnsID, serial;

  var conf = require("../SQLConfig");
  let connection = new sql.Connection(conf.config);
  connection
    .connect()
    .then(function() {
      let trans = new sql.Transaction(connection);
      trans
        .begin()
        .then(function() {
          var promises = [];
          var request = trans.request(); //RecYear ,SerialNo ,TransferDate ,FromStoreID ,ToStoreID ,UserID
          request.input("RecYear", finTrns.RecYear);
          request.input("SerialNo", finTrns.SerialNo);
          request.input("TransferDate", finTrns.TransferDate);
          request.input("FromStoreID", finTrns.FromStoreID);
          request.input("ToStoreID", finTrns.ToStoreID);
          request.input("UserID", finTrns.UserID);
          request
            .execute("FinishTransferInsert")
            .then(function(recordset) {
              finTrnsID = recordset[0][0].FinTransferID;
              serial = recordset[0][0].SerialNo;

              promises.push(
                Promise.map(details, function(det) {
                  var request = trans.request();
                  request.input("RecYear", finTrns.RecYear);
                  request.input("SerialNo", serial);
                  request.input("RecordDate", det.RecordDate);
                  request.input("ColorID", det.ColorID);
                  request.input("Quantity", det.Quantity);
                  request.input("BatchNo", det.BatchNo);
                  request.input("FinTransferID", finTrnsID);
                  request.input("UserID", det.UserID);
                  request.input("FromStoreID", finTrns.FromStoreID);
                  request.input("ToStoreID", finTrns.ToStoreID);
                  return request.execute("FinTransferDetailsInsert");
                })
              );

              Promise.all(promises)
                .then(function(recordset) {
                  trans
                    .commit()
                    .then(function() {
                      res.json({
                        returnValue: 1,
                        affected: 1
                      });
                    })
                    .catch(function(err) {
                      trans.rollback();
                      res.json({
                        error: err
                      });
                      console.log(err);
                    });
                })
                .catch(function(err) {
                  trans.rollback();
                  console.log("Transaction Rolled Back");
                  res.json({
                    error: err
                  });
                  console.log(err);
                });
            })
            .catch(function(err) {
              trans.rollback();
              console.log("Transaction Rolled Back");
              res.json({
                error: err
              });
              console.log(err);
            });
        })
        .catch(function(err) {
          trans.rollback();
          console.log("Transaction Rolled Back");
          res.json({
            error: err
          });
          console.log(err);
        });
    })
    .catch(function(err) {
      console.log("Connection Failed");
      res.json({
        error: err
      });
      console.log(err);
    });
});

router.put("/:id", function(req, res, next) {
  res.setHeader("Content-Type", "application/json");
  var finTrns = req.body.master;
  var details = req.body.details;

  var conf = require("../SQLConfig");
  var connection = new sql.Connection(conf.config);
  connection
    .connect()
    .then(function() {
      var trans = new sql.Transaction(connection);
      trans
        .begin()
        .then(function() {
          var promises = [];
          var request = trans.request();
          request.input("FinTransferID", req.params.id);
          request.input("RecYear", finTrns.RecYear);
          request.input("SerialNo", finTrns.SerialNo);
          request.input("TransferDate", finTrns.TransferDate);
          request.input("FromStoreID", finTrns.FromStoreID);
          request.input("ToStoreID", finTrns.ToStoreID);
          request.input("UserID", finTrns.UserID);
          request.execute("FinishTransferUpdate").then(function(recordset) {
            var request = trans.request();
            request
              .query(
                `SELECT * From dbo.FinishedStoreDetails WHERE FinTransferID=${
                  req.params.id
                }`
              )
              .then(function(recordset) {
                var curDet = recordset;
                console.log(curDet);
                var addedList = details.filter(function(det) {
                  return !det.FinStoreID;
                });
                console.log(addedList);
                var deletedList = curDet.filter(function(cur) {
                  return (
                    !details.filter(function(newd) {
                      return cur.FinStoreID == newd.FinStoreID;
                    }).length > 0
                  );
                });
                console.log(deletedList);
                var editedList = details.filter(function(newd) {
                  return (
                    curDet.filter(function(cur) {
                      return cur.FinStoreID == newd.FinStoreID;
                    }).length > 0
                  );
                });
                console.log(editedList);

                promises.push(
                  Promise.map(details, function(det) {
                    var request = trans.request();
                    request.input("RecYear", finTrns.RecYear);
                    request.input("SerialNo", finTrns.SerialNo);
                    request.input("RecordDate", det.RecordDate);
                    request.input("ColorID", det.ColorID);
                    request.input("Quantity", det.Quantity);
                    request.input("BatchNo", det.BatchNo);
                    request.input("FinTransferID", finTrns.FinTransferID);
                    request.input("UserID", det.UserID);
                    request.input("FromStoreID", finTrns.FromStoreID);
                    request.input("ToStoreID", finTrns.ToStoreID);
                    return request.execute("FinTransferDetailsInsert");
                  })
                );
                promises.push(
                  Promise.map(editedList, function(det) {
                    var request = trans.request();
                    request.input("FinStoreID", det.FinStoreID);
                    request.input("RecYear", det.RecYear);
                    request.input("SerialNo", det.SerialNo);
                    request.input("RecordDate", det.RecordDate);
                    request.input("ColorID", det.ColorID);
                    request.input("Quantity", det.Quantity);
                    request.input("BatchNo", det.BatchNo);
                    request.input("FinEqualizeID", det.FinEqualizeID);
                    request.input("FinReceivingID", det.FinReceivingID);
                    request.input("FinDispensingID", det.FinDispensingID);
                    request.input("FinReturnID", det.FinReturnID);
                    request.input("FinRejectID", det.FinRejectID);
                    request.input("UserID", det.UserID);
                    request.input("StoreTypeID", det.StoreTypeID);
                    return request.execute("FinishDetailUpdate");
                  })
                );
                promises.push(
                  Promise.map(deletedList, function(det) {
                    var request = trans.request();
                    request.input("FinStoreID", det.FinStoreID);
                    return request.execute("FinishDetailDelete");
                  })
                );

                Promise.all(promises)
                  .then(function(recordset) {
                    trans
                      .commit()
                      .then(function() {
                        res.json({
                          returnValue: 1,
                          affected: 1
                        });
                      })
                      .catch(function(err) {
                        trans.rollback();
                        res.json({
                          error: err
                        });
                        console.log(err);
                      });
                  })
                  .catch(function(err) {
                    trans.rollback();
                    console.log("Transaction Rolled Back");
                    res.json({
                      error: err
                    });
                    console.log(err);
                  });
              })
              .catch(function(err) {
                trans.rollback();
                console.log("Transaction Rolled Back");
                res.json({
                  error: err
                });
                console.log(err);
              });
          });
        })
        .catch(function(err) {
          trans.rollback();
          console.log("Transaction Rolled Back");
          res.json({
            error: err
          });
          console.log(err);
        });
    })
    .catch(function(err) {
      console.log("Connection Failed");
      res.json({
        error: err
      });
      console.log(err);
    });
});

router.delete("/:id", function(req, res, next) {
  res.setHeader("Content-Type", "application/json");
  var conf = require("../SQLConfig");
  var connection = new sql.Connection(conf.config);
  connection.connect().then(function() {
    var trans = new sql.Transaction(connection);
    trans
      .begin()
      .then(function() {
        var request = trans.request();
        request.input("FinTransferID", req.params.id);
        request
          .execute("FinishTransferDelete")
          .then(function(recordset) {
            trans
              .commit()
              .then(function() {
                res.json({
                  returnValue: 1,
                  affected: 1
                });
              })
              .catch(function(err) {
                trans.rollback();
                res.json({
                  error: err
                });
                console.log(err);
              });
          })
          .catch(function(err) {
            trans.rollback();
            console.log("Transaction Rolled Back");
            res.json({
              error: err
            });
            console.log(err);
          });
      })
      .catch(function(err) {
        trans.rollback();
        console.log("Transaction Rolled Back");
        res.json({
          error: err
        });
        console.log(err);
      });
  });
});

module.exports = router;
