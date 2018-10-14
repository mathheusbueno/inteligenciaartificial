var limiteMovimentos = 500;
var tamanhoPopulacao = 50;
var taxaDeMutacao = 0.05;
var velocidade = 1;
var pontoM = 0;
var nMP = 0;
var gradeDoJogo = [
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0],
];
var formas = {
	I: [[0,0,0,0], [1,1,1,1], [0,0,0,0], [0,0,0,0]],
	J: [[2,0,0], [2,2,2], [0,0,0]],
	L: [[0,0,3], [3,3,3], [0,0,0]],
	O: [[4,4], [4,4]],
	S: [[0,5,5], [5,5,0], [0,0,0]],
	T: [[0,6,0], [6,6,6], [0,0,0]],
	Z: [[7,7,0], [0,7,7], [0,0,0]]
};
var cores = ["F92338", "C973FF", "1C76BC", "FEE356", "53D504", "36E0FF", "F8931D"];
var aux = 1;
var mediaPontos = 0;
var formaAtual = {x: 0, y: 0, forma: undefined};
var proximaFormaT;
var bolsa = [];
var indiceBolsa = 0;
var ponto = 0;
var changevelocidade = false;
var salvaEstado;
var estadoDaRodada;
var velocidadeIndex = 0;
var ai = true;
var desenhar = true;
var tomadasDeMovimento = 0;
var moveAlgoritimo = {};
var inspecionaMovimento = false;
var cromossomos = [];
var cromossomoAtual = -1;
var geracao = 0;
var etapaDeMutacao = 0.2;
var arquivo = {
	tamanhoPopulacao: 0,
	geracaoAtual: 0,
	elites: [],
	cromossomos: []
};
/**
 * Inicia População
 */
function inicia() {
	arquivo.tamanhoPopulacao = tamanhoPopulacao;
	proximaForma();
	aplicaForma();
	salvaEstado = obtemEstado();
	estadoDaRodada = obtemEstado();
	criarPopulacaoInicial();
	var loop = function(){
		if (changevelocidade) {
			clearInterval(intervalo);
			intervalo = setInterval(loop, veqdade);
			mudarIntervalo = false;
		}
		if (velocidade === 0) {
			desenhar = false;
			atualizar();
			atualizar();
			atualizar();
		} else {
			desenhar = true;
		}
		atualizar();
		if (velocidade === 0) {
				desenhar = true;
			atualizarPontuacao();
		}


	};
	var intervalo = setInterval(loop, velocidade);

}
document.onLoad = inicia();
/**
 * Cria a população inicial de cromossomos, cada um com um cromossomo diferente.
 */
 function criarPopulacaoInicial() {
 	cromossomos = [];
 	for (var i = 0; i < tamanhoPopulacao; i++) {
 		var cromossomo = {
 			id: Math.random(),
 			linhasEliminadas: 0.3935587493589162,
 			alturaPonderada: -0.03912912193790874,
 			alturaAcumulada: -0.49354972909621503,
 			alturaRelativa: 0.21161863317931295,
 			buracos: -0.09249577901233855,
 			aspereza: -0.05557203063066768,
 		};
 		cromossomos.push(cromossomo);
 	}
 	avaliaProximoCromossomo();
 }
/**
 * Avalia o próximo cromossomo da população. Se não houver nenhum, evolui a população.
 */
 function avaliaProximoCromossomo() {
 	cromossomoAtual++;
 	if (cromossomoAtual == cromossomos.length) {
 		evoluir();
 	}
 	carregarEstado(estadoDaRodada);
 	tomadasDeMovimento = 0;
 	proximoMovimento();
 }
/**
 * Evolui toda a população é avança para á próxima geracao.
 */
 function evoluir() {
	console.log("------------------------");
	console.log(geracao + "ª Geração");
 	console.log("Avaliação OK");

	mediaPontos = mediaPontos /tamanhoPopulacao;
	console.log("Media dos Pontos: "+mediaPontos);

	mediaPontos = 0;
 	cromossomoAtual = 0;
 	geracao++;
 	redefine();
 	estadoDaRodada = obtemEstado();
 	cromossomos.sort(function(a, b) {
 		return b.fitness - a.fitness;
 	});
 	arquivo.elites.push(copia(cromossomos[0]));
	console.log("Fitness: |" + cromossomos[0].fitness + "|");
	console.log("---Cromossomo---");
	console.log("ID: "+cromossomos[0].id);
	console.log("Linhas Eliminadas: "+cromossomos[0].linhasEliminadas);
	console.log("Altura Ponderada: "+cromossomos[0].alturaPonderada);
	console.log("Altura Acumulada: "+cromossomos[0].alturaAcumulada);
	console.log("Altura Relativa: "+cromossomos[0].alturaRelativa);
	console.log("Buracos: "+cromossomos[0].buracos);
	console.log("Aspereza: "+cromossomos[0].aspereza);
	console.log("----------------");
	console.log("------------------------");
 	while(cromossomos.length > tamanhoPopulacao / 2) {
 		cromossomos.pop();
 	}

 	var totalFitness = 0;
 	for (var i = 0; i < cromossomos.length; i++) {
 		totalFitness += cromossomos[i].fitness;
 	}
	function obterCromossomoAleatorio() {
		return cromossomos[numeroponderadoaleatorio(0, cromossomos.length - 1)];
	}
	var filhos = [];
	filhos.push(copia(cromossomos[0]));
	while (filhos.length < tamanhoPopulacao) {
		filhos.push(obterFilho(obterCromossomoAleatorio(), obterCromossomoAleatorio()));
	}
	cromossomos = [];
	cromossomos = cromossomos.concat(filhos); //O método concat () é usado para juntar duas ou mais strings.
	arquivo.cromossomos = copia(cromossomos);
	arquivo.geracaoAtual = copia(geracao);
}
/**
 * Cria um filho cromossomo apartir dos pais, e depois faz a mutação com o filho.
 */
 function obterFilho(pai1, pai2) {
 	var filho = {
 		id : Math.random(),
 		linhasEliminadas: escolhaAleatoria(pai1.linhasEliminadas, pai2.linhasEliminadas),
 		alturaPonderada: escolhaAleatoria(pai1.alturaPonderada, pai2.alturaPonderada),
 		alturaAcumulada: escolhaAleatoria(pai1.alturaAcumulada, pai2.alturaAcumulada),
 		alturaRelativa: escolhaAleatoria(pai1.alturaRelativa, pai2.alturaRelativa),
 		buracos: escolhaAleatoria(pai1.buracos, pai2.buracos),
 		aspereza: escolhaAleatoria(pai1.aspereza, pai2.aspereza),
 		fitness: -1
 	};
 	//Mutação
 	if (Math.random() < taxaDeMutacao) {
 		filho.linhasEliminadas = filho.linhasEliminadas + Math.random() * etapaDeMutacao * 2 - etapaDeMutacao;
 	}
 	if (Math.random() < taxaDeMutacao) {
 		filho.alturaPonderada = filho.alturaPonderada + Math.random() * etapaDeMutacao * 2 - etapaDeMutacao;
 	}
 	if (Math.random() < taxaDeMutacao) {
 		filho.alturaAcumulada = filho.alturaAcumulada + Math.random() * etapaDeMutacao * 2 - etapaDeMutacao;
 	}
 	if (Math.random() < taxaDeMutacao) {
 		filho.alturaRelativa = filho.alturaRelativa + Math.random() * etapaDeMutacao * 2 - etapaDeMutacao;
 	}
 	if (Math.random() < taxaDeMutacao) {
 		filho.buracos = filho.buracos + Math.random() * etapaDeMutacao * 2 - etapaDeMutacao;
 	}
 	if (Math.random() < taxaDeMutacao) {
 		filho.aspereza = filho.aspereza + Math.random() * etapaDeMutacao * 2 - etapaDeMutacao;
 	}
 	return filho;
 }
/**
 	Retorna uma matriz de todos os movimentos possíveis que podem ocorrer no estado atual, avaliados pelos parâmetros do atual cromossomo
 */
 function obterTodosMovimentosPossiveis() {
 	var ultimoEstado = obtemEstado();
 	var MovimentosPossiveis = [];
 	var possiveisCMovimentos = [];
 	var interacoes = 0;
 	for (var rotacao = 0; rotacao < 4; rotacao++) {
 		var xAnterior = [];
 			for (var t = -5; t <= 5; t++) {
 			interacoes++;
 			carregarEstado(ultimoEstado);
 			for (var j = 0; j < rotacao; j++) {
 				rodarForma();
 			}
 			if (t < 0) {
 				for (var esquer = 0; esquer < Math.abs(t); esquer++) {
 					moverEsquerda();
 				}
 			} else if (t > 0) {
 				for (var direi = 0; direi < t; direi++) {
 					moverDireita();
 				}
 			}
 			if (!contem(xAnterior, formaAtual.x)) {
 				var moverResultadoBaixo = moverBaixo();
 				while (moverResultadoBaixo.movido) {
 					moverResultadoBaixo = moverBaixo();
 				}
 				var algoritmo = {
 					linhasEliminadas: moverResultadoBaixo.linhasEliminadas,
 					alturaPonderada: Math.pow(obterAltura(), 1.5),
 					alturaAcumulada: obtemAlturaAcumulada(),
 					alturaRelativa: obtemAlturaRelativa(),
 					buracos: obtemBuracos(),
 					aspereza: obtemAspereza()
 				};
 				var avaliacao = 0;
 				avaliacao += algoritmo.linhasEliminadas * cromossomos[cromossomoAtual].linhasEliminadas;
 				avaliacao += algoritmo.alturaPonderada * cromossomos[cromossomoAtual].alturaPonderada;
 				avaliacao += algoritmo.alturaAcumulada * cromossomos[cromossomoAtual].alturaAcumulada;
 				avaliacao += algoritmo.alturaRelativa * cromossomos[cromossomoAtual].alturaRelativa;
 				avaliacao += algoritmo.buracos * cromossomos[cromossomoAtual].buracos;
 				avaliacao += algoritmo.aspereza * cromossomos[cromossomoAtual].aspereza;
 				if (moverResultadoBaixo.perder) {
 					avaliacao -= 500;
 				}
 				MovimentosPossiveis.push({rotacoes: rotacao, traducao: t, avaliacao: avaliacao, algoritmo: algoritmo});
 				xAnterior.push(formaAtual.x);
 			}
 		}
 	}
 	carregarEstado(ultimoEstado);
	if (ponto>pontoM){
		pontoM = ponto;
	}
	if (ponto == 0){
		mediaPontos += pontoM;
		pontoM = 0;
	}
 	return MovimentosPossiveis;
 }
/**
 * Retorna a classificação mais alta
 */
 function obtemMaiorMovimento(movimentos) {
 	var maxclassificacao = -10000000000000;
 	var maxMovimento = -1;
 	var lacos = [];
 	for (var index = 0; index < movimentos.length; index++) {
 		if (movimentos[index].avaliacao > maxclassificacao) {
 			maxclassificacao = movimentos[index].avaliacao;
 			maxMovimento = index;
 			lacos = [index];
 		} else if (movimentos[index].avaliacao == maxclassificacao) {
 			lacos.push(index);
 		}
 	}
	var mover = movimentos[lacos[0]];
	mover.algoritmo.lacos = lacos.length;
	return mover;
}
/**
 * Proximo Movimento
 */
 function proximoMovimento() {
 	tomadasDeMovimento++;
 	if (tomadasDeMovimento > limiteMovimentos) {
 		cromossomos[cromossomoAtual].fitness = copia(ponto);

 		avaliaProximoCromossomo();
 	} else {
 		var desenhoAntigo = copia(desenhar);
 		desenhar = false;
 		var MovimentosPossiveis = obterTodosMovimentosPossiveis();
 		var ultimoEstado = obtemEstado();
 		proximaForma();
 		for (var i = 0; i < MovimentosPossiveis.length; i++) {
 			var proxMovimento = obtemMaiorMovimento(obterTodosMovimentosPossiveis());
 			MovimentosPossiveis[i].avaliacao += proxMovimento.avaliacao;
 		}
 		carregarEstado(ultimoEstado);
 		var mover = obtemMaiorMovimento(MovimentosPossiveis);
 		for (var rotacoes = 0; rotacoes < mover.rotacoes; rotacoes++) {
 			rodarForma();
 		}
 		if (mover.traducao < 0) {
 			for (var esquerdaE = 0; esquerdaE < Math.abs(mover.traducao); esquerdaE++) {
 				moverEsquerda();
 			}
 		} else if (mover.traducao > 0) {
 			for (var direitaD = 0; direitaD < mover.traducao; direitaD++) {
 				moverDireita();
 			}
 		}
 		if (inspecionaMovimento) {
 			moveAlgoritimo = mover.algoritmo;
 		}
 		desenhar = desenhoAntigo;
 		saida();
 		atualizarPontuacao();


 	}

 }
/**
 * Atualiza o Jogo
 */
 function atualizar() {
 	if (ai && cromossomoAtual != -1) {
 		var results = moverBaixo();
 	 		if (!results.movido) {
  			if (results.perder) {
 		 				cromossomos[cromossomoAtual].fitness = copia(ponto);
 			 			avaliaProximoCromossomo();
 			} else {
 				proximoMovimento();
 			}
 		}
 	} else {
 		moverBaixo();
 	}
 	saida();
  	atualizarPontuacao();
 }
/**
 * Move para Baixo.
 */
 function moverBaixo() {
 	var result = {perder: false, movido: true, linhasEliminadas: 0};
 	removerForma();
 	formaAtual.y++;
 	if (colisao(gradeDoJogo, formaAtual)) {
 		formaAtual.y--;
 		aplicaForma();
 		proximaForma();
 		result.linhasEliminadas = limparLinhas();
 		if (colisao(gradeDoJogo, formaAtual)) {
 			result.perder = true;
 			if (ai) {
 			} else {
 				redefine();
 			}
 		}
 		result.movido = false;
 	}
 	aplicaForma();
 	ponto++;
 	atualizarPontuacao();
 	saida();
 	return result;
 }
/**
 * Move para esquerda
 */
 function moverEsquerda() {
 	removerForma();
 	formaAtual.x--;
 	if (colisao(gradeDoJogo, formaAtual)) {
 		formaAtual.x++;
 	}
 	aplicaForma();
 }
/**
 * Move para direita
 */
 function moverDireita() {
 	removerForma();
 	formaAtual.x++;
 	if (colisao(gradeDoJogo, formaAtual)) {
 		formaAtual.x--;
 	}
 	aplicaForma();
 }
/**
 * Gira na forma Horaria se Possivel
 */
 function rodarForma() {
 	removerForma();
 	formaAtual.forma = rodar(formaAtual.forma, 1);
 	if (colisao(gradeDoJogo, formaAtual)) {
 		formaAtual.forma = rodar(formaAtual.forma, 3);
 	}
 	aplicaForma();
 }
/**
 * Limpa todas as linhas que estão completamente preenchidas.
 */
 function limparLinhas() {
 	var linhasParaLimpar = [];
 	for (var linha = 0; linha < gradeDoJogo.length; linha++) {
 		var contEspacoVazio = false;
 		for (var coluna = 0; coluna < gradeDoJogo[linha].length; coluna++) {
 			if (gradeDoJogo[linha][coluna] === 0) {
 				contEspacoVazio = true;
 			}
 		}
 		if (!contEspacoVazio) {
 			linhasParaLimpar.push(linha);
 		}
 	}
 	if (linhasParaLimpar.length == 1) {
 		ponto += 400;
 	} else if (linhasParaLimpar.length == 2) {
 		ponto += 1000;
 	} else if (linhasParaLimpar.length == 3) {
 		ponto += 3000;
 	} else if (linhasParaLimpar.length >= 4) {
 		ponto += 12000;
 	}
 	var linhasEliminadas = copia(linhasParaLimpar.length);
 	for (var limpar = linhasParaLimpar.length - 1; limpar >= 0; limpar--) {
 		gradeDoJogo.splice(linhasParaLimpar[limpar], 1);
 	}
 	while (gradeDoJogo.length < 20) {
 		gradeDoJogo.unshift([0,0,0,0,0,0,0,0,0,0]);
 	}
 	return linhasEliminadas;
 }
/**
 * Aplica Forma.
 */
 function aplicaForma() {
 	for (var linha = 0; linha < formaAtual.forma.length; linha++) {
 		for (var coluna = 0; coluna < formaAtual.forma[linha].length; coluna++) {
 			if (formaAtual.forma[linha][coluna] !== 0) {
 				gradeDoJogo[formaAtual.y + linha][formaAtual.x + coluna] = formaAtual.forma[linha][coluna];
 			}
 		}
 	}
 }
/**
 * Remover Forma.
 */
 function removerForma() {
 	for (var linha = 0; linha < formaAtual.forma.length; linha++) {
 		for (var coluna = 0; coluna < formaAtual.forma[linha].length; coluna++) {
 			if (formaAtual.forma[linha][coluna] !== 0) {
 				gradeDoJogo[formaAtual.y + linha][formaAtual.x + coluna] = 0;
 			}
 		}
 	}
 }
/**
 * Proxima Forma
 */
 function proximaForma() {
 	indiceBolsa += 1;
 	if (bolsa.length === 0 || indiceBolsa == bolsa.length) {
 		gerarBolsa();
 	}
 	if (indiceBolsa == bolsa.length - 1) {
 		var sementeAnt = aux;
 		proximaFormaT = propAleatoria(formas);
 		aux = sementeAnt;
 	} else {
 		proximaFormaT = formas[bolsa[indiceBolsa + 1]];
 	}
 	formaAtual.forma = formas[bolsa[indiceBolsa]];
 	formaAtual.x = Math.floor(gradeDoJogo[0].length / 2) - Math.ceil(formaAtual.forma[0].length / 2);
 	formaAtual.y = 0;
 }
/**
 * Criar Bolsa de Formas
 */
 function gerarBolsa() {
 	bolsa = [];
 	var conteudo = "";
 	for (var i = 0; i < 7; i++) {
 		var forma = chaveAleatoria(formas);
 		while(conteudo.indexOf(forma) != -1) {
 			forma = chaveAleatoria(formas);
 		}
 		bolsa[i] = forma;
 		conteudo += forma;
 	}
 	indiceBolsa = 0;
 }
/**
 * redefine
 */
 function redefine() {
 	ponto = 0;
 	gradeDoJogo = [[0,0,0,0,0,0,0,0,0,0],
 	[0,0,0,0,0,0,0,0,0,0],
 	[0,0,0,0,0,0,0,0,0,0],
 	[0,0,0,0,0,0,0,0,0,0],
 	[0,0,0,0,0,0,0,0,0,0],
 	[0,0,0,0,0,0,0,0,0,0],
 	[0,0,0,0,0,0,0,0,0,0],
 	[0,0,0,0,0,0,0,0,0,0],
 	[0,0,0,0,0,0,0,0,0,0],
 	[0,0,0,0,0,0,0,0,0,0],
 	[0,0,0,0,0,0,0,0,0,0],
 	[0,0,0,0,0,0,0,0,0,0],
 	[0,0,0,0,0,0,0,0,0,0],
 	[0,0,0,0,0,0,0,0,0,0],
 	[0,0,0,0,0,0,0,0,0,0],
 	[0,0,0,0,0,0,0,0,0,0],
 	[0,0,0,0,0,0,0,0,0,0],
 	[0,0,0,0,0,0,0,0,0,0],
 	[0,0,0,0,0,0,0,0,0,0],
 	[0,0,0,0,0,0,0,0,0,0],
 	];
 	movimentos = 0;
 	gerarBolsa();
 	proximaForma();
 }
/**
 Verifica a colisao
 */
 function colisao(cena, objeto) {
 	for (var linha = 0; linha < objeto.forma.length; linha++) {
 		for (var coluna = 0; coluna < objeto.forma[linha].length; coluna++) {
 			if (objeto.forma[linha][coluna] !== 0) {
 				if (cena[objeto.y + linha] === undefined || cena[objeto.y + linha][objeto.x + coluna] === undefined || cena[objeto.y + linha][objeto.x + coluna] !== 0) {
 					return true;
 				}
 			}
 		}
 	}
 	return false;
 }
 function rodar(matriz, tempos) {
 	for (var t = 0; t < tempos; t++) {
 		matriz = transpor(matriz);
 		for (var i = 0; i < matriz.length; i++) {
 			matriz[i].reverse();
 		}
 	}
 	return matriz;
 }
 function transpor(array) {
 	return array[0].map(function(coluna, i) {
 		return array.map(function(linha) {
 			return linha[i];
 		});
 	});
 }
/**
 * Saida para tela
 */
 function saida() {
 	if (desenhar) {
 		var saida = document.getElementById("saida");
 		var html = "<h1>Tópicos em Inteligência Artificial</h1><h5>Abordagem evolucionária para Tetris AI</h5><h5>Aluno: Matheus Bueno</h5>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp";
 		var space = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
 		for (var i = 0; i < gradeDoJogo.length; i++) {
 			if (i === 0) {
 				html += "[" + gradeDoJogo[i] + "]";
 			} else {
 				html += "<br />" + space + "[" + gradeDoJogo[i] + "]";
 			}
 		}

 		for (var c = 0; c < cores.length; c++) {
 			html = substTudo(html, "," + (c + 1), ",<font color=\"" + cores[c] + "\">" + (c + 1) + "</font>");
 			html = substTudo(html, (c + 1) + ",", "<font color=\"" + cores[c] + "\">" + (c + 1) + "</font>,");
 		}
 		saida.innerHTML = html;
 	}
 }
/**
 * Atualiza Pontuação
 */
 function atualizarPontuacao() {
 	if (desenhar) {
 		var detalhesPontuacao = document.getElementById("ponto");
 		var html = "<br /><br /><h2>&nbsp;</h2><h3>Pontuação: " + ponto + "</h3>";
 		html += "<br /><b>Próximo Tetraminó</b>";
 		for (var i = 0; i < proximaFormaT.length; i++) {
 			var proximo = substTudo((proximaFormaT[i] + ""), "0", "&nbsp;");
 			html += "<br />&nbsp;&nbsp;&nbsp;&nbsp;" + proximo;
 		}
 		for (var l = 0; l < 4 - proximaFormaT.length; l++) {
 			html += "<br />";
 		}
 		for (var c = 0; c < cores.length; c++) {
 			html = substTudo(html, "," + (c + 1), ",<font color=\"" + cores[c] + "\">" + (c + 1) + "</font>");
 			html = substTudo(html, (c + 1) + ",", "<font color=\"" + cores[c] + "\">" + (c + 1) + "</font>,");
 		}
 		html += "<br />Velocidade: " + velocidade;
 		if (ai) {
 			html += "<br />Movimentos: " + tomadasDeMovimento + "/" + limiteMovimentos;
 			html += "<br />Geração: " + geracao;
 			html += "<br />Indivíduos: " + (cromossomoAtual + 1)  + "/" + tamanhoPopulacao;
 			html += "<br /><br /><br /><br /><br /><br /><br />" ;

 		}
 		html = substTudo(substTudo(substTudo(html, "&nbsp;,", "&nbsp;&nbsp;"), ",&nbsp;", "&nbsp;&nbsp;"), ",", "&nbsp;");
 		detalhesPontuacao.innerHTML = html;
 	}
 }
/**
 * Retorna o Estado Atual
 */
 function obtemEstado() {
 	var estado = {
 		gradeDoJogo: copia(gradeDoJogo),
 		formaAtual: copia(formaAtual),
 		proximaFormaT: copia(proximaFormaT),
 		bolsa: copia(bolsa),
 		indiceBolsa: copia(indiceBolsa),
 		aux: copia(aux),
 		ponto: copia(ponto)
 	};
 	return estado;
 }
/**
 * Carrega Estado Atual
 */
 function carregarEstado(estado) {
 	gradeDoJogo = copia(estado.gradeDoJogo);
 	formaAtual = copia(estado.formaAtual);
 	proximaFormaT = copia(estado.proximaFormaT);
 	bolsa = copia(estado.bolsa);
 	indiceBolsa = copia(estado.indiceBolsa);
 	aux = copia(estado.aux);
 	ponto = copia(estado.ponto);
 	saida();
 	atualizarPontuacao();
 }
/**
 * Retorna a altura acumulada
 */
 function obtemAlturaAcumulada() {
 	removerForma();
 	var picos = [20,20,20,20,20,20,20,20,20,20];
 	for (var linha = 0; linha < gradeDoJogo.length; linha++) {
 		for (var coluna = 0; coluna < gradeDoJogo[linha].length; coluna++) {
 			if (gradeDoJogo[linha][coluna] !== 0 && picos[coluna] === 20) {
 				picos[coluna] = linha;
 			}
 		}
 	}
 	var alturaTotal = 0;
 	for (var i = 0; i < picos.length; i++) {
 		alturaTotal += 20 - picos[i];
 	}
 	aplicaForma();
 	return alturaTotal;
 }
/**
 * Retorna os Buracos
 */
 function obtemBuracos() {
 	removerForma();
 	var picos = [20,20,20,20,20,20,20,20,20,20];
 	for (var linha = 0; linha < gradeDoJogo.length; linha++) {
 		for (var coluna = 0; coluna < gradeDoJogo[linha].length; coluna++) {
 			if (gradeDoJogo[linha][coluna] !== 0 && picos[coluna] === 20) {
 				picos[coluna] = linha;
 			}
 		}
 	}
 	var buracos = 0;
 	for (var x = 0; x < picos.length; x++) {
 		for (var y = picos[x]; y < gradeDoJogo.length; y++) {
 			if (gradeDoJogo[y][x] === 0) {
 				buracos++;
 			}
 		}
 	}
 	aplicaForma();
 	return buracos;
 }
/**
 * Obtem o buraco do vetor
 */
 function obtemBuracosArray() {
 	var array = copia(gradeDoJogo);
 	removerForma();
 	var picos = [20,20,20,20,20,20,20,20,20,20];
 	for (var linha = 0; linha < gradeDoJogo.length; linha++) {
 		for (var coluna = 0; coluna < gradeDoJogo[linha].length; coluna++) {
 			if (gradeDoJogo[linha][coluna] !== 0 && picos[coluna] === 20) {
 				picos[coluna] = linha;
 			}
 		}
 	}
 	for (var x = 0; x < picos.length; x++) {
 		for (var y = picos[x]; y < gradeDoJogo.length; y++) {
 			if (gradeDoJogo[y][x] === 0) {
 				array[y][x] = -1;
 			}
 		}
 	}
 	aplicaForma();
 	return array;
 }
/**
 * retorna a aspereza.
 */
 function obtemAspereza() {
 	removerForma();
 	var picos = [20,20,20,20,20,20,20,20,20,20];
 	for (var linha = 0; linha < gradeDoJogo.length; linha++) {
 		for (var coluna = 0; coluna < gradeDoJogo[linha].length; coluna++) {
 			if (gradeDoJogo[linha][coluna] !== 0 && picos[coluna] === 20) {
 				picos[coluna] = linha;
 			}
 		}
 	}
 	var aspereza = 0;
 	var diferencas = [];
 	for (var i = 0; i < picos.length - 1; i++) {
 		aspereza += Math.abs(picos[i] - picos[i + 1]);
 		diferencas[i] = Math.abs(picos[i] - picos[i + 1]);
 	}
 	aplicaForma();
 	return aspereza;
 }
/**
 * Retorna a Altura Relativa
 */
 function obtemAlturaRelativa() {
 	removerForma();
 	var picos = [20,20,20,20,20,20,20,20,20,20];
 	for (var linha = 0; linha < gradeDoJogo.length; linha++) {
 		for (var coluna = 0; coluna < gradeDoJogo[linha].length; coluna++) {
 			if (gradeDoJogo[linha][coluna] !== 0 && picos[coluna] === 20) {
 				picos[coluna] = linha;
 			}
 		}
 	}
 	aplicaForma();
 	return Math.max.apply(Math, picos) - Math.min.apply(Math, picos);
 }
/**
 * Retorna a Altura
 */
 function obterAltura() {
 	removerForma();
 	var picos = [20,20,20,20,20,20,20,20,20,20];
 	for (var linha = 0; linha < gradeDoJogo.length; linha++) {
 		for (var coluna = 0; coluna < gradeDoJogo[linha].length; coluna++) {
 			if (gradeDoJogo[linha][coluna] !== 0 && picos[coluna] === 20) {
 				picos[coluna] = linha;
 			}
 		}
 	}
 	aplicaForma();
 	return 20 - Math.min.apply(Math, picos);
 }
/**
 * Copia objeto
 */
 function copia(obj) {
 	return JSON.parse(JSON.stringify(obj));
 }
/**
 * Retorna propAleatoria
 */
 function propAleatoria(obj) {
 	return(obj[chaveAleatoria(obj)]);
 }
/**
 * Retorna uma chave de propriedade aleatória do objeto fornecido.
 */
 function chaveAleatoria(obj) {
 	var keys = Object.keys(obj);
 	var i = numeroAleatorioMinMax(0, keys.length);
 	return keys[i];
 }
 /**
  * substTudo.
  */
 function substTudo(alvo, buscaZ, substituicaoZ) {
 	return alvo.replace(new RegExp(buscaZ, 'g'), substituicaoZ);
 }
/**
 * Retorna um número aleatório que é determinado a partir de min e max
 */
 function numeroAleatorioMinMax(min, max) {
 	max = max || 1;
 	min = min || 0;
 	aux = (aux * 9301 + 49297) % 233280;
 	var rnd = aux / 233280;
 	return Math.floor(min + rnd * (max - min));
 }
 function numeroAleatorioEntre(min, max) {
 	return Math.floor(Math.random() * (max - min + 1) + min);
 }
 function numeroponderadoaleatorio(min, max) {
 	return Math.floor(Math.pow(Math.random(), 2) * (max - min + 1) + min);
 }
 function escolhaAleatoria(proUM, proDois) {
 	if (Math.round(Math.random()) === 0) {
 		return copia(proUM);
 	} else {
 		return copia(proDois);
 	}
 }
 function contem(a, obj) {
 	var i = a.length;
 	while (i--) {
 		if (a[i] === obj) {
 			return true;
 		}
 	}
 	return false;
 }
