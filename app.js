var express = require('express');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var cors = require('cors');
var favicon = require('serve-favicon');

var sql = require('mssql');
var con = require('./SQLconfig');
var connection = new sql.Connection(con.config);
//store the connection
sql.globalConnection = connection;

var app = express();

// all environments
app.set('port', 5500);
app.set('views', path.join(__dirname, 'public/dist'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(cors());

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());

var stylus = require('stylus');
app.use(stylus.middleware(path.join(__dirname, 'public/dist')));
app.use(express.static(path.join(__dirname, 'public/dist')));

// development only
//if ('development' == app.get('env')) {
//    app.use(express.errorHandler());
//}

var index = require('./routes/index');
var fabrics = require('./routes/fabrics');
var Accessory = require('./routes/Accessories');
var login = require('./routes/login');
var dash = require('./routes/dashboard');
var brands = require('./routes/brands');
var model = require('./routes/model');
var users = require('./routes/user');
var color = require('./routes/prodColor');
var size = require('./routes/prodSize');
var customer = require('./routes/customer');
var supplier = require('./routes/supplier');
var salesHeader = require('./routes/salesHeader');
var salesDetail = require('./routes/salesDetail');
var salesPayment = require('./routes/salesPayment');
var salesRep = require('./routes/salesRep');
var finstore = require('./routes/finishedStore');
var findetail = require('./routes/finDetails');
var finrec = require('./routes/finReceiving');
var findisp = require('./routes/finDispense');
var finEqualize = require('./routes/finEqualize');
var finReturn = require('./routes/finReturn');
var finReject = require('./routes/finReject');
var matStore = require('./routes/materialStore');
var matDet = require('./routes/matDetials');
var matInsp = require('./routes/matInspection');
var matrec = require('./routes/matReceiving');
var matdisp = require('./routes/matDispensing');
var matequl = require('./routes/matEqualize');
var matret = require('./routes/matReturn');

app.use('/', index);
app.use('/api/fabrics', fabrics);
app.use('/api/Accessories', Accessory);
app.use('/api/authenticate', login);
app.use('/api/dash', dash);
app.use('/api/brands', brands);
app.use('/api/models', model);
app.use('/api/users', users);
app.use('/api/color', color);
app.use('/api/size', size);
app.use('/api/customer', customer);
app.use('/api/supplier', supplier);
app.use('/api/sheaders', salesHeader);
app.use('/api/sdetail', salesDetail);
app.use('/api/spayment', salesPayment);
app.use('/api/srep', salesRep);
app.use('/api/finstore', finstore);
app.use('/api/fdetail', findetail);
app.use('/api/finrec', finrec);
app.use('/api/findisp', findisp);
app.use('/api/finequl', finEqualize);
app.use('/api/finret', finReturn);
app.use('/api/finrej', finReject);
app.use('/api/matstore', matStore);
app.use('/api/matdet', matDet);
app.use('/api/matInsp', matInsp);
app.use('/api/matrec', matrec);
app.use('/api/matdisp', matdisp);
app.use('/api/matequl', matequl);
app.use('/api/matret', matret);

connection.connect().then(function() {
  console.log('Connection pool open for duty');
  http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
    });  
}).catch(function(err) {
  console.error('Error creating connection pool', err);
});

connection.on('connect', function(err) {
    if (err) return console.error(err);
});