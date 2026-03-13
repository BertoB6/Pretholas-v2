// Banco de dados com 6 camisas em destaque
const produtosDestaque = [
    { id: 1, nome: 'Liverpool 25/26', preco: 500.00, imagem: 'camisa1.jpg' },
    { id: 2, nome: 'Real Madrid 25/26', preco: 500.00, imagem: 'camisa2.jpg' },
    { id: 3, nome: 'Barcelona 25/26', preco: 500.00, imagem: 'camisa3.jpg' },
    { id: 4, nome: 'Manchester City 25/26', preco: 500.00, imagem: 'camisa4.jpg' },
    { id: 5, nome: 'Atletico de Madrid 25/26', preco: 500.00, imagem: 'camisa5.jpg' },
    { id: 6, nome: 'Sporting 25/26', preco: 500.00, imagem: 'camisa6.jpg' }
];

let carrinho = [];

document.addEventListener('DOMContentLoaded', function() {
    renderizarDestaques();
    carregarCarrinho();
    initMenu();
    initCart();
});

function renderizarDestaques() {
    const container = document.getElementById('produtos-destaque');
    if (!container) return;
    
    container.innerHTML = produtosDestaque.map(prod => `
        <div class="produto-card">
            <div class="produto-img">
                <img src="${prod.imagem}" alt="${prod.nome}" onerror="this.src='https://via.placeholder.com/300x225?text=Pretholas'">
            </div>
            <div class="produto-info">
                <h3 class="produto-nome">${prod.nome}</h3>
                <div class="produto-preco">${prod.preco.toFixed(2)}MT</div>
                <button class="btn-comprar" onclick="adicionarAoCarrinho(${prod.id})">COMPRAR</button>
            </div>
        </div>
    `).join('');
}

function adicionarAoCarrinho(id) {
    const produto = produtosDestaque.find(p => p.id === id);
    const existente = carrinho.find(item => item.id === id);
    
    if (existente) {
        existente.quantidade++;
    } else {
        carrinho.push({
            id: produto.id,
            nome: produto.nome,
            preco: produto.preco,
            imagem: produto.imagem,
            quantidade: 1
        });
    }
    
    atualizarCarrinho();
    alert(`${produto.nome} adicionado ao carrinho!`);
}

function atualizarCarrinho() {
    document.getElementById('cartCount').textContent = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
    
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
                    <img src="${item.imagem}" alt="${item.nome}" class="cart-item-img">
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

function checkout() {
    if (carrinho.length === 0) {
        alert('Carrinho vazio!');
        return;
    }
    
    let msg = "🛒 *NOVO PEDIDO - PRETHOLAS* 🛒\n\n";
    carrinho.forEach(item => {
        msg += `${item.nome} - ${item.preco.toFixed(2)}MT x ${item.quantidade}\n`;
    });
    const total = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
    msg += `\n*Total: ${total.toFixed(2)}MT*`;
    
    window.open(`https://wa.me/258852158504?text=${encodeURIComponent(msg)}`, '_blank');
}

// Menu
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

// Carrinho dropdown
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
