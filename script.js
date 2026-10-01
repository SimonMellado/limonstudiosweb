// Carrito de compras global
let cart = [];

function toggleModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.toggle('hidden');
    }
}

function toggleCartModal() {
    toggleModal('cart-modal');
}

function addToCart(name, price) {
    cart.push({ name, price });
    updateCartUI();
    toggleCartModal();
}

function updateCartUI() {
    const badge = document.getElementById('cart-badge');
    const itemsContainer = document.getElementById('cart-items');
    const totalPriceEl = document.getElementById('cart-total-price');

    if (cart.length > 0) {
        badge.innerText = cart.length;
        badge.classList.remove('hidden');
    } else {
        badge.classList.add('hidden');
    }

    itemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price;
        const itemEl = document.createElement('div');
        itemEl.className = 'flex justify-between items-center bg-slate-950 p-3 rounded-xl border border-slate-800';
        itemEl.innerHTML = `
            <div>
                <p class="font-semibold text-white text-sm">${item.name}</p>
                <p class="text-xs text-yellow-400">$${item.price.toLocaleString('es-CL')} CLP</p>
            </div>
            <button onclick="removeFromCart(${index})" class="text-slate-500 hover:text-red-400 text-xs">Eliminar</button>
        `;
        itemsContainer.appendChild(itemEl);
    });

    totalPriceEl.innerText = `$${total.toLocaleString('es-CL')} CLP`;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function calculateCustomPrice() {
    const basePrice = parseInt(document.getElementById('cfg-type').value);
    const checkboxes = document.querySelectorAll('.cfg-feature:checked');
    let total = basePrice;

    checkboxes.forEach(cb => {
        total += parseInt(cb.value);
    });

    document.getElementById('cfg-total').innerText = `$${total.toLocaleString('es-CL')} CLP`;
    return total;
}

function addConfiguredToCart() {
    const select = document.getElementById('cfg-type');
    const typeName = select.options[select.selectedIndex].text.split('(')[0].trim();
    const total = calculateCustomPrice();
    addToCart(typeName, total);
}

function sendAIMessage() {
    const input = document.getElementById('ai-input');
    const text = input.value.trim();
    if (!text) return;

    const messages = document.getElementById('ai-messages');
    
    // User message
    const userMsg = document.createElement('div');
    userMsg.className = 'bg-yellow-400 text-slate-950 p-3 rounded-xl max-w-[80%] ml-auto text-right font-medium';
    userMsg.innerText = text;
    messages.appendChild(userMsg);

    input.value = '';
    messages.scrollTop = messages.scrollHeight;

    // AI response simulation
    setTimeout(() => {
        const aiMsg = document.createElement('div');
        aiMsg.className = 'bg-slate-800 text-slate-200 p-3 rounded-xl max-w-[80%]';
        aiMsg.innerText = 'Gracias por tu consulta. Nuestros servicios incluyen garantía de optimización, entrega puntual y soporte continuo. ¿Quieres agendar una breve cotización por WhatsApp?';
        messages.appendChild(aiMsg);
        messages.scrollTop = messages.scrollHeight;
    }, 1000);
}

function checkout() {
    if (cart.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }
    alert('Redirigiendo a la pasarela segura Flow / Registro de transferencia...');
    cart = [];
    updateCartUI();
    toggleCartModal();
}
