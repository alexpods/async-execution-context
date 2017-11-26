# async-execution-context
[![Build Status](https://travis-ci.org/alexpods/async-execution-context.svg?branch=master)](https://travis-ci.org/alexpods/async-execution-context)

An execution context that persists across async tasks



## Example

```js
const { ctx } = require('async-execution-context')

(async () => {
  ctx.prop1 = 10

  await Promise.resolve().then(() => {
    ctx.prop2 = 20

    console.log(ctx.prop1) // 10
    console.log(ctx.prop2) // 20
  })

  console.log(ctx.prop1) // 10
  console.log(ctx.prop2) // undefined
})()
```

Express application:
```js
// after authentication
app.use((req, res) => {
  ctx.user = req.user
})

// some API endpoint
app.get('/pizza', async (req, res) => {
  const pizza = await getPizza()

  return res.status(200).send(pizza)
})

// get-pizza.js
const { ctx } = require('async-execution-context')

async function getPizza() {
  const pizza = await getPizzaFromDB()

  console.log(`User ${ctx.user.name} wants a slice of pizza!`)

  return pizza
}
```