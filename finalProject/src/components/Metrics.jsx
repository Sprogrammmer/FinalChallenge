import React from 'react';

const Metric = ({ label, value }) => {
  return (
    <div className="metric">
      <p className="metric-label">{label}</p>
      <div className="metric-value">
        {Array.isArray(value) ? (
          value.map((product, index) => (
            <div key={index}>
              <p>{product.title}</p>
            </div>
          ))
        ) : (
          value
        )}
      </div>
    </div>
  );
};

export default Metric;
