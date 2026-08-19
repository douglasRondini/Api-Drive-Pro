export function buildDashboardSummary({ users = [], alunos = [], instrutores = [] }) {
  const totalUsuarios = users.length
  const totalAlunos = alunos.length
  const totalInstrutores = instrutores.length

  const usuariosPorRole = users.reduce((acc, user) => {
    const role = user.role || 'Aluno'
    acc[role] = (acc[role] || 0) + 1
    return acc
  }, {})

  const instrutoresAtivos = instrutores.filter((instrutor) => instrutor.disponivel === true).length
  const instrutoresInativos = totalInstrutores - instrutoresAtivos

  return {
    totalUsuarios,
    totalAlunos,
    totalInstrutores,
    instrutoresAtivos,
    instrutoresInativos,
    usuariosPorRole,
    usuariosRecentes: users.slice(0, 5)
  }
}
