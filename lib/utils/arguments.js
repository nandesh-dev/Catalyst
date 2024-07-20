/**
 * Parse an array of arguments.
 * @returns {Object<string, string|boolean>}
 */
function parseArguments(args) {
  return args.reduce((accumulator, arg, index, args) => {
    if (arg.startsWith("--")) {
      if (index + 1 < args.length && !args[index + 1].startsWith("--")) {
        return {
          [arg.slice(2)]: args[index + 1],
          ...accumulator,
        };
      } else {
        return {
          [arg.slice(2)]: true,
          ...accumulator,
        };
      }
    }

    return accumulator;
  }, {});
}

export const Args = Object.freeze(parseArguments(process.argv));
