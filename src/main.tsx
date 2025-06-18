
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Make React available globally to prevent initialization issues
(window as any).React = React;

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(<App />);
}
