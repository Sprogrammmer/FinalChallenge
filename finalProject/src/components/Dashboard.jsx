import React, { useState, useEffect } from 'react';
import Metric from './Metrics';

const Dashboard = () => {
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [averagePrice, setAveragePrice] = useState(0);
  const [bestSellingProducts, setBestSellingProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMetrics = async () => {
    try {
      const productsResponse = await fetch('https://fakestoreapi.com/products');
      const productsData = await productsResponse.json();
      setTotalProducts(productsData.length);

      const ordersResponse = await fetch('https://fakestoreapi.com/carts');
      const ordersData = await ordersResponse.json();
      setTotalOrders(ordersData.length);

      const revenue = ordersData.reduce((acc, order) => {
        const orderTotal = order.products.reduce((total, product) => {
          const productData = productsData.find(
            (p) => p.id === product.productId
          );
          return total + productData.price * product.quantity;
        }, 0);
        return acc + orderTotal;
      }, 0);
      setTotalRevenue(revenue);

      const prices = productsData.map((product) => product.price);
      const average = prices.reduce((acc, price) => acc + price, 0) / prices.length;
      setAveragePrice(average);

      const bestSelling = productsData.sort((a, b) =>
        a.orderCount < b.orderCount ? 1 : -1
      );
      setBestSellingProducts(bestSelling.slice(0, 5));

      setIsLoading(false);
    } catch (error) {
      setError(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  if (isLoading) {
    return(
        <div className="loader">
            <span className="loader-text">loading</span>
            <span className="load"></span>
        </div>
    )
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div className="dashboard">
      <h1 className="dashboard-heading"><img src="/cart.svg" alt="" className='cart'/>DASHBOARD</h1>
      <div className="dashboard-metrics">
        <Metric label="Total Products" value={totalProducts} />
        <Metric label="Total Orders" value={totalOrders} />
        <Metric label="Total Revenue" value={`$${totalRevenue.toFixed(2)}`} />
        <Metric label="Average Price" value={`$${averagePrice.toFixed(2)}`} />
        <Metric label="Best Selling Products" value={bestSellingProducts} />
      </div>
    </div>
  );
};

export default Dashboard;
