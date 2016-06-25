var request = require('request');
var cheerio = require('cheerio');
var path = require('path');
var fs = require('fs');
//var csv = require('fast-csv');
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;

var config = {
  userName: 'aprende',
  password: 'Tutto123!',
  server: 'aprendesrv.database.windows.net',
  options: {encrypt: true, database: 'aprendedb'}
};

//var http = require('http');
var caminhoSimulado = './Simulados/simENEM2012CienciasHumanas.html';

var questao = [];
var pergunta = [];
var urlImagem = [];
var respostaCorreta;
var respostas = [];
var corretas = [];
var nomeArquivo;

fs.readFile(caminhoSimulado,'utf8', (err, data) => {
    if (err) {        console.log(err);    }  
    
    var fileName = path.basename(caminhoSimulado);
    nomeArquivo = fileName;
   
    //FAZ A LEITURA DO DOCUMENTO
    var $ = cheerio.load(data);

    //LOOP GERAL
    $('.well').each(function(i, element){
        var mainLoop = $(this);

        //PEGA O NÚMERO DA QUESTÃO
        var questaoSoma = i + 1;
        questao.push(questaoSoma); 

        //PEGA SOMENTE A PERGUNTA
        pergunta.push(mainLoop.children().children().children().parent().next('.span11').text());

        //PEGAS TODAS AS ALTERNATIVAS POR PERGUNTA
        respostas.push(mainLoop.children().children().children().parent().next().next().children().next().children().children('small').text());

        //PEGA AS URL´s DAS IMAGENS POR PERGUNTA
        var isUrl = mainLoop.children().children().children().parent().next('.span11').children().children().attr('src');

        urlImagem.push(isUrl);

        //PEGA TODAS AS RESPOSTAS CORRETAS POR PERGUNTA
        //var isChecked = mainLoop.children().children().children().parent().next('.span12').children().next().children().children();

        //corretas.push(isChecked);

        //corretas.push(isChecked.text());

        //console.log(isChecked);

        /*if(somenteRespCorreta.attr('checked')){
                    //PEGA SOMENTE A RESPOSTA CORRETA
                    respostaCorreta = somenteRespCorreta.next().text();        
                }*/
       
    });
    
    //var t = respostas[30];
    
    
    
    //console.log(respostas[30].split(".")[4]+".");
    
    var con = new Connection(config);
    con.on('connect', function(err){
        console.log("Conectou");
        //executeInsertTipoSimulado();
        //executeInsertResposta()
        //executeInsertSimulado();
       });

    function executeInsertTipoSimulado() {
        request = new Request("INSERT [dbo].[TipoSimulado] ([Descricao], [DataCriacao]) VALUES (@Descricao, CURRENT_TIMESTAMP);", function(err){
        if (err) {
            console.log(err);
        }
        });
        
        request.addParameter('Descricao', TYPES.NVarChar, nomeArquivo);
    
    con.execSql(request);
}

    function executeInsertResposta() {
        for (var i = 0; i < respostas.length + 1; i++) {
                request = new Request("INSERT [dbo].[Resposta] ([Resposta1], [Resposta2],[Resposta3],[Resposta4],[Resposta5],[RespostaCorreta],[DataCriacao]) VALUES (@Resp1,@Resp2,@Resp3,@Resp4,@Resp5,@RespCorreta, CURRENT_TIMESTAMP);", function(err){
                if (err) {
                    console.log(err);
                }
                });
                //console.log(respostas[i].split(".")[0] + ".");
                request.addParameter('Resp1', TYPES.NVarChar, respostas[i].split(".")[0] + ".");
                request.addParameter('Resp2', TYPES.NVarChar, respostas[i].split(".")[1] + ".");
                request.addParameter('Resp3', TYPES.NVarChar, respostas[i].split(".")[2] + ".");
                request.addParameter('Resp4', TYPES.NVarChar, respostas[i].split(".")[3] + ".");
                request.addParameter('Resp5', TYPES.NVarChar, respostas[i].split(".")[4] + ".");
                request.addParameter('RespCorreta', TYPES.NVarChar, respostas[i].split(".")[0] + ".");   
        }
    
    con.execSql(request);
}

    function executeInsertSimulado() {
        for (var i = 0; i < respostas.length + 1; i++) {
                request = new Request("INSERT [dbo].[Simulado] ([Questao], [Pergunta],[UrlImagem],[RespostaId],[TipoSimuladoId],[DataCriacao]) VALUES (@Questao,@Pergunta,@UrlImg,@RespId,@TipoSimuladoId, CURRENT_TIMESTAMP);", function(err){
                if (err) {
                    console.log(err);
                }
                });
                
                request.addParameter('Questao', TYPES.NVarChar, questao[i]);
                request.addParameter('Pergunta', TYPES.NVarChar, pergunta[i]);
                request.addParameter('UrlImg', TYPES.NVarChar, urlImagem[i] == "undefined" ? null : urlImagem[i]);
                request.addParameter('RespId', TYPES.NVarChar, ;
                request.addParameter('TipoSimuladoId', TYPES.NVarChar, ;
        }
    
    con.execSql(request);
}

    
});

