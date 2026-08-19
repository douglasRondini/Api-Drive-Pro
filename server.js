import { app } from './src/app.js'
import swaggerUi from 'swagger-ui-express'
import swaggerJsDoc from 'swagger-jsdoc'
import { ensureDefaultAdmin } from './src/config/adminBootstrap.js'

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Agendamentos CNH',
      version: '1.0.0',
    },
    servers: [
      {
        url: '/', // Usa a origem de onde estiver rodando (Render ou Local)
        description: 'Servidor Atual',
      },
      {
        url: 'https://api-drive-pro.onrender.com',
        description: 'Servidor de Produção (Render)',
      },
      {
        url: 'http://localhost:3000',
        description: 'Servidor Local',
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

// Gera a documentação e registra a rota /docs no app
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const PORT = process.env.PORT || 3000

ensureDefaultAdmin()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT} 🚀`)
      console.log(`Documentação disponível na rota /docs 📄`)
      console.log('Administrador padrão pronto para login: admin@drivepro.com / DrivePro@123')
    })
  })
  .catch((error) => {
    console.error('Erro ao iniciar administrador padrão:', error)
    process.exit(1)
  })