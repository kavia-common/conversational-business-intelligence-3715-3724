import React, { useState, useEffect } from 'react';
import './App.css';
import OceanTable from './components/Table/OceanTable';

/**
 * PUBLIC_INTERFACE
 * App
 * Renders a demo Ocean Professional table on the main page so it is visible at /.
 */
function App() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // Mock columns and data for immediate rendering
  const columns = [
    { key: 'id', header: 'ID', width: '80px', align: 'left' },
    { key: 'name', header: 'Name', align: 'left' },
    { key: 'quantity', header: 'Quantity', align: 'right', width: '120px' },
    { key: 'price', header: 'Price', align: 'right', width: '120px' },
    { key: 'status', header: 'Status', align: 'center', width: '140px' },
  ];

  const data = [
    { id: 1001, name: 'Atlantic Salmon', quantity: 12, price: 199.99, status: 'Complete' },
    { id: 1002, name: 'Pacific Mackerel', quantity: 8, price: 89.50, status: 'Pending' },
    { id: 1003, name: 'Yellowfin Tuna', quantity: 4, price: 349.00, status: 'Failed' },
    { id: 1004, name: 'Swordfish Steaks', quantity: 22, price: 129.00, status: 'Processing' },
    { id: 1005, name: 'Sea Scallops', quantity: 16, price: 249.00, status: 'Paid' },
    { id: 1006, name: 'Halibut Fillet', quantity: 6, price: 279.00, status: 'Pending' },
  ];

  return (
    <div className="App app-gradient">
      <header className="App-header" style={{ alignItems: 'stretch' }}>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>

        <main className="messages-container" style={{ width: '100%', maxWidth: 1000 }}>
          <h1 className="title" style={{ textAlign: 'left', marginBottom: 8, fontSize: 20 }}>
            Orders
          </h1>
          <OceanTable
            caption="Orders"
            ariaLabel="Orders table"
            columns={columns}
            data={data}
            stickyHeader
            enableSortIcons
          />
        </main>
      </header>
    </div>
  );
}

export default App;
