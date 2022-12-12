import { capitalize } from '.';

type ParsedObject = {
  name: string | undefined;
  fields: Field[];
  prototype: ParsedObject | undefined;
};

type Field = {
  name: string;
  value: string | ParsedObject;
};

function getValueName(obj: any): string {
  if (['string', 'boolean', 'number'].includes(typeof obj)) {
    return `${capitalize(typeof obj)} (${obj})`;
  } else if (typeof obj === 'undefined') {
    return `Undefined`;
  } else if (Array.isArray(obj)) {
    return `Array (length: ${obj.length})`;
  }
  return capitalize(typeof obj);
}

function getFieldFromDescriptorEntry([name, descriptor]: [
  string,
  TypedPropertyDescriptor<any> & PropertyDescriptor
]): Field {
  return {
    name,
    value: getValueName(descriptor.value),
  };
}

export function getFields(obj: any) {
  const descriptors = Object.getOwnPropertyDescriptors(obj);
  const descriptorEntries = Object.entries(descriptors);
  return descriptorEntries.map(getFieldFromDescriptorEntry);
}

export function parsePrototypes(obj: any): ParsedObject | undefined {
  if (!obj) {
    return undefined;
  }

  let name;
  if (Object.getOwnPropertyNames(obj).includes('constructor')) {
    name = obj.constructor?.name;
  }

  return {
    name,
    fields: getFields(obj),
    prototype: parsePrototypes(Object.getPrototypeOf(obj)),
  };
}
