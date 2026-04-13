async function carregarTarefas() {
    const res = await fetch('http://localhost:3000/tarefas');
    const tarefas = await res.json();

   
    document.querySelectorAll('.cards').forEach(c => c.innerHTML = '');

    tarefas.forEach(t => {
        const card = document.createElement('div');
        card.className = `card prio-${t.prioridade}`;
        card.innerHTML = `
            <p><strong>${t.descricao}</strong></p>
            <p>Setor: ${t.setor}</p>
            <p>Resp: ${t.nome_usuario}</p>
            <div class="actions">
                <button onclick="editar(${t.id})">Editar</button>
                <button onclick="excluir(${t.id})">Ecluir</button>
                <select onchange="mudarStatus(${t.id}, this.value)">
                    <option value="a fazer" ${t.status === 'a fazer' ? 'selected' : ''}>A Fazer</option>
                    <option value="fazendo" ${t.status === 'fazendo' ? 'selected' : ''}>Fazendo</option>
                    <option value="pronto" ${t.status === 'pronto' ? 'selected' : ''}>Pronto</option>
                </select>
            </div>
        `;
        document.querySelector(`#${t.status.replace(' ', '-') } .cards`).appendChild(card);
    });
}

async function excluir(id) {
    if (confirm("Deseja excluir esta tarefa?")) {
        await fetch(`http://localhost:3000/tarefas/${id}`, { method: 'DELETE' });
        carregarTarefas();
    }
}

async function mudarStatus(id, novoStatus) {
  
    await fetch(`http://localhost:3000/tarefas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: novoStatus })
    });
    carregarTarefas();
}

carregarTarefas();