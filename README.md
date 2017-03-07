nightmare-load-filter
======================

Add pre-load content filtering to your [Nightmare](http://github.com/segmentio/nightmare) scripts.

## Usage
Require the library and pass the Nightmare library as a reference to attach the plugin actions:

```js
var Nightmare = require('nightmare');
require('nightmare-load-filter')(Nightmare);
```

### .filter(filter, fn)
Adds a prerequest call to `fn` filtered to the URLs specified in `filter`.  The `fn` parameter must be a function that accepts details and a callback.  When complete, the callback must specify a response object, even if it is empty.  Note that `filter` is of the same form and works in the same way that the [Electron filter does](https://github.com/atom/electron/blob/master/docs/api/session.md#seswebrequest).  See the [`onBeforeRequest` documentation](https://github.com/electron/electron/blob/2b955a5ae12ca4b15f0c018243b99c78d5e79e40/docs/api/web-request.md#webrequestonbeforerequestfilter-listener) in the Electron documentation for more information.

## Example

```js
yield nightmare
  .filter({
    urls:[
      'http://example.com'
    ]
  }, function(details, cb){
    //cancel a specific file
    return cb({cancel: (details.url === 'http://example.com/some-resource.js')});
  })
  .goto('http://example.com');
```
