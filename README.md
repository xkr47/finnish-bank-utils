Finnish IBAN and reference number validator/generator
=====================================================

[![Build Status](https://travis-ci.org/vkomulai/finnish-bank-utils.svg?branch=master)](https://travis-ci.org/vkomulai/finnish-bank-utils)

- A micro Javascript library for validating and creating Finnish IBAN bank account numbers and reference numbers
- Vanilla JS (ES6), no dependencies
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

# Validate any IBAN
FinnishBankUtils.isValidIBAN('FI 90 800026 2776 1348')
```

```
# Valid reference number returns true, allows whitespace
# !! Reference number type must be a string !!
FinnishBankUtils.isValidFinnishRefNumber('1511890656')
FinnishBankUtils.isValidFinnishRefNumber('15118 90656')
```

```
# Generate a Finnish reference number
FinnishBankUtils.generateFinnishRefNumber()
// '6173672848'
```

```
# Generate a Finnish IBAN
FinnishBankUtils.generateFinnishRefIBAN()
// 'FI9080002627761348'
```

Functions
---------

##### isValidFinnishRefNumber(referenceNumber) : string --> boolean
-Validates parameter given reference number

##### isValidFinnishIBAN(ibanNumber) : string --> boolean
-Validates parameter given Finnish IBAN number

##### generateFinnishRefNumber() : void --> string
-Generates a random 10 char long Finnish reference number

##### generateFinnishIBAN() : void --> string
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
[MIT License](LICENSE)


