// import test from 'ava';

// import { logPrototypes } from '.';

// test('Test function', (t) => {
//   function Test(this: any) {
//     this.a = 'World';
//   }
//   const testObj: any = new (Test as any)();
//   t.is(logPrototypes(testObj, { showProperties: true }), undefined);
//   Test.prototype.getA = function () {
//     return this.a;
//   };
//   const testObj2: any = new (Test as any)();
//   t.is(logPrototypes(testObj2, { showProperties: true }), undefined);
// });

// test('Test class', (t) => {
//   class Test {
//     a = 'World';
//     getA() {
//       return this.a;
//     }
//   }

//   class InheritedTest extends Test {
//     b = 'Hello';
//     getB() {
//       return this.b;
//     }
//   }
//   // const testObj: any = new Test();
//   // t.is(logPrototypes(testObj, { showProperties: true }), undefined);
//   const testObj2: any = new InheritedTest();
//   // t.is(logPrototypes(testObj2, { showProperties: true }), undefined);
//   t.is(logPrototypes(testObj2, { showDescriptors: true }), undefined);
// });
