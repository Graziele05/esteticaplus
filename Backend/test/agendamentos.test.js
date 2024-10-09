const mysql = require('mysql2/promise');

let connection;

beforeAll(async () => {
    connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'estetica-plus',
    });
});

afterAll(async () => {
    await connection.query('TRUNCATE TABLE agendamentos');
    await connection.end();
});

describe('CRUD de Agendamentos', () => {
    test('Deve criar um novo agendamento', async () => {
        const agendamento = { nome_pessoa: 'João', contato_telefonico: '999999999', email: 'joao@example.com', data_agendamento: '2024-10-10' };

        const start = performance.now();
        const [result] = await connection.query('INSERT INTO agendamentos SET ?', agendamento);
        const end = performance.now(); 

        expect(result.affectedRows).toBe(1);
        console.log(`Tempo de inserção: ${end - start} ms`);
        expect(end - start).toBeLessThan(100); 
    });

    test('Deve ler todos os agendamentos', async () => {
        const start = performance.now();
        const [rows] = await connection.query('SELECT * FROM agendamentos');
        const end = performance.now();

        expect(rows.length).toBeGreaterThan(0);
        console.log(`Tempo de leitura (todos): ${end - start} ms`);
        expect(end - start).toBeLessThan(100); 
    });

    test('Deve selecionar agendamentos por nome específico', async () => {
        const start = performance.now();
        const [rows] = await connection.query('SELECT * FROM agendamentos WHERE nome_pessoa = ?', ['João']);
        const end = performance.now();

        expect(rows.length).toBeGreaterThan(0);
        console.log(`Tempo de leitura (nome específico): ${end - start} ms`);
        expect(end - start).toBeLessThan(100);
    });

    test('Deve selecionar agendamentos por parte do nome', async () => {
        const start = performance.now();
        const [rows] = await connection.query('SELECT * FROM agendamentos WHERE nome_pessoa LIKE ?', ['Jo%']);
        const end = performance.now();

        expect(rows.length).toBeGreaterThan(0);
        console.log(`Tempo de leitura (parte do nome): ${end - start} ms`);
        expect(end - start).toBeLessThan(100);
    });

    test('Deve selecionar agendamentos em um intervalo de datas', async () => {
        const start = performance.now();
        const [rows] = await connection.query('SELECT * FROM agendamentos WHERE data_agendamento BETWEEN ? AND ?', ['2024-10-01', '2024-10-31']);
        const end = performance.now();

        expect(rows.length).toBeGreaterThan(0);
        console.log(`Tempo de leitura (intervalo de datas): ${end - start} ms`);
        expect(end - start).toBeLessThan(100);
    });


    test('Deve atualizar um agendamento', async () => {
        const [rows] = await connection.query('SELECT * FROM agendamentos WHERE nome_pessoa = ?', ['João']);
        const id_agenda = rows[0].id_agenda;

        const updatedData = { nome_pessoa: 'João Atualizado' };

        const start = performance.now();
        const [result] = await connection.query('UPDATE agendamentos SET ? WHERE id_agenda = ?', [updatedData, id_agenda]);
        const end = performance.now();

        expect(result.affectedRows).toBe(1);
        console.log(`Tempo de atualização: ${end - start} ms`);
        expect(end - start).toBeLessThan(100);
    });

    test('Deve deletar um agendamento', async () => {
        const [rows] = await connection.query('SELECT * FROM agendamentos WHERE nome_pessoa = ?', ['João Atualizado']);
        const id_agenda = rows[0].id_agenda;

        const start = performance.now();
        const [result] = await connection.query('DELETE FROM agendamentos WHERE id_agenda = ?', [id_agenda]);
        const end = performance.now();

        expect(result.affectedRows).toBe(1);
        console.log(`Tempo de deleção: ${end - start} ms`);
        expect(end - start).toBeLessThan(100);
    });
});
