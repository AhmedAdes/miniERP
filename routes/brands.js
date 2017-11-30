var express = require('express');
var router = express.Router();
var sql = require('mssql');
var jwt = require(`jsonwebtoken`);
var sqlcon = sql.globalPool;

router.use(function (req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers[`authorization`];
    var secret = req.body.salt || req.query.salt || req.headers[`salt`];
    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, secret, function (err, decoded) {
            if (err) {
                return res.status(403).send({
                    success: false,
                    message: `Failed to authenticate token.`
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
            message: `No token provided.`
        });
    }
});

router.get('/', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.query(`Select c.*,u.UserName From dbo.ProductBrandCoding c Join dbo.SystemUsers u on c.UserID = u.UserID`)
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
    request.query(`Select c.*,u.UserName From dbo.ProductBrandCoding c Join dbo.SystemUsers u on c.UserID = u.UserID Where BrandID = '${req.params.id}'`)
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
    var brand = req.body;
    var request = new sql.Request(sqlcon);
    request.input('BrandName', brand.BrandName);
    request.input('UserID', brand.UserID);
    request.execute('BrandInsert', function (err, result) {
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

router.put('/:id', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var brand = req.body;
    var request = new sql.Request(sqlcon);
    request.input('BrandID', req.params.id);
    request.input('BrandName', brand.BrandName);
    request.input('UserID', brand.UserID);
    request.execute('BrandUpdate', function (err, result) {
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

router.delete('/:id', function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    var request = new sql.Request(sqlcon);
    request.input('BrandID', req.params.id);
    request.execute('BrandDelete', function (err, result) {
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

function generateBrandID() {
    var request = new sql.Request(sqlcon);
    request.query(`SELECT (ISNULL(MAX(BrandID), 0) + 1) as max FROM dbo.ProductBrandCoding`)
        .then(function (ret) {
            res.json(ret.recordset);
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