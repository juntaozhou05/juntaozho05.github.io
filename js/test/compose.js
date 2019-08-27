function compose(...args) {
  const fns = [].slice.call(args);
  return function(initValue) {
    let res = initValue;
    for (let i = fns.length - 1; i > -1; i--) {
      res = fns[i](res);
    }
    return res;
  };
}
function pipe(...args) {
  const fns = [].slice.call(args);
  return function(initValue) {
    let res = initValue;
    for (let i = 0; i < fns.length; i++) {
      res = fns[i](res);
    }
    return res;
  };
}
// const composeRight = (...args) => x =>
//   args.reduceRight((value, item) => item(value), x);
// const compose = (...args) => x =>
//   args.reduce((value, item) => item(value), x);

const add = name => name + "1";
const upper = name => name.toUpperCase() + "2";
const addHi = name => "hi" + name;
const fn = pipe(
  add,
  upper,
  addHi
);
console.log(fn("abc"));
