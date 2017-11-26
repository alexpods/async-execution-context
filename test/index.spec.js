const { expect } = require('chai')
const { AsyncExecutionContext } = require('../src/async-execution-context')


describe('async-execution-context module', () => {
  const mod = require('../src/index.js')

  it('should export a context proxy as a "ctx" property', async () => {
    const { ctx } = mod

    await Promise.resolve().then(async () => {
      ctx.prop1 = 10

      await Promise.resolve().then(() => {
        ctx.prop2 = 20
      })

      await Promise.resolve().then(() => {
        expect(ctx).to.have.property('prop1', 10)
        expect(ctx).to.not.have.property('prop2', 20)
      })
    })
  })

  it('should export a global async execution context instance as a "context" property', async () => {
    const { context } = mod

    expect(context).to.be.instanceof(AsyncExecutionContext)

    const parentContext = context.current

    await Promise.resolve().then(async () => {
      expect(parentContext.isPrototypeOf(context.current))
    })
  })

  it('should export the AsyncExecutionContext class', () => {
    expect(mod.AsyncExecutionContext).to.equal(AsyncExecutionContext)
  })
})