# order-service-v2

*node.js v7.6 + required*

## Usage
Install packages with npm
```
npm i 
```

## Structrue
### config
Use package [config](https://www.npmjs.com/package/config)

### server/controllers
Only deal with request and response, you should add try catch statement to catch error from upper levels

### server/middlewares
All middlewares you add here

### server/models
Only add modules which related whih dateset, mysql, elasticsearch, mongodb, hbase, redis, solr...; you shoudn't add any user logic here, just process data.
Those models privide data for services or controllers.

### server/routes
Use package [koa-router](https://www.npmjs.com/package/koa-router)
You could add middleware here.

### server/services
All interfaces for controllers or other services, process data, catch error. Those services must testable.

### server/utils
Some tools you create here, make connection of database,send Email, functional method, fetch api result etc.

### server/app.js
Interface of this application.

### static
Static file add here

### test/main
All test file add here, base on mocha.