# workingday-uk
Promise-based node package to determine if a date is a working day in the UK, based on being a weekday, and not a bank holiday, according to the UK government website.

## Usage

```js
fn([string isoDate]|[Date date], [boolean offline])
```

* Takes an optional Date object or a string in the format YYYY-mm-DD. Default: today
* Takes an optional boolean whether to work offline. Default: true (using a local copy of the GOV.UK bank holiday API response)

### Examples

Use with no params for today
```js
const isWorkingDay = require('workingday-uk')

isWorkingDay()
.then(iwd => {
    console.log('Today is a working day? ' + iwd)
})
```

Use with a date
```js
const isWorkingDay = require('workingday-uk')

const dateToCheck = new Date(2000, 0, 1) //1st Jan 2000

isWorkingDay(dateToCheck)
.then(iwd => {
    console.log(iwd) //False
})
```

Use with a date string of YYYY-MM-DD
```js
const isWorkingDay = require('workingday-uk')

const dateToCheck = '2019-12-24'

isWorkingDay(dateToCheck)
.then(iwd => {
    console.log(iwd) //True - Tuesday, and not a bank holiday
})
```

Check online for today
```js
const isWorkingDay = require('workingday-uk')

isWorkingDay(false)
.then(iwd => {
    console.log('Today is a working day? ' + iwd)
})
```

Check online for Christmas Day
```js
const isWorkingDay = require('workingday-uk')

const dateToCheck = '2019-12-25'

isWorkingDay(dateToCheck, false)
.then(iwd => {
    console.log(iwd) //False
})
```