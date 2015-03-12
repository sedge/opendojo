![Test status](https://magnum.travis-ci.com/sedge/opendojo.svg?token=Pq9BJTQsrUUEcKjEssNY&branch=master)

## CONTRIBUTING.md

## TOC
1. Patch Requirements
2. Logging
3. Style Guide
4. Unit Tests

### Final Patch Requirements

1. 1 commit per issue PR.
2. Tests pass locally on your machine. See the README for the most up-to-date way to run tests
2. Confirm that travis-ci is passing

#### Travis-ci states

In the PR, confirm that travis-ci has passed the tests. In every pull request, you'll see this when travis-ci is running:

![screen shot 2015-02-03 at 12 17 22 am](https://cloud.githubusercontent.com/assets/1616860/6014882/84f60162-ab3a-11e4-8fd4-5c959c0c41f9.png)

---------------------------
![screen shot 2015-02-03 at 12 17 16 am](https://cloud.githubusercontent.com/assets/1616860/6014880/84f31ca4-ab3a-11e4-8c25-09e0ccb634ae.png)
---------------------------

And this when tests have passed:

![screen shot 2015-02-03 at 12 16 43 am](https://cloud.githubusercontent.com/assets/1616860/6014883/84f77bfa-ab3a-11e4-8b98-f90ca7810a46.png)

----------------------------
![screen shot 2015-02-03 at 12 16 52 am](https://cloud.githubusercontent.com/assets/1616860/6014881/84f4eb88-ab3a-11e4-9853-f53721897fb3.png)

-----------------------

### Logging

Our logging module provides four logging methods:

```js
var log = require('./bin/logger');

log.info(...);
log.warn(...);
log.error(...);
log.fatal(...);
```

Whenever a successful `request` occurs, after a response is sent, log the `req`,
`res` and data objects using `info`:

```js
res.status(200).send(student);
log.info({
  req: req,
  res: res,
  student: student
});
```

If a request is unsuccessful, our error handling middleware will catch and log
it with `warn` on a 404, or `error` on anything else.

If you are programming an error case that is guaranteed to crash the program,
or should cause the server to abort, log the error with `fatal`:

```js
case 'EADDRINUSE':
  log.fatal(bind + ' is already in use');
  process.exit(1);
  break;
```


### Style-guide

Follow this styling for all code commited on the front or back end:

```javascript
// Single line comments to explain stuff
var camelCaseVariableNames;

/**
 * Multiline comments for section names ONLY
 */
function CapitalizedCamelClassNames() {
  // Constructor logic here
}

function camelCasedFunctionNames() {
  /**
   * Prefer early returns, like this:
   */
  if (failCondition) {  // `failCondition == true` or `failCondition != undefined` is usually unnecessary
    // Conditional logic here
    return;
  }
  if (!otherCondition) {
    // Conditional logic here
    return;
  }

  /**
   * Instead of this:
   */
  if (failCondition) {
    // Conditional logic here
  }  else if(!otherCondition) {
    // Conditional logic here
  }
}

// Space before curly braces:
function codeBlock() {}

// vs

function codeBlock(){}

xx// Two
xxxx// Space
xxxxxx// Indents
function niceAndCompact {
  If (derp) {
    return;
  }
}

// Simple single statement if conditions:
if (err) throw err;

// vs
if (err) {
  throw err;
}

// Comments directly above code block they relate to
function blah() {
	// ...
}
// vs

// Comments not directly above code block

function blah() {
	// ...
}

```