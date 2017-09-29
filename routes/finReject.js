
var express = require('express');
var router = express.Router();
var sql = require('mssql');
var sqlcon = sql.globalConnection;
var Promise = require('bluebird');

router.get('/', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query(`SELECT fr.*, u.UserName FROM dbo.FinishedReject fr JOIN dbo.SystemUsers u ON u.UserID = fr.UserID`)
        .then(function (recordset) {
            res.json(recordset);
        }).catch(function (err) {
            if (err) { res.json({ error: err }); console.log(err); }
        })
});

router.get('/:id', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query(`SELECT fr.*, u.UserName FROM dbo.FinishedReject fr JOIN dbo.SystemUsers u ON u.UserID = fr.UserID Where fr.FinRejectID = ${req.params.id}`)
        .then(function (recordset) {
            res.json(recordset);
        }).catch(function (err) {
            if (err) { res.json({ error: err }); console.log(err); }
        })
});

router.post('/', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var finRej = req.body.master;
    var details = req.body.details;
    var finRejID, serial;

    var conf = require('../SQLConfig');
    var connection = new sql.Connection(conf.config);
    connection.connect().then(function () {
        var trans = new sql.Transaction(connection);
        trans.begin()
            .then(function () {
                var promises = [];
                var request = trans.request(); //RecYear ,SerialNo ,RejectDate ,RejectReason ,UserID
                request.input('RecYear', finRej.RecYear);
                request.input('SerialNo', finRej.SerialNo);
                request.input('RejectDate', finRej.RejectDate);
                request.input('RejectReason', finRej.RejectReason);
                request.input('UserID', finRej.UserID);
                request.execute('FinishRejectInsert')
                    .then(function (recordset, returnValue, affected) {
                        finRejID = recordset[0][0].FinRejectID;
                        serial = recordset[0][0].SerialNo;

                        promises.push(Promise.map(details, function (det) {
                            var request = trans.request();
                            request.input('RecYear', finRej.RecYear);
                            request.input('SerialNo', serial);
                            request.input('RecordDate', det.RecordDate);
                            request.input('ColorID', det.ColorID);
                            request.input('Quantity', -det.Quantity);
                            request.input('BatchNo', det.BatchNo);
                            request.input('FinRejectID', finRejID);
                            request.input('FinReceivingID', det.FinReceivingID);
                            request.input('FinDispensingID', det.FinDispensingID);
                            request.input('FinReturnID', det.FinReturnID);
                            request.input('FinEqualizeID', det.FinEqualizeID);
                            request.input('UserID', det.UserID);
                            request.input('StoreTypeID', det.StoreTypeID);
                            return request.execute('FinishDetailInsert')
                        }));

                        Promise.all(promises)
                            .then(function (recordset) {
                                trans.commit().then(function () {
                                    res.json({ returnValue: 1, affected: 1 });
                                }).catch(function (err) {
                                    trans.rollback();
                                    res.json({ error: err }); console.log(err);
                                })
                            }).catch(function (err) {
                                trans.rollback();
                                console.log('Transaction Rolled Back');
                                res.json({ error: err }); console.log(err);
                            })
                    }).catch(function (err) {
                        trans.rollback();
                        console.log('Transaction Rolled Back');
                        res.json({ error: err }); console.log(err);
                    })
            }).catch(function (err) {
                trans.rollback();
                console.log('Transaction Rolled Back');
                res.json({ error: err }); console.log(err);
            })
    }).catch(function (err) {
        console.log('Connection Failed');
        res.json({ error: err }); console.log(err);
    })
});

router.put('/:id', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var finRej = req.body.master;
    var details = req.body.details;

    var conf = require('../SQLConfig');
    var connection = new sql.Connection(conf.config);
    connection.connect().then(function () {
        var trans = new sql.Transaction(connection);
        trans.begin()
            .then(function () {
                var promises = [];
                var request = trans.request();
                request.input('FinRejectID', req.params.id);
                request.input('RecYear', finRej.RecYear);
                request.input('SerialNo', finRej.SerialNo);
                request.input('EqualizeDate', finRej.EqualizeDate);
                request.input('EqualizeType', finRej.DispenseTo);
                request.input('UserID', finRej.UserID);
                request.execute('FinishRejectUpdate').then(function (recordset, returnValue, affected) {

                    var request = trans.request();
                    request.query(`SELECT * From dbo.FinishedStoreDetails Where FinRejectID=${req.params.id}`)
                        .then(function (recordset) {
                            var curDet = recordset;
                            console.log(curDet);
                            var addedList = details.filter(function (det) { return !det.FinStoreID });
                            console.log(addedList);
                            var deletedList = curDet.filter(function (cur) { return !details.filter(function (newd) { return cur.FinStoreID == newd.FinStoreID }).length > 0 })
                            console.log(deletedList);
                            var editedList = details.filter(function (newd) { return curDet.filter(function (cur) { return cur.FinStoreID == newd.FinStoreID }).length > 0 })
                            console.log(editedList);

                            promises.push(Promise.map(addedList, function (det) {
                                var request = trans.request();
                                request.input('RecYear', finRej.RecYear);
                                request.input('SerialNo', finRej.SerialNo);
                                request.input('RecordDate', det.RecordDate);
                                request.input('ColorID', det.ColorID);
                                request.input('Quantity', -det.Quantity);
                                request.input('BatchNo', det.BatchNo);
                                request.input('FinRejectID', finRej.FinRejectID);
                                request.input('FinReceivingID', det.FinReceivingID);
                                request.input('FinDispensingID', det.FinDispensingID);
                                request.input('FinReturnID', det.FinReturnID);
                                request.input('FinEqualizeID', det.FinEqualizeID);
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
                                request.input('FinRejectID', det.FinRejectID);
                                request.input('FinReceivingID', det.FinReceivingID);
                                request.input('FinDispensingID', det.FinDispensingID);
                                request.input('FinReturnID', det.FinReturnID);
                                request.input('FinEqualizeID', det.FinEqualizeID);
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
                                .then(function (recordset) {
                                    trans.commit().then(function () {
                                        res.json({ returnValue: 1, affected: 1 });
                                    }).catch(function (err) {
                                        trans.rollback();
                                        res.json({ error: err }); console.log(err);
                                    })
                                }).catch(function (err) {
                                    trans.rollback();
                                    console.log('Transaction Rolled Back');
                                    res.json({ error: err }); console.log(err);
                                })

                        }).catch(function (err) {
                            trans.rollback();
                            console.log('Transaction Rolled Back');
                            res.json({ error: err }); console.log(err);
                        })
                });
            }).catch(function (err) {
                trans.rollback();
                console.log('Transaction Rolled Back');
                res.json({ error: err }); console.log(err);
            })
    }).catch(function (err) {
        console.log('Connection Failed');
        res.json({ error: err }); console.log(err);
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
                request.input('FinRejectID', req.params.id);
                request.execute('FinishRejectDelete')
                    .then(function (recordset) {
                        trans.commit().then(function () {
                            res.json({ returnValue: 1, affected: 1 });
                        }).catch(function (err) {
                            trans.rollback();
                            res.json({ error: err }); console.log(err);
                        })
                    }).catch(function (err) {
                        trans.rollback();
                        console.log('Transaction Rolled Back');
                        res.json({ error: err }); console.log(err);
                    })
            }).catch(function (err) {
                trans.rollback();
                console.log('Transaction Rolled Back');
                res.json({ error: err }); console.log(err);
            })
    })
});

module.exports = router;