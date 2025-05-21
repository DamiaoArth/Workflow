Objetivo: Desenvolver um aplicativo web em React com Tailwind CSS para criar um workspace com dois modos (Plan e Work), utilizando agentes IA autônomos implementados com o framework Agno. O foco é permitir o gerenciamento de tarefas e execução de projetos pessoais por meio de Kanban automatizado por agentes, com chat inteligente, logs, e execução via IA.

🎯 Escopo Funcional
1. Workspace com Dois Modos:
Plan: permite criar novos projetos e tarefas.

As tarefas podem ser adicionadas ao Kanban ou disparar workflows no n8n.

Work: execução direta de tarefas via chat.

2. Sistema de Agentes Inteligentes (via Agno):
Um agente atua como Gerente de Projeto: recebe o objetivo do usuário e divide em funcionalidades.

Outro agente é o Scrum Master: organiza as funcionalidades em sprints, distribui tarefas e gera cards no Kanban.

Todos os agentes são feitos com Agno Framework e utilizam modelos como GPT-4o-mini.

3. Kanban Inteligente:
Colunas padrão: Backlog, To Do, In Progress, In Review, Done.

Os agentes controlam a movimentação dos cards:

Quando uma tarefa vai pra To Do, um agente é escalado.

Tarefas completadas vão pra In Progress, e depois In Review.

Se In Review requer intervenção humana, o item aguarda; caso contrário, vai pra Done.

O humano pode comentar e retornar tarefas para To Do ou In Progress.

4. Log e Dashboard:
Painel com:

Kanban por sprint.

Log de ações dos agentes.

Linha do tempo das tarefas.

Agendamentos e revisões.

🛠 Tecnologias:
React (JSX)

Tailwind CSS

Agno Framework (agentes)

OpenAI/OpenRouter GPT-4o-mini API

n8n (opcional - integração modo Plan)

🧩 Funcionalidades dos Agentes:
Separar objetivo do usuário em funcionalidades via GPT-4o-mini.

Organizar funcionalidades em sprints, com prioridade e dependências.

Gerar cards do Kanban automaticamente, colocando em To Do.

Escalar agentes IA automaticamente para executar tarefas.

Gerenciar transição entre colunas com lógica contextual.

Emitir logs de sucesso, falha e decisões do agente.

🔄 Fluxo Esperado
Usuário digita no chat: "Quero criar um app de notas com login e exportação PDF"

Agente 1 (Gerente) separa isso em:

Criar tela de login

Criar CRUD de notas

Exportar notas em PDF

Agente 2 (Scrum Master) organiza:

Sprint 1: Login e CRUD

Sprint 2: PDF e ajustes finais

Tarefas são enviadas para o Kanban com status To Do

Cada tarefa ganha um agente executor (via GPT-4o-mini)

O fluxo de tarefas segue até Done, com logs em cada etapa.


