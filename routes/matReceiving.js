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
    request.query(`SELECT fr.*, u.UserName, c.MaterialID,c.MaterialName,c.Category,c.Unit, det.Quantity, det.QCNO, det.UnitPrice 
FROM dbo.MaterialReceiving fr JOIN dbo.MaterialStoreDetails det ON det.MatReceivingID = fr.MatReceivingID 
JOIN dbo.MaterialCoding c ON c.MaterialID = det.MaterialID JOIN dbo.SystemUsers u ON u.UserID = fr.UserID`)
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

router.get('/:id(\\d+)', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query(`SELECT fr.*, u.UserName, c.MaterialID,c.MaterialName,c.Category,c.Unit, det.Quantity, det.QCNO, det.UnitPrice 
FROM dbo.MaterialReceiving fr JOIN dbo.MaterialStoreDetails det ON det.MatReceivingID = fr.MatReceivingID 
JOIN dbo.MaterialCoding c ON c.MaterialID = det.MaterialID JOIN dbo.SystemUsers u ON u.UserID = fr.UserID Where fr.MatReceivingID = ${req.params.id}`)
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
    var matrec = req.body.master;
    var details = req.body.details;
    var matRecID, serial;

    var conf = require('../SQLConfig');
    var connection = new sql.Connection(conf.config);
    connection.connect().then(function () {
        var trans = new sql.Transaction(connection);
        trans.begin()
            .then(function () {
                var promises = [];
                var request = trans.request(); //RecYear ,SerialNo ,ReceivingDate ,ManfDate ,POID ,InvoiceNo ,InvoiceDate ,QCNO ,UserID ,InspID
                request.input('RecYear', matrec.RecYear);
                request.input('SerialNo', matrec.SerialNo);
                request.input('ReceivingDate', matrec.ReceivingDate);
                request.input('ManfDate', matrec.ManfDate);
                request.input('POID', matrec.POID);
                request.input('InvoiceNo', matrec.InvoiceNo);
                request.input('InvoiceDate', matrec.InvoiceDate);
                request.input('QCNO', matrec.QCNO);
                request.input('InspID', matrec.InspID);
                request.input('UserID', matrec.UserID);
                request.execute('MaterialReceivingInsert')
                    .then(function (recordset) {
                        matRecID = recordset[0][0].MatReceivingID;
                        serial = recordset[0][0].SerialNo;

                        promises.push(Promise.map(details, function (det) {
                            var request = trans.request();
                            //RecYear ,SerialNo ,RecordDate ,MaterialID ,Quantity ,QCNO ,UnitPrice ,MatReceivingID ,ProdOrdID ,MatDispensingID ,
                            //MatEqualizeID ,MatReturnID ,UserID ,SupplierBatchNo
                            request.input('RecYear', matrec.RecYear);
                            request.input('SerialNo', serial);
                            request.input('RecordDate', det.RecordDate);
                            request.input('MaterialID', det.MaterialID);
                            request.input('Quantity', det.Quantity);
                            request.input('QCNO', det.QCNO);
                            request.input('UnitPrice', det.UnitPrice);
                            request.input('MatReceivingID', matRecID);
                            request.input('MatDispensingID', det.MatDispensingID);
                            request.input('MatEqualizeID', det.MatEqualizeID);
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
    var matrec = req.body.master;
    var details = req.body.details;

    var conf = require('../SQLConfig');
    var connection = new sql.Connection(conf.config);
    connection.connect().then(function () {
        var trans = new sql.Transaction(connection);
        trans.begin()
            .then(function () {
                var promises = [];
                var request = trans.request();
                request.input('MatReceivingID', req.params.id);
                request.input('RecYear', matrec.RecYear);
                request.input('SerialNo', matrec.SerialNo);
                request.input('ReceivingDate', matrec.ReceivingDate);
                request.input('ManfDate', matrec.ManfDate);
                request.input('POID', matrec.POID);
                request.input('InvoiceNo', matrec.InvoiceNo);
                request.input('InvoiceDate', matrec.InvoiceDate);
                request.input('QCNO', matrec.QCNO);
                request.input('InspID', matrec.InspID);
                request.input('UserID', matrec.UserID);
                request.execute('MaterialReceivingUpdate').then(function (recordset) {

                    var request = trans.request();
                    request.query(`SELECT * From dbo.MaterialStoreDetails Where MatReceivingID=${req.params.id}`)
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
                                request.input('RecYear', matrec.RecYear);
                                request.input('SerialNo', matrec.SerialNo);
                                request.input('RecordDate', det.RecordDate);
                                request.input('MaterialID', det.MaterialID);
                                request.input('Quantity', det.Quantity);
                                request.input('QCNO', det.QCNO);
                                request.input('UnitPrice', det.UnitPrice);
                                request.input('MatReceivingID', matrec.MatReceivingID);
                                request.input('MatDispensingID', det.MatDispensingID);
                                request.input('MatEqualizeID', det.MatEqualizeID);
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
                                request.input('Quantity', det.Quantity);
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
                request.input('MatReceivingID', req.params.id);
                request.execute('MaterialReceivingDelete')
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