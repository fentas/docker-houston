#!/usr/bin/env node

var argv = require('minimist')(process.argv.slice(2)),
    bodyParser = require('body-parser'),
    serveStatic = require('serve-static'),
    connect = require('connect'),
    through = require('through'),
    request = require('request').defaults({
      'headers': {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      'auth': {
        'user': process.env.CATTLE_ACCESS,
        'pass': process.env.CATTLE_SECRET
      }
    })

connect()
  .use('/bin', serveStatic('./bin'))
  .use(bodyParser.json({ type: 'application/*+json' }))
  .use('/registry2', function webhook(req, res) {
    if ( ! req.body.events ) return

    var todo = []
    req.body.events.forEach(function(event, i) {
      if ( event.action == 'push' )
        todo.push(event.target.repository)
    })

    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end()
  })
  .use(function setContect(req, res, next) {
    console.log({
      'method': req.method,
      'uri': process.env.CATTLE_ENDPOINT + req.url,
      'form': req.body
    })
    request = request.defaults({
      'method': req.method,
      'uri': process.env.CATTLE_ENDPOINT + req.url,
      'form': req.body
    })
    next()
  })
  .use('/v1/registrationtokens', function rancher(req, res) {
    request({}).pipe(res)
  })
  .use('/v1/services', function rancher(req, res) {
    var r = request({}),
        query = req._parsedUrl.query ? JSON.parse('{"' + decodeURI(req._parsedUrl.query.replace(/&/g, "\",\"").replace(/=/g,"\":\"")) + '"}') : null,
        json = ''

    if ( query && query.prettify ) {
      r = r.pipe(through(function write(data) { json += data; this.resume() },
      function end() {
        try {
          data = JSON.parse(json)
          this.emit('data', data.data.map(function(service) {
            if ( /^(active|activating)$/.test(service.state) )
              return service.name
          }).sort().join(','))
        }
        catch(e) {
          this.emit('data', json)
        }
        this.emit('end')
      }))
    }
    r.pipe(res)
  })
  .listen(8000, process.env.HOST)
