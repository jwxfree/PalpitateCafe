var items = [];
function addItem(itemName, itemPrice) {
    var itemRows = document.querySelectorAll('.boughtItem-tray .boughtItem p');
    var existingItem = Array.from(itemRows).find(function(row) {
        return row.textContent.trim() === itemName;
    });

    var item = {
        name: itemName,
        price: itemPrice
    };
    items.push(item);

    if (existingItem) {

        var quantityInput = existingItem.parentElement.nextElementSibling.querySelector('.quantity-input');
        var quantity = parseInt(quantityInput.value) + 1;
        quantityInput.value = quantity;

        var itemSubtotalCol = existingItem.parentElement.nextElementSibling.nextElementSibling.nextElementSibling;
        var subtotal = quantity * itemPrice;
        itemSubtotalCol.textContent = subtotal;
    } else {
    
        var newRow = document.createElement('div');
        newRow.className = "row ms-1";

        var itemNameCol = document.createElement('div');
        itemNameCol.className = "col-lg-5 boughtItem ";
        itemNameCol.innerHTML = `<p>${itemName}</p>`;

        var itemQtyCol = document.createElement('div');
        itemQtyCol.className = "col-lg-3 text-center boughtQty";
        itemQtyCol.innerHTML = `<input type="number" class="form-control quantity-input" min="1" value="1">`;

        var itemPriceCol = document.createElement('div');
        itemPriceCol.className = "col-lg-2 boughtPrice  text-center";
        itemPriceCol.innerHTML = `<p>${itemPrice}</p>`;

        var itemSubtotalCol = document.createElement('div');
        itemSubtotalCol.className = "col-lg-2 boughtSubtotal ms-1 text-center";
        itemSubtotalCol.innerHTML = `<p>${itemPrice}</p>`;

        var deleteButtonCol = document.createElement('div');
        deleteButtonCol.className = "";
        deleteButtonCol.innerHTML = `<button class="btn btn-danger btn-sm delete-btn mb-3">Delete</button>`;

    
        newRow.appendChild(itemNameCol);
        newRow.appendChild(itemQtyCol);
        newRow.appendChild(itemPriceCol);
        newRow.appendChild(itemSubtotalCol);
        newRow.appendChild(deleteButtonCol); 

    
        var boughtItemTray = document.querySelector('.boughtItem-tray');
        boughtItemTray.appendChild(newRow);

     
        var quantityInput = itemQtyCol.querySelector('.quantity-input');
        quantityInput.addEventListener('input', function() {
            var quantity = parseInt(this.value);
            var subtotal = quantity * itemPrice;
            itemSubtotalCol.querySelector('p').textContent = subtotal;
            updateTotal();
        });

        
        var deleteButton = deleteButtonCol.querySelector('.delete-btn');
        deleteButton.addEventListener('click', function() {
            newRow.remove();
            updateTotal();
        });

        updateTotal(); // Update total after adding a new item
    }
}

function updateTotal() {
    var subtotalElements = document.querySelectorAll('.boughtSubtotal p');
    var total = 0;
    subtotalElements.forEach(function(subtotalElement) {
        var subtotal = parseInt(subtotalElement.textContent);
        if (!isNaN(subtotal)) {
            total += subtotal;
        }
    });
    var orderTotalElement = document.querySelector('.orderTotal');
    orderTotalElement.textContent = 'TOTAL: ' + total;

    var total = items.reduce((acc, item) => acc + item.price, 0);
            var orderTotalElement = document.querySelector('.orderTotal');
            orderTotalElement.textContent = 'TOTAL: ₱' + total.toFixed(2);
}

function displayReceipt() {
    var receiptContent = "<h4>Receipt</h4><hr>";
    items.forEach(function (item) {
        receiptContent += `<p>Item Name: ${item.name}</p>`;
        receiptContent += "<p>Quantity: 1</p>";
        receiptContent += `<p>Price: $${item.price.toFixed(2)}</p>`;
        receiptContent += `<p>Subtotal: $${item.price.toFixed(2)}</p>`;
        receiptContent += "<hr>";
    });
    var total = items.reduce((acc, item) => acc + item.price, 0);
    receiptContent += `<p><strong>Total: $${total.toFixed(2)}</strong></p>`;

    var receiptAlert = `
        <div class="alert alert-info alert-dismissible fade show" role="alert">
            ${receiptContent}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;

    var receiptContainer = document.querySelector('.receipt');
    receiptContainer.innerHTML = receiptAlert;

    receiptContainer.focus();
}