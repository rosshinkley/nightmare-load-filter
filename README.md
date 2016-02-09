nightmare-load-filter
======================

# Important Note
This library will not be ready for use until [Nightmare #391](https://github.com/segmentio/nightmare/issues/391) is completed.  For now, if this library is needed, use the [`electron-plugin` branch from my fork](https://github.com/rosshinkley/nightmare/tree/electron-plugin).

Add pre-load content filtering to your [Nightmare](http://github.com/segmentio/nightmare) scripts.

## Usage
Simply require the library: 

```js
require('nightmare-custom-event')
```

### .filter(filter, fn)
Adds a prerequest call to `fn` filtered to the URLs specified in `filter`.  The `fn` parameter must be a function that accepts details and a callback.  When complete, the callback must specify a response object, even if it is empty.  Note that `filter` is of the same form and works in the same way that the [Electron filter does](https://github.com/atom/electron/blob/master/docs/api/session.md#seswebrequest).  See the [`onBeforeRequest` documentation](https://github.com/atom/electron/blob/master/docs/api/session.md#seswebrequestonbeforerequestfilter-listener) in the Electron documentation for more information.

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
