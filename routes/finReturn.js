
var express = require('express');
var router = express.Router();
var sql = require('mssql');
var sqlcon = sql.globalConnection;
var Promise = require('bluebird');

router.get('/', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query(`SELECT fr.*, u.UserName FROM dbo.FinishedReturn fr JOIN dbo.SystemUsers u ON u.UserID = fr.UserID`)
        .then(function (recordset) {
            res.json(recordset);
        }).catch(function (err) {
            if (err) { res.json({ error: err }); console.log(err); }
        })
});

router.get('/:id', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query(`SELECT fr.*, u.UserName FROM dbo.FinishedReturn fr JOIN dbo.SystemUsers u ON u.UserID = fr.UserID Where fr.FinReturnID = ${req.params.id}`)
        .then(function (recordset) {
            res.json(recordset);
        }).catch(function (err) {
            if (err) { res.json({ error: err }); console.log(err); }
        })
});

router.post('/', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var finRet = req.body.master;
    var details = req.body.details;
    var finRetID, serial;

    var conf = require('../SQLConfig');
    var connection = new sql.Connection(conf.config);
    connection.connect().then(function () {
        var trans = new sql.Transaction(connection);
        trans.begin()
            .then(function () {
                var promises = [];
                var request = trans.request(); //RecYear ,SerialNo ,ReturnDate ,ReturnFrom ,ReturnReason ,UserID
                request.input('RecYear', finRet.RecYear);
                request.input('SerialNo', finRet.SerialNo);
                request.input('ReturnDate', finRet.ReturnDate);
                request.input('ReturnFrom', finRet.ReturnFrom);
                request.input('ReturnReason', finRet.ReturnReason);
                request.input('SOID', finRet.SOID);
                request.input('UserID', finRet.UserID);
                request.execute('FinishReturnInsert')
                    .then(function (recordset, returnValue, affected) {
                        finRetID = recordset[0][0].FinReturnID;
                        serial = recordset[0][0].SerialNo;

                        promises.push(Promise.map(details, function (det) {
                            var request = trans.request();
                            request.input('RecYear', finRet.RecYear);
                            request.input('SerialNo', serial);
                            request.input('RecordDate', det.RecordDate);
                            request.input('ColorID', det.ColorID);
                            request.input('Quantity', det.Quantity);
                            request.input('BatchNo', det.BatchNo);
                            request.input('FinReturnID', finRetID);
                            request.input('FinReceivingID', det.FinReceivingID);
                            request.input('FinDispensingID', det.FinDispensingID);
                            request.input('FinRejectID', det.FinRejectID);
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
    var finRet = req.body.master;
    var details = req.body.details;

    var conf = require('../SQLConfig');
    var connection = new sql.Connection(conf.config);
    connection.connect().then(function () {
        var trans = new sql.Transaction(connection);
        trans.begin()
            .then(function () {
                var promises = [];
                var request = trans.request();
                request.input('FinReturnID', req.params.id);
                request.input('RecYear', finRet.RecYear);
                request.input('SerialNo', finRet.SerialNo);
                request.input('ReturnDate', finRet.ReturnDate);
                request.input('ReturnFrom', finRet.ReturnFrom);
                request.input('ReturnReason', finRet.ReturnReason);
                request.input('SOID', finRet.SOID);
                request.input('UserID', finRet.UserID);
                request.execute('FinishReturnUpdate').then(function (recordset, returnValue, affected) {

                    var request = trans.request();
                    request.query(`SELECT * From dbo.FinishedStoreDetails Where FinReturnID=${req.params.id}`)
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
                                request.input('RecYear', finRet.RecYear);
                                request.input('SerialNo', finRet.SerialNo);
                                request.input('RecordDate', det.RecordDate);
                                request.input('ColorID', det.ColorID);
                                request.input('Quantity', det.Quantity);
                                request.input('BatchNo', det.BatchNo);
                                request.input('FinReturnID', finRet.FinReturnID);
                                request.input('FinReceivingID', det.FinReceivingID);
                                request.input('FinDispensingID', det.FinDispensingID);
                                request.input('FinRejectID', det.FinRejectID);
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
                                request.input('Quantity', det.Quantity);
                                request.input('BatchNo', det.BatchNo);
                                request.input('FinReturnID', det.FinReturnID);
                                request.input('FinReceivingID', det.FinReceivingID);
                                request.input('FinDispensingID', det.FinDispensingID);
                                request.input('FinRejectID', det.FinRejectID);
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
                request.input('FinReturnID', req.params.id);
                request.execute('FinishReturnDelete')
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