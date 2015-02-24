![Test status](https://magnum.travis-ci.com/sedge/opendojo.svg?token=Pq9BJTQsrUUEcKjEssNY&branch=master)

## TOC

1. Prerequisites
2. Installation
3. Environment
4. Tests

### Prerequisites

The following global dependencies are required for this application:

1. Nodejs v0.10.~ (native)
2. MongoDB (native)
3. Grunt (npm module)
4. Mocha (npm module)

### Installation

From the root directory: `npm install`

### Environment

The server won't run without an environment file in the root directory of the application. Copy the provided `env.dist` file to `.env` and customize as necessary.

### Tests

Tests are a `grunt` task that invoke the `mocha` test framework and provide JavaScript linting by running:

```bash
$> grunt test
```

