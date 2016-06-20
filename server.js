var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var csv = require('fast-csv');

//var http = require('http');
var caminhoSimulado = './Simulados/simENEM2012CienciasHumanas.html';

var questao = [];
var pergunta = [];
var urlImagem;
var respostaCorreta;
var respostas = [];
var corretas = [];

fs.readFile(caminhoSimulado,'utf8', (err, data) => {
    if (err) {        console.log(err);    }
    
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

        if(isUrl != null){urlImagem = isUrl}

        //PEGA TODAS AS RESPOSTAS CORRETAS POR PERGUNTA
        var isChecked = mainLoop.children().children().children().parent().next('.span12').children().next().children().children();

        corretas.push(isChecked);

        //corretas.push(isChecked.text());

        //console.log(isChecked);

        /*if(somenteRespCorreta.attr('checked')){
                    //PEGA SOMENTE A RESPOSTA CORRETA
                    respostaCorreta = somenteRespCorreta.next().text();        
                }*/
       
    });



var ws = fs.createWriteStream('aprende.csv');

/*for (var index = 0; index < questao.length; index++) {
    console.log(questao[index]);
}*/

csv.write([
    questao,
    pergunta
], {headers:true})
.pipe(ws);

/*var metadata = {
            questao: questao,
            pergunta: pergunta,
            urlImagem: urlImagem
        };

        console.log(metadata); */

//console.log(respostas[0]);
//console.log(corretas[0][0].prev.next.next.text);
//var resp = [];

/*for (var i = 0; i < corretas.length; i++) {
    //var geral = corretas[i];
    
    for (var j = 0; j < corretas[i].length; j++) {
        //var espec = array[j];
        
        resp.push()

        if(espec.attr('checked')){
            console.log(espec.text());
        }
    }
}*/

//console.log(t);

});
/*request(url, function (error, response, body) {
  if (!error) {
    var $ = cheerio.load(body);
    questao = $('div').attr('class', 'span1').html();  
      
      
    console.log("Questão " + questao);
  } else {
    console.log("We’ve encountered an error: " + error);
  }
});*/

/*http.createServer(function (req, res) {
    
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('Hello, world!');
    
}).listen(process.env.PORT || 8080); */