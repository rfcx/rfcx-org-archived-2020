# rfcx.org

## Development server

### Node version
Required Nodejs version is specified in `.nvmrc` file. If you use [nvm](https://github.com/nvm-sh/nvm), you can run the following commands in the project's root:
If required node version is not yet installed on your machine:
```
nvm install
```
If required node version is installed on your machine:
```
nvm use
```

### Install the dependencies:

```sh
npm install
```

### Run local server:

```sh
npm run dev
```

Navigate to http://localhost:8084/

## Build

To build the project for production:

```sh
NODE_ENV=production npm run build
```


## Code scaffolding
For creating a new page you should add a new one to `src/html/*new-page*.html` with the following structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Rainforest Connection | *new-page* m</title>
    <meta name="description" content="">
    <meta name="keywords" content="">
    <!-- @include modules/common/head.html -->
    <link rel="stylesheet" href="css/*new-page*.min.css">
</head>
<body class="*new-page*">
<!-- @include modules/common/body-start.html -->
<!-- @include modules/common/header.html -->
<!-- @include modules/common/footer.html -->
<!-- @include modules/common/modal.html -->
<!-- @include modules/common/body-end.html -->
</body>
</html>
```
For creating modules you should add a new module to `src/html/modules/*new-page*/*new-module*.html` and add this one to body of `src/html/*new-page*.html` between:

```html
<!-- @include modules/common/header.html -->
<!-- @include modules/*new-page*/*new-module*.html -->
<!-- @include modules/common/footer.html -->
```
For creating styles page you should add a new one to `src/less/*new-page*.less`.
For creating modules you should add a new module to `src/less/modules/*new-page*/*new-module*.less` and add this one to `src/less/*new-page*.less` to the top of the page.

[![Browserstack](https://camo.githubusercontent.com/178e11ae94b103abb44ddee10ce0e40901f99ca9/687474703a2f2f6937352e666173747069632e72752f6269672f323031362f303333302f65642f36356564373566346535663434396564353735366438646336323332313765642e6a7067)](https://www.browserstack.com/)
