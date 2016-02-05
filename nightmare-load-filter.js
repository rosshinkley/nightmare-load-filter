var Nightmare = require('nightmare'),
  debug = require('debug')('nightmare:load-filter');

Nightmare.action('filter',
  function(name, options, parent, win, renderer, done) {
    parent.on('filter', function(filter, filterFunction) {
      win.webContents.session.webRequest.onBeforeRequest(filter, function(details, cb) {
        parent.emit('log', 'load-filter', details);
        var fn = new Function('with(this){return ' + filterFunction + '}').call({});
        fn(details, cb);
      });
      parent.emit('filter');
    });
    done();
    return this;
  },
  function(filter, filterFunction, done) {
    //emit the filter to the child process
    debug('issuing filter: ' + require('util')
      .inspect(filter));
    this.child.once('filter', done);
    this.child.emit('filter', filter, String(filterFunction));
  });
