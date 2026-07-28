import express from 'express'
import swaggerUi from 'swagger-ui-express'
import { userRoutes } from './routes/userRoutes.js';
import { alunoRoutes } from './routes/alunoRoutes.js';
import { instrutorRoutes } from './routes/instrutorRoutes.js';
import { agendamentoRoutes } from './routes/agendamentoRoutes.js';
import { swaggerDocs } from './config/swagger.js'

const app = express()

app.use(express.json())

// Rota do Swagger
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

// Rotas da API
app.use(userRoutes)
app.use(alunoRoutes)
app.use(instrutorRoutes)
app.use(agendamentoRoutes)

export { app }