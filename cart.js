// 1. Initialize Cart on Load
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();

    // Attach Add to Cart listener if on single product page
    if (document.getElementById('prodetails')) {
        attachAddToCartListener();
    }

    // Render cart items if on cart page
    if (document.getElementById('cart')) {
        renderCartItems();
    }
});

// 2. Attach "Add to Cart" functionality (sproduct.html)
function attachAddToCartListener() {
    const addBtn = document.querySelector('#prodetails button.normal');
    const quantityInput = document.querySelector('#prodetails input[type="number"]');
    const sizeSelect = document.querySelector('#prodetails select');

    if (!addBtn) return;

    addBtn.addEventListener('click', () => {
        const mainImgSrc = document.getElementById('mainImg').src;
        const name = document.querySelector('#prodetails h4').innerText;
        const priceText = document.querySelector('#prodetails h2').innerText;
        const price = parseFloat(priceText.replace('$', '').trim());
        const quantity = parseInt(quantityInput.value) || 1;
        const size = sizeSelect.value;

        if (size === "Select Size") {
            alert("Please select a size!");
            return;
        }

        // Use the actual displayed image filename as the variant identifier
        const imageFilename = mainImgSrc.split('/').pop(); // e.g. "moreProduct3.png"

        // Unique ID = image filename + size
        // This ensures different images (variants) on the same product page are treated separately
        const uniqueId = `${imageFilename}-${size}`;

        const product = {
            id: uniqueId,
            name: name,
            price: price,
            image: mainImgSrc,
            quantity: quantity,
            size: size
        };

        addToCart(product);
    });
}

// 3. Add product to cart (with variant support)
function addToCart(newProduct) {
    let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];

    // Check if this exact variant (same image + same size) already exists
    const existingIndex = cart.findIndex(item => item.id === newProduct.id);

    if (existingIndex !== -1) {
        // Same variant → increase quantity
        cart[existingIndex].quantity += newProduct.quantity;
    } else {
        // Different variant → add as new item
        cart.push(newProduct);
    }

    localStorage.setItem('shoppingCart', JSON.stringify(cart));
    updateCartCount();
    alert("Item added to cart!");
}

// 4. Render cart items on cart.html
function renderCartItems() {
    const cartBody = document.getElementById('cart-body');
    const subtotalEl = document.getElementById('cart-subtotal');
    const totalEl = document.getElementById('cart-total');

    if (!cartBody) return;

    let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
    cartBody.innerHTML = '';

    let total = 0;

    if (cart.length === 0) {
        cartBody.innerHTML = '<tr><td colspan="6">Your cart is empty.</td></tr>';
        subtotalEl.innerText = "$0.00";
        totalEl.innerText = "$0.00";
        return;
    }

    cart.forEach((item, index) => {
        const itemSubtotal = item.price * item.quantity;
        total += itemSubtotal;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td><a href="#" onclick="removeFromCart(${index})"><i class="far fa-times-circle"></i></a></td>
            <td><img src="${item.image}" alt="${item.name}"></td>
            <td>${item.name}<br><small>Size: ${item.size}</small></td>
            <td>$${item.price.toFixed(2)}</td>
            <td><input type="number" value="${item.quantity}" min="1" onchange="updateQuantity(${index}, this.value)"></td>
            <td>$${itemSubtotal.toFixed(2)}</td>
        `;
        cartBody.appendChild(row);
    });

    subtotalEl.innerText = `$${total.toFixed(2)}`;
    totalEl.innerHTML = `<strong>$${total.toFixed(2)}</strong>`;
}

// 5. Helper Functions
function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    // Desktop cart icon count
    const lgBagSpan = document.querySelector('#lg-bag span');
    if (lgBagSpan) lgBagSpan.innerText = totalItems;

    // Mobile cart icon count
    const mobileBagSpan = document.querySelector('#mobile span');
    if (mobileBagSpan) mobileBagSpan.innerText = totalItems;
}

function updateQuantity(index, newValue) {
    let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
    const qty = parseInt(newValue);
    
    if (qty < 1 || isNaN(qty)) {
        cart[index].quantity = 1;
    } else {
        cart[index].quantity = qty;
    }

    localStorage.setItem('shoppingCart', JSON.stringify(cart));
    renderCartItems();
    updateCartCount();
}

function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
    renderCartItems();
    updateCartCount();
}