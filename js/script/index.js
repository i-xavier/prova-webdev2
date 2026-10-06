import Repositorio from "./repo/repositorio.js";

const bd = new Repositorio();

//aponta pro botão que ativa o dark mode
const toggleButton = document.getElementById('theme-toggle');
const html = document.documentElement;

// Carregar tema salvo ou preferido pelo sistema
const temaSalvo = localStorage.getItem('theme');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
//const produtosVitrine = document.getElementById("produtosVitrine"); //aponta pro espaço que carrega as últimas notícias
const inputFiltro = document.getElementById("search-bar"); //aponta pro serach bar
const btnProdutos = document.querySelectorAll(".btnProdutos"); //aponta pros botões que manipulam a aba de últimas notícias
const carregarProdutos = document.getElementById("produtos");
const formNewsletter = document.querySelector("form"); //aponta pro formulário de newsletter



const produtosIniciais = [
    {
        id: 1,
        nome: "PlayStation 2",
        categoria: "Console",
        preco: 2.99,
        avaliacao: 4.5,
        imagem: "assets/img/produto.jpeg",//"https://picsum.photos/800/400?random=1",
        alt: "Fotografia do console PlayStation 2"
    },
    {
        id: 2,
        nome: "Nintendo Wii",
        categoria: "Console",
        preco: 5.0,
        avaliacao: 2.35,
        imagem: "assets/img/produto.jpeg",//"https://picsum.photos/800/400?random=2",
        alt: "Fotografia do console Nintendo Wii"
    },
    {
        id: 3,
        nome: "Grand Theft Auto 6",
        categoria: "Jogos",
        preco: 6.90,
        avaliacao: 1.2,
        imagem: "assets/img/produto.jpeg",//"https://picsum.photos/800/400?random=3",
        alt: "Fotografia do jogo digital Grand Theft Auto 6"
    },
    {
        id: 4,
        nome: "Mousepad GX",
        categoria: "Acessórios",
        preco: 7.99,
        avaliacao: 3.7,
        imagem: "assets/img/produto.jpeg",//"https://picsum.photos/800/400?random=4",
        alt: "Fotografia do acessório Mousepad Gx"
    },
    {
        id: 5,
        nome: "Computador Gamer Pichau HJ950 Ryzen 5",
        categoria: "Computadores",
        preco: 10.5,
        avaliacao: 4.7,
        imagem: "assets/img/produto.jpeg",//"https://picsum.photos/800/400?random=5",
        alt: "Fotografia do computador gamer Pichau HJ950 Ryzen 5"
    },
    {
        id: 6,
        nome: "Pasta térmica geladinho",
        categoria: "Acessórios",
        preco: 2.6,
        avaliacao: 5.0,
        imagem: "assets/img/produto.jpeg",//"https://picsum.photos/800/400?random=6",
        alt: "Fotografia da pasta térmica geladinho"
    },
    {
        id: 7,
        nome: "Xbox Series X",
        categoria: "Console",
        preco: 3.6,
        avaliacao: 2.5,
        imagem: "assets/img/produto.jpeg",//"https://picsum.photos/800/400?random=7",
        alt: "Fotografia do console Xbox Series X"
    },
    {
        id: 8,
        nome: "Bomberman 7",
        categoria: "Jogos",
        preco: 4.3,
        avaliacao: 4.2,
        imagem: "assets/img/produto.jpeg",//"https://picsum.photos/800/400?random=8",
        alt: "Fotografia do jogo digital Bomberman 7"
    }
];

let produtos = produtosIniciais; //variável de manipulação dos dados de notícia recebe algumas notícias como default de outro array
let filtroBuscaProdutos = [];
let textoBusca; //texto escrito na barra de busca

document.addEventListener("DOMContentLoaded", () => {
    //carrega na variável os dados salvos em localStorage
    const dadosSalvos = JSON.parse(localStorage.getItem("produtos"));

    if (dadosSalvos) {
        //caso tenha dados salvos no localStorage a variável que guarda o array de noitícias é atualizada
        produtos = dadosSalvos;
    } else{
        localStorage.setItem(
            "produtos",
            JSON.stringify(produtos)
        );
    }
    //é carregado todas as últimas notícias como padrão

    //localStorage.setItem("produtos", JSON.stringify(produtos));
    const listaProdutos = gerenciarProdutos("todas");
    //adiciona as notícias na tela
    //addProdutos();
    addProdutos(listaProdutos);
})

//Aplica o tema dark caso o tema salvo seva equivalente
if (temaSalvo === 'dark' || (!temaSalvo && systemPrefersDark)) {
    html.setAttribute('data-theme', 'dark');
    //logo.setAttribute("src", "assets/logo-light.svg")
} else {
    //logo.setAttribute("src", "assets/logo-light.svg")
}

// Alternar tema ao clicar
toggleButton.addEventListener('click', () => {

    const temaAtual = html.getAttribute('data-theme');

    const novoTema = temaAtual === 'dark' ? 'light' : 'dark';

    html.setAttribute('data-theme', novoTema);

    localStorage.setItem('theme', novoTema);

});

//evento que manipula os botões da aba últimas notícias
btnProdutos.forEach(botao => {
    //"ouve" cada um dos botões pra encontrar qual foi clicado
    botao.addEventListener("click", (e) => {
        e.preventDefault();
        const click = e.target.dataset.id;
        if (!click) return;

        //passa o tema que foi clicado para ser filtrado 
        const ult = gerenciarProdutos(click);
        //mostra na tela após o filtro
        addProdutos(ult);
    });
});

//evento que manipula o filtro da barra de pesquisa
inputFiltro.addEventListener('input', (e) => {
    e.preventDefault();

    //captura e trata o testo digitado
    textoBusca = e.target.value.toLowerCase();

    //apaga todos os filhos que estão na tela para carregar novos
    limparListaProdutos();

    const lista = gerenciarProdutos();

    addProdutos(lista);
})

const addProdutos = (lista) => {
    limparListaProdutos();

    for (let i = 0; i < lista.length; i++) {

        const imagem = lista[i].imagem;
        const categoria = lista[i].categoria;
        const nome = lista[i].nome;
        const preco = lista[i].preco;
        const avaliacao = lista[i].avaliacao;

        const div = document.createElement("div");
        div.id = lista[i].id;
        div.classList.add("cardProdutos", "fade-in");

        //Adiciona o span que vai conter a imagem
        const spanImg = document.createElement("span");
        spanImg.classList.add("imgCardProdutos");
        const contentImg = document.createElement("img");
        contentImg.setAttribute("alt", lista[i].alt);
        contentImg.setAttribute("src", imagem);
        spanImg.appendChild(contentImg);

        //Adiciona o span que vai conter a categoria
        const spanCategoria = document.createElement("span");
        const catFormatada = formatarCategoria(categoria); //chama a função de formatação do texto categoria
        // Adiciona a classe da categoria e a classe para formatar o botão
        spanCategoria.classList.add("categoriaCardProdutos", "cat-" + catFormatada);
        const contentCategoria = document.createTextNode(categoria);
        spanCategoria.appendChild(contentCategoria);

        //Adiciona o span que controla o titulo
        const spanNome = document.createElement("span");
        spanNome.classList.add("nomeCardProdutos");
        const contentNome = document.createTextNode(nome);
        spanNome.appendChild(contentNome);

        //Adiciona o span que mostra o autor
        const spanPreco = document.createElement("span");
        spanPreco.classList.add("precoCardProdutos");
        const contentPreco = document.createTextNode(preco);
        spanPreco.appendChild(contentPreco);

        //Adiciona o span que mostra a data
        const spanAvaliacao = document.createElement("span");
        spanAvaliacao.classList.add("avaliacaoCardProdutos");
        const contentAvaliacao = document.createTextNode(avaliacao);
        spanAvaliacao.appendChild(contentAvaliacao);

        const botoesSpan = document.createElement("span");
        botoesSpan.classList.add("botoesCardProd")

        const botaoAddCarrinho = document.createElement("input");
        //botaoAddCarrinho.classList.add("fas", "fa-shopping-cart", "me-2")
        botaoAddCarrinho.setAttribute("type", "submit");
        botaoAddCarrinho.setAttribute("value", " + ");


        botaoAddCarrinho.addEventListener("click", function () {
            const registroProduto = bd.buscarProduto(lista[i].id);

            //console.log(registroProduto);

           if (registroProduto) {
                bd.abrirCarrinho(registroProduto.produto);
                alert(`${registroProduto.produto.nome} foi adicionado ao carrinho!`);
            } else {
                console.log("Erro ao adicionar produto");
            }

        })

        botoesSpan.appendChild(botaoAddCarrinho);


        //guarda os filhos na div que guardará o produto
        div.appendChild(spanImg);
        div.appendChild(spanCategoria);
        div.appendChild(spanNome);
        div.appendChild(spanPreco);
        div.appendChild(spanAvaliacao);
        div.appendChild(botoesSpan);

        //guarda no espaço que ficará as notícias
        carregarProdutos.appendChild(div);

    }

}

const gerenciarProdutos = (click) => {

    const array = produtos;
    //analisa se o click possui os valores de categoria
    if (click !== undefined && click !== "todas") {
        switch (click) {
            case 'consoles':
                array = produtos.filter(item.categoria === 'Consoles');
                break;
            case 'acessorios':
                array = produtos.filter(item.categoria === 'Acessórios');
                break;
            case 'computadores':
                array = produtos.filter(item.categoria === 'Computadores');
                break;
            case 'jogos':
                array = produtos.filter(item.categoria === 'Jogos');
                break;
        }
    }
    //se houver texto na barra de buscas, cria uma nova lista já filtrada com o texto inputado
    if (textoBusca !== undefined && textoBusca !== "") {
        const busca = array.filter(n => n.titulo.toLowerCase().includes(textoBusca))
        filtroBuscaProdutos = busca;
        return busca;
    }

    filtroBuscaProdutos = array;
    return array;
}

const limparListaProdutos = () => {

    //enquanto houver elementos filhos vai apagando um a um desse espaço 
    while (carregarProdutos.firstChild) {
        carregarProdutos.removeChild(carregarProdutos.firstChild);
    }
}

const formatarCategoria = (texto) => {
    return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};