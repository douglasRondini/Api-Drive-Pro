import test from 'node:test'
import assert from 'node:assert/strict'

import { buildDashboardSummary } from '../src/services/AdminDashboardService.js'

test('buildDashboardSummary calcula métricas do painel administrativo', () => {
  const dashboard = buildDashboardSummary({
    users: [
      { id: '1', email: 'a@a.com', name: 'Aluno', age: '20', role: 'Aluno' },
      { id: '2', email: 'b@b.com', name: 'Instrutor', age: '30', role: 'Instrutor' },
      { id: '3', email: 'c@c.com', name: 'Admin', age: '40', role: 'ADMIN' },
      { id: '4', email: 'd@d.com', name: 'Aluno 2', age: '25', role: 'Aluno' }
    ],
    alunos: [{ id: '1' }, { id: '4' }],
    instrutores: [{ id: '2', disponivel: true }, { id: '5', disponivel: false }]
  })

  assert.equal(dashboard.totalUsuarios, 4)
  assert.equal(dashboard.totalAlunos, 2)
  assert.equal(dashboard.totalInstrutores, 2)
  assert.equal(dashboard.instrutoresAtivos, 1)
  assert.equal(dashboard.instrutoresInativos, 1)
  assert.equal(dashboard.usuariosPorRole.Aluno, 2)
  assert.equal(dashboard.usuariosPorRole.Instrutor, 1)
  assert.equal(dashboard.usuariosPorRole.ADMIN, 1)
})
