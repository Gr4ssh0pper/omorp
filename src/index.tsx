import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AdminPanel from './components/AdminPanel';
import ProductGrid from './components/ProductGrid';

const App: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
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