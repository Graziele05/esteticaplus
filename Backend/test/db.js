const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'estetica-plus'
});

db.connect((err) => {
  if (err) {
    console.error('Erro ao realizar a conexão com o banco de dados: ', err);
    return;
  }
  console.log('Conectado ao banco de dados MySQL.');
});

module.exports = db;
