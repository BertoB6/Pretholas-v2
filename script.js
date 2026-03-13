// ===== DADOS DOS PRODUTOS MISTURADOS =====
const produtos = [
    // Camisas
    { id: 1, nome: 'Liverpool 25/26', preco: 500.00, imagem: 'camisa1.jpg' },
    // Bolas
    { id: 9, nome: 'Bola de Futsal Pro', preco: 300.00, imagem: 'bola1.jpg' },
    // Camisas
    { id: 2, nome: 'Real Madrid 25/26', preco: 500.00, imagem: 'camisa2.jpg' },
    // Chuteiras
    { id: 13, nome: 'Chuteira Elite FG', preco: 1200.00, imagem: 'chuteira1.jpg' },
    // Camisas
    { id: 3, nome: 'Barcelona 25/26', preco: 500.00, imagem: 'camisa3.jpg' },
    // Bolas
    { id: 10, nome: 'Bola de Campo Oficial', preco: 2000.00, imagem: 'bola2.jpg' },
    // Camisas
    { id: 4, nome: 'Manchester City 25/26', preco: 500.00, imagem: 'camisa4.jpg' },
    // Chuteiras
    { id: 14, nome: 'Chuteira Pro SG', preco: 1500.00, imagem: 'chuteira2.jpg' },
    // Camisas
    { id: 5, nome: 'Chelsea 25/26', preco: 500.00, imagem: 'camisa5.jpg' },
    // Bolas
    { id: 11, nome: 'Bola de Treino', preco: 800.00, imagem: 'bola3.jpg' },
    // Camisas
    { id: 6, nome: 'Arsenal 25/26', preco: 500.00, imagem: 'camisa6.jpg' },
    // Bolas
    { id: 12, nome: 'Bola Society', preco: 1200.00, imagem: 'bola4.jpg' },
    // Camisas
    { id: 7, nome: 'Benfica 25/26', preco: 500.00, imagem: 'camisa7.jpg' },
    // Camisas
    { id: 8, nome: 'Sporting 25/26', preco: 500.00, imagem: 'camisa8.jpg' }
];

// ===== VARIÁVEIS GLOBAIS =====
let carrinho = [];
let produtoSelecionado = null;

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    renderizarProdutos();
    carregarCarrinho();
    initMenu();
    initCart();
    initModal();
    initCheckout();
});

// ===== RENDERIZAR PRODUTOS =====
function renderizarProdutos() {
    const container = document.getElementById('produtos-grid');
    if (!container) return;
    
    container.innerHTML = produtos.map(prod => `
        <div class="produto-card">
            <div class="produto-img">
                <img src="${prod.imagem}" alt="${prod.nome}" onerror="this.src='https://via.placeholder.com/300x225?text=Pretholas'">
            </div>
            <div class="produto-info">
                <h3 class="produto-nome">${prod.nome}</h3>
                <div class="produto-preco">${prod.preco.toFixed(2)}MT</div>
                <button class="btn-comprar" onclick="abrirModalCompra(${prod.id})">COMPRAR</button>
            </div>
        </div>
    `).join('');
}

// ===== FUNÇÕES DO MODAL =====
function abrirModalCompra(id) {
    produtoSelecionado = produtos.find(p => p.id === id);
    if (!produtoSelecionado) return;

    document.getElementById('modalProdutoImg').src = produtoSelecionado.imagem;
    document.getElementById('modalProdutoNome').textContent = produtoSelecionado.nome;
    document.getElementById('modalProdutoPreco').textContent = produtoSelecionado.preco.toFixed(2) + 'MT';
    document.getElementById('compraModal').classList.add('active');
}

function fecharModal() {
    document.getElementById('compraModal').classList.remove('active');
    produtoSelecionado = null;
}

function initModal() {
    document.getElementById('modalFechar').addEventListener('click', fecharModal);
    
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('compraModal');
        if (e.target === modal) fecharModal();
    });
    
    document.getElementById('comprarAgoraBtn').addEventListener('click', function() {
        if (!produtoSelecionado) return;
        adicionarAoCarrinho(produtoSelecionado.id, 1);
        fecharModal();
        document.getElementById('cartDropdown').classList.add('active');
    });
    
    document.getElementById('adicionarMaisBtn').addEventListener('click', function() {
        if (!produtoSelecionado) return;
        adicionarAoCarrinho(produtoSelecionado.id, 2);
        fecharModal();
        alert(`✅ 2 unidades de ${produtoSelecionado.nome} adicionadas ao carrinho!`);
    });
    
    document.getElementById('verCarrinhoBtn').addEventListener('click', function() {
        fecharModal();
        document.getElementById('cartDropdown').classList.add('active');
    });
}

// ===== FUNÇÕES DO CARRINHO =====
function adicionarAoCarrinho(id, quantidade = 1) {
    const produto = produtos.find(p => p.id === id);
    if (!produto) return;

    const existente = carrinho.find(item => item.id === id);
    
    if (existente) {
        existente.quantidade += quantidade;
    } else {
        carrinho.push({
            id: produto.id,
            nome: produto.nome,
            preco: produto.preco,
            imagem: produto.imagem,
            quantidade: quantidade
        });
    }
    
    atualizarCarrinho();
}

function atualizarCarrinho() {
    const totalItems = carrinho.reduce((total, item) => total + item.quantidade, 0);
    document.getElementById('cartCount').textContent = totalItems;
    
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (carrinho.length === 0) {
        cartItems.innerHTML = '<p class="cart-empty">Seu carrinho está vazio</p>';
        cartTotal.textContent = '0.00MT';
    } else {
        let html = '';
        let total = 0;
        
        carrinho.forEach(item => {
            total += item.preco * item.quantidade;
            html += `
                <div class="cart-item">
                    <img src="${item.imagem}" alt="${item.nome}" class="cart-item-img" onerror="this.src='https://via.placeholder.com/50x50?text=Prod'">
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.nome}</div>
                        <div class="cart-item-price">${item.preco.toFixed(2)}MT x ${item.quantidade}</div>
                    </div>
                    <i class="fas fa-trash cart-item-remove" onclick="removerDoCarrinho(${item.id})"></i>
                </div>
            `;
        });
        
        cartItems.innerHTML = html;
        cartTotal.textContent = total.toFixed(2) + 'MT';
    }
    
    localStorage.setItem('pretholas-carrinho', JSON.stringify(carrinho));
}

function removerDoCarrinho(id) {
    carrinho = carrinho.filter(item => item.id !== id);
    atualizarCarrinho();
}

function carregarCarrinho() {
    const salvo = localStorage.getItem('pretholas-carrinho');
    if (salvo) {
        carrinho = JSON.parse(salvo);
        atualizarCarrinho();
    }
}

function initCheckout() {
    document.getElementById('btnCheckout').addEventListener('click', function() {
        if (carrinho.length === 0) {
            alert('Seu carrinho está vazio!');
            return;
        }
        
        let msg = "🛒 *NOVO PEDIDO - PRETHOLAS* 🛒\n\n";
        carrinho.forEach(item => {
            msg += `${item.nome} - ${item.preco.toFixed(2)}MT x ${item.quantidade}\n`;
        });
        const total = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
        msg += `\n*Total: ${total.toFixed(2)}MT*`;
        
        window.open(`https://wa.me/258852158504?text=${encodeURIComponent(msg)}`, '_blank');
    });
}

// ===== FUNÇÕES DO MENU =====
function initMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const sideMenu = document.getElementById('sideMenu');
    const menuOverlay = document.getElementById('menuOverlay');
    const closeMenu = document.getElementById('closeMenu');
    
    menuToggle.addEventListener('click', () => {
        sideMenu.classList.add('active');
        menuOverlay.classList.add('active');
    });
    
    closeMenu.addEventListener('click', () => {
        sideMenu.classList.remove('active');
        menuOverlay.classList.remove('active');
    });
    
    menuOverlay.addEventListener('click', () => {
        sideMenu.classList.remove('active');
        menuOverlay.classList.remove('active');
    });
}

// ===== FUNÇÕES DO CARRINHO DROPDOWN =====
function initCart() {
    const cartToggle = document.getElementById('cartToggle');
    const cartDropdown = document.getElementById('cartDropdown');
    const closeCart = document.getElementById('closeCart');
    
    cartToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        cartDropdown.classList.toggle('active');
    });
    
    closeCart.addEventListener('click', () => {
        cartDropdown.classList.remove('active');
    });
    
    document.addEventListener('click', (e) => {
        if (!cartDropdown.contains(e.target) && !cartToggle.contains(e.target)) {
            cartDropdown.classList.remove('active');
        }
    });
      }
