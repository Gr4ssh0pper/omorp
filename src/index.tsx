import React from 'react';
import ReactDOM from 'react-dom/client';
import AdminPanel from './components/AdminPanel';
import ProductGrid from './components/ProductGrid';

const App: React.FC = () => {
  return (
    <div>
      <AdminPanel />
      <ProductGrid />
    </div>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
