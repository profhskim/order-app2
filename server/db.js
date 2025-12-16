// In-memory data store
let menus = [
  {
    id: 1,
    name: '아메리카노 (ICE)',
    description: '시원하고 깔끔한 맛의 아메리카노',
    price: 4000,
    imageUrl: '/americano-ice.jpg',
    stock: 100,
  },
  {
    id: 2,
    name: '아메리카노 (HOT)',
    description: '따뜻하고 부드러운 아메리카노',
    price: 3500,
    imageUrl: '/americano-hot.jpg',
    stock: 100,
  },
  {
    id: 3,
    name: '카페라떼 (ICE)',
    description: '부드러운 우유와 에스프레소의 조화',
    price: 4500,
    imageUrl: '/caffe-latte.jpg',
    stock: 50,
  },
];

let options = [
    { id: 101, name: '샷 추가', price: 500 },
    { id: 102, name: '시럽 추가', price: 300 },
];

let orders = [];
let orderCounter = 1;

const getMenus = () => menus;
const getMenusForAdmin = () => menus.map(m => ({ id: m.id, name: m.name, stock: m.stock }));
const getMenuById = (id) => menus.find(m => m.id === id);
const getOptions = () => options;

const updateMenuStock = (id, newStock) => {
    const menu = getMenuById(id);
    if (menu) {
        menu.stock = newStock;
        return menu;
    }
    return null;
}

const addOrder = (order) => {
    const newOrder = {
        id: orderCounter++,
        order_timestamp: new Date().toISOString(),
        status: '주문 접수',
        items: order.items
    };
    orders.push(newOrder);
    return newOrder;
}

const getActiveOrders = () => orders.filter(o => o.status !== '완료');
const getOrderById = (id) => orders.find(o => o.id === id);

const updateOrderStatus = (id, newStatus) => {
    const order = getOrderById(id);
    if (order) {
        // When status changes to '완료', decrement stock
        if (newStatus === '완료' && order.status !== '완료') {
            order.items.forEach(item => {
                const menu = getMenuById(item.menu_id);
                if (menu) {
                    menu.stock = Math.max(0, menu.stock - item.quantity);
                }
            });
        }
        order.status = newStatus;
        return order;
    }
    return null;
}

module.exports = {
    getMenus,
    getMenusForAdmin,
    getMenuById,
    updateMenuStock,
    getOptions,
    addOrder,
    getActiveOrders,
    getOrderById,
    updateOrderStatus
};
