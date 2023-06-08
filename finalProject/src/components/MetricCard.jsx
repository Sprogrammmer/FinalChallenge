import React from 'react';

const MetricCard = ({ title, value, color }) => {
  return (
    <div className="metric-card" style={{ backgroundColor: color }}>
      <h2 className="metric-title">{title}</h2>
      <div className="metric-value">{value}</div>
    </div>
  );
};

export default MetricCard;
