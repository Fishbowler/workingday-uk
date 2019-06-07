const govBankHolidays = 'https://www.gov.uk/bank-holidays.json'

const isWeekend = (date) => {
    const dayOfWeek = date.getDay()
    if (dayOfWeek == 0 || dayOfWeek == 6) {
        return true
    }
    return false
}

const getBankHolidayData = (() => {
    return makeRequest(govBankHolidays)
        .then((bhData) => {
            const bhDateArray = bhData['england-and-wales']['events']
            const bhDatesOnly = bhDateArray.reduce((acc, val) => acc.concat(val.date), [])
            return Promise.resolve(bhDatesOnly)
        })
})

const isBankHoliday = (dateString) => {
    return getBankHolidayData()
        .then((bankHolidays) => {
            return Promise.resolve(bankHolidays.includes(dateString))
        })
}

const isWorkingDay = function () { //Can't be an arrow function - we need `arguments`
    const args = Array.from(arguments)

    //Date parsing from params - only one of these will be populated
    let dateString = isDateString(args[0]) && args.shift()
    let date = !dateString && ((isInstanceOfDate(args[0]) && args.shift()) || new Date())

    //Get the representations to match up - we need both
    if (dateString) {
        date = new Date(dateString)
    } else if (date) {
        dateString = getDateString(date)
    }

    //If params were supplied, but the parsing failed
    if (!date && !dateString) {
        throw new Error('Couldn\'t parse date from input. Must be a Date object, or a string in the format DD-MM-YYYY.')
    }

    //Check for weekend first - this is cheap
    if (isWeekend(date)) {
        return Promise.resolve(false)
    }

    return isBankHoliday(dateString)
        .then(isBH => {
            return Promise.resolve(!isBH)
        })
}

const getDateString = (date) => {
    return date.toISOString().substring(0, 10)
}

const isInstanceOfDate = (date) => {
    return (date instanceof Date &&
        Object.prototype.toString.call(date) === '[object Date]')
}

const isDateString = (dateString) => {
    const dateStringRegex = /\d\d\d\d-\d\d-\d\d/
    return (typeof dateString === 'string') &&
        (dateString.length == 10) &&
        dateStringRegex.test(dateString)
}

const makeRequest = (url) => {
    return new Promise((resolve, reject) => {
            const lib = url.startsWith('https') ? require('https') : require('http');
            const request = lib.get(url, (response) => {
                if (response.statusCode < 200 || response.statusCode > 299) {
                    reject(new Error('Failed to fetch data, status code: ' + response.statusCode));
                }
                const body = [];
                response.on('data', (chunk) => body.push(chunk));
                response.on('end', () => resolve(body.join('')));
            })
            request.on('error', (err) => reject(err))
        })
        .then(response => {
            return JSON.parse(response)
        })

}

module.exports = isWorkingDay