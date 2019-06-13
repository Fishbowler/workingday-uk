const iwd = require('../index.js')

var chai = require("chai");
chai.use(require("chai-as-promised"));
const expect = chai.expect;

const nock = require('nock')

it('should return false if passed Christmas Day as a string', (done)=>{
    expect(iwd('2018-12-25')).to.eventually.be.false
    .notify(done)
})

it('should return false if passed Christmas Day as a date', (done)=>{
    expect(iwd(new Date(2018,11,25))).to.eventually.be.false
    .notify(done)
})

it('should return true if passed Christmas Eve 2018 as a string', (done)=>{
    expect(iwd('2018-12-24')).to.eventually.be.true
    .notify(done)
})

it('should return true if passed Christmas Eve 2018 as a date', (done)=>{
    expect(iwd(new Date(2018,11,24))).to.eventually.be.true
    .notify(done)
})

it('should return the same value online or offline', (done)=>{ //intentionally uses "today" to introduce potential flakyness - maybe it'll find something
    iwd(true)
    .then(onlineResult => {
        expect(iwd(false)).to.eventually.equal(onlineResult).notify(done)
    })
})

describe('intercepted tests', ()=>{

    beforeEach(()=>{
        const mockAPIResponse = {
            "england-and-wales": {
                "division": "england-and-wales",
                "events": [
                    {
                        "title": "Testing Day",
                        "date": "2019-06-13",
                        "notes": "The day of testing",
                        "bunting": true
                    }
                ]
            }
        }

        nock('https://www.gov.uk')
            .get('/bank-holidays.json')
            .reply(200, mockAPIResponse)
    })

    afterEach(()=>{
        nock.restore()
        nock.cleanAll()
        nock.enableNetConnect()
        nock.activate()
    })

    it('should honour the values of the API when online', (done)=>{
        expect(iwd('2019-06-13',false)).to.eventually.be.false.notify(done)
    })

})

