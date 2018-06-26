# Readme: TODO

## Getting Started

## Table of content

## Installation

## Usage

### API requests

API requests follow [redux-api-middleware](https://github.com/agraboso/redux-api-middleware) syntax.

To make a request, we should use actions ending by request status :

```javascript
export const SUBMIT_REQUEST = 'userrequest/SUBMIT_REQUEST';
export const SUBMIT_SUCCESS = 'userrequest/SUBMIT_SUCCESS';
export const SUBMIT_FAILURE = 'userrequest/SUBMIT_FAILURE';
```

Then we could make a request using a Symbol action named `CALL_API`, with an array as types with 3 states (request, success, failure) :

```javascript
export const submit = data => ({
  [CALL_API]: {
    endpoint: `/url`,
    types: [SUBMIT_REQUEST, SUBMIT_SUCCESS, SUBMIT_FAILURE],
    config: {
      method: 'POST',
      body: JSON.stringify(data),
    },
  },
});
```


### `npm start`

Build and watch files change without creating static files,
for development purpose.

### `npm test`

Enable test scripts.

### `npm run build`

Build main files in `build/` directory.

#### `npm run build:force`

Allow building with bypassing linting errors.
**Do not use if not required**.

### Customizing theme

[Ant Design](https://ant.design) is using Less for styling.
[A set of less variables](https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less)
are defined for each design aspect that can be customized.
This variables can be override by defining values in `less-overrides.js` file.

## Deployment

## Roadmap

## Contributing

## Licence

## Credits

## Links
