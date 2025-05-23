import React, { useState, useEffect } from 'react';
import { DataContext } from './DataContext';

export const DataProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [alerts, setAlerts] = useState([]);

  // Fetch inicial
  useEffect(() => {
    (async () => {
      try {
        const [pRes, aRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/alerts'),
        ]);
        setProducts(await pRes.json());
        setAlerts(await aRes.json());
      } catch (err) {
        console.error('Fetch inicial:', err);
      }
    })();
  }, []);

  const uploadExcel = async (file) => {
    const form = new FormData();
    form.append('file', file);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: form,
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      // refresca datos
      const productsData = await (await fetch('/api/products')).json();
      const alertsData   = await (await fetch('/api/alerts')).json();
      setProducts(productsData);
      setAlerts(alertsData);
      return true;
    } catch (err) {
      console.error('uploadExcel error:', err);
      return false;
    }
  };

  return (
    <DataContext.Provider
      value={{ products, alerts, uploadExcel }}
    >
      {children}
    </DataContext.Provider>
  );
};