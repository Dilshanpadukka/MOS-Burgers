document.addEventListener('DOMContentLoaded', () => {
    displayOrders();
});



function displayOrders() {
    const orderTableBody = document.getElementById('orderTableBody');
    const orders = JSON.parse(sessionStorage.getItem('orders')) || [];

    orderTableBody.innerHTML = '';
    orders.forEach((order, index) => {
        const row = document.createElement('tr');

        const itemsList = Array.isArray(order.items) ? order.items.map(item => {
            const quantity = Number(item.quantity) || 0;
            const price = Number(item.price) || 0;
            return `<li>${item.name || 'Unknown Item'} (x${quantity}) - Rs. ${(price * quantity).toFixed(2)}</li>`;
        }).join('') : '<li>No items</li>';

        const discount = Number(order.discount) || 0;
        const totalPrice = Number(order.totalPrice) || 0;

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${order.customerName || 'No Name'}</td>
            <td>${order.contactNo || 'No Contact'}</td>
            <td>
                <ul>
                    ${itemsList}
                </ul>
            </td>
            <td>Rs. ${discount.toFixed(2)}</td>
            <td>Rs. ${totalPrice.toFixed(2)}</td>
            <td><button class="btn btn-sm" style="background-color: #e27324cc;" onclick="printOrderReport(${index})">Print Order Report</button></td>
        `;
        orderTableBody.appendChild(row);
    });
}

function saveOrdersToSessionStorage(orders) {
    sessionStorage.setItem('orders', JSON.stringify(orders));
}

function addOrder(newOrder) {
    let orders = JSON.parse(sessionStorage.getItem('orders')) || [];
    orders.push(newOrder);
    saveOrdersToSessionStorage(orders);
    displayOrders(); 
}

function printOrderReport(index) {
    const orders = JSON.parse(sessionStorage.getItem('orders')) || [];
    const order = orders[index];

    if (order) {
        const { customerName = 'No Name', contactNo = 'No Contact' } = order;
        const items = Array.isArray(order.items) ? order.items : [];
        const discount = Number(order.discount) || 0;
        const totalPrice = Number(order.totalPrice) || 0;

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text("Order Report", 10, 10);

        doc.setFontSize(12);
        doc.text(`Customer Name: ${customerName}`, 10, 20);
        doc.text(`Contact No: ${contactNo}`, 10, 30);

        doc.text("Items:", 10, 40);
        items.forEach((item, i) => {
            const quantity = Number(item.quantity) || 0;
            const price = Number(item.price) || 0;
            doc.text(`${item.name || 'Unknown Item'} (x${quantity}) - Rs. ${(price * quantity).toFixed(2)}`, 10, 50 + (i * 10));
        });

        doc.text(`Discount: Rs. ${discount.toFixed(2)}`, 10, 50 + (items.length * 10) + 10);
        doc.text(`Total Price: Rs. ${totalPrice.toFixed(2)}`, 10, 50 + (items.length * 10) + 20);

        doc.save(`Order_Report_${index + 1}.pdf`);
    } else {
        alert('Order not found!');
    }
}