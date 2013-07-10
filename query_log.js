var winston = require('./lib/winston');

var options = {
    from: new Date - 24 * 60 * 60 * 1000,
    until: new Date
};

// add transport file
winston.add(winston.transports.File, 
  { filename: 'somefile.log' });

//
// Find items logged between today and yesterday.
//
winston.query(options, function (err, results) {
  if (err) {
    throw err;
  }

  console.log(results);
});