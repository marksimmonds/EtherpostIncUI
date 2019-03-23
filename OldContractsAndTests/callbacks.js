var myCallback = function(data) {
  console.log('got data: '+data);
};

var usingItNow = function(callback) {
  callback('get it?');
};

usingItNow(myCallback);


// ======================

// setTimeout(function () {
//   console.log("timeout function here...");
// }, 1000);

// var callback = function () {
//   console.log("callback funtion here...");
// };

// // setTimeout(callback, 10000);

// setTimeout(callback, 2000)


// ======================

// // Create a function that accepts another function as an argument
// const callbackAcceptingFunction = (fn) => {
//   // Calls the function with any required arguments
//   return fn(1, 2, 3)
// }

// // Callback gets arguments from the above call
// const callback = (arg1, arg2, arg3) => {
//   return arg1 + arg2 + arg3
// }

// // Passing a callback into a callback accepting function
// const result = callbackAcceptingFunction(callback)
// console.log(result) // 6


// ======================

// Create a function that accepts another function as an argument
// const callbackAcceptingFunction = function (data) {
//   // Calls the function with any required arguments
//   return data(2, 3, 4)
// }

// // Callback gets arguments from the above call
// const addition = function (arg1, arg2, arg3) {
//   return arg1 + arg2 + arg3
// }

// const multiply = function (arg1, arg2, arg3) {
//   return arg1 * arg2 * arg3
// }

// // Passing a callback into a callback accepting function
// const result = callbackAcceptingFunction(addition)
// console.log(result) // 9

// const result2 = callbackAcceptingFunction(multiply)
// console.log(result2) // 24



// ======================

// const numbers = [3, 4, 10, 20]
// const getLessThanFive = num => num < 5
// const getMoreThanTen = num => num > 10

// // Passing getLessThanFive function into filter
// const lesserThanFive = numbers.filter(getLessThanFive)

// // Passing getMoreThanTen function into filter
// const moreThanTen = numbers.filter(getMoreThanTen)

// console.log(`[3, 4, 10, 20] lesserThanFive: ${lesserThanFive}`)
// console.log(`[3, 4, 10, 20] moreThanTen: ${moreThanTen}`)


// ======================

const numbers = [3, 4, 10, 20]

function getLessThanFive(num, l) {
  return num < l
}

let lessThanFive = numbers.filter(getLessThanFive, 5)

console.log(lessThanFive)

