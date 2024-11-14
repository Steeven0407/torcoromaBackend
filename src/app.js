import express from 'express'
import partidas from './routes/partidas.routes.js'
import index from './routes/index.routes.js'
const app = express()

app.use(express.json())


app.use(partidas)
app.use(index)

app.use((req, res, next) => {
    res.status(404).json({
        mesagge: 'El endpoint no fue encontrado'
    })
})

export default app