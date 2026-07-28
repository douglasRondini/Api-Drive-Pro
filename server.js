import { app } from './src/app.js'

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT} 🚀`)
  console.log(`Documentação disponível em: http://localhost:${PORT}/docs 📄`)
})

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Agendamentos CNH',
      version: '1.0.0',
    },
    servers: [
      {
        url: '/', // 👈 Recomendado: faz as requisições no mesmo domínio em que o Swagger estiver aberto
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
  apis: ['./src/routes/*.js'], // caminho das suas rotas
};