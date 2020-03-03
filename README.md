# Fortellis Specification Validator

The Fortellis specification validator can be used to ensure that API specifications conform to the Fortellis rules and standards. More information on the Fortellis rules and standards can be found [here](https://docs.fortellis.io/docs/tutorials/spec-provider/linting-api-specs/).

## Installation

```bash
npm i @fortellis/spec-validator
```

## Usage

The spec validator exposes two functions for linting api specifications, one for yaml strings and one for parsed JSON objects. Both return an array of resulting linting notices in the spec. A valid spec will return an empty array.

### JSON Objects

```js
const { lint } = require('@fortellis/spec-validator');

const mySpec = {
  // ...
};
const results = lint(mySpec);
```

### Yaml String

```js
const fs = require('fs');
const { lintRaw } = require('@fortellis/spec-validator');

const mySpec = fs.readFileSync('./my-spec.yaml', 'utf8');
const results = lintRaw(mySpec);
```

#### Options

Both functions take a second argument to supply an options object. The options object will allow you to partially customize the behavior of the linter. The following are available items in the options object:

| Key        | Type          | Description                                                                                                                                                                                                             | Default |
| ---------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `rulesets` | object        | Define the rulesets used in the linter. Each ruleset is a key in this object.                                                                                                                                           | `{}`    |
| `severity` | enum (number) | Determine the level of linting notice that should be returned in the results array (`error (0)`, `warn (1)`, `info (2)`, `hint (3)`). These severity levels are exported as `Severity` from `@fortellis/spec-validator` | `0`     |
| `verbose`  | boolean       | Enable/Disable logging from the linter                                                                                                                                                                                  | `false` |

### Results

The results array that shows you all of the linter notices for the passed in spec will contain objects will a bunch of information about the specific notice and where the notice is located in the spec.

| Key        | Type   | Description                                                                                                                       |
| ---------- | ------ | --------------------------------------------------------------------------------------------------------------------------------- |
| `code`     | string | Where the notice originated from.                                                                                                 |
| `message`  | string | The human readable description of the cause of the notice.                                                                        |
| `severity` | number | The severity level of the notice (`error (0)`, `warn (1)`, `info (2)`, `hint (3)`).                                               |
| `path`     | array  | An array of keys denoting the location of the notice within the spec.                                                             |
| `range`    | object | Contains the `start` and `end` objects which denote the exact line and character location of the notice within the original spec. |

#### Example

```js
{
  code: 'parser',
  message: 'Mapping key must be a string scalar rather than number',
  severity: 0,
  path: [
    'paths',
    '/my-endpoint',
    'get',
    'responses',
    '200'
  ],
  range: {
    start: {
      line: 44,
      character: 8
    },
    end: {
      line: 44,
      character: 11
    }
  }
}
```
