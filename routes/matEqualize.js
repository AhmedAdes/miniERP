var express = require('express');
var router = express.Router();
var sql = require('mssql');
var jwt = require("jsonwebtoken");
var sqlcon = sql.globalConnection;
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
    request.query(`SELECT fr.*, u.UserName FROM dbo.MatStoreEqualization fr JOIN dbo.SystemUsers u ON u.UserID = fr.UserID`)
        .then(function (recordset) {
            res.json(recordset);
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
    request.query(`SELECT fr.*, u.UserName FROM dbo.MatStoreEqualization fr JOIN dbo.SystemUsers u ON u.UserID = fr.UserID Where fr.MatEqualizeID = ${req.params.id}`)
        .then(function (recordset) {
            res.json(recordset);
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
    var matEqul = req.body.master;
    var details = req.body.details;
    var matEqulID, serial;

    var conf = require('../SQLConfig');
    var connection = new sql.Connection(conf.config);
    connection.connect().then(function () {
        var trans = new sql.Transaction(connection);
        trans.begin()
            .then(function () {
                var promises = [];
                var request = trans.request(); //RecYear ,SerialNo ,EqualizeDate ,EqualizeType ,UserID
                request.input('RecYear', matEqul.RecYear);
                request.input('SerialNo', matEqul.SerialNo);
                request.input('EqualizeDate', matEqul.EqualizeDate);
                request.input('EqualizeType', matEqul.EqualizeType);
                request.input('UserID', matEqul.UserID);
                request.input('Category', matEqul.Category);
                request.execute('MaterialEqualizationInsert')
                    .then(function (recordset) {
                        matEqulID = recordset[0][0].MatEqualizeID;
                        serial = recordset[0][0].SerialNo;

                        promises.push(Promise.map(details, function (det) {
                            var request = trans.request();
                            request.input('RecYear', matEqul.RecYear);
                            request.input('SerialNo', serial);
                            request.input('RecordDate', det.RecordDate);
                            request.input('MaterialID', det.MaterialID);
                            request.input('Quantity', matEqul.EqualizeType == 'Decrease' ? -det.Quantity : det.Quantity);
                            request.input('QCNO', det.QCNO);
                            request.input('UnitPrice', det.UnitPrice);
                            request.input('MatReceivingID', det.MatReceivingID);
                            request.input('MatDispensingID', det.MatDispensingID);
                            request.input('MatEqualizeID', matEqulID);
                            request.input('MatReturnID', det.MatReturnID);
                            request.input('ProdOrdID', det.ProdOrdID);
                            request.input('SupplierBatchNo', det.SupplierBatchNo);
                            request.input('UserID', det.UserID);
                            return request.execute('MaterialDetailInsert')
                        }));

                        Promise.all(promises)
                            .then(function (recordset) {
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
    var matEqul = req.body.master;
    var details = req.body.details;

    var conf = require('../SQLConfig');
    var connection = new sql.Connection(conf.config);
    connection.connect().then(function () {
        var trans = new sql.Transaction(connection);
        trans.begin()
            .then(function () {
                var promises = [];
                var request = trans.request();
                request.input('MatEqualizeID', req.params.id);
                request.input('RecYear', matEqul.RecYear);
                request.input('SerialNo', matEqul.SerialNo);
                request.input('EqualizeDate', matEqul.EqualizeDate);
                request.input('EqualizeType', matEqul.EqualizeType);
                request.input('UserID', matEqul.UserID);
                request.execute('MaterialEqualizationUpdate').then(function (recordset) {

                    var request = trans.request();
                    request.query(`SELECT * From dbo.MaterialStoreDetails Where MatEqualizeID=${req.params.id}`)
                        .then(function (recordset) {
                            var curDet = recordset;
                            console.log(curDet);
                            var addedList = details.filter(function (det) {
                                return !det.MatStoreID
                            });
                            console.log(addedList);
                            var deletedList = curDet.filter(function (cur) {
                                return !details.filter(function (newd) {
                                    return cur.MatStoreID == newd.MatStoreID
                                }).length > 0
                            })
                            console.log(deletedList);
                            var editedList = details.filter(function (newd) {
                                return curDet.filter(function (cur) {
                                    return cur.MatStoreID == newd.MatStoreID
                                }).length > 0
                            })
                            console.log(editedList);

                            promises.push(Promise.map(addedList, function (det) {
                                var request = trans.request();
                                request.input('RecYear', matEqul.RecYear);
                                request.input('SerialNo', matEqul.SerialNo);
                                request.input('RecordDate', det.RecordDate);
                                request.input('MaterialID', det.MaterialID);
                                request.input('Quantity', matEqul.EqualizeType == 'Decrease' ? -det.Quantity : det.Quantity);
                                request.input('QCNO', det.QCNO);
                                request.input('UnitPrice', det.UnitPrice);
                                request.input('MatReceivingID', det.MatReceivingID);
                                request.input('MatDispensingID', det.MatDispensingID);
                                request.input('MatEqualizeID', matEqul.MatEqualizeID);
                                request.input('MatReturnID', det.MatReturnID);
                                request.input('ProdOrdID', det.ProdOrdID);
                                request.input('SupplierBatchNo', det.SupplierBatchNo);
                                request.input('UserID', det.UserID);
                                return request.execute('MaterialDetailInsert');
                            }));
                            promises.push(Promise.map(editedList, function (det) {
                                var request = trans.request();
                                request.input('MatStoreID', det.MatStoreID);
                                request.input('RecYear', det.RecYear);
                                request.input('SerialNo', det.SerialNo);
                                request.input('RecordDate', det.RecordDate);
                                request.input('MaterialID', det.MaterialID);
                                request.input('Quantity', matEqul.EqualizeType == 'Decrease' ? -det.Quantity : det.Quantity);
                                request.input('QCNO', det.QCNO);
                                request.input('UnitPrice', det.UnitPrice);
                                request.input('MatReceivingID', det.MatReceivingID);
                                request.input('MatDispensingID', det.MatDispensingID);
                                request.input('MatEqualizeID', det.MatEqualizeID);
                                request.input('MatReturnID', det.MatReturnID);
                                request.input('ProdOrdID', det.ProdOrdID);
                                request.input('SupplierBatchNo', det.SupplierBatchNo);
                                request.input('UserID', det.UserID);
                                return request.execute('MaterialDetailUpdate');
                            }));
                            promises.push(Promise.map(deletedList, function (det) {
                                var request = trans.request();
                                request.input('MatStoreID', det.MatStoreID);
                                return request.execute('MaterialDetailDelete');
                            }));

                            Promise.all(promises)
                                .then(function (recordset) {
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
                request.input('MatEqualizeID', req.params.id);
                request.execute('MaterialEqualizationDelete')
                    .then(function (recordset) {
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