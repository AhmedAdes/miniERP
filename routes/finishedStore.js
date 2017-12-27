var express = require('express');
var router = express.Router();
var sql = require('mssql');
var jwt = require("jsonwebtoken");
var sqlcon = sql.globalConnection;

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
    request.query(`Select * From dbo.vwFinishStore ORDER BY ModelCode, ColorName, StoreTypeID, BatchNo`)
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

router.get('/storeBlnce/all', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query(`Select ModelID ,ModelName ,ModelCode ,ColorName ,ColorID ,BatchNo ,StoreTypeID ,StoreType,
    (SELECT ISNULL(SUM(Quantity), 0) FROM dbo.FinishedStoreDetails 
        WHERE FinReceivingID IS NOT NULL AND ColorID=f.ColorID AND StoreTypeID=f.StoreTypeID AND BatchNo=f.BatchNo) ReceivingQty,
    (SELECT ISNULL(SUM(ABS(Quantity)), 0) FROM dbo.FinishedStoreDetails 
        WHERE FinDispensingID IS NOT NULL AND ColorID=f.ColorID AND StoreTypeID=f.StoreTypeID AND BatchNo=f.BatchNo) DispensingQty,
    (SELECT ISNULL(SUM(Quantity), 0) FROM dbo.FinishedStoreDetails 
        WHERE FinEqualizeID IS NOT NULL AND ColorID=f.ColorID AND StoreTypeID=f.StoreTypeID AND BatchNo=f.BatchNo) EqualizeQty,
    (SELECT ISNULL(SUM(Quantity), 0) FROM dbo.FinishedStoreDetails 
        WHERE FinTransferID IS NOT NULL AND ColorID=f.ColorID AND StoreTypeID=f.StoreTypeID AND BatchNo=f.BatchNo) TransferQty,
    Quantity 
    FROM dbo.vwFinishStore f
    ORDER BY ModelCode, ColorName, StoreTypeID, BatchNo`)
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
    request.query(`Select * From dbo.vwFinishStore Where BrandID='${req.params.id}'`)
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
router.get('/strBlncByDate/:indate', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query(`Select * From dbo.fncFinishStoreByDate('${req.params.indate}') ORDER BY ModelCode, ColorName, StoreTypeID, BatchNo`)
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
router.get('/strBlncByDateZero/:indate', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query(`Select * From dbo.fncFinishStoreByDate('${req.params.indate}') where Quantity > 0 ORDER BY ModelCode, ColorName, StoreTypeID, BatchNo`)
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
router.get('/storeBalanceReport/:all', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query("Select * From dbo.vwFinishStore where Quantity > 0 ORDER BY ModelCode, ColorName, StoreTypeID, BatchNo")
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
router.get('/BalanceSubDet/:all', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.multiple = true;
    request.query(`Select ABS(SUM(s.Quantity * ISNULL(m.PricePiece, 0))) SumPiecePrice FROM dbo.vwFinishStore s JOIN dbo.ProductModelCoding m ON m.ModelID = s.ModelID AND s.StoreTypeID = 1;
                   Select ABS(SUM(s.Quantity * ISNULL(m.PriceStores,0))) SumStoresPrice FROM dbo.vwFinishStore s JOIN dbo.ProductModelCoding m ON m.ModelID = s.ModelID AND s.StoreTypeID = 1;
                   SELECT ABS(SUM(s.Quantity * ISNULL(m.PriceWholeSale,0))) SumWholeSalePrice FROM dbo.vwFinishStore s JOIN dbo.ProductModelCoding m ON m.ModelID = s.ModelID AND s.StoreTypeID = 1;`,
        function (err, recordset) {
            if (err) {
                res.json({
                    error: err
                });
                console.log(err);
            }
            res.json({
                piece: recordset[0],
                store: recordset[1],
                whole: recordset[2]
            });
        })
});
router.get('/ProdHistoryMod/:id', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.multiple = true;
    request.input("ModelID", req.params.id)
    request.query(`SELECT * FROM dbo.vwFinProductActivity WHERE ModelID = @ModelID;
                    SELECT sd.SOID ,sh.SODate ,Quantity ,Price ,ColorID ,ColorName ,ModelID ,ModelCode ,ModelName, c.CustName, c.ContactPerson, sh.GrandTotal 
                    FROM dbo.vwSalesOrderDetail sd JOIN dbo.SalesOrderHeader sh ON sh.SOID = sd.SOID JOIN dbo.Customers c ON c.CustID = sh.CustID
                    WHERE ModelID = @ModelID;
                    SELECT ISNULL(SUM(Quantity),0) StockQty FROM dbo.FinishedStoreDetails d JOIN dbo.ProductColorCoding c ON c.ColorID = d.ColorID Where ModelID = @ModelID;`,
        function (err, recordset) {
            if (err) {
                res.json({
                    error: err
                });
                console.log(err);
            }
            res.json({
                finRec: recordset[0].filter(f => f.FinReceivingID != null),
                finDisp: recordset[0].filter(f => f.FinDispensingID != null),
                finEqz: recordset[0].filter(f => f.FinEqualizeID != null),
                finRet: recordset[0].filter(f => f.FinReturnID != null),
                finRej: recordset[0].filter(f => f.FinRejectID != null),
                sales: recordset[1],
                stock: recordset[2]
            });
        })
});

router.get('/ProdHistoryClr/:id', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.multiple = true;
    request.input("ColorID", req.params.id)
    request.query(`SELECT * FROM dbo.vwFinProductActivity WHERE ColorID = @ColorID;
                    SELECT sd.SOID ,sh.SODate ,Quantity ,Price ,ColorID ,ColorName ,ModelID ,ModelCode ,ModelName, c.CustName, c.ContactPerson, sh.GrandTotal 
                    FROM dbo.vwSalesOrderDetail sd JOIN dbo.SalesOrderHeader sh ON sh.SOID = sd.SOID JOIN dbo.Customers c ON c.CustID = sh.CustID
                    WHERE ColorID = @ColorID;
                    SELECT ISNULL(SUM(Quantity),0) StockQty FROM dbo.FinishedStoreDetails Where ColorID = @ColorID;`,
        function (err, recordset) {
            if (err) {
                res.json({
                    error: err
                });
                console.log(err);
            }
            res.json({
                finRec: recordset[0].filter(f => f.FinReceivingID != null),
                finDisp: recordset[0].filter(f => f.FinDispensingID != null),
                finEqz: recordset[0].filter(f => f.FinEqualizeID != null),
                finRet: recordset[0].filter(f => f.FinReturnID != null),
                finRej: recordset[0].filter(f => f.FinRejectID != null),
                sales: recordset[1],
                stock: recordset[2]
            });
        })
});
router.get('/ReceiveByPeriod/:fromDate.:toDate', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query(`SELECT det.FinStoreID ,det.RecYear ,det.SerialNo ,det.ColorID ,det.Quantity ,det.BatchNo ,det.FinReceivingID ,
                        c.ColorName,m.ModelID,m.ModelCode,m.ModelName,fr.ReceivingDate,fr.ManfDate,fr.BatchNo,fr.ReceivedFrom 
                    FROM dbo.FinishedStoreDetails det JOIN dbo.ProductColorCoding c ON c.ColorID = det.ColorID
                    JOIN dbo.ProductModelCoding m ON m.ModelID = c.ModelID JOIN dbo.FinishedReceiving fr ON fr.FinReceivingID = det.FinReceivingID
                    WHERE ReceivingDate BETWEEN '${req.params.fromDate}' And '${req.params.toDate}'`)
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
router.get('/DispenseByPeriod/:fromDate.:toDate', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query(`SELECT det.FinStoreID ,det.RecYear ,det.SerialNo ,det.ColorID ,ABS(det.Quantity) Quantity ,det.BatchNo ,det.FinDispensingID ,
                        c.ColorName,m.ModelID,m.ModelCode,m.ModelName,fd.DispensingDate,fd.SOID,fd.DispenseTo
                    FROM dbo.FinishedStoreDetails det JOIN dbo.ProductColorCoding c ON c.ColorID = det.ColorID
                    JOIN dbo.ProductModelCoding m ON m.ModelID = c.ModelID JOIN dbo.FinishedDispensing fd ON fd.FinDispensingID = det.FinDispensingID
                    WHERE fd.DispensingDate BETWEEN '${req.params.fromDate}' And '${req.params.toDate}'`)
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
router.get('/EqualizeByPeriod/:fromDate.:toDate', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query(`SELECT det.FinStoreID ,det.RecYear ,det.SerialNo ,det.ColorID ,ABS(det.Quantity) Quantity,det.BatchNo ,det.FinEqualizeID ,
                        c.ColorName,m.ModelID,m.ModelCode,m.ModelName,fe.EqualizeDate, fe.EqualizeType
                    FROM dbo.FinishedStoreDetails det JOIN dbo.ProductColorCoding c ON c.ColorID = det.ColorID
                    JOIN dbo.ProductModelCoding m ON m.ModelID = c.ModelID JOIN dbo.FinStoreEqualization fe ON fe.FinEqualizeID = det.FinEqualizeID
                    WHERE fe.EqualizeDate BETWEEN '${req.params.fromDate}' And '${req.params.toDate}'`)
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
router.get('/ReturnByPeriod/:fromDate.:toDate', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query(`SELECT det.FinStoreID ,det.RecYear ,det.SerialNo ,det.ColorID ,ABS(det.Quantity) Quantity,det.BatchNo ,det.FinReturnID ,
                        c.ColorName,m.ModelID,m.ModelCode,m.ModelName,fr.ReturnDate, fr.ReturnFrom, fr.ReturnReason
                    FROM dbo.FinishedStoreDetails det JOIN dbo.ProductColorCoding c ON c.ColorID = det.ColorID
                    JOIN dbo.ProductModelCoding m ON m.ModelID = c.ModelID JOIN dbo.FinishedReturn fr ON fr.FinReturnID = det.FinReturnID
                    WHERE fr.ReturnDate BETWEEN '${req.params.fromDate}' And '${req.params.toDate}'`)
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
router.get('/EmptyStock/:all', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query(`SELECT *, DATEDIFF(DAY, frstReceivingDate, lstDispDate) AS StayPeriod FROM (
                    SELECT m.ModelCode, m.ModelName, det.ColorID, c.ColorName, ISNULL(SUM(Quantity),0) StockQty,
                    (SELECT TOP 1 r.ReceivingDate FROM dbo.FinishedStoreDetails d JOIN dbo.FinishedReceiving r ON r.FinReceivingID = d.FinReceivingID WHERE d.ColorID = det.ColorID) frstReceivingDate,
                    (SELECT TOP 1 r.DispensingDate FROM dbo.FinishedStoreDetails d JOIN dbo.FinishedDispensing r ON r.FinDispensingID = d.FinDispensingID WHERE d.ColorID = det.ColorID ORDER BY r.DispensingDate DESC) lstDispDate
                    FROM dbo.FinishedStoreDetails det 
                    JOIN dbo.ProductColorCoding c ON c.ColorID = det.ColorID 
                    JOIN dbo.ProductModelCoding m ON m.ModelID = c.ModelID
                    GROUP BY det.ColorID, c.ColorName, m.ModelCode, m.ModelName 
                    HAVING SUM(Quantity) <= 0
                    ) QRY`)
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
module.exports = router;