[![Build Status](https://travis-ci.org/vkomulai/finnish-bank-utils.svg?branch=master)](https://travis-ci.org/vkomulai/finnish-bank-utils) ![0 deps](https://david-dm.org/vkomulai/finnish-bank-utils.svg) ![Downloads](https://img.shields.io/npm/dt/finnish-bank-utils.svg) ![License](https://img.shields.io/npm/l/finnish-bank-utils.svg)

- A micro Javascript library for validating, creating and formatting Finnish IBAN bank account numbers and reference numbers
- Lightweight, 5.2kB
- No dependencies
- Vanilla JS (ES6) + Babel for browser compatibility

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
const FinnishBankUtils = require('finnish-bank-utils')
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

```sh
# Valid IBAN returns true, allows whitespace
FinnishBankUtils.isValidFinnishIBAN('FI9080002627761348')
FinnishBankUtils.isValidFinnishIBAN('FI 90 800026 2776 1348')
```

```sh
# Valid reference number returns true, allows whitespace
# !! Reference number type must be a string !!
FinnishBankUtils.isValidFinnishRefNumber('1511890656')
FinnishBankUtils.isValidFinnishRefNumber('15118 90656')

# Allow international format for local reference number
FinnishBankUtils.isValidFinnishRefNumber('RF34 1234 561')
```

```sh
# Valid IBAN returns formatted version, allows whitespace
FinnishBankUtils.formatFinnishIBAN('FI9080002627761348')
// 'FI90 8000 2627 7613 48'
```

```sh
# Valid reference number returns formatted version, allows whitespace
FinnishBankUtils.formatFinnishRefNumber('1511890656')
// '15118 90656'
FinnishBankUtils.formatFinnishRefNumber('RF341234561')
// 'RF34 1234 561'
```

```sh
# Generate a Finnish reference number
FinnishBankUtils.generateFinnishRefNumber()
// '6173672848'
```

```sh
# Generate a Finnish IBAN
FinnishBankUtils.generateFinnishRefIBAN()
// 'FI9080002627761348'
```

Functions
---------

##### isValidFinnishRefNumber(referenceNumber) : string --> boolean
- Validates parameter given reference number

##### isValidFinnishIBAN(ibanNumber) : string --> boolean
- Validates parameter given Finnish IBAN number

##### formatFinnishRefNumber(referenceNumber) : string --> string
- Formats parameter given reference number

##### formatFinnishIBAN(ibanNumber) : string --> string
- Formats parameter given Finnish IBAN number

##### generateFinnishRefNumber() : void --> string
- Generates a random 10 char long Finnish reference number

##### generateFinnishIBAN() : void --> string
- Generates a random Finnish IBAN number

Building
--------

```sh
# Build a distributable, minified UMD library compatible with browsers and Node
npm run dist

# Run tests
npm run test
```

License
-------
[MIT License](LICENSE)
