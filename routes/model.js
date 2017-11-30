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
    request.query(`Select c.*,b.BrandName,u.UserName,c.WashID, w.WashType FROM dbo.ProductModelCoding c 
                JOIN dbo.SystemUsers u on c.UserID = u.UserID 
                JOIN dbo.ProductBrandCoding b ON b.BrandID = c.BrandID
                Left JOIN dbo.WashTypes w ON w.WashID = c.WashID`)
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
    request.query(`Select c.*,b.BrandName,u.UserName,c.WashID, w.WashType FROM dbo.ProductModelCoding c 
                JOIN dbo.SystemUsers u on c.UserID = u.UserID 
                JOIN dbo.ProductBrandCoding b ON b.BrandID = c.BrandID
                Left JOIN dbo.WashTypes w ON w.WashID = c.WashID
                Where ModelID = '${req.params.id}'`)
        .then(function (result) {
            result.recordset[0].SelectedProductImgSrc = result.recordset[0].Photo == null ? null : new Buffer(result.recordset[0].Photo).toString('base64');
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
router.get('/withColors/all', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query(`SELECT DISTINCT m.ModelID, m.ModelCode,m.ModelName, c.ColorName ,c.ColorID , fdet.BatchNo, 
                    fdet.StoreTypeID, (SELECT StoreType FROM StoreTypes WHERE StoreTypeID=fdet.StoreTypeID) StoreType, 0 Quantity, 
                    (SELECT SUM(Quantity)  FROM dbo.FinishedStoreDetails Where ColorID = c.ColorID AND BatchNo = fdet.BatchNo GROUP BY BatchNo) Stock
                FROM dbo.ProductModelCoding m JOIN dbo.ProductColorCoding c ON c.ModelID = m.ModelID
                JOIN dbo.FinishedStoreDetails fdet ON fdet.ColorID = c.ColorID
                GROUP BY m.ModelID, m.ModelCode,m.ModelName, c.ColorName ,c.ColorID , fdet.BatchNo, fdet.StoreTypeID`)
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
    var model = req.body.model;
    var clrs = req.body.clrs;
    var sizes = req.body.sizes;
    var modelID;

    var conf = require('../SQLConfig');
    var connection = new sql.ConnectionPool(conf.config);
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
                request.input('WashID', model.WashID);
                request.input('UserID', model.UserID);
                request.execute('ModelInsert')
                    .then(function (result) {
                        modelID = result.recordset[0].ModelID;

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
                                console.log('Transaction Rolled Back Promise');
                                res.json({
                                    error: err
                                });
                                console.log(err);
                            })

                    }).catch(function (err) {
                        trans.rollback();
                        console.log('Transaction Rolled Back Insert');
                        res.json({
                            error: err
                        });
                        console.log(err);
                    })

            }).catch(function (err) {
                trans.rollback();
                console.log('Transaction Rolled Back Transaction');
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
    var model = req.body.model;
    var clrs = req.body.clrs;
    var sizes = req.body.sizes;

    var conf = require('../SQLConfig');
    var connection = new sql.ConnectionPool(conf.config);
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
                request.input('WashID', model.WashID);
                request.input('UserID', model.UserID);
                request.execute('ModelUpdate')
                    .then(function (result) {

                        var request = trans.request();
                        request.query(`SELECT * From dbo.ProductColorCoding Where ModelID=${req.params.id}`)
                            .then(function (result) {
                                var clrsDet = recordset;
                                var addedClrList = clrs.filter(function (det) {
                                    return !det.ColorID
                                });
                                var deletedClrList = clrsDet.filter(function (cur) {
                                    return !clrs.filter(function (newd) {
                                        return cur.ColorID == newd.ColorID
                                    }).length > 0
                                })
                                var editedClrList = clrs.filter(function (newd) {
                                    return clrsDet.filter(function (cur) {
                                        return cur.ColorID == newd.ColorID
                                    }).length > 0
                                })

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
                                    .then(function (result) {
                                        var sizDet = recordset;
                                        var addedSizList = sizes.filter(function (det) {
                                            return !det.ProdSizeID
                                        });
                                        var deletedSizList = sizDet.filter(function (cur) {
                                            return !sizes.filter(function (newd) {
                                                return cur.ProdSizeID == newd.ProdSizeID
                                            }).length > 0
                                        })
                                        var editedSizList = sizes.filter(function (newd) {
                                            return sizDet.filter(function (cur) {
                                                return cur.ProdSizeID == newd.ProdSizeID
                                            }).length > 0
                                        })

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
                                                console.log('Transaction Rolled Back Promise');
                                                res.json({
                                                    error: err
                                                });
                                                console.log(err);
                                            })
                                    }).catch(function (err) {
                                        trans.rollback();
                                        console.log('Transaction Rolled Back Select2');
                                        res.json({
                                            error: err
                                        });
                                        console.log(err);
                                    })
                            }).catch(function (err) {
                                trans.rollback();
                                console.log('Transaction Rolled Back Select1');
                                res.json({
                                    error: err
                                });
                                console.log(err);
                            })
                    }).catch(function (err) {
                        trans.rollback();
                        console.log('Transaction Rolled Back Insert');
                        res.json({
                            error: err
                        });
                        console.log(err);
                    })
            }).catch(function (err) {
                trans.rollback();
                console.log('Transaction Rolled Back Transaction');
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
    var request = new sql.Request(sqlcon);
    request.input('ModelID', req.params.id);
    request.execute('ModelDelete', function (err, result) {
        if (err) {
            res.json({
                error: err
            });
            console.log(err);
        } else {
            res.json({
                returnValue: result.returnValue,
                affected: result.rowsAffected[0]
            });
        }
    });
});

function generateModelID() {
    var request = new sql.Request(sqlcon);
    request.query("SELECT (ISNULL(MAX(BrandID), 0) + 1) as max FROM dbo.ProductModelCoding")
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
};

function padLeft(nr, n, str) {
    return Array(n - String(nr).length + 1).join(str || '0') + nr;
}

module.exports = router;