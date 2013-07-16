var winston = require('./lib/winston'),
    express = require('express');

var LOGFILENAME = 'somefile.log';
var EXCFILENAME = 'exceptions.log';

var logger = new (winston.Logger)({
    transports: [
    new (winston.transports.Console)({ colorize: true }),
    new (winston.transports.File)({ filename: LOGFILENAME,
                                    maxsize: 10000000,
                                    maxFiles: 5 })
    ],
    exceptionHandlers: [
      new winston.transports.File({ filename: EXCFILENAME })
    ],
    exitOnError: false
});

winston.add(winston.transports.File, { filename: LOGFILENAME });

var options = {
    from: new Date - 24 * 60 * 60 * 1000,
    until: new Date
};

// initialize express
var app = express();

// support body data
app.use(express.bodyParser());

/*
app.get('/hello.txt', function(req, res){
  var body = 'Hello World';
  
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Content-Length', body.length);
  res.end(body);
});
*/

app.get('/query_log', function(req, res){
  winston.query(options, function (err, results) {
      if (err) {
        err;
      }
      
      //console.log(results);
      var body = JSON.stringify(results);
      res.setHeader('Content-Type', 'text/json');
      res.setHeader('Content-Length', body.length);
      //res.setHeader('Access-Control-Allow-Origin', '*');
      res.end(body);
    });
})

app.post('/logmein', function(req, res){
  //logger.log('info', 'logmein - Hello distributed log files');
  var log_msg = req.body.logmsg;
  logger.log('error', '%s - %s', req.ip, log_msg);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.end();
});

app.listen(3000);
console.log('Listening on port 3000');
/*
logger.log('info', 'Hello distributed log files');
logger.info('Hello again distributed logs');
logger.log('info', 'test message %j', {number: 123}, {});
*/