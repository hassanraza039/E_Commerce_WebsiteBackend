export const orderView = (o) => ({
  id: o.orderId,
  customer: o.customer,
  email: o.email,
  items: o.items,
  total: o.total,
  status: o.status,
  date: o.createdAt.toISOString().slice(5, 10), // "09-05" (admin panel ka format)
});

export const ordersView = (list) => list.map(orderView);