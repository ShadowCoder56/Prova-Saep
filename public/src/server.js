const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'saep_kanban'
});


app.post('/usuarios', (req, res) => {
    const { nome, email } = req.body;
    db.query('INSERT INTO usuarios (nome, email) VALUES (?, ?)', [nome, email], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ msg: "Usuário cadastrado!" });
    });
});

app.get('/usuarios', (req, res) => {
    db.query('SELECT * FROM usuarios', (err, results) => {
        res.json(results);
    });
});

app.post('/tarefas', (req, res) => {
    const { id_usuario, descricao, setor, prioridade, data_cadastro } = req.body;
    db.query('INSERT INTO tarefas (id_usuario, descricao, setor, prioridade, data_cadastro) VALUES (?, ?, ?, ?, ?)', 
    [id_usuario, descricao, setor, prioridade, data_cadastro], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ msg: "Tarefa cadastrada!" });
    });
});

app.get('/tarefas', (req, res) => {
    const sql = `SELECT t.*, u.nome as nome_usuario FROM tarefas t 
                 JOIN usuarios u ON t.id_usuario = u.id`;
    db.query(sql, (err, results) => {
        res.json(results);
    });
});

app.put('/tarefas/:id', (req, res) => {
    const { descricao, setor, prioridade, status } = req.body;
    db.query('UPDATE tarefas SET descricao=?, setor=?, prioridade=?, status=? WHERE id=?', 
    [descricao, setor, prioridade, status, req.params.id], () => {
        res.json({ msg: "Atualizado!" });
    });
});

app.delete('/tarefas/:id', (req, res) => {
    db.query('DELETE FROM tarefas WHERE id=?', [req.params.id], () => {
        res.json({ msg: "Excluído!" });
    });
});

app.listen(3000, () => console.log("Servidor em http://localhost:3000"));