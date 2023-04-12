const express = require('express');
const cors = require('cors');
const app = express();
const porta = process.env.PORT;


app.use(cors()); // Habilita o CORS para todas as rotas

app.use(express.json()); // Habilita o uso de JSON no corpo da requisição


app.get('/adicionar-valores', (req, res) => {
  const { google } = require('googleapis');
  const keys = require('./credentials.json');

  const client = new google.auth.JWT(
    keys.client_email,
    null,
    keys.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
  );

  const spreadsheetId = '1TsYHgoWVp8JMzyioWMWQGe-ueGpus0WEDkYdgsKzSno';
  const range = 'A:A';

  const newValues = req.query.valores;

  google.sheets({ version: 'v4', auth: client }).spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    resource: {
      values: [newValues],
    },
  }, (err, result) => {
    if (err) return res.status(500).json({ error: `Erro ao adicionar os valores: ${err}` });
    res.status(200).json({ message: 'Valores adicionados com sucesso!' });
  });
});




app.get('/dados-do-sheets', (req, res) => {
  const { google } = require('googleapis');
  const keys = require('./credentials.json');

  const client = new google.auth.JWT(
    keys.client_email,
    null,
    keys.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
  );

  const spreadsheetId = '1TsYHgoWVp8JMzyioWMWQGe-ueGpus0WEDkYdgsKzSno';
  const range = 'A1:AL';

  google.sheets({ version: 'v4', auth: client }).spreadsheets.values.get({
    spreadsheetId,
    range,
  }, (err, result) => {
    if (err) return res.status(500).json({ error: `Erro ao ler a planilha: ${err}` });
    const rows = result.data.values;
    const searchValue = req.query.placa; // obtenha o valor de busca a partir do query parameter

    const columnIndexF = 5; // Coluna F
    const columnIndexes = [34, 35, 36, 37]; // Colunas AI a AL
    const row = rows.find(row => row[columnIndexF] === searchValue);
    if (row) {
      const values = columnIndexes.reduce((obj, index) => {
        obj[index] = row[index];
        return obj;
      }, {});
      res.json(values); // retorne um JSON com os valores obtidos para a placa pesquisada
    } else {
      res.status(404).json({ error: `Não foi possível encontrar a placa ${searchValue}` }); // retorne um erro se a placa não foi encontrada
    }
  });
});

app.listen(porta, () => {console.log('Rodando Legal na porta', porta)})




// const { google } = require('googleapis');
// const keys = require('./credentials.json');

// const client = new google.auth.JWT(
//   keys.client_email,
//   null,
//   keys.private_key,
//   ['https://www.googleapis.com/auth/spreadsheets']
// );

// // ID da planilha e range da última linha
// const spreadsheetId = '1TsYHgoWVp8JMzyioWMWQGe-ueGpus0WEDkYdgsKzSno';
// const range = 'A:A';

// // Novos valores para a última linha
// const newValues = ['carro', 'moto', 'caminhao', 'van'];

// // Adiciona os novos valores na última linha
// google.sheets({ version: 'v4', auth: client }).spreadsheets.values.append({
//   spreadsheetId,
//   range,
//   valueInputOption: 'RAW',
//   insertDataOption: 'INSERT_ROWS',
//   resource: {
//     values: [newValues],
//   },
// }, (err, res) => {
//   if (err) return console.log(`Erro ao adicionar os valores: ${err}`);
//   console.log(`Valores adicionados com sucesso!`);
// });
