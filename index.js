#!/usr/local/bin/node

var argv = require('minimist')(process.argv.slice(2)),
		bodyParser = require('body-parser'),
		serveStatic = require('serve-static')
		connect = require('connect'),
		request = require('request').defaults({
			'headers': {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			'auth': {
		    'user': argv['rancher-access'],
		    'pass': argv['rancher-secret']
		  }
		})

connect()
	.use('/bin', serveStatic('./bin'))
	.use(bodyParser.json({ type: 'application/*+json' }))
	.use(function setContect(req, res, next) {
		console.log(req)
	  request = request.defaults({
			'method': req.method,
			'uri': argv['rancher-endpoint'] + req.url,
			'form': req.body
		})
	  next()
	})
	.use('/v1/registrationtokens', function rancher(req, res) {
		request({}).pipe(res)
	})
	.use('/v1/services', function rancher(req, res) {
		request({}).pipe(res)
	})
	.listen(8000)
