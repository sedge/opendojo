## CONTRIBUTING.md

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
  }  else {
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
