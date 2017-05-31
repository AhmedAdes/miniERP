
var express = require('express');
var router = express.Router();
var sql = require('mssql');
var Promise = require('bluebird');
var sqlcon = sql.globalConnection;

router.get('/', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query(`Select * FROM dbo.vwSalesOrderHeader`)
        .then(function (recordset) { res.json(recordset); })
        .catch(function (err) { res.json({ error: err }); console.log(err); })
});

router.get('/:id(\\d+)', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query(`Select * FROM dbo.vwSalesOrderHeader Where SOID = ${req.params.id}`)
        .then(function (recordset) { res.json(recordset); })
        .catch(function (err) { res.json({ error: err }); console.log(err); });
});

router.post('/', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var so = req.body.master;
    var sod = req.body.details;
    var pays = req.body.payments;
    var SOrderID;
    var conf = require('../SQLconfig');
    var connection = new sql.Connection(conf.config);

    connection.connect().then(function () {
        var trans = new sql.Transaction(connection);
        trans.begin()
            .then(function () {
                var promises = [];
                var request = trans.request();
                request.input('SODate', so.SODate);
                request.input('CustID', so.CustID);
                request.input('SalesTax', so.SalesTax);
                request.input('Discount', so.Discount);
                request.input('Notes', so.Notes);
                request.input('DeliveryDate', so.DeliveryDate);
                request.input('Commisioner', so.Commisioner);
                request.input('CommisionerTel', so.CommisionerTel);
                request.input('DeliveryType', so.DeliveryType);
                request.input('PayMethod', so.PayMethod);
                request.input('GrandTotal', so.GrandTotal);
                request.input('SalesRepID', so.SalesRepID);
                request.input('UserID', so.UserID);
                request.execute('SalesHeaderInsert')
                    .then(function (recordset) {
                        SOrderID = recordset[0][0].SOID;
                        console.log('SOID: ' + SOrderID);

                        promises.push(Promise.map(sod, function (det) {
                            var request = trans.request();
                            request.input('SOID', SOrderID);
                            request.input('Quantity', det.Quantity);
                            request.input('Price', det.Price);
                            request.input('ColorID', det.ColorID);
                            request.input('UserID', det.UserID);
                            return request.execute('SalesDetailInsert')
                        }));

                        promises.push(Promise.map(pays, function (pay) {
                            var request = trans.request();
                            request.input('SOID', SOrderID);
                            request.input('PaymentDate', pay.PaymentDate);
                            request.input('PayAmount', pay.PayAmount);
                            request.input('CommisionPaymentDate', pay.CommisionPaymentDate);
                            request.input('CommisionAmount', pay.CommisionAmount);
                            request.input('Paid', pay.Paid);
                            request.input('CommsionPaid', pay.CommsionPaid);
                            request.input('UserID', pay.UserID);
                            return request.execute('SalesPaymentInsert')
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
                        res.json({ error: err }); console.log(err);
                    })
            }).catch(function (err) {
                trans.rollback();
                res.json({ error: err }); console.log(err);
            })
    }).catch(function (err) {
        res.json({ error: err }); console.log(err); connection.close();
    });
});

router.put('/:id', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var so = req.body.master;
    var sod = req.body.details;
    var pays = req.body.payments;
    var SOrderID;
    var conf = require('../SQLconfig');
    var connection = new sql.Connection(conf.config);

    connection.connect().then(function () {
        var trans = new sql.Transaction(connection);
        trans.begin()
            .then(function () {
                var promises = [];
                var request = trans.request();
                request.input('SOID', req.params.id);
                request.input('SODate', so.SODate);
                request.input('CustID', so.CustID);
                request.input('SalesTax', so.SalesTax);
                request.input('Discount', so.Discount);
                request.input('Notes', so.Notes);
                request.input('DeliveryDate', so.DeliveryDate);
                request.input('Commisioner', so.Commisioner);
                request.input('CommisionerTel', so.CommisionerTel);
                request.input('DeliveryType', so.DeliveryType);
                request.input('PayMethod', so.PayMethod);
                request.input('GrandTotal', so.GrandTotal);
                request.input('SalesRepID', so.SalesRepID);
                request.input('UserID', so.UserID);
                request.execute('SalesHeaderUpdate')
                    .then(function (recordset) {
                        console.log('Sales Order Updated');
                        var request = trans.request();
                        request.input('SOID', req.params.id);
                        promises.push(request.execute('SalesDetailDelete'));
                        var request = trans.request();
                        request.input('SOID', req.params.id);
                        promises.push(request.execute('SalesPaymentDelete'));

                        promises.push(Promise.map(sod, function (det) {
                            var request = trans.request();
                            request.input('SOID', req.params.id);
                            request.input('Quantity', det.Quantity);
                            request.input('Price', det.Price);
                            request.input('ColorID', det.ColorID);
                            request.input('UserID', det.UserID);
                            return request.execute('SalesDetailInsert')
                        }));

                        promises.push(Promise.map(pays, function (pay) {
                            var request = trans.request();
                            request.input('SOID', req.params.id);
                            request.input('PaymentDate', pay.PaymentDate);
                            request.input('PayAmount', pay.PayAmount);
                            request.input('CommisionPaymentDate', pay.CommisionPaymentDate);
                            request.input('CommisionAmount', pay.CommisionAmount);
                            request.input('Paid', pay.Paid);
                            request.input('CommsionPaid', pay.CommsionPaid);
                            request.input('UserID', pay.UserID);
                            return request.execute('SalesPaymentInsert')
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
                        res.json({ error: err }); console.log(err);
                    })
            }).catch(function (err) {
                trans.rollback();
                res.json({ error: err }); console.log(err);
            })
    }).catch(function (err) {
        res.json({ error: err }); console.log(err); connection.close();
    });
});

router.delete('/:id', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.input('SOID', req.params.id);
    request.execute('SalesHeaderDelete', function (err, recordset, returnValue, affected) {
        if (err) { res.json({ error: err }); console.log(err); }
        else {
            res.json({ returnValue: returnValue, affected: affected });
        }
    });
});

module.exports = router;