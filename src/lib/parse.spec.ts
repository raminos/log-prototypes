import test from 'ava';

import { parsePrototypes } from './parse';

const objectParsedObject = {
  constructorName: 'Object',
  properties: [
    {
      name: '__defineGetter__',
      type: { name: 'function', description: '__defineGetter__' },
    },
    {
      name: '__defineSetter__',
      type: { name: 'function', description: '__defineSetter__' },
    },
    {
      name: 'hasOwnProperty',
      type: { name: 'function', description: 'hasOwnProperty' },
    },
    {
      name: '__lookupGetter__',
      type: { name: 'function', description: '__lookupGetter__' },
    },
    {
      name: '__lookupSetter__',
      type: { name: 'function', description: '__lookupSetter__' },
    },
    {
      name: 'isPrototypeOf',
      type: { name: 'function', description: 'isPrototypeOf' },
    },
    {
      name: 'propertyIsEnumerable',
      type: { name: 'function', description: 'propertyIsEnumerable' },
    },
    {
      name: 'toString',
      type: { name: 'function', description: 'toString' },
    },
    {
      name: 'valueOf',
      type: { name: 'function', description: 'valueOf' },
    },
    {
      name: '__proto__',
      type: { name: 'undefined', description: undefined },
    },
    {
      name: 'toLocaleString',
      type: { name: 'function', description: 'toLocaleString' },
    },
  ],
  parsedPrototype: undefined,
};

test('Test constructor function with all common types as properties', (t) => {
  class TestClass {}
  function Test(this: any) {
    this.a = 'World';
    this.b = 123;
    this.c = false;
    this.d = Symbol('Hello');
    this.e = function printHello() {
      console.log('Hello');
    };
    this.f = function () {
      console.log("I'm so anonymous");
    };
    this.g = BigInt('9007199254740991');
    this.h = new Date('2022-12-21');
    this.i = /ab*c/g;
    this.j = new Map([
      [1, 'Hello'],
      [2, 'World'],
    ]);
    this.k = new Set(['Hello', 'World']);
    this.l = { a: 'Hello', b: 'World' };
    this.m = Object.getPrototypeOf(new Map());
    this.n = Object.getPrototypeOf('Hello World');
    this.o = new TestClass();
    this.p = undefined;
    this.q = null;
    this.r = NaN;
    this.s = Infinity;
  }
  const testObj: any = new (Test as any)();
  const result = parsePrototypes(testObj);
  t.deepEqual(result, {
    constructorName: undefined,
    properties: [
      {
        name: 'a',
        type: { name: 'string', description: '"World"' },
      },
      {
        name: 'b',
        type: { name: 'number', description: '123' },
      },
      {
        name: 'c',
        type: { name: 'boolean', description: 'false' },
      },
      {
        name: 'd',
        type: { name: 'symbol', description: 'Hello' },
      },
      {
        name: 'e',
        type: { name: 'function', description: 'printHello' },
      },
      {
        name: 'f',
        type: { name: 'function', description: 'anonymous' },
      },
      {
        name: 'g',
        type: {
          description: '9007199254740991',
          name: 'bigint',
        },
      },
      {
        name: 'h',
        type: {
          description: '2022-12-21T00:00:00.000Z',
          name: 'Date',
        },
      },
      {
        name: 'i',
        type: {
          description: '/ab*c/g',
          name: 'RegExp',
        },
      },
      {
        name: 'j',
        type: {
          description: '2',
          name: 'Map',
        },
      },
      {
        name: 'k',
        type: {
          description: '2',
          name: 'Set',
        },
      },
      {
        name: 'l',
        type: {
          description: '2',
          name: 'object',
        },
      },
      {
        name: 'm',
        type: {
          description: '11',
          name: 'Map.prototype',
        },
      },
      {
        name: 'n',
        type: {
          description: '50',
          name: 'String.prototype',
        },
      },
      {
        name: 'o',
        type: {
          description: undefined,
          name: 'TestClass',
        },
      },
      {
        name: 'p',
        type: {
          description: undefined,
          name: 'undefined',
        },
      },
      {
        name: 'q',
        type: {
          description: undefined,
          name: 'null',
        },
      },
      {
        name: 'r',
        type: {
          description: 'NaN',
          name: 'number',
        },
      },
      {
        name: 's',
        type: {
          description: 'Infinity',
          name: 'number',
        },
      },
    ],
    parsedPrototype: {
      constructorName: 'Test',
      properties: [],
      parsedPrototype: objectParsedObject,
    },
  });
});

test('Test simple class', (t) => {
  class Test {
    a = 'Hello';
    b() {
      console.log('World');
    }
  }
  t.deepEqual(parsePrototypes(new Test()), {
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
  });
});

test('Test class with inheritance', (t) => {
  class MetaTest {
    c = 'Meta Hello';
    d() {
      console.log('I love being meta.');
    }
  }
  class Test extends MetaTest {
    a = 'Hello';
    b() {
      console.log('World');
    }
  }

  t.deepEqual(parsePrototypes(new Test()), {
    constructorName: undefined,
    properties: [
      {
        name: 'c',
        type: { name: 'string', description: '"Meta Hello"' },
      },
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
      parsedPrototype: {
        constructorName: 'MetaTest',
        properties: [
          {
            name: 'd',
            type: {
              name: 'function',
              description: 'd',
            },
          },
        ],
        parsedPrototype: objectParsedObject,
      },
    },
  });
});

test('Test object with added prototype', (t) => {
  const testPrototype = {
    a: 'Meta Hello',
    b() {
      console.log('World');
    },
  };
  const test = {
    a: 'Hello',
    __proto__: testPrototype,
  };

  t.deepEqual(parsePrototypes(test), {
    constructorName: undefined,
    properties: [
      {
        name: 'a',
        type: { name: 'string', description: '"Hello"' },
      },
    ],
    parsedPrototype: {
      constructorName: undefined,
      properties: [
        {
          name: 'a',
          type: { name: 'string', description: '"Meta Hello"' },
        },
        { name: 'b', type: { name: 'function', description: 'b' } },
      ],
      parsedPrototype: objectParsedObject,
    },
  });
});

test('Test built in type', (t) => {
  t.deepEqual(parsePrototypes(1), {
    constructorName: undefined,
    properties: [],
    parsedPrototype: {
      constructorName: 'Number',
      properties: [
        {
          name: 'toExponential',
          type: {
            name: 'function',
            description: 'toExponential',
          },
        },
        {
          name: 'toFixed',
          type: {
            name: 'function',
            description: 'toFixed',
          },
        },
        {
          name: 'toPrecision',
          type: {
            name: 'function',
            description: 'toPrecision',
          },
        },
        {
          name: 'toString',
          type: {
            name: 'function',
            description: 'toString',
          },
        },
        {
          name: 'valueOf',
          type: {
            name: 'function',
            description: 'valueOf',
          },
        },
        {
          name: 'toLocaleString',
          type: {
            name: 'function',
            description: 'toLocaleString',
          },
        },
      ],
      parsedPrototype: objectParsedObject,
    },
  });
});
