import express from 'express'
import path from 'path'
import swaggerUi from 'swagger-ui-express'
import { fileURLToPath } from 'url'
import { userRoutes } from './routes/userRoutes.js';
import { alunoRoutes } from './routes/alunoRoutes.js';
import { instrutorRoutes } from './routes/instrutorRoutes.js';
import { agendamentoRoutes } from './routes/agendamentoRoutes.js';
import { adminRoutes } from './routes/adminRoutes.js';
import { swaggerDocs } from './config/swagger.js'

const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(express.json())

app.use(express.static(path.join(__dirname, '../public')))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'))
})

// Rota do Swagger
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

// Rotas da API
app.use(userRoutes)
app.use(alunoRoutes)
app.use(instrutorRoutes)
app.use(agendamentoRoutes)
app.use(adminRoutes)

export { app }