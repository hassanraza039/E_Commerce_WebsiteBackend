export const productView = (p) => ({
  id: p._id,
  name: p.name,
  category: p.category,
  price: p.price,
  cut_price: p.cut_price,
  discount: p.discount,
  stock: p.stock,
  sold: p.sold,
  rating: p.rating,
  image: p.image,
});

export const productsView = (list) => list.map(productView);