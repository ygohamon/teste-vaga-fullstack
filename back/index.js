// Importações necessárias
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Habilita CORS
app.use(cors());
// Middleware
app.use(bodyParser.json()); // Para análise do corpo da requisição JSON
app.use(bodyParser.urlencoded({ extended:true }));

// Usar rotas definidas
require('./src/app/controllers/index')(app);

// Rota de teste
app.post('/', (req, res) => {
    res.send('Ok!');
});

// Inicialização do servidor
const PORT = process.env.SERVER_PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server rodando na porta ${PORT}`);
});
