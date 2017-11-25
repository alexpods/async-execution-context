const expect = require('chai').expect
const context = require('../index.js')

describe('Test', () => {

  it('should work', () => {
    expect(context.test()).to.be.true
  })
})
