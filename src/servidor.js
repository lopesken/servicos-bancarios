const express = require('express')
const rotas = require('./rotas/rotas');

const app = express()

app.use(express.json())
app.use(rotas)
const port = process.env.PORT

app.listen(3000, () => {
    console.log(`Servidor esta rodando na porta http://localhost:${port}`)
})