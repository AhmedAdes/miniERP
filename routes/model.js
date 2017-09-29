
var express = require('express');
var router = express.Router();
var sql = require('mssql');
var sqlcon = sql.globalConnection;
var Promise = require('bluebird');

router.get('/', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query(`Select c.*,b.BrandName,u.UserName FROM dbo.ProductModelCoding c 
                JOIN dbo.SystemUsers u on c.UserID = u.UserID JOIN dbo.ProductBrandCoding b ON b.BrandID = c.BrandID`)
        .then(function (recordset) {
            res.json(recordset);
        }).catch(function (err) {
            if (err) { res.json({ error: err }); console.log(err); }
        })
});

router.get('/:id', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query(`Select c.*,b.BrandName,u.UserName FROM dbo.ProductModelCoding c 
                JOIN dbo.SystemUsers u on c.UserID = u.UserID JOIN dbo.ProductBrandCoding b ON b.BrandID = c.BrandID 
                Where ModelID = '${req.params.id}'`)
        .then(function (recordset) {
            recordset[0].SelectedProductImgSrc = recordset[0].Photo === null ? null : new Buffer(recordset[0].Photo).toString('base64');
            res.json(recordset);
        }).catch(function (err) {
            if (err) { res.json({ error: err }); console.log(err); }
        })
});

router.post('/', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var model = req.body.model;
    var clrs = req.body.clrs;
    var sizes = req.body.sizes;
    var modelID;

    var conf = require('../SQLConfig');
    var connection = new sql.Connection(conf.config);
    connection.connect().then(function () {
        var trans = new sql.Transaction(connection);
        trans.begin()
            .then(function () {
                var promises = [];
                var request = trans.request();
                request.input('ModelName', model.ModelName);
                request.input('BrandID', model.BrandID);
                request.input('ProdType', model.ProdType);
                request.input('Photo', sql.Image, model.Photo === null ? null : new Buffer(model.Photo, 'base64'));
                request.input('PricePiece', model.PricePiece);
                request.input('PriceWholeSale', model.PriceWholeSale);
                request.input('PriceStores', model.PriceStores);
                request.input('UserID', model.UserID);
                request.execute('ModelInsert')
                    .then(function (recordset, returnValue, affected) {
                        modelID = recordset[0][0].ModelID;

                        promises.push(Promise.map(clrs, function (color) {
                            var request = trans.request();
                            request.input('Color', color.Color);
                            request.input('ColorName', color.ColorName);
                            request.input('ModelID', modelID);
                            request.input('UserID', model.UserID);
                            return request.execute('ColorInsert')
                        }));

                        promises.push(Promise.map(sizes, function (size) {
                            var request = trans.request();
                            request.input('SizeID', size.Size);
                            request.input('QuntPerDozen', size.QuntPerDozen);
                            request.input('ModelID', modelID);
                            request.input('UserID', size.UserID);
                            return request.execute('ProdSizeInsert')
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
                                console.log('Transaction Rolled Back Promise');
                                res.json({ error: err }); console.log(err);
                            })

                    }).catch(function (err) {
                        trans.rollback();
                        console.log('Transaction Rolled Back Insert');
                        res.json({ error: err }); console.log(err);
                    })

            }).catch(function (err) {
                trans.rollback();
                console.log('Transaction Rolled Back Transaction');
                res.json({ error: err }); console.log(err);
            })
    }).catch(function (err) {
        console.log('Connection Failed');
        res.json({ error: err }); console.log(err);
    })
});

router.put('/:id', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var model = req.body.model;
    var clrs = req.body.clrs;
    var sizes = req.body.sizes;

    var conf = require('../SQLConfig');
    var connection = new sql.Connection(conf.config);
    connection.connect().then(function () {
        var trans = new sql.Transaction(connection);
        trans.begin()
            .then(function () {
                var promises = [];
                var request = trans.request();
                request.input('ModelID', req.params.id);
                request.input('ModelName', model.ModelName);
                request.input('ProdType', model.ProdType);
                request.input('Photo', sql.Image, model.Photo === null ? null : new Buffer(model.Photo, 'base64'));
                request.input('PricePiece', model.PricePiece);
                request.input('PriceWholeSale', model.PriceWholeSale);
                request.input('PriceStores', model.PriceStores);
                request.input('UserID', model.UserID);
                request.execute('ModelUpdate')
                    .then(function (recordset, returnValue, affected) {

                        var request = trans.request();
                        request.query(`SELECT * From dbo.ProductColorCoding Where ModelID=${req.params.id}`)
                            .then(function (recordset) {
                                var clrsDet = recordset;
                                var addedClrList = clrs.filter(function (det) { return !det.ColorID });
                                var deletedClrList = clrsDet.filter(function (cur) { return !clrs.filter(function (newd) { return cur.ColorID == newd.ColorID }).length > 0 })
                                var editedClrList = clrs.filter(function (newd) { return clrsDet.filter(function (cur) { return cur.ColorID == newd.ColorID }).length > 0 })

                                promises.push(Promise.map(addedClrList, function (color) {
                                    var request = trans.request();
                                    request.input('Color', color.Color);
                                    request.input('ColorName', color.ColorName);
                                    request.input('ModelID', req.params.id);
                                    request.input('UserID', model.UserID);
                                    return request.execute('ColorInsert')
                                }));
                                promises.push(Promise.map(editedClrList, function (color) {
                                    var request = trans.request();
                                    request.input('ColorID', color.ColorID);
                                    request.input('Color', color.Color);
                                    request.input('ColorName', color.ColorName);
                                    request.input('ModelID', req.params.id);
                                    request.input('UserID', model.UserID);
                                    return request.execute('ColorUpdate')
                                }));
                                promises.push(Promise.map(deletedClrList, function (det) {
                                    var request = trans.request();
                                    request.input('ColorID', det.ColorID);
                                    return request.execute('ColorDelete');
                                }));
                                var request = trans.request();
                                request.query(`SELECT * From dbo.ProductSizes Where ModelID=${req.params.id}`)
                                    .then(function (recordset) {
                                        var sizDet = recordset;
                                        var addedSizList = sizes.filter(function (det) { return !det.ProdSizeID });
                                        var deletedSizList = sizDet.filter(function (cur) { return !sizes.filter(function (newd) { return cur.ProdSizeID == newd.ProdSizeID }).length > 0 })
                                        var editedSizList = sizes.filter(function (newd) { return sizDet.filter(function (cur) { return cur.ProdSizeID == newd.ProdSizeID }).length > 0 })

                                        promises.push(Promise.map(addedSizList, function (size) {
                                            var request = trans.request();
                                            request.input('SizeID', size.Size);
                                            request.input('QuntPerDozen', size.QuntPerDozen);
                                            request.input('ModelID', req.params.id);
                                            request.input('UserID', model.UserID);
                                            return request.execute('ProdSizeInsert')
                                        }));
                                        promises.push(Promise.map(editedSizList, function (size) {
                                            var request = trans.request();
                                            request.input('ProdSizeID', size.ProdSizeID);
                                            request.input('SizeID', size.Size);
                                            request.input('QuntPerDozen', size.QuntPerDozen);
                                            request.input('ModelID', req.params.id);
                                            request.input('UserID', model.UserID);
                                            return request.execute('ProdSizeUpdate')
                                        }));
                                        promises.push(Promise.map(deletedSizList, function (det) {
                                            var request = trans.request();
                                            request.input('ProdSizeID', det.ProdSizeID);
                                            return request.execute('ProdSizeDelete');
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
                                                console.log('Transaction Rolled Back Promise');
                                                res.json({ error: err }); console.log(err);
                                            })
                                    }).catch(function (err) {
                                        trans.rollback();
                                        console.log('Transaction Rolled Back Select2');
                                        res.json({ error: err }); console.log(err);
                                    })
                            }).catch(function (err) {
                                trans.rollback();
                                console.log('Transaction Rolled Back Select1');
                                res.json({ error: err }); console.log(err);
                            })
                    }).catch(function (err) {
                        trans.rollback();
                        console.log('Transaction Rolled Back Insert');
                        res.json({ error: err }); console.log(err);
                    })
            }).catch(function (err) {
                trans.rollback();
                console.log('Transaction Rolled Back Transaction');
                res.json({ error: err }); console.log(err);
            })
    }).catch(function (err) {
        console.log('Connection Failed');
        res.json({ error: err }); console.log(err);
    })
});

router.delete('/:id', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.input('ModelID', req.params.id);
    request.execute('ModelDelete', function (err, recordset, returnValue, affected) {
        if (err) { res.json({ error: err }); console.log(err); }
        else {
            res.json({ returnValue: returnValue, affected: affected });
        }
    });
});

function generateModelID() {
    var request = new sql.Request(sqlcon);
    request.query("SELECT (ISNULL(MAX(BrandID), 0) + 1) as max FROM dbo.ProductModelCoding")
        .then(function (recordset) {
            res.json(recordset);
        }).catch(function (err) {
            if (err) { res.json({ error: err }); console.log(err); }
        })
};

function padLeft(nr, n, str) {
    return Array(n - String(nr).length + 1).join(str || '0') + nr;
}

module.exports = router;