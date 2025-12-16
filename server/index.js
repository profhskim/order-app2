const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Get all menus for customer view
app.get('/api/menus', (req, res) => {
    const menus = db.getMenus();
    const options = db.getOptions();
    const menusWithOptions = menus.map(menu => ({
        ...menu,
        options: options, // Assuming all options apply to all menus as per PRD structure
    }));
    res.json(menusWithOptions);
});

// Get all menus for admin view (with stock)
app.get('/api/admin/menus', (req, res) => {
    const menus = db.getMenusForAdmin();
    res.json(menus);
});

// Update menu stock
app.patch('/api/admin/menus/:id', (req, res) => {
    const { id } = req.params;
    const { stock } = req.body;

    if (stock === undefined || stock < 0) {
        return res.status(400).json({ message: 'Invalid stock value' });
    }

    const updatedMenu = db.updateMenuStock(parseInt(id), stock);

    if (updatedMenu) {
        res.json(updatedMenu);
    } else {
        res.status(404).json({ message: 'Menu not found' });
    }
});


// Get all active orders for admin view
app.get('/api/admin/orders', (req, res) => {
    const orders = db.getActiveOrders();
    res.json(orders);
});

// Create a new order
app.post('/api/orders', (req, res) => {
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: 'Invalid order data' });
    }

    // Basic validation
    for(const item of items) {
        const menu = db.getMenuById(item.menu_id);
        if (!menu || menu.stock < item.quantity) {
            return res.status(400).json({ message: `Not enough stock for menu id ${item.menu_id}`});
        }
    }

    const newOrder = db.addOrder({ items });
    res.status(201).json({
        order_id: newOrder.id,
        message: "주문이 성공적으로 접수되었습니다."
    });
});

// Update order status
app.patch('/api/orders/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['주문 접수', '제조 중', '완료'];
    if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status value' });
    }

    const updatedOrder = db.updateOrderStatus(parseInt(id), status);

    if (updatedOrder) {
        res.json({
            order_id: updatedOrder.id,
            new_status: updatedOrder.status
        });
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
