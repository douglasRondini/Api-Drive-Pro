import { Router } from 'express'
import { AgendamentoController } from '../controllers/AgendamentoController.js'

const agendamentoRoutes = Router()
const agendamentoController = new AgendamentoController()

/**
 * @swagger
 * /agendamentos:
 *   post:
 *     summary: Cria uma solicitação de aula (aluno agenda com ou sem instrutor definido)
 *     tags: [Agendamentos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [alunoId, localOrigem, dataHora]
 *             properties:
 *               alunoId:
 *                 type: string
 *               instrutorId:
 *                 type: string
 *                 description: Opcional. Se omitido, a solicitação fica em aberto para qualquer instrutor aceitar.
 *               localOrigem:
 *                 type: string
 *               dataHora:
 *                 type: string
 *                 format: date-time
 *               preco:
 *                 type: number
 *             example:
 *               alunoId: "652f1c2e8f1b2c3a4d5e6f7a"
 *               instrutorId: "652f1c2e8f1b2c3a4d5e6f7b"
 *               localOrigem: "Av. Paulista, 1000"
 *               dataHora: "2026-08-05T14:00:00.000Z"
 *               preco: 120.5
 *     responses:
 *       201:
 *         description: Solicitação criada com sucesso (status inicial PENDENTE)
 *       400:
 *         description: Dados inválidos, aluno/instrutor inexistente ou conflito de horário
 */
agendamentoRoutes.post('/agendamentos', (req, res) => agendamentoController.create(req, res))

/**
 * @swagger
 * /agendamentos/{id}:
 *   get:
 *     summary: Busca um agendamento pelo ID
 *     tags: [Agendamentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dados do agendamento
 *       404:
 *         description: Agendamento não encontrado
 */
agendamentoRoutes.get('/agendamentos/:id', (req, res) => agendamentoController.getById(req, res))

/**
 * @swagger
 * /agendamentos/aluno/{alunoId}:
 *   get:
 *     summary: Lista os agendamentos solicitados por um aluno
 *     tags: [Agendamentos]
 *     parameters:
 *       - in: path
 *         name: alunoId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de agendamentos do aluno
 *       404:
 *         description: Aluno não encontrado
 */
agendamentoRoutes.get('/agendamentos/aluno/:alunoId', (req, res) => agendamentoController.listByAluno(req, res))

/**
 * @swagger
 * /agendamentos/instrutor/{instrutorId}:
 *   get:
 *     summary: Lista os agendamentos vinculados a um instrutor
 *     tags: [Agendamentos]
 *     parameters:
 *       - in: path
 *         name: instrutorId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de agendamentos do instrutor
 *       404:
 *         description: Instrutor não encontrado
 */
agendamentoRoutes.get('/agendamentos/instrutor/:instrutorId', (req, res) => agendamentoController.listByInstrutor(req, res))

/**
 * @swagger
 * /agendamentos/{id}/aceitar:
 *   patch:
 *     summary: Instrutor aceita uma solicitação pendente (própria ou em aberto)
 *     tags: [Agendamentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [instrutorId]
 *             properties:
 *               instrutorId:
 *                 type: string
 *             example:
 *               instrutorId: "652f1c2e8f1b2c3a4d5e6f7b"
 *     responses:
 *       200:
 *         description: Agendamento aceito (status ACEITA)
 *       400:
 *         description: Não é possível aceitar (status inválido, conflito de horário ou instrutor divergente)
 */
agendamentoRoutes.patch('/agendamentos/:id/aceitar', (req, res) => agendamentoController.aceitar(req, res))

/**
 * @swagger
 * /agendamentos/{id}/recusar:
 *   patch:
 *     summary: Recusa uma solicitação pendente
 *     tags: [Agendamentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Agendamento recusado (status RECUSADA)
 *       400:
 *         description: Não é possível recusar a partir do status atual
 */
agendamentoRoutes.patch('/agendamentos/:id/recusar', (req, res) => agendamentoController.recusar(req, res))

/**
 * @swagger
 * /agendamentos/{id}/cancelar:
 *   patch:
 *     summary: Cancela uma solicitação pendente ou já aceita
 *     tags: [Agendamentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Agendamento cancelado (status CANCELADA)
 *       400:
 *         description: Não é possível cancelar a partir do status atual
 */
agendamentoRoutes.patch('/agendamentos/:id/cancelar', (req, res) => agendamentoController.cancelar(req, res))

/**
 * @swagger
 * /agendamentos/{id}/concluir:
 *   patch:
 *     summary: Marca uma aula aceita como concluída
 *     tags: [Agendamentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Agendamento concluído (status CONCLUIDA)
 *       400:
 *         description: Não é possível concluir a partir do status atual
 */
agendamentoRoutes.patch('/agendamentos/:id/concluir', (req, res) => agendamentoController.concluir(req, res))

export { agendamentoRoutes }
