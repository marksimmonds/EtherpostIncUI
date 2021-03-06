// /_ ES5 _/
var isMomHappy = false;

// // Promise
// var willIGetNewPhone = new Promise(
//     function (resolve, reject) {
//         if (isMomHappy) {
//             var phone = {
//                 brand: 'Samsung',
//                 color: 'black'
//             };
//             resolve(phone); // fulfilled
//         } else {
//             var reason = new Error('mom is not happy');
//             reject(reason); // reject
//         }

//     }
// );


// // call our promise
// var askMom = function () {
//     willIGetNewPhone
//         .then(function (resolve) {
//             // yay, you got a new phone
//             console.log('got me a phone:', resolve);
//          // output: { brand: 'Samsung', color: 'black' }
//         })
//         .catch(function (error) {
//             // oops, mom don't buy it
//             console.log(error.message);
//          // output: 'mom is not happy'
//         });
// };

// askMom();



// Promise
// const willIGetNewPhone = new Promise(
//     (resolve, reject) => { // fat arrow
//         if (isMomHappy) {
//             const phone = {
//                 brand: 'Samsung',
//                 color: 'black'
//             };
//             resolve(phone);
//         } else {
//             const reason = new Error('mom is not happy');
//             reject(reason);
//         }

//     }
// );

// const showOff = function (phone) {
//     const message = 'Hey friend, I have a new ' +
//                 phone.color + ' ' + phone.brand + ' phone';
//     return Promise.resolve(message);
// };

// // call our promise
// const askMom = function () {
//     willIGetNewPhone
//         .then(showOff)
//         .then(fulfilled => console.log(fulfilled)) // fat arrow
//         .catch(error => console.log(error.message)); // fat arrow
// };

// askMom();

// promise syntax look like this
// new Promise(/_ executor_/ function (resolve, reject) { ... } );



const arr = [ { key: 1 }, { key: 2 }, { key: 3 } ]

const results = arr.map(async (obj) => { return obj.key; });
// document.writeln( `Before waiting: ${results}`);

Promise.all(results).then((completed) => console.log( `\nResult: ${completed}`));

let p = Promise.all(results).then((completed) => console.log( `\nResult from var p: ${completed}`));

let q = Promise.all(results)

q.then((completed) => console.log( `\nResult from var q: ${completed}`));


function r() {
    return Promise.all(results)
}

r().then((data) => console.log(data))
