const { expect } = require('chai')
const { AsyncExecutionContext } = require('../src/async-execution-context.js')

function log(...args) {
  require('fs').writeSync(1, `${require('util').format(...args)}\n`)
}

describe('Async Execution Context', () => {
  let ctx

  beforeEach(() => {
    ctx = new AsyncExecutionContext()
  })

  describe('context behaviour', () => {
    it('should store values for the current context', async () => {
      const context = ctx.current

      context.someValue = 10
      context.anotherValue = 'Hello, World!'

      const childContexts = []

      await Promise.all([1,2.3].map(() => {
        return new Promise(resolve => setTimeout(() => {
          resolve(childContexts.push(ctx.current))
        }))
      }))

      for (let childContext of childContexts) {
        expect(childContext).to.have.property('someValue',    context.someValue)
        expect(childContext).to.have.property('anotherValue', context.anotherValue)
      }
    })


    it('should not pollute sibling contexts', async () => {
      const siblingContexts = []
      const parentContext = ctx.current

      const props = ['prop1', 'prop2', 'prop3']

      await Promise.all(props.map((prop, index) => {
        return new Promise(resolve => setTimeout(() => {
          const context = ctx.current

          context[prop] = 'value' + index

          siblingContexts.push(context)

          resolve()
        }))
      }))

      for (let index of siblingContexts.keys()) {
        const context = siblingContexts[index]
        const prop    = props[index]

        for (let anotherContext of siblingContexts) {
          if (context === anotherContext) {
            continue
          }

          expect(anotherContext).to.not.have.property(prop)
        }
      }
    })

    it('should make a context on a previous nesting level to be a prototype of the current context', async () => {
      let context1, context2, context3, context4

      context1 = ctx.current
      context1.a = 10

      await Promise.resolve().then(() => {
        context2 = ctx.current
        context2.b = 20
      })

      await Promise.resolve().then(() => {
        context3 = ctx.current
        context3.c = 40
      })

      context4 = ctx.current

      expect(context1.isPrototypeOf(context2)).to.be.true
      expect(context1.isPrototypeOf(context3)).to.be.true
      expect(context1.isPrototypeOf(context4)).to.be.true

      expect(context2.isPrototypeOf(context3)).to.be.false
      expect(context2.isPrototypeOf(context4)).to.be.false

      expect(context3.isPrototypeOf(context4)).to.be.false
    })
  })

  describe('proxy', () => {
    it('should retrive property value from the current context', () => {
      const context = ctx.current
      const proxy   = ctx.proxy

      const props = ['prop1', 'prop2', 'prop3']

      for (let prop of props) {
        context[prop] = 'value' + Math.random()
      }

      for (let prop of props) [
        expect(proxy).to.have.property(prop, context[prop])
      ]
    })

    it('should not return values from othe contexts', async () => {
      const context = ctx.current
      const proxy   = ctx.proxy

      const props = ['prop1', 'prop2', 'prop3']

      await new Promise((resolve) => setTimeout(() => {
        const childContext = ctx.current

        for (let prop of props) {
          childContext[prop] = 'value' + Math.random()
        }

        resolve()
      }))

      for (let prop of props) [
        expect(proxy).to.not.have.property(prop)
      ]
    })
  })
})
