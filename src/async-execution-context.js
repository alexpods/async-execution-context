const asyncHooks = require('async_hooks')

class AsyncExecutionContext {

  constructor() {
    this._store = {}
    this._hook  = this._createHook()
    this._proxy = null

    this._ensureContext()

    this.enable()
  }

  get current() {
    return this._ensureContext()
  }

  get proxy() {
    if (this._proxy) {
      return this._proxy
    }

    return this._proxy = new Proxy({}, {
      get: (target, property) => {
        return this.current[property]
      },

      set: (target, property, value) => {
        this.current[property] = value
      },

      has: (target, property) => {
        return property in this.current
      }
    })
  }

  enable() {
    return this._hook.enable()
  }

  disable() {
    return this._hook.disable()
  }

  _createHook() {
    return asyncHooks.createHook({
      init: (asyncId, type, triggerAsyncId) => {
        this._store[asyncId] = this._createContext(asyncId, triggerAsyncId)
      },
      destroy: (asyncId) => {
        delete this._store[asyncId]
      }
    })
  }

  _ensureContext() {
    const asyncId = asyncHooks.executionAsyncId()

    if (!this._store[asyncId]) {
      this._store[asyncId] = this._createContext(asyncId, asyncHooks.triggerAsyncId())
    }

    return this._store[asyncId]
  }

  _createContext(asyncId, parentAsyncId) {
    return Object.create(this._store[parentAsyncId] || Object.prototype)
  }
}

module.exports = { AsyncExecutionContext }
