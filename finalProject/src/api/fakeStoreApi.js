const BASE_URL = 'https://fakestoreapi.com';

export const getProducts = () => {
  return fetch(`${BASE_URL}/products`).then((response) => response.json());
};

export const getCarts = () => {
  return fetch(`${BASE_URL}/carts`).then((response) => response.json());
};
