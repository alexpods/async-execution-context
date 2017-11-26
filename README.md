# async-execution-context
An execution context that persists across async tasks

## Example

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