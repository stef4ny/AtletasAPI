const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('Atleta');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Configurar banco de dados MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'Atleta',
  port: 3307
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
    return;
  }
  console.log('Connected to the MySQL database');
});

// Criar tabela Users
db.query(
  'CREATE TABLE IF NOT EXISTS users (id_atleta INT AUTO_INCREMENT PRIMARY KEY, nome_atleta VARCHAR(255), modalidade VARCHAR(255) , equipe VARCHAR(255), recordes_pessoais VARCHAR(255))',
  err => {
    if (err) {
      console.error('Error creating table:', err.message);
      return;
    }
    console.log('Table "users" created or already exists');
  }
);

// Rotas

// Listar todos os usuários
app.get('/u', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      res.status(500).send(err.message);
      return;
    }
    res.json(results);
  });
});

// Buscar um usuário pelo ID
app.get('/users/:id', (req, res) => {
  const id = req.params.id;
  db.query('SELECT * FROM users WHERE id = ?', [id], (err, result) => {
    if (err) {
      res.status(500).send(err.message);
      return;
    }
    if (result.length === 0) {
      res.status(404).send('User not found');
      return;
    }
    res.json(result[0]);
  });
});

// Criar um novo usuário
app.post('/users', (req, res) => {
  const { nome_atleta, modalidade, equipe, recordes_atleta} = req.body;
  db.query('INSERT INTO users (nome_atleta, modalidade, equipe, recordes_atleta) VALUES (?, ?, ?,?)', [nome_atleta, modalidade, equipe, recordes_atleta], (err, result) => {
    if (err) {
      res.status(500).send(err.message);
      return;
    }
    res.status(201).json({ id: result.insertId });
  });
});

// Atualizar um usuário existente
app.put('/users/:id', (req, res) => {
  const id = req.params.id;
  const { nome_atleta, modalidade, equipe, recordes_atleta } = req.body;
  db.query('UPDATE users SET nome_atleta = ?, modalidade = ?, equipe = ?, recordes_atleta = ? WHERE id = ?', [nome_atleta, modalidade, equipe,recordes_atleta, id], (err, result) => {
    if (err) {
      res.status(500).send(err.message);
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).send('User not found');
      return;
    }
    res.sendStatus(204);
  });
});

// Deletar um usuário
app.delete('/users/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM users WHERE id = ?', [id], (err, result) => {
    if (err) {
      res.status(500).send(err.message);
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).send('User not found');
      return;
    }
    res.sendStatus(204);
  });
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});