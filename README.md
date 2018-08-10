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

### i18n Internationalisation

To set translation to one component, follow theses instructions:
+ `import { translate } from 'react-i18next';`

+ Use it like HOC -> `export default translate('MyComponentTranslation')(MyComponent);`

+ execute `this.props.t('Content')` were you need to translate.

+ example: `<p>Content</p>` -> `<p>{this.props.t('Content')}</p>`

+ Then, go to `src/locales/en.js` & `src/locales/fr.js` 

+ Add an object property called like `MyComponentTranslation`
in `fr` and `en` objects.

Finally, add all the properties you need to translate.

#### Go to https://codesandbox.io/s/n4p235y56m for simple example.

#### Official website : https://react.i18next.com/overview/getting-started for more informations.

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
