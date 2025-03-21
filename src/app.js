import express from 'express'
import partidas from './routes/partidas.routes.js'
import index from './routes/index.routes.js'
import eventos from './routes/eventosNoticias.routes.js'
import gruposParroquiales from './routes/gruposparroquiales.routes.js'
import cors from 'cors'


const app = express()

app.use(express.json())

app.use(express.json())
app.use (cors({
    origin:['http://localhost:5173']}))




app.use(partidas)
app.use(index)
app.use(eventos)
app.use(gruposParroquiales)

app.use((req, res, next) => {
    res.status(404).json({
        mesagge: 'El endpoint no fue encontrado'
    })
})

export default app