# nelreina-node-utils

Library of handy Utils scripts for NodeJS / Most common use in my projects

This package contains:

* unirest
* sqllize - some handy sequelize utility functions

## Unirest

An abstraction of unirest module and promisify.
Now you can use unirest with async/await

### API

```javascript
// Default to GET method
unirest(url, options);
```

### Options

```javascript
options = {
  method: 'POST', // defaults to GET
  query: {}, // Object with query params
  body: {} // Object for POST/ PUT body
};
```

### Example

```javascript
const { unirest } = require('nelreina-node-utils');

unirest('https://jsonplaceholder.typicode.com/posts')
  .then(data => console.log(data))
  .catch(err => console.error(err));
```

#### OR

```javascript
const { unirest } = require('nelreina-node-utils');

(async () => {
  const data = await unirest('https://jsonplaceholder.typicode.com/posts');
  console.info(data);
})();
```

## sqllize

Pending docs...
