/**
 * Module dependencies.
 */

require('mocha-generators')
  .install();

var Nightmare = require('nightmare');
var should = require('chai')
  .should();
var url = require('url');
var server = require('./server');
var fs = require('fs');
var mkdirp = require('mkdirp');
var path = require('path');
var rimraf = require('rimraf');

/**
 * Temporary directory
 */

var tmp_dir = path.join(__dirname, 'tmp')

/**
 * Get rid of a warning.
 */

process.setMaxListeners(0);

/**
 * Locals.
 */

var base = 'http://localhost:7500/';

describe('Nightmare Load Filter', function() {
  before(function(done) {
    require('../nightmare-load-filter');
    server.listen(7501, function() {
      server.listen(7500, done);
    });
  });

  it('should be constructable', function * () {
    var nightmare = Nightmare();
    nightmare.should.be.ok;
    yield nightmare.end();
  });

  describe('filter content', function() {
    var nightmare;

    beforeEach(function() {
      nightmare = Nightmare();
    });

    afterEach(function * () {
      yield nightmare.end();
    });

    it('should filter nothing', function * () {
      var imageExists = yield nightmare
        .filter({}, function(details, cb) {
          cb({
            cancel: false
          });
        })
        .goto('http://localhost:7500')
        .evaluate(function() {
          var image = document.querySelector('#image-local');
          return !!image.complete && !!image.naturalWidth;
        });

      imageExists.should.be.true;
    });
    
    it('should filter specific files', function * () {
      var localImageExists = yield nightmare
        .filter({}, function(details, cb) {
          cb({
            cancel: (details.url === 'http://localhost:7500/red.png')
          });
        })
        .goto('http://localhost:7500')
        .evaluate(function() {
          var image = document.querySelector('#image-local');
          return !!image.complete && !!image.naturalWidth;
        });

      var servedImageExists = yield nightmare.evaluate(function() {
          var image = document.querySelector('#image-served') || {};
          return !!image.complete && !!image.naturalWidth;
        })

      var title = yield nightmare.title();

      localImageExists.should.be.false;
      servedImageExists.should.be.true;
      title.should.equal('load filter');
    });

    it('should filter by regular expression', function * () {
      var localImageExists = yield nightmare
        .filter({
        }, function(details, cb){
          cb({cancel: /png$/.test(details.url)});
        })
        .goto('http://localhost:7500')
        .evaluate(function() {
          var image = document.querySelector('#image-local') || {};
          return !!image.complete && !!image.naturalWidth;
        });

        var servedImageExists = yield nightmare.evaluate(function() {
          var image = document.querySelector('#image-served') || {};
          return !!image.complete && !!image.naturalWidth;
        })

      var title = yield nightmare.title();

      localImageExists.should.be.false;
      servedImageExists.should.be.false;
      title.should.equal('load filter');
    });

    it('should filter by url', function * () {
      var localImageExists = yield nightmare
        .filter({
          urls:[
            'http://localhost:7501/*'
          ]
        }, function(details, cb){
          cb({cancel: true})
        })
        .goto('http://localhost:7500')
        .evaluate(function() {
          var image = document.querySelector('#image-local') || {};
          return !!image.complete && !!image.naturalWidth;
        });

        var servedImageExists = yield nightmare.evaluate(function() {
          var image = document.querySelector('#image-served') || {};
          return !!image.complete && !!image.naturalWidth;
        })

      var title = yield nightmare.title();

      localImageExists.should.be.true;
      servedImageExists.should.be.false;
      title.should.equal('load filter');
    });
  });
});
