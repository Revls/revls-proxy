'use strict';

var bouncy    = require('bouncy');
var minimatch = require('minimatch');
var api       = require('./api');
var table     = require('./table');

api.notifier(function(tbl){
  console.log('Updating proxy table');
  table = tbl;
});

var server = bouncy(function (req, res, bounce) {
  var mtch = match(req.headers.host, table)
  if (mtch){
    bounce(table[mtch]);
  } else if (req.headers.host === 'proxy.revls.co') {
    bounce(Number(process.env.PORT) + 1);
  } else {
    res.statusCode = 404;
    res.end('Resource not found in this server.');
  }
});

server.listen(process.env.PORT, function (){
  console.log('Proxy running on %d', this.address().port);
});

function match(tng, obj){
  var oldTng = tng, pmach;
  if (tng.split('.').length === 2) tng = 'www.' + tng
  var mtch = Object.keys(obj).filter(function(key){
    return minimatch(tng, key)
  })
  if (match.length > 1) pmach = mtch.filter(function (t){
    return t === oldTng
  })
  if (pmach.length) return pmach[0]
  return mtch[0]
}
