import React, { useEffect, useState } from 'react';
import MetricCard from './MetricCard';
import LoadingIndicator from './LoadingIndicator';
import ErrorIndicator from './ErrorIndicator';
import { getProducts, getCarts } from '../api/fakeStoreApi';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productsCount, setProductsCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [averagePrice, setAveragePrice] = useState(0);
  const [topSellingProducts, setTopSellingProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsResponse = await getProducts();
        const cartsResponse = await getCarts();

        setProductsCount(productsResponse.length);
        setOrdersCount(cartsResponse.length);

        const totalPrice = productsResponse.reduce(
          (total, product) => total + product.price,
          0
        );
        setTotalRevenue(totalPrice);

        setAveragePrice(totalPrice / productsResponse.length);

        const productsSold = cartsResponse.flatMap((cart) => cart.products);
        const productSales = {};
        productsSold.forEach((product) => {
          if (product.id in productSales) {
            productSales[product.id]++;
          } else {
            productSales[product.id] = 1;
          }
        });
        const sortedProducts = Object.entries(productSales).sort(
          (a, b) => b[1] - a[1]
        );
        const topProducts = sortedProducts.slice(0, 5).map((entry) => ({
          id: entry[0],
          sales: entry[1],
        }));
        setTopSellingProducts(topProducts);

        setIsLoading(false);
      } catch (error) {
        setError('Error al cargar los datos del panel de control.');
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="dashboard container">
      <h1 className="dashboard-heading">DASHBOARD</h1>
      {isLoading && <LoadingIndicator />}
      {error && <ErrorIndicator message={error} />}
      {!isLoading && !error && (
        <div className="metrics-container">
          <MetricCard
            title="Total de productos"
            value={productsCount}
            color="#FF9800"
          />
          <MetricCard
            title="Total de pedidos realizados"
            value={ordersCount}
            color="#FF5722"
          />
          <MetricCard
            title="Ingresos totales generados"
            value={`$${totalRevenue.toFixed(2)}`}
            color="#FFC107"
          />
          <MetricCard
            title="Precio promedio de los productos"
            value={`$${averagePrice.toFixed(2)}`}
            color="#FFEB3B"
          />
          <MetricCard
            title="Productos más vendidos"
            value={topSellingProducts.map((product) => (
              <div key={product.id}>
                Producto {product.id}: {product.sales} ventas
              </div>
            ))}
            color="#FF9800"
          />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
