var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
//var http = require('http');
var caminhoSimulado = './Simulados/simENEM2012CienciasHumanas.html';

var questao;
var pergunta;
var urlImagem;
var respostaA;
var respostaB;
var respostaC;
var respostaD;
var respostaE;
var respostaCorreta;

fs.readFile(caminhoSimulado,'utf8', (err, data) => {
    if (err) {
        throw err;
    }
    
    var $ = cheerio.load(data);
    
    questao = $('#exam-field-714 div .span1 p strong').text();
    pergunta = $('#exam-field-714 div .span11').text();
    respostaA = $('#exam-field-714 div .span9 .radio small').first().text();
    respostaB = $('#exam-field-714 div .span9 .radio small')
    respostaC = $('#exam-field-714 div .span9 .radio small').text();
    respostaD = $('#exam-field-714 div .span9 .radio small').text();
    respostaE = $('#exam-field-714 div .span9 .radio small').last().text();

//var array = Object.getOwnPropertyNames(respostaB)


    
    console.log(respostaB.children().text());    
        
    
    
    
    
    
    
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