var express = require('express');
var router = express.Router();
var sql = require('mssql');
var jwt = require("jsonwebtoken");
var sqlcon = sql.globalPool;

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
    request.query(`SELECT * FROM dbo.vwFinishStoreDetails`)
        .then(function (result) {
            res.json(result.recordset);
        })
        .catch(function (err) {
            res.json({
                error: err
            });
            console.log(err);
        })
});
router.get('/Receiving/:id', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query(`SELECT * FROM dbo.vwFinishStoreDetails Where FinReceivingID = ${req.params.id}`)
        .then(function (result) {
            res.json(result.recordset);
        })
        .catch(function (err) {
            res.json({
                error: err
            });
            console.log(err);
        })
});
router.get('/Dispensing/:id', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query(`SELECT * FROM dbo.vwFinishStoreDetails Where FinDispensingID = ${req.params.id}`)
        .then(function (result) {
            res.json(result.recordset);
        })
        .catch(function (err) {
            res.json({
                error: err
            });
            console.log(err);
        })
});
router.get('/Equalize/:id', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query(`SELECT * FROM dbo.vwFinishStoreDetails Where FinEqualizeID = ${req.params.id}`)
        .then(function (result) {
            res.json(result.recordset);
        })
        .catch(function (err) {
            res.json({
                error: err
            });
            console.log(err);
        })
});
router.get('/Return/:id', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query(`SELECT * FROM dbo.vwFinishStoreDetails Where FinReturnID = ${req.params.id}`)
        .then(function (result) {
            res.json(result.recordset);
        })
        .catch(function (err) {
            res.json({
                error: err
            });
            console.log(err);
        })
});
router.get('/Reject/:id', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query(`SELECT * FROM dbo.vwFinishStoreDetails Where FinRejectID = ${req.params.id}`)
        .then(function (result) {
            res.json(result.recordset);
        })
        .catch(function (err) {
            res.json({
                error: err
            });
            console.log(err);
        })
});

router.get('/ClrStock/:id', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query(`SELECT BatchNo, StoreTypeID, (SELECT StoreType FROM StoreTypes WHERE StoreTypeID=d.StoreTypeID) StoreType, SUM(Quantity) Stock 
                    FROM dbo.FinishedStoreDetails d WHERE ColorID = ${req.params.id} GROUP BY BatchNo, StoreTypeID`)
        .then(function (result) {
            res.json(result.recordset);
        })
        .catch(function (err) {
            res.json({
                error: err
            });
            console.log(err);
        })
});
router.get('/ClrStockWOrders/:id.:strID', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.multiple = true;
    request.query(`SELECT ISNULL(SUM(Quantity),0) OrderQty FROM dbo.SalesOrderDetails WHERE ColorID=${req.params.id} AND StoreTypeID=${req.params.strID} AND 
                SOID NOT IN (SELECT SOID FROM dbo.FinishedDispensing WHERE SOID IS NOT NULL);
                SELECT ISNULL(SUM(Quantity),0) StockQty FROM dbo.FinishedStoreDetails Where ColorID = ${req.params.id} AND StoreTypeID=${req.params.strID} ; `,
        function (err, result) {
            if (err) {
                res.json({
                    error: err
                });
                console.log(err);
            }
            res.json({
                orders: result.recordsets[0],
                stock: result.recordsets[1]
            });
        })
});

router.post('/', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var material = req.body;
    var request = new sql.Request(sqlcon);
    request.input('RecYear', material.RecYear);
    request.input('SerialNo', material.SerialNo);
    request.input('RecordDate', material.RecordDate);
    request.input('ColorID', material.ColorID);
    request.input('Quantity', material.Quantity);
    request.input('BatchNo', material.BatchNo);
    request.input('FinReceivingID', material.FinReceivingID);
    request.input('FinDispensingID', material.FinDispensingID);
    request.input('FinEqualizeID', material.FinEqualizeID);
    request.input('FinReturnID', material.FinReturnID);
    request.input('FinRejectID', material.FinRejectID);
    request.input('UserID', material.UserID);
    request.execute('FinishDetailInsert', function (err, result) {
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

router.delete('/Receiving/:id', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.input('FinReceivingID', req.params.id);
    request.execute('FinishDetailDeleteReceiving', function (err, result) {
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
router.delete('/Dispensing/:id', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.input('FinDispensingID', req.params.id);
    request.execute('FinishDetailDeleteDispense', function (err, result) {
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
router.delete('/Equalize/:id', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.input('FinEqualizeID', req.params.id);
    request.execute('FinishDetailDeleteEqualize', function (err, result) {
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
router.delete('/Return/:id', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.input('FinReturnID', req.params.id);
    request.execute('FinishDetailDeleteReturn', function (err, result) {
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
router.delete('/Reject/:id', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.input('FinRejectID', req.params.id);
    request.execute('FinishDetailDeleteReject', function (err, result) {
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

module.exports = router;