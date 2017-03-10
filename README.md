# Logiceditor

[Test for JS Developer to Logiceditor](/docs/test-logiceditor-table-editor.md)

# Application

[Logiceditor](https://ankostyuk.github.io/logiceditor/dist/app/index.html)

# Supported Browsers

* Google Chrome 56
* Mozilla Firefox 41
* Opera 43
* Microsoft Internet Explorer 11
* Microsoft Internet Explorer 10 - Opening a file through a double click
* Apple Safari 9.1.3 - File encoding trubles


# Dependencies & Licenses

* [angular](https://github.com/angular/angular.js) - [MIT](https://github.com/angular/angular.js/blob/master/LICENSE)
* [angular-ui-sortable](https://github.com/angular-ui/ui-sortable) - [MIT](https://github.com/angular-ui/ui-sortable/blob/master/LICENSE)
* [bootstrap](https://github.com/twbs/bootstrap) - [MIT](https://github.com/twbs/bootstrap/blob/v4-dev/LICENSE)
* [jquery](https://github.com/jquery/jquery) - [Open](https://github.com/jquery/jquery/blob/master/LICENSE.txt)
* [jquery-ui](https://github.com/jquery/jquery-ui) - [Open](https://github.com/jquery/jquery-ui/blob/master/LICENSE.txt)
* [nullpointer-commons](https://github.com/newpointer/commons-js) - [MIT](https://github.com/newpointer/commons-js/blob/master/LICENSE)
* [nullpointer-i18n](https://github.com/newpointer/i18n-js) - [MIT](https://github.com/newpointer/i18n-js/blob/master/LICENSE)
* [Glyphicons](http://glyphicons.com/) - Icon Fonts into [Twitter Bootstrap](http://getbootstrap.com/components/#glyphicons)

See [/package.json](/package.json) for more details.

# Project

## Init

Install:
* nodejs 5.10+
* npm

```bash
npm install
```

## i18n

Install `gettext` for i18n support.

```bash
npm run i18n
```

## Dev

```bash
npm run dev
```

[http://localhost:8090](http://localhost:8090)

## Tests

### Unit

```bash
npm run test:unit
```

### e2e

```bash
# Of necessity
./node_modules/protractor/bin/webdriver-manager update
```

```bash
npm run dev
```

```bash
npm run selenium
```

```bash
npm run test:e2e
```

## Production

```bash
npm run production
```

[/dist](/dist)
