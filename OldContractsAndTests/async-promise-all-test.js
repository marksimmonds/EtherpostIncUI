

const fetch = require('node-fetch')

// // L1
// console.log('🥪 Synchronous 1');

// // L2
// setTimeout(_ => console.log(`🍅 Timeout 2`), 0);

// // L3
// Promise.resolve().then(_ => console.log('🍍 Promise 3'));

// // L4
// console.log('🥪 Synchronous 4');



const promise = fetch('https://jsonplaceholder.typicode.com/todos/1')

promise
  .then(res => res.json())
  .then(todo => console.log('😛', todo.title))
  .catch(err => console.error('😭', err))

console.log('🥪 Synchronous')



// const arr = [ { key: 1 }, { key: 2 }, { key: 3 } ]

// // const x = (function () {
// //   Promise.all(arr.map(async (obj) => { return await obj.key; }))
// //   .then((completed) => console.log( `\nResult: ${completed}`))
// // })()

// const y = function () {
//   Promise.all(arr.map(async (obj) => { return await obj.key; }))
//   .then((completed) => console.log( `\nResult (const y = function(){}): ${completed}`))
// }
// // console.log(`y1 : ${y()}`)
 

// function f1(p1){
//     Promise.all(p1.map(async (obj) => { return await obj.key; }))
//     .then((completed) => console.log( `\nResult (function f1(p1)): ${completed}`))
// }

// let x

// function f2(p1){
//     Promise.all(p1.map(async (obj) => { return await obj.key; }))
//     .then((completed) => x = completed)
// }

// // console.log(`f1(arr) with console.log, ${f1(arr)}`)
// function timeout(ms) {
//   setTimeout(function(){ 
//     console.log("Hello"); }, ms);
// }

// console.log(x)
// timeout(3000) 


// // let test = console.log('this is a test')


// function z2(p1){
//     Promise.all(p1.map(async (obj) => { return await obj.key; }))
//     .then((completed) => console.log( `\nResult z2 - (function z(p1)): ${completed}`))
// }
// console.log(`2nd go (z2): ${z2(arr)}`) //returns undefined, but promise is returned later

// console.log('does this work y1 ?', y())  //returns undefined, but promise is returned later
// console.log(`does this work y2 ? ${y()}`) //returns undefined, but promise is returned later
// console.log(y()) //returns undefined, but promise is returned later



// console.log('let xx = async...:')
// let zz = async () => {console.log(`z(arr): ${await z(arr)}`)}

// console.log('zz:')
// zz()

// console.log('z(arr):')
// z(arr)
// // async function (resolve) => await x

// console.log(`here is text: ${text}`)
// console.log(`After waiting: ${results}`)

// // await Promise.all(array.map(async (element) => {console.log('do async operation')}))


// // const resultsPromise = arr.map(async (obj) => { return obj.key; })
// // // document.writeln( `Before waiting: ${results}`);

// // const results2 = await Promise.all(resultsPromise)

// // console.log(`\nResult: ${results2}`)


// // Some random async functions that deal with value
// async function thingOne(obj) { return obj.key }
// // async function thingTwo(value) { ... }
// // async function thingThree(value) { ... }

// async function doManyThings(obj) {
//   var result = await thingOne(obj)
//   // var resultTwo = await thingTwo(result);
//   // var finalResult = await thingThree(resultTwo);

//   return result;
// }

// console.log(`============`)
// for (i=0; i<arr.length; i++){
// 	console.log(`arr[i].key: ${arr[i].key}`)
// 	console.log(`Do Many Things: ${doManyThings(arr[i])}`)
// }


// // Call doManyThings()

// // // Some random async functions that deal with value
// // async function thingOne() { ... }
// // async function thingTwo(value) { ... }
// // async function thingThree(value) { ... }

// // async function doManyThings() {
// //   var result = await thingOne();
// //   var resultTwo = await thingTwo(result);
// //   var finalResult = await thingThree(resultTwo);

// //   return finalResult;
// // }

// // // Call doManyThings()


// console.log('========== BASIC CALLBACK EXAMPLE ====================')

// doThingOne(function() {
// 		return 'first'
//   doThingTwo(function() {
//   	return 'second'
//     doThingThree(function() {
//     	return 'third'
//       doThingFour(function() {
//       	return 'fourth'
//         // Oh no
//       });
//     });
//   });
// });

// console.log(`Callback Example: ${doThingOne()}`)

// console.log('========== BASIC ASYNC AWAIT EXAMPLE ====================')

// setTimeout(function() {
//   console.log('This runs after 5 seconds');
// }, 5000);

// console.log('This runs first');



// console.log('=========== BASIC PROMISE EXAMPLE ===================')
// const firstPromise = new Promise(function(resolve) {
//   resolve("first")
// })
// const secondPromise = new Promise(function(resolve) {
//   resolve("second")
// })

// const thirdPromise = new Promise(function(resolve) {
//   resolve("third")
// })

// const doAllThings = firstPromise
// .then(function() {
//   return secondPromise
// })
// .then(function() {
// 	return thirdPromise
// })

// doAllThings.then(function(result) {
//   console.log(result); // This logs: "second"
// });
