const express = require('express')
const app = express()
const port = 3000

const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'nodedb'
})

db.connect(err =>
{
    if (err)
    {
        throw err
    }
    console.log('Database connected.')
});

createTable();

app.get('/', (req, resp) =>
{
    insertName(resp);
})

app.listen(port, () =>
{
    console.log('Rodando na porta ' + port);
})

function insertName(response)
{
    let name = 'Name_' + Date.now();

    let sql = `INSERT INTO people(name) values ('` + name + `')`;

    db.query(sql, function (error, results)
    {
        if (error) throw error;

        getNames(response);
    });
}

function getNames(response)
{
    let sql = `SELECT id, name FROM people ORDER BY id;`;

    db.query(sql, function (error, results, fields)
    {
        if (error) throw error;

        var responseText = '<h1>Full Cycle</h1>';
        responseText += '<table><tr><th>Id</th><th>Name</th></tr>';
        results.forEach(row =>
        {
            responseText += '<tr>';
            responseText += '<td>' + row.id + '</td>';
            responseText += '<td>' + row.name + '</td>';
            responseText += '</tr>';
        });
        responseText += '</table>';
        response.send(responseText);
    });
}

function createTable()
{
    var createTableStatment = `CREATE TABLE IF NOT EXISTS people (id INT NOT NULL AUTO_INCREMENT, name VARCHAR(255), PRIMARY KEY (id));`

    db.query(createTableStatment)
}