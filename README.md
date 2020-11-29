# rfcx.org

## Development server

Install the dependencies:

```sh
npm install
```

Run local server:

```sh
npm start
```

Navigate to http://localhost:8084/

## Build

To build the project in development:

```sh
npm build
```

Use `npm build:prod` for a production build.

## Code scaffolding
For creating a new page you should add a new one to `src/html/*new-page*.html` with the following structure:

```sh
<!DOCTYPE html>
<html lang="en">
<head>
    <!-- @if NODE_ENV='production' -->
        <!-- @include modules/common/gtm-head.html -->
    <!-- @endif -->
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <title>Rainforest Connection | *new-page* m</title>
    <meta name="description" content="">
    <meta name="keywords" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">
    <link rel="icon" href="favicon.ico" type="image/x-icon">
    <link rel="stylesheet" href="css/*new-page*<!-- @echo partialsSuffix -->.css">
    <!-- @if NODE_ENV='production' -->
        <!-- @include modules/common/fb-pixel.html -->
    <!-- @endif -->
</head>
<body class="*new-page*">
<!-- @if NODE_ENV='production' -->
    <!-- @include modules/common/gtm-body.html -->
<!-- @endif -->
<!-- @include modules/common/header.html -->
<!-- @include modules/common/footer.html -->
<!-- @include modules/common/modal.html -->
<!-- @if NODE_ENV='production' -->
    <!-- @include modules/common/gtag.html -->
    <!-- @include modules/common/hubspot.html -->
<!-- @endif -->
</body>
</html>
```
For creating modules you should add a new module to `src/html/modules/*new-page*/*new-module*.html` and add this one to body of `src/html/*new-page*.html` between:

```sh
<!-- @include modules/common/header.html -->
<!-- @include modules/*new-page*/*new-module*.html -->
<!-- @include modules/common/footer.html -->
```
For creating styles page you should add a new one to `src/less/*new-page*.less`.
For creating modules you should add a new module to `src/less/modules/*new-page*/*new-module*.less` and add this one to `src/less/*new-page*.less` to the top of the page.

[![Browserstack](https://camo.githubusercontent.com/178e11ae94b103abb44ddee10ce0e40901f99ca9/687474703a2f2f6937352e666173747069632e72752f6269672f323031362f303333302f65642f36356564373566346535663434396564353735366438646336323332313765642e6a7067)](https://www.browserstack.com/)
