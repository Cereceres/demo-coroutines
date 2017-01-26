'use strict'
// demo using co
const co = require('co')
var i = 2
let otherGen= function *  () {
  // the context is the same of coroutine
  console.log('context in otherGen is', this);
  // catch the result from promise too
   let res = yield Promise.resolve('me is ' + (i ===2 ? 'second' : 'third'))
  console.log(res);
  i++
};
let iterater = otherGen.call({this: 'context is different because generator is instanced'})
// you pass a generator to coroutine
let returned = co.call({this: 'is context' },function *  () {
  // the context is passed to generator
  console.log('context in otherGen is', this);
  // you can yield a promise
   let res = yield Promise.resolve('me is first')
   // the value returned by the coroutine is the value which the promise is resolved
   console.log(res)
   // you can yield a generator
   yield otherGen
   // you can yield  a interater
   yield iterater
   // random
   let random = Math.random()
   // if you yield a promise rejected the flow is stopped and the promise returned by the coroutine
   // is rejected
   if(random < 0.33) yield Promise.reject('the promise is rejected')
   // the same if a exeption is thrown
   else if(random < 0.66) throw new Error('if a error is throw in coroutine, is catched')
   // the flow finish when all the generator is iterated
   return yield Promise.resolve('the coroutine finish here and you can resolve the promise')
})
// returned is a promise
returned.then(value => {
  // you can get the result from coroutine
  console.log(value);
})
// every axeption or promise rejected is catched here
.catch((err) => {
  console.log('every error is catched ', err)
})
