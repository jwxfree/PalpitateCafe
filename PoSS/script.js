items = []
function addItem(itemName, itemPrice) {
    var itemRows = document.querySelectorAll('.boughtItem-tray tbody tr');
    var existingItem = Array.from(itemRows).find(function(row) {
        return row.cells[0].textContent.trim() === itemName;
    });

    if (existingItem) {
        var quantityInput = existingItem.cells[1].querySelector('.quantity-input');
        var quantity = parseInt(quantityInput.value) + 1;
        quantityInput.value = quantity;

        var subtotal = quantity * itemPrice;
        existingItem.cells[3].textContent = '₱' + subtotal.toFixed(2);

        var itemIndex = items.findIndex(function(element) {
            return element.name === itemName;
        });
        items[itemIndex].quantity = quantity;
    } else {
        var item = {
            name: itemName,
            price: itemPrice,
            quantity: 1
        };
    
        items.push(item);

        var newRow = document.createElement('tr');

        var itemNameCell = document.createElement('td');
        itemNameCell.textContent = itemName;

        var itemQtyCell = document.createElement('td');
        itemQtyCell.innerHTML = `<input type="number" class="form-control quantity-input" min="1" value="1">`;

        var itemPriceCell = document.createElement('td');
        itemPriceCell.textContent = '₱' + itemPrice.toFixed(2);

        var itemSubtotalCell = document.createElement('td');
        itemSubtotalCell.className = "boughtSubTotal";
        var subtotal = item.quantity * item.price;
        itemSubtotalCell.textContent = '₱' + subtotal.toFixed(2);

        var deleteButtonCell = document.createElement('td');
        var deleteButton = document.createElement('button');
        deleteButton.className ="deleteBtn"
        deleteButton.textContent = 'DELETE';
        deleteButton.addEventListener('click', function() {
            deleteItem(itemName);
        });
        deleteButtonCell.appendChild(deleteButton);

        newRow.appendChild(itemNameCell);
        newRow.appendChild(itemQtyCell);
        newRow.appendChild(itemPriceCell);
        newRow.appendChild(itemSubtotalCell);
        newRow.appendChild(deleteButtonCell);

        var boughtItemTray = document.querySelector('.boughtItem-tray tbody');
        boughtItemTray.appendChild(newRow);

        var quantityInput = itemQtyCell.querySelector('.quantity-input');
        quantityInput.addEventListener('input', function() {
            var quantity = parseInt(this.value);
            var subtotal = quantity * itemPrice;
            updateSubtotal(itemName, subtotal);
            updateTotal();
        });
    }
    updateTotal();
}

function deleteItem(itemName) {
    var itemIndex = items.findIndex(function(element) {
        return element.name === itemName;
    });
    items.splice(itemIndex, 1);

    var itemRows = document.querySelectorAll('.boughtItem-tray tbody tr');
    var targetRow = Array.from(itemRows).find(function(row) {
        return row.cells[0].textContent.trim() === itemName;
    });

    if (targetRow) {
        targetRow.remove();
    }

    updateTotal();
}

function updateSubtotal(itemName, subtotal) {
    var itemRows = document.querySelectorAll('.boughtItem-tray tbody tr');
    var targetRow = Array.from(itemRows).find(function(row) {
        return row.cells[0].textContent.trim() === itemName;
    });

    if (targetRow) {
        targetRow.cells[3].textContent = '₱' + subtotal.toFixed(2);
    }
}

function updateTotal() {
    var subtotalElements = document.querySelectorAll('.boughtItem-tray tbody tr');
    var total = 0;
    subtotalElements.forEach(function(row) {
        var subtotal = parseFloat(row.cells[3].textContent.replace('₱', ''));
        if (!isNaN(subtotal)) {
            total += subtotal;
        }
    });
    var orderTotalElement = document.querySelector('.orderTotal');
    orderTotalElement.textContent = 'TOTAL: ₱' + total.toFixed(2);
}

function displayReceipt() {
    var receiptContent = "<h4>Receipt</h4><hr>";
    items.forEach(function (item) {
        receiptContent += `<p>Item Name: ${item.name}</p>`;
        receiptContent += `<p>Quantity: ${item.quantity}</p>`;
        receiptContent += `<p>Price: ₱${item.price.toFixed(2)}</p>`;
        receiptContent += `<p>Subtotal: ₱${(item.quantity * item.price).toFixed(2)}</p>`;
        receiptContent += "<hr>";
    });
    var total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    receiptContent += `<p><strong>Total: ₱${total.toFixed(2)}</strong></p>`;

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

function newOrder() {
    // Clear the receipt content
    var receiptContainer = document.querySelector('.receipt');
    receiptContainer.innerHTML = '';

    // Remove all dynamically created rows
    var boughtItemTray = document.querySelector('.boughtItem-tray');
    var newRowElements = boughtItemTray.querySelectorAll('tbody tr');
    newRowElements.forEach(function(row) {
        row.remove();
    });

    // Clear the items array
    items = [];
    
    // Update the total to 0
    updateTotal();
}
