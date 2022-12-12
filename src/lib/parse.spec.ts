import test from 'ava';

import { parsePrototypes } from './parse';

test('Test function', (t) => {
  function Test(this: any) {
    this.a = 'World';
  }
  const testObj: any = new (Test as any)();
  const result = parsePrototypes(testObj);
  console.log(JSON.stringify(result, null, 1));
  t.is(result, undefined);
  // Test.prototype.getA = function () {
  //   return this.a;
  // };
  // const testObj2: any = new (Test as any)();
  // t.is(parsePrototypes(testObj2), undefined);
});
