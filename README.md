Utilities for Finnish baking IBAN and reference numbers
=======================================================

[![Build Status](https://travis-ci.org/vkomulai/finnish-bank-utils.svg?branch=master)](https://travis-ci.org/vkomulai/finnish-bank-utils)

- A micro Javascript library for validating and creating Finnish IBAN bank account numbers and reference numbers
- Vanilla JS (ES6), no dependencies.
- ES6 + Babel for browser compatibility

Installation
------------

```sh
# NPM
npm install finnish-bank-utils
# Bower
bower install finnish-bank-utils
```

Usage
-----

Node.js

``` js
const FinnishBankUtils = require('finnish-bank-utills')
FinnishBankUtils.isValidFinnishIBAN('FI9080002627761348')
```

Browser: Writes FinnishBankUtils into global namespace.

``` html
<script src="finnish-bank-utils.min.js"></script>
<script>
  FinnishBankUtils.isValidFinnishIBAN('FI9080002627761348')
</script>

```

Examples
--------

```
# Valid IBAN returns true, allows whitespace
FinnishBankUtils.isValidFinnishIBAN('FI9080002627761348')
FinnishBankUtils.isValidFinnishIBAN('FI 90 800026 2776 1348')
```

```
# Valid reference number returns true, allows whitespace
FinnishBankUtils.isValidRefNumber('1511890656')
FinnishBankUtils.isValidRefNumber('15118 90656')
```

```
# Generate finnish reference number
FinnishBankUtils.generateFinnishRefNumber()
// FI9080002627761348
```

```
# Generate finnish IBAN
FinnishBankUtils.generateFinnishRefNumber()
// 6173672848
```

Functions
---------

##### isValidRefNumber(referenceNumber) : string --> boolean
-Validates parameter given reference number

##### isValidFinnishIBAN(ibanNumber) : string --> boolean
-Validates parameter given Finnish IBAN number

##### isValidIBAN(ibanNumber) : string --> boolean
-Validates parameter given IBAN number

##### generateFinnishRefNumber() : void --> string
-Generates a random 10 char long Finnish referencenumber number

##### generateFinnishIban() : void --> string
-Generates a random Finnish IBAN number

Building
--------

````
# Build a distributable, minified UMD library compatible with browsers and Node
npm run dist
# Run tests
npm run test
````

License
-------
MIT License
