export function capitalize(value: string) {
  if (value === '') {
    return value;
  }
  const [firstLetter, ...rest] = value;
  return `${firstLetter.toUpperCase()}${rest.join('')}`;
}

function getConnector(isLast: boolean, isLastPrototype: boolean) {
  let connectingLine = '   ';
  if (!isLastPrototype) {
    connectingLine = '│  ';
  }
  if (isLast) {
    return connectingLine + '  └──';
  } else {
    return connectingLine + '  ├──';
  }
}

function isLast(index: number, length: number) {
  return index == length - 1;
}

export type Options = {
  showSymbols?: boolean;
  showDescriptors?: boolean;
  showProperties?: boolean;
  includeConstructor?: boolean;
  depth?: number;
};
export function logPrototypes(obj: any, opts?: Options): void {
  console.log('----LOG START---\n');

  let currentObj = obj;
  let counter = 0;
  while (currentObj) {
    let isLastPrototype = false;
    if (!Object.getPrototypeOf(currentObj)) {
      isLastPrototype = true;
    }

    if (Object.getOwnPropertyNames(currentObj).includes('constructor')) {
      console.log(
        `${isLastPrototype ? '└──' : '├──'} ${currentObj.constructor.name}`
      );
    } else if (counter === 0) {
      console.log('┌── Initial Object');
    }

    if (opts?.showProperties) {
      let properties = Object.getOwnPropertyNames(currentObj);
      if (!opts.includeConstructor) {
        properties = properties.filter(
          (property) => property !== 'constructor'
        );
      }

      const propertiesString = properties
        .map((property, index) => {
          const connector = getConnector(
            isLast(index, properties.length),
            isLastPrototype
          );
          let type;
          if (
            ['string', 'boolean', 'number', 'undefined'].includes(
              typeof currentObj[property]
            )
          ) {
            type = `${capitalize(typeof currentObj[property])} (${
              currentObj[property]
            })`;
          } else if (Array.isArray(currentObj[property])) {
            type = `Array (length: ${currentObj[property].length})`;
          } else {
            type = capitalize(typeof currentObj[property]);
          }
          return `${connector} '${property}': ${type}`;
        })
        .join('\n');

      if (properties.length > 0) {
        console.log(`${propertiesString}`);
      }
    }

    if (opts?.showSymbols) {
      const symbols = Object.getOwnPropertySymbols(currentObj);
      console.log(`symbols`, symbols);
    }
    if (opts?.showDescriptors) {
      let descriptors = Object.getOwnPropertyDescriptors(currentObj);

      if (!opts.includeConstructor) {
        descriptors = Object.fromEntries(
          Object.entries(descriptors).filter(([name]) => name !== 'constructor')
        );
      }

      const descriptorEntries = Object.entries(descriptors);
      const descriptorsString = descriptorEntries
        .map(([name, descriptor], index) => {
          const connector = getConnector(
            isLast(index, descriptorEntries.length),
            isLastPrototype
          );

          let attributesString = '';
          if (descriptor.writable) {
            attributesString += 'writable ';
          }
          if (descriptor.configurable) {
            attributesString += 'configurable ';
          }
          if (descriptor.enumerable) {
            attributesString += 'enumerable ';
          }
          attributesString = attributesString.slice(0, -1);

          return `${connector} ${name} (${attributesString})`;
        })
        .join('\n');

      if (descriptorEntries.length > 0) {
        console.log(`${descriptorsString}`);
      }
    }
    currentObj = Object.getPrototypeOf(currentObj);
    counter++;
  }
  console.log('\n----LOG END---');
}
