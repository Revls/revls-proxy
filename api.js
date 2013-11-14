var fs      = require('fs');
var crypto  = require('crypto')
var express = require('express');
var app     = module.exports = express();
var token   = md5(Date.now() + 'secrettoken');
var json    = fs.readFileSync('./table.json', 'utf8')

app.get('/api/token', function (req, res){
  res.end(token);
});

app.post('/api/place/new', function (req, res){
  var data = req.body;
  var notifier = app.get('notifier');
  if (token !== data.token) {
    res.statusCode = 403;
    return res.end('invalid request');
  }
  json[data.host] = data.port;
  fs.writeFile('./table.json', JSON.stringify(json, null, 2), function (err){
    if (err)
      return res.end('error processing request');
    if (notifier)
      notifier(json);
    res.end('ok');
  });
});

app.listen(Number(process.env.PORT) + 1, function (){
  console.log('Proxy API ready on: %d', this.address().port);
});

app.notifier = function (fn){
  app.set('notifier', fn)
}

function md5(hash) {
  return crypto.createHash('md5').update(hash + '').digest('hex');
}