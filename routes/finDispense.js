var express = require('express');
var router = express.Router();
var sql = require('mssql');
var jwt = require("jsonwebtoken");
var sqlcon = sql.globalPool;
var Promise = require('bluebird');

router.use(function (req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers["authorization"];
    var secret = req.body.salt || req.query.salt || req.headers["salt"];
    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, secret, function (err, decoded) {
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

router.get('/', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query(`SELECT fr.*, s.CustName , u.UserName, (SELECT SUM(ABS(Quantity)) FROM dbo.FinishedStoreDetails WHERE FinDispensingID = fr.FinDispensingID GROUP BY FinDispensingID) SumQty 
                FROM dbo.FinishedDispensing fr LEFT JOIN dbo.vwSalesOrderHeader s ON fr.SOID = s.SOID JOIN dbo.SystemUsers u ON u.UserID = fr.UserID`)
        .then(function (result) {
            res.json(result.recordset);
        }).catch(function (err) {
            if (err) {
                res.json({
                    error: err
                });
                console.log(err);
            }
        })
});

router.get('/:id', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query(`SELECT fr.*, s.CustName , u.UserName FROM dbo.FinishedDispensing fr LEFT JOIN dbo.vwSalesOrderHeader s ON fr.SOID = s.SOID 
                    JOIN dbo.SystemUsers u ON u.UserID = fr.UserID Where fr.FinDispensingID = ${req.params.id}`)
        .then(function (result) {
            res.json(result.recordset);
        }).catch(function (err) {
            if (err) {
                res.json({
                    error: err
                });
                console.log(err);
            }
        })
});

router.post('/', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var finDisp = req.body.master;
    var details = req.body.details;
    var finDispID, serial;

    var conf = require('../SQLConfig');
    var connection = new sql.Connection(conf.config);
    connection.connect().then(function () {
        var trans = new sql.Transaction(connection);
        trans.begin()
            .then(function () {
                var promises = [];
                var request = trans.request();
                request.input('RecYear', finDisp.RecYear);
                request.input('SerialNo', finDisp.SerialNo);
                request.input('DispensingDate', finDisp.DispensingDate);
                request.input('SOID', finDisp.SOID);
                request.input('DispenseTo', finDisp.DispenseTo);
                request.input('UserID', finDisp.UserID);
                request.execute('FinishDispensingInsert')
                    .then(function (result) {
                        finDispID = result.recordset[0].FinDispensingID;
                        serial = result.recordset[0].SerialNo;

                        promises.push(Promise.map(details, function (det) {
                            var request = trans.request();
                            console.log(det);
                            request.input('RecYear', finDisp.RecYear);
                            request.input('SerialNo', serial);
                            request.input('RecordDate', det.RecordDate);
                            request.input('ColorID', det.ColorID);
                            request.input('Quantity', -det.Quantity);
                            request.input('BatchNo', det.BatchNo);
                            request.input('FinDispensingID', finDispID);
                            request.input('FinReceivingID', det.FinReceivingID);
                            request.input('FinEqualizeID', det.FinEqualizeID);
                            request.input('FinReturnID', det.FinReturnID);
                            request.input('FinRejectID', det.FinRejectID);
                            request.input('UserID', det.UserID);
                            request.input('StoreTypeID', det.StoreTypeID);
                            return request.execute('FinishDetailInsert')
                        }));

                        Promise.all(promises)
                            .then(function (result) {
                                trans.commit().then(function () {
                                    res.json({
                                        returnValue: 1,
                                        affected: 1
                                    });
                                }).catch(function (err) {
                                    trans.rollback();
                                    res.json({
                                        error: err
                                    });
                                    console.log(err);
                                })
                            }).catch(function (err) {
                                trans.rollback();
                                console.log('Transaction Rolled Back');
                                res.json({
                                    error: err
                                });
                                console.log(err);
                            })
                    }).catch(function (err) {
                        trans.rollback();
                        console.log('Transaction Rolled Back');
                        res.json({
                            error: err
                        });
                        console.log(err);
                    })
            }).catch(function (err) {
                trans.rollback();
                console.log('Transaction Rolled Back');
                res.json({
                    error: err
                });
                console.log(err);
            })
    }).catch(function (err) {
        console.log('Connection Failed');
        res.json({
            error: err
        });
        console.log(err);
    })
});

router.put('/:id', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var finDisp = req.body.master;
    var details = req.body.details;

    var conf = require('../SQLConfig');
    var connection = new sql.Connection(conf.config);
    connection.connect().then(function () {
        var trans = new sql.Transaction(connection);
        trans.begin()
            .then(function () {
                var promises = [];
                var request = trans.request();
                request.input('FinDispensingID', req.params.id);
                request.input('RecYear', finDisp.RecYear);
                request.input('SerialNo', finDisp.SerialNo);
                request.input('DispensingDate', finDisp.DispensingDate);
                request.input('SOID', finDisp.SOID);
                request.input('DispenseTo', finDisp.DispenseTo);
                request.input('UserID', finDisp.UserID);
                request.execute('FinishDispensingUpdate').then(function (result) {

                    var request = trans.request();
                    request.query(`SELECT * From dbo.FinishedStoreDetails Where FinDispensingID=${req.params.id}`)
                        .then(function (result) {
                            var curDet = recordset;
                            console.log(curDet);
                            var addedList = details.filter(function (det) {
                                return !det.FinStoreID
                            });
                            console.log(addedList);
                            var deletedList = curDet.filter(function (cur) {
                                return !details.filter(function (newd) {
                                    return cur.FinStoreID == newd.FinStoreID
                                }).length > 0
                            })
                            console.log(deletedList);
                            var editedList = details.filter(function (newd) {
                                return curDet.filter(function (cur) {
                                    return cur.FinStoreID == newd.FinStoreID
                                }).length > 0
                            })
                            console.log(editedList);

                            promises.push(Promise.map(addedList, function (det) {
                                var request = trans.request();
                                request.input('RecYear', finDisp.RecYear);
                                request.input('SerialNo', finDisp.SerialNo);
                                request.input('RecordDate', det.RecordDate);
                                request.input('ColorID', det.ColorID);
                                request.input('Quantity', -det.Quantity);
                                request.input('BatchNo', det.BatchNo);
                                request.input('FinDispensingID', finDisp.FinDispensingID);
                                request.input('FinReceivingID', det.FinReceivingID);
                                request.input('FinEqualizeID', det.FinEqualizeID);
                                request.input('FinReturnID', det.FinReturnID);
                                request.input('FinRejectID', det.FinRejectID);
                                request.input('UserID', det.UserID);
                                request.input('StoreTypeID', det.StoreTypeID);
                                return request.execute('FinishDetailInsert');
                            }));
                            promises.push(Promise.map(editedList, function (det) {
                                var request = trans.request();
                                request.input('FinStoreID', det.FinStoreID);
                                request.input('RecYear', det.RecYear);
                                request.input('SerialNo', det.SerialNo);
                                request.input('RecordDate', det.RecordDate);
                                request.input('ColorID', det.ColorID);
                                request.input('Quantity', -det.Quantity);
                                request.input('BatchNo', det.BatchNo);
                                request.input('FinDispensingID', det.FinDispensingID);
                                request.input('FinReceivingID', det.FinReceivingID);
                                request.input('FinEqualizeID', det.FinEqualizeID);
                                request.input('FinReturnID', det.FinReturnID);
                                request.input('FinRejectID', det.FinRejectID);
                                request.input('UserID', det.UserID);
                                request.input('StoreTypeID', det.StoreTypeID);
                                return request.execute('FinishDetailUpdate');
                            }));
                            promises.push(Promise.map(deletedList, function (det) {
                                var request = trans.request();
                                request.input('FinStoreID', det.FinStoreID);
                                return request.execute('FinishDetailDelete');
                            }));

                            Promise.all(promises)
                                .then(function (result) {
                                    trans.commit().then(function () {
                                        res.json({
                                            returnValue: 1,
                                            affected: 1
                                        });
                                    }).catch(function (err) {
                                        trans.rollback();
                                        res.json({
                                            error: err
                                        });
                                        console.log(err);
                                    })
                                }).catch(function (err) {
                                    trans.rollback();
                                    console.log('Transaction Rolled Back');
                                    res.json({
                                        error: err
                                    });
                                    console.log(err);
                                })

                        }).catch(function (err) {
                            trans.rollback();
                            console.log('Transaction Rolled Back');
                            res.json({
                                error: err
                            });
                            console.log(err);
                        })
                });
            }).catch(function (err) {
                trans.rollback();
                console.log('Transaction Rolled Back');
                res.json({
                    error: err
                });
                console.log(err);
            })
    }).catch(function (err) {
        console.log('Connection Failed');
        res.json({
            error: err
        });
        console.log(err);
    })
});

router.delete('/:id', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var conf = require('../SQLConfig');
    var connection = new sql.Connection(conf.config);
    connection.connect().then(function () {
        var trans = new sql.Transaction(connection);
        trans.begin()
            .then(function () {
                var request = trans.request();
                request.input('FinDispensingID', req.params.id);
                request.execute('FinishDispensingDelete')
                    .then(function (result) {
                        trans.commit().then(function () {
                            res.json({
                                returnValue: 1,
                                affected: 1
                            });
                        }).catch(function (err) {
                            trans.rollback();
                            res.json({
                                error: err
                            });
                            console.log(err);
                        })
                    }).catch(function (err) {
                        trans.rollback();
                        console.log('Transaction Rolled Back');
                        res.json({
                            error: err
                        });
                        console.log(err);
                    })
            }).catch(function (err) {
                trans.rollback();
                console.log('Transaction Rolled Back');
                res.json({
                    error: err
                });
                console.log(err);
            })
    })
});

module.exports = router;