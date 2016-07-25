# extractability
A suite of tests for content extractor libraries.  
Inspired by the pursuit of content extraction perfection at [EpubPress](https://epub.press).

## How it works
`extractability` runs your extraction library against a library of html documents.  
It asserts that titles, descriptions, authors and text segments are all properly extracted and that junk is removed.

## Install
```
npm install --save-dev extractability
```

## Usage

#### `extractability(extractorFn, options)`

**Arguments**

**`extractorFn(htmlString)` -> `Promise` -> `articleObj`**
- Accepts html string.
- Returns a promise that resolves to an article object.

**`options`**
- `output`:
 - Log out results
 - **Default**: `false`
- `testCaseFn`:
	- Function for creating an async test case.
	- Should accept a description and function that is passed a `done` callback.
	- `testCaseFn(description, fn(done))`)
	- **Default:** Uses `mocha`
- `assertInclude`:
	- Function to assert one string includes another.
	- Eg. assertInclude(string, substring)
	- **Default:** Uses chai `assert.include`
- `assertEqual`:
	- Function to assert two values are equal.
	- `assertEqual(actual, expected)`
	- **Default:** Uses chai `assert.equal`

### Examples

**As a standalone tool.**
```js
const extractability = require('extractability');
const extractorFn = require('content-extractor-library');

const results = extractability(extractorFn, { output: false });

console.log(results.successCount); // 5
console.log(results.failCount): // 3
```

**As part of a test suite.**

*Eg. tests/regression-test.js*
```js
const extractability = require('extractability');
const extractorFn = require('content-extractor-library');


// Mocha Example
describe('It can extract anything', () => {
	extractability(extractorFn);
});

// Jasmine Example
describe('It can extract anything!', () => {
	extractability(extractorFn, {
		testCaseFn: it,
		assertInclude: (actual, expected, msg) => { expect(actual).toMatch(expected) },
		assertEqual: (actual, expected, msg) => { expect(actual).toEqual(expected) },
	});
});
```

### Todo
- [ ] Easy integration with Mocha test suites
- [ ] Easy integration with Jasmine tests suites
- [ ] Easy integration with QUnit test suites
- [ ] Easy use with no test suites
- [ ] `npm test` runs the library against a bunch extraction libraries
- [ ] Publish to npm
