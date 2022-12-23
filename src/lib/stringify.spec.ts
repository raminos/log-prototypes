import test from 'ava';

import { objectParsedObject } from './parse.spec';
import { stringifyParsedPrototypes } from './stringify';

test('Test simple parsed class', (t) => {
  t.is(
    stringifyParsedPrototypes({
      constructorName: undefined,
      properties: [
        {
          name: 'a',
          type: {
            name: 'string',
            description: '"Hello"',
          },
        },
      ],
      parsedPrototype: {
        constructorName: 'Test',
        properties: [
          {
            name: 'b',
            type: {
              name: 'function',
              description: 'b',
            },
          },
        ],
        parsedPrototype: objectParsedObject,
      },
    }),
    `┌── Initial Object
│   └── a: string
├── Test
│   └── b: function
└── Object
    ├── __defineGetter__: function
    ├── __defineSetter__: function
    ├── hasOwnProperty: function
    ├── __lookupGetter__: function
    ├── __lookupSetter__: function
    ├── isPrototypeOf: function
    ├── propertyIsEnumerable: function
    ├── toString: function
    ├── valueOf: function
    ├── __proto__: undefined
    └── toLocaleString: function
`
  );
});
