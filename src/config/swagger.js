import swaggerJsdoc from 'swagger-jsdoc'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Agendamentos CNH (Alunos & Instrutores) com Node.js & Prisma',
      version: '1.0.0',
    },
    servers: [{ url: 'http://localhost:3000' }],
  },
  apis: ['./src/routes/*.js'], // Lê as rotas dentro da pasta src/routes
}

export const swaggerDocs = swaggerJsdoc(options)