const { AsyncExecutionContext } = require('./async-execution-context')

let context = null

function ensureContext() {
  if (!context) {
    context = new AsyncExecutionContext()
  }

  return context
}

module.exports = {
  AsyncExecutionContext,

  get ctx() {
    return ensureContext().proxy
  },

  get context() {
    return ensureContext()
  },
}
