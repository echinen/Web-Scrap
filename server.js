var request = require('request');
var cheerio = require('cheerio');
var path = require('path');
var fs = require('fs');
//var csv = require('fast-csv');
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
var ConnectionPool = require('tedious-connection-pool');

var config = {
    userName: '',
    password: '',
    server: '',
    options: { encrypt: true, database: 'aprendedb' }
};

var poolConfig = {
    min: 1,
    max: 3,
    log: true
};

var pool = new ConnectionPool(poolConfig, config);

var caminhoSimulado = './Simulados/simENEM2012CienciasHumanas.html';

var questao = "";
var perguntas = "";
var urlImagem = "";
var respostaCorreta = "";
var respostasA = "";
var respostasB = "";
var respostasC = "";
var respostasD = "";
var respostasE = "";
var nomeArquivo;

fs.readFile(caminhoSimulado, 'utf8', (err, data) => {
    if (err) { console.error(err); }

    var fileName = path.basename(caminhoSimulado);
    nomeArquivo = fileName;

    //FAZ A LEITURA DO DOCUMENTO
    var $ = cheerio.load(data);

    //LOOP GERAL
    $('.well').each(function (i, element) {
        var mainLoop = $(this);

        //PEGA O NÚMERO DA QUESTÃO
        var questaoSoma = i + 1;
        questao = questao + questaoSoma + "|";

        //PEGA TODAS AS PERGUNTAS
        var perg = mainLoop.children().children().children().parent().next('.span11').text() + "|";
        perguntas = perguntas + perg;

        //PEGA TODAS AS RESPOSTAS (A)
        var A = mainLoop.children().children().children().parent().next().next().children().next().children().children('small').text().split(".")[0] + "." + "|";
        respostasA = respostasA + A;

        //PEGA TODAS AS RESPOSTAS (B)
        var B = mainLoop.children().children().children().parent().next().next().children().next().children().children('small').text().split(".")[1] + "." + "|";
        respostasB = respostasB + B;

        //PEGA TODAS AS RESPOSTAS (C)
        var C = mainLoop.children().children().children().parent().next().next().children().next().children().children('small').text().split(".")[2] + "." + "|";
        respostasC = respostasC + C;

        //PEGA TODAS AS RESPOSTAS (D)
        var D = mainLoop.children().children().children().parent().next().next().children().next().children().children('small').text().split(".")[3] + "." + "|";
        respostasD = respostasD + D;

        //PEGA TODAS AS RESPOSTAS (E)
        var E = mainLoop.children().children().children().parent().next().next().children().next().children().children('small').text().split(".")[4] + "." + "|";
        respostasE = respostasE + E;

        //PEGA AS URL´s DAS IMAGENS POR PERGUNTA
        var isUrl = mainLoop.children().children().children().parent().next('.span11').children().children().attr('src') + "|";

        urlImagem = urlImagem + isUrl;
    });

    //LOOP IN INPUT CHECKBOX
    $('input').each(function (i, elem) {
        var inLoopInput = $(this);

        //PEGA TODAS AS RESPOSTAS CORRETAS
        if (inLoopInput.attr('checked')) {
            var respAux = inLoopInput.next().text().split(")")[0] + "|";

            respostaCorreta = respostaCorreta + respAux;
        }
    });

    pool.acquire(function (err, Connection) {
        if (err) {
            console.error(err);
        }

        var request = new Request("INSERT [dbo].[SimuladoAprende] ([NomeSimulado], [RespostaA],[RespostaB],[RespostaC],[RespostaD],[RespostaE],[RespostaCorreta],[Questao],[Pergunta],[UrlImagem],[DataCriacao]) VALUES (@NmSimulado,@RespA,@RespB,@RespC,@RespD,@RespE, @RespCorreta,@Questao,@Pergunta,@Url, CURRENT_TIMESTAMP);", function (err, rowCount) {
            if (err) {
                console.log(err);
            }

            console.log('rowCount' + rowCount);
            Connection.release();
        });

        request.addParameter('NmSimulado', TYPES.NVarChar, nomeArquivo);
        request.addParameter('RespA', TYPES.NVarChar, respostasA);
        request.addParameter('RespB', TYPES.NVarChar, respostasB);
        request.addParameter('RespC', TYPES.NVarChar, respostasC);
        request.addParameter('RespD', TYPES.NVarChar, respostasD);
        request.addParameter('RespE', TYPES.NVarChar, respostasE);
        request.addParameter('RespCorreta', TYPES.NVarChar, respostaCorreta);
        request.addParameter('Questao', TYPES.NVarChar, questao);
        request.addParameter('Pergunta', TYPES.NVarChar, perguntas);
        request.addParameter('Url', TYPES.NVarChar, urlImagem);

        request.on('row', function (columns) {
            console.log('Valor: ' + columns[0].value);
        });

        Connection.execSql(request);

        pool.on('error', function (err) {
            console.error(err);
        });
    });
});

