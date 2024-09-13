const express = require('express');
const router = express.Router();
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');

// Configuração do Multer para salvar arquivos temporariamente no diretório de uploads
const upload = multer({ dest: 'uploads/' });

// Validação de CPF
function validaCPF(cpf) {
    if (!cpf) {
        return false;
    }

    cpf = cpf.replace(/[^\d]+/g, '');
    // Elimina CPFs invalidos conhecidos
    if (cpf.length !== 11 ||
        cpf === '00000000000' ||
        cpf === '11111111111' ||
        cpf === '22222222222' ||
        cpf === '33333333333' ||
        cpf === '44444444444' ||
        cpf === '55555555555' ||
        cpf === '66666666666' ||
        cpf === '77777777777' ||
        cpf === '88888888888' ||
        cpf === '99999999999') {
        return false;
    }

    // Valida 1o digito
    let add = 0;
    for (let i = 0; i < 9; i++) {
        add += parseInt(cpf.charAt(i), 10) * (10 - i);
    }
    let rev = 11 - (add % 11);
    if (rev === 10 || rev === 11) {
        rev = 0;
    }
    if (rev !== parseInt(cpf.charAt(9), 10)) {
        return false;
    }

    // Valida 2o digito
    add = 0;
    for (let i = 0; i < 10; i++) {
        add += parseInt(cpf.charAt(i), 10) * (11 - i);
    }
    rev = 11 - (add % 11);
    if (rev === 10 || rev === 11) {
        rev = 0;
    }
    if (rev !== parseInt(cpf.charAt(10), 10)) {
        return false;
    }

    return true;
}

// Validação de CNPJ
function validaCNPJ(cnpj) {
    if (!cnpj) {
        return false;
    }
    cnpj = cnpj.replace(/[^\d]+/g, '');

    if (cnpj.length !== 14) {
        return false;
    }

    // Elimina CNPJs invalidos conhecidos
    if (cnpj === '00000000000000' ||
        cnpj === '11111111111111' ||
        cnpj === '22222222222222' ||
        cnpj === '33333333333333' ||
        cnpj === '44444444444444' ||
        cnpj === '55555555555555' ||
        cnpj === '66666666666666' ||
        cnpj === '77777777777777' ||
        cnpj === '88888888888888' ||
        cnpj === '99999999999999') {
        return false;
    }

    // Valida DVs
    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) {
            pos = 9;
        }
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado !== parseInt(digitos.charAt(0), 10)) {
        return false;
    }

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) {
            pos = 9;
        }
    }

    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado !== parseInt(digitos.charAt(1), 10)) {
        return false;
    }

    return true;
}

// Validação de Valores do CSV
function validaValores(vlTotal, qtPrestacoes, vlPresta) {
    const calcularValor = vlTotal / qtPrestacoes;
    return calcularValor === vlPresta;
}

// Formata valores em real
function formatarReal(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

// Rota de Upload de arquivos.
router.post('/upload', upload.single('file'), (req, res) => {
    const filePath = req.file.path;
    const dados = [];

    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => {
            const cpfCnpj = data.nrCpfCnpj.length === 11
                ? validaCPF(data?.nrCpfCnpj)
                : validaCNPJ(data?.nrCpfCnpj);

            const valores = validaValores(
                parseFloat(data?.vlTotal),
                parseInt(data?.qtPrestacoes),
                parseFloat(data?.vlPresta)
            );

            dados.push({
                ...data,
                cpfCnpj,
                valores,
                total: formatarReal(data.vlTotal),
                prestacao: formatarReal(data.vlPresta)
            });
        })
        .on('end', () => {
            res.json(dados);
        })
        .on('error', (err) => {
            res.status(500).send({ error: 'Ocorreu um erro ao processar o arquivo!' });
        });
});

module.exports = app => app.use('/test', router);