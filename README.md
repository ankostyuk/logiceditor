# Logiceditor

[Test for JS Developer to Logiceditor](/docs/test-logiceditor-table-editor.md)

# Application

[Logiceditor](https://ankostyuk.github.io/logiceditor/)

# Dependencies & Licenses

```
// TODO
```

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
