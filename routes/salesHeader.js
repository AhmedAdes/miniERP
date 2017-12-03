var express = require('express');
var router = express.Router();
var sql = require('mssql');
var jwt = require("jsonwebtoken");
var Promise = require('bluebird');
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
    request.query(`Select * FROM dbo.vwSalesOrderHeader`)
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
router.get('/:id(\\d+)', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query(`Select * FROM dbo.vwSalesOrderHeader Where SOID = ${req.params.id}`)
        .then(function (result) {
            res.json(result.recordset);
        })
        .catch(function (err) {
            res.json({
                error: err
            });
            console.log(err);
        });
});
router.get('/unfinSales', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query(`Select * FROM dbo.vwSalesOrderHeader Where SOID NOT IN (SELECT SOID FROM dbo.FinishedDispensing WHERE SOID IS NOT NULL)`)
        .then(function (result) {
            res.json(result.recordset);
        })
        .catch(function (err) {
            res.json({
                error: err
            });
            console.log(err);
        });
});
router.get('/finSales', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query(`Select * FROM dbo.vwSalesOrderHeader Where SOID IN (SELECT SOID FROM dbo.FinishedDispensing WHERE SOID IS NOT NULL)`)
        .then(function (result) {
            res.json(result.recordset);
        })
        .catch(function (err) {
            res.json({
                error: err
            });
            console.log(err);
        });
});
router.get('/salesByStrType/:id(\\d+).:fromDate.:toDate', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query(`SELECT h.CustID, c.CustName, d.ColorID, m.ModelName, d.Quantity, d.Price AS UnitPrice, (d.Quantity * d.Price) SubTotal, ISNULL(h.Discount, 0) Discount, m.ModelCode, h.SODate
                    FROM dbo.SalesOrderDetails d JOIN dbo.ProductColorCoding p ON p.ColorID = d.ColorID
                    JOIN dbo.ProductModelCoding m ON m.ModelID = p.ModelID JOIN dbo.SalesOrderHeader h ON h.SOID = d.SOID 
                    JOIN dbo.Customers c ON c.CustID = h.CustID
                    WHERE d.StoreTypeID = ${req.params.id} AND h.SODate BETWEEN '${req.params.fromDate}' And '${req.params.toDate}'`)
        .then(function (result) {
            res.json(result.recordset);
        })
        .catch(function (err) {
            res.json({
                error: err
            });
            console.log(err);
        });
});
router.get('/salesByCust/:id(\\d+).:fromDate.:toDate', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query(`SELECT h.CustID, c.CustName, d.ColorID, m.ModelName, d.Quantity, d.Price AS UnitPrice, (d.Quantity * d.Price) SubTotal, ISNULL(h.Discount, 0) Discount, m.ModelCode, h.SODate
                    FROM dbo.SalesOrderDetails d JOIN dbo.ProductColorCoding p ON p.ColorID = d.ColorID
                    JOIN dbo.ProductModelCoding m ON m.ModelID = p.ModelID JOIN dbo.SalesOrderHeader h ON h.SOID = d.SOID 
                    JOIN dbo.Customers c ON c.CustID = h.CustID
                    WHERE c.CustID = ${req.params.id} AND h.SODate BETWEEN '${req.params.fromDate}' And '${req.params.toDate}'`)
        .then(function (result) {
            res.json(result.recordset);
        })
        .catch(function (err) {
            res.json({
                error: err
            });
            console.log(err);
        });
});
router.get('/salesByProduct/:id(\\d+).:fromDate.:toDate', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query(`SELECT h.CustID, c.CustName, d.ColorID, m.ModelName, d.Quantity, d.Price AS UnitPrice, (d.Quantity * d.Price) SubTotal, ISNULL(h.Discount, 0) Discount, 
                    m.ModelCode, h.SODate, c.Country + ' - ' + c.Area AS Region, h.SOID
                    FROM dbo.SalesOrderDetails d JOIN dbo.ProductColorCoding p ON p.ColorID = d.ColorID
                    JOIN dbo.ProductModelCoding m ON m.ModelID = p.ModelID JOIN dbo.SalesOrderHeader h ON h.SOID = d.SOID 
                    JOIN dbo.Customers c ON c.CustID = h.CustID
                    WHERE m.ModelID = ${req.params.id} AND h.SODate BETWEEN '${req.params.fromDate}' And '${req.params.toDate}'`)
        .then(function (result) {
            res.json(result.recordset);
        })
        .catch(function (err) {
            res.json({
                error: err
            });
            console.log(err);
        });
});
router.get('/salesByProductMonths/:id(\\d+).:fromDate.:toDate', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query(`;with  MonthRecursive as (
                select CAST('${req.params.fromDate}' as DATE) as MonthDate ,1 as [level]
                union all
                select DATEADD(MONTH,level, CAST('${req.params.fromDate}' as DATE)),[level]+1 from  
                MonthRecursive where DATEADD(MONTH,level, CAST('${req.params.fromDate}' as DATE))<=CAST('${req.params.toDate}' as DATE))
                SELECT MonthDate, (SELECT SUM(d.Quantity * d.Price)  FROM dbo.SalesOrderDetails d JOIN dbo.ProductColorCoding p ON p.ColorID = d.ColorID
                JOIN dbo.ProductModelCoding m ON m.ModelID = p.ModelID JOIN dbo.SalesOrderHeader h ON h.SOID = d.SOID 
                WHERE m.ModelID=${req.params.id} AND h.SODate BETWEEN MonthDate AND DATEADD(DAY,-1,DATEADD(MONTH,1,MonthDate))) TotalAmount from MonthRecursive d`)
        .then(function (result) {
            res.json(result.recordset);
        })
        .catch(function (err) {
            res.json({
                error: err
            });
            console.log(err);
        });
});
router.get('/salesByCntry/:fromDate.:toDate', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query(`SELECT c.Country, SUM(d.Quantity) Quantity, SUM(h.GrandTotal) Amount
                    FROM dbo.SalesOrderHeader h JOIN dbo.SalesOrderDetails d ON d.SOID = h.SOID JOIN dbo.Customers c ON c.CustID = h.CustID 
                    WHERE h.SODate BETWEEN '${req.params.fromDate}' And '${req.params.toDate}'
                    GROUP BY c.Country ORDER BY c.Country`)
        .then(function (result) {
            res.json(result.recordset);
        })
        .catch(function (err) {
            res.json({
                error: err
            });
            console.log(err);
        });
});
router.get('/salesByArea/:cntry.:fromDate.:toDate', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query(`SELECT c.Area, SUM(d.Quantity) Quantity, SUM(h.GrandTotal) Amount
                    FROM dbo.SalesOrderHeader h JOIN dbo.SalesOrderDetails d ON d.SOID = h.SOID JOIN dbo.Customers c ON c.CustID = h.CustID 
                    WHERE c.Country = '${req.params.cntry}' AND h.SODate BETWEEN '${req.params.fromDate}' And '${req.params.toDate}'
                    GROUP BY c.Country, c.Area ORDER BY c.Area`)
        .then(function (result) {
            res.json(result.recordset);
        })
        .catch(function (err) {
            res.json({
                error: err
            });
            console.log(err);
        });
});
router.get('/sellingCntry', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query(`SELECT DISTINCT Country FROM dbo.Customers WHERE CustID IN (SELECT CustID FROM dbo.SalesOrderHeader)`)
        .then(function (result) {
            res.json(result.recordset);
        })
        .catch(function (err) {
            res.json({
                error: err
            });
            console.log(err);
        });
});
router.get('/TsellProdQty/:fltr.:fromDate.:toDate', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query(`SELECT TOP 10 m.ModelCode, m.ModelName, SUM(d.Quantity) Quantity, SUM(d.Quantity * d.Price) Amount
                    FROM dbo.SalesOrderHeader h JOIN dbo.SalesOrderDetails d ON d.SOID = h.SOID
                    JOIN dbo.ProductColorCoding p ON p.ColorID = d.ColorID JOIN dbo.ProductModelCoding m ON m.ModelID = p.ModelID
                    WHERE  h.SODate BETWEEN '${req.params.fromDate}' And '${req.params.toDate}'
                    GROUP BY m.ModelCode, m.ModelName ORDER BY ${req.params.fltr} DESC`)
        .then(function (result) {
            res.json(result.recordset);
        })
        .catch(function (err) {
            res.json({
                error: err
            });
            console.log(err);
        });
});
router.get('/LsellProdQty/:fltr.:fromDate.:toDate', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query(`SELECT TOP 10 m.ModelCode, m.ModelName, SUM(d.Quantity) Quantity, SUM(d.Quantity * d.Price) Amount
                    FROM dbo.SalesOrderHeader h JOIN dbo.SalesOrderDetails d ON d.SOID = h.SOID
                    JOIN dbo.ProductColorCoding p ON p.ColorID = d.ColorID JOIN dbo.ProductModelCoding m ON m.ModelID = p.ModelID
                    WHERE  h.SODate BETWEEN '${req.params.fromDate}' And '${req.params.toDate}'
                    GROUP BY m.ModelCode, m.ModelName ORDER BY ${req.params.fltr} ASC`)
        .then(function (result) {
            res.json(result.recordset);
        })
        .catch(function (err) {
            res.json({
                error: err
            });
            console.log(err);
        });
});
router.get('/compareSales/:month1.:year1.:month2.:year2', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query(`SELECT M1.ModelCode, M1.ModelName, M1.Quantity M1Quantity, M1.Amount M1Amount, ISNULL(M2.Quantity,0) M2Quantity, ISNULL(M2.Amount,0) M2Amount 
                    FROM fncMonthSales(${req.params.month1}, ${req.params.year1}) M1 
                    LEFT JOIN (SELECT * FROM dbo.fncMonthSales(${req.params.month2},${req.params.year2})) M2 ON M1.ModelCode = M2.ModelCode`)
        .then(function (result) {
            res.json(result.recordset);
        })
        .catch(function (err) {
            res.json({
                error: err
            });
            console.log(err);
        });
});

router.get('/salesSummary/:fromDate.:toDate', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query(`SELECT SUM(GrandTotal) TotalAmount, COUNT(DISTINCT h.SOID) TotalOrders, COUNT(DISTINCT CustID) TotalCustomers, 
    (SELECT SUM(Quantity) From dbo.SalesOrderDetails d join dbo.SalesOrderHeader h on d.SOID = h.SOID 
    And h.SODate BETWEEN '${req.params.fromDate}' And '${req.params.toDate}') AS TotalProducts 
    FROM dbo.SalesOrderHeader h WHERE h.SODate BETWEEN '${req.params.fromDate}' And '${req.params.toDate}'`)
        .then(function (result) {
            res.json(result.recordset);
        })
        .catch(function (err) {
            res.json({
                error: err
            });
            console.log(err);
        });
});
router.get('/salesSummaryChrt/:fromDate.:toDate', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.input('fromDate', req.params.fromDate)
    request.input('toDate', req.params.toDate)
    request.query(`;with  MonthRecursive as (
                select CAST(@fromDate as DATE) as MonthDate ,1 as [level]
                union all
                select DATEADD(MONTH,level, CAST(@fromDate as DATE)),[level]+1 from  
                MonthRecursive where DATEADD(MONTH,level, CAST(@fromDate as DATE))<=CAST(@toDate as DATE))
                SELECT MonthDate, (SELECT SUM(GrandTotal)  FROM dbo.vwSalesOrderHeader h 
                WHERE SODate BETWEEN MonthDate AND DATEADD(DAY,-1,DATEADD(MONTH,1,MonthDate))) TotalAmount, 
                (SELECT SUM(SumQty)  FROM dbo.vwSalesOrderHeader h 
                WHERE SODate BETWEEN MonthDate AND DATEADD(DAY,-1,DATEADD(MONTH,1,MonthDate))) TotalQty
                from MonthRecursive d`)
        .then(function (result) {
            res.json(result.recordset);
        })
        .catch(function (err) {
            res.json({
                error: err
            });
            console.log(err);
        });
});

router.get('/incomeTracker/', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.multiple = true;
    request.query(`
        SELECT ISNULL(SUM(PayAmount),0) UnpaidAmount, COUNT(SOPayID) OpenInvoices FROM dbo.SalesOrderPayment WHERE Paid = 0 ;
        SELECT ISNULL(SUM(PayAmount),0) OverDueAmount, COUNT(SOPayID) OverDueInvoices FROM dbo.SalesOrderPayment WHERE Paid = 0 AND PaymentDate < GETDATE();
        SELECT ISNULL(SUM(PayAmount),0) PaidAmount, COUNT(SOPayID) BilledInvoices FROM dbo.SalesOrderPayment WHERE Paid = 1 AND ReceivePaymentDate > DATEADD(MONTH, -1, GETDATE());
    `, function (err, result) {
        if (err) {
            res.json({
                error: err
            });
            console.log(err);
        }
        res.json({
            Unpaid: result.recordsets[0],
            OverDue: result.recordsets[1],
            Paid: result.recordsets[2]
        });
    })
});
router.get('/unpaidInvoices', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query(`SELECT * FROM dbo.vwSalesOrderPayment WHERE Paid = 0`)
        .then(function (result) {
            res.json(result.recordset);
        })
        .catch(function (err) {
            res.json({
                error: err
            });
            console.log(err);
        });
});
router.get('/overDueInvoices', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query(`SELECT * FROM dbo.vwSalesOrderPayment WHERE Paid = 0 AND PaymentDate < GETDATE()`)
        .then(function (result) {
            res.json(result.recordset);
        })
        .catch(function (err) {
            res.json({
                error: err
            });
            console.log(err);
        });
});
router.get('/paidInvoices', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query(`SELECT * FROM dbo.vwSalesOrderPayment WHERE Paid = 1 AND ReceivePaymentDate > DATEADD(MONTH, -1, GETDATE())`)
        .then(function (result) {
            res.json(result.recordset);
        })
        .catch(function (err) {
            res.json({
                error: err
            });
            console.log(err);
        });
});
router.get('/SlsHdModels/:soid', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query(`SELECT m.ModelID, m.ModelCode,m.ModelName, c.ColorName ,c.ColorID , fdet.BatchNo, 
	fdet.StoreTypeID, (SELECT StoreType FROM StoreTypes WHERE StoreTypeID=fdet.StoreTypeID) StoreType, ABS(fdet.Quantity) Quantity, 
    (SELECT SUM(Quantity)  FROM dbo.FinishedStoreDetails Where ColorID = c.ColorID AND BatchNo = fdet.BatchNo GROUP BY BatchNo) Stock
    FROM dbo.ProductModelCoding m 
    JOIN dbo.ProductColorCoding c ON c.ModelID = m.ModelID 
    JOIN dbo.SalesOrderDetails det ON det.ColorID = c.ColorID 
    LEFT JOIN dbo.FinishedDispensing fd ON fd.SOID = det.SOID 
    LEFT JOIN dbo.FinishedStoreDetails fdet ON fdet.FinDispensingID = fd.FinDispensingID AND fdet.ColorID = c.ColorID
    WHERE det.SOID = ${req.params.soid}`)
        .then(function (result) {
            res.json(result.recordset);
        })
        .catch(function (err) {
            res.json({
                error: err
            });
            console.log(err);
        });
});
router.post('/', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var so = req.body.master;
    var sod = req.body.details;
    var pays = req.body.payments;
    var SOrderID;
    var conf = require('../SQLConfig');
    var connection = new sql.ConnectionPool(conf.config);

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
                request.input('DiscountPrcnt', so.DiscountPrcnt);
                request.input('Notes', so.Notes);
                request.input('SelfNotes', so.SelfNotes);
                request.input('DeliveryDate', so.DeliveryDate);
                request.input('Commisioner', so.Commisioner);
                request.input('CommisionerTel', so.CommisionerTel);
                request.input('DeliveryType', so.DeliveryType);
                request.input('PayMethod', so.PayMethod);
                request.input('GrandTotal', so.GrandTotal);
                request.input('SalesRepID', so.SalesRepID);
                request.input('UserID', so.UserID);
                request.execute('SalesHeaderInsert')
                    .then(function (result) {
                        SOrderID = result.recordset[0].SOID;
                        console.log('SOID: ' + SOrderID);

                        promises.push(Promise.map(sod, function (det) {
                            var request = trans.request();
                            request.input('SOID', SOrderID);
                            request.input('Quantity', det.Quantity);
                            request.input('Price', det.Price);
                            request.input('ColorID', det.ColorID);
                            request.input('UserID', det.UserID);
                            request.input('StoreTypeID', det.StoreTypeID);
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
                        res.json({
                            error: err
                        });
                        console.log(err);
                    })
            }).catch(function (err) {
                trans.rollback();
                res.json({
                    error: err
                });
                console.log(err);
            })
    }).catch(function (err) {
        res.json({
            error: err
        });
        console.log(err);
        connection.close();
    });
});

router.put('/:id', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var so = req.body.master;
    var sod = req.body.details;
    var pays = req.body.payments;
    var SOrderID;
    var conf = require('../SQLConfig');
    var connection = new sql.ConnectionPool(conf.config);

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
                request.input('DiscountPrcnt', so.DiscountPrcnt);
                request.input('Notes', so.Notes);
                request.input('SelfNotes', so.SelfNotes);
                request.input('DeliveryDate', so.DeliveryDate);
                request.input('Commisioner', so.Commisioner);
                request.input('CommisionerTel', so.CommisionerTel);
                request.input('DeliveryType', so.DeliveryType);
                request.input('PayMethod', so.PayMethod);
                request.input('GrandTotal', so.GrandTotal);
                request.input('SalesRepID', so.SalesRepID);
                request.input('UserID', so.UserID);
                request.execute('SalesHeaderUpdate')
                    .then(function (result) {
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
                            request.input('StoreTypeID', det.StoreTypeID);
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
                        res.json({
                            error: err
                        });
                        console.log(err);
                    })
            }).catch(function (err) {
                trans.rollback();
                res.json({
                    error: err
                });
                console.log(err);
            })
    }).catch(function (err) {
        res.json({
            error: err
        });
        console.log(err);
        connection.close();
    });
});

router.delete('/:id', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.input('SOID', req.params.id);
    request.execute('SalesHeaderDelete', function (err, result) {
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

router.get('/SalesGroupPeriod/:groupby.:fromDate.:toDate', function (req, res, next) {
    let group = req.params.groupby
    let mainStr = `
        SELECT h.CustID, c.CustName, d.ColorID, m.ModelName, d.Quantity, d.Price AS UnitPrice, (d.Quantity * d.Price) SubTotal, ISNULL(h.Discount, 0) Discount, 
                m.ModelCode, h.SODate, c.Country + ' - ' + c.Area AS Region, c.Country, c.Area, h.SOID, h.DiscountPrcnt, d.StoreTypeID, (SELECT StoreType FROM StoreTypes WHERE StoreTypeID=d.StoreTypeID) StoreType,
                CASE h.DiscountPrcnt 
                WHEN 1 THEN CAST((ISNULL(h.Discount, 0) * (d.Quantity * d.Price) / 100) / (SELECT COUNT(ColorID) FROM dbo.SalesOrderDetails WHERE SOID = h.SOID) AS MONEY)	
                WHEN 0 THEN CAST(ISNULL(h.Discount, 0) / (SELECT COUNT(ColorID) FROM dbo.SalesOrderDetails WHERE SOID = h.SOID) AS MONEY) END TOTDiscount
        FROM dbo.SalesOrderDetails d 
        JOIN dbo.ProductColorCoding p ON p.ColorID = d.ColorID
        JOIN dbo.ProductModelCoding m ON m.ModelID = p.ModelID 
        JOIN dbo.SalesOrderHeader h ON h.SOID = d.SOID 
        JOIN dbo.Customers c ON c.CustID = h.CustID
        WHERE h.SODate BETWEEN '${req.params.fromDate}' And '${req.params.toDate}'
        `
    let str = ``
    if (group == 'Product') {
        str = `SELECT ModelCode, ModelName, COUNT(DISTINCT SOID) SalesCount, SUM(QRY.Quantity) Quantity ,SUM(QRY.SubTotal) SubTotal, CAST(SUM(TOTDiscount) AS REAL) TOTDiscount 
        FROM (${mainStr}) QRY GROUP BY ModelCode, ModelName ORDER BY SubTotal DESC`
    } else if (group == 'Customer') {
        str = `SELECT CustID, CustName, Max(Region) Region, COUNT(DISTINCT SOID) SalesCount, SUM(QRY.Quantity) Quantity ,SUM(QRY.SubTotal) SubTotal, CAST(SUM(TOTDiscount) AS REAL) TOTDiscount 
        FROM (${mainStr}) QRY GROUP BY CustID, CustName ORDER BY SubTotal DESC`
    } else if (group == 'Store') {
        str = `SELECT StoreTypeID, StoreType, COUNT(DISTINCT SOID) SalesCount, SUM(QRY.Quantity) Quantity ,SUM(QRY.SubTotal) SubTotal, CAST(SUM(TOTDiscount) AS REAL) TOTDiscount 
        FROM (${mainStr}) QRY GROUP BY StoreTypeID, StoreType ORDER BY SubTotal DESC`
    } else if (group == 'Country') {
        str = `SELECT Country, COUNT(DISTINCT QRY.CustID) CustCount, COUNT(DISTINCT SOID) SalesCount, SUM(QRY.Quantity) Quantity ,SUM(QRY.SubTotal) SubTotal, CAST(SUM(TOTDiscount) AS REAL) TOTDiscount 
        FROM (${mainStr}) QRY GROUP BY Country ORDER BY SubTotal DESC`
    } else {
        str = mainStr
    }
    let request = new sql.Request(sqlcon);
    request.query(str)
        .then(function (result) {
            res.json(result.recordset);
        })
        .catch(function (err) {
            res.json({
                error: err
            });
            console.log(err);
        });
})

module.exports = router;