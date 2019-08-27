const curry = fn => {
  if (typeof fn !== "function") {
    throw Error("No function provided");
  }
  return function curriedFn(...args) {
    if (args.length < fn.length) {
      return function() {
        args = [...args, ...arguments];
        return curriedFn(...args);
      };
    }
    return fn(...args);
  };
};

const multiply = (x, y, z) => x * y * z;
console.log(curry(multiply)(1, 3)(3)); //6
