const iwd = require('./index.js')

iwd('2018-12-25').then(result => {console.log(result)}) //false
iwd('2018-12-24').then(result => {console.log(result)}) //true