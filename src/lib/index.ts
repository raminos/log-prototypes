import { parsePrototypes } from './parse';
import { stringifyParsedPrototypes } from './stringify';

export { parsePrototypes, stringifyParsedPrototypes };

export function log(obj: unknown): void {
  console.log(stringifyParsedPrototypes(parsePrototypes(obj)));
}
