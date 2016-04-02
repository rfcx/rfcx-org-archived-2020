rfcx.org
================

Node Express app that renders the main Rainforest Connection website

Designed for production deployment on AWS Elastic Beanstalk
* Running in "development" requires "environmental variables" to be defined in config/env_vars.js
* Running in "production" (on AWS Elastic Beanstalk) requires the same variables to be set in .ebextensions/env_vars.config OR manually through the AWS Elastic Beanstalk application configuration web console.

master
![](https://api.travis-ci.org/rfcx/rfcx.org.png?branch=master)

Use following commands to run local server:

```sh
$ npm start
```
or
```sh
$ node app.js
```

The page will be available via `http://localhost:8080`.

Use the following command to run gulp builder:

```sh
$ gulp
```

[![Browserstack](https://camo.githubusercontent.com/178e11ae94b103abb44ddee10ce0e40901f99ca9/687474703a2f2f6937352e666173747069632e72752f6269672f323031362f303333302f65642f36356564373566346535663434396564353735366438646336323332313765642e6a7067)](https://www.browserstack.com/)
