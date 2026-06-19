import React, { useState } from 'react';
import Generator from './components/Generator';
import Scanner from './components/Scanner';
import History from './components/History';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('generate');
  const [history, setHistory] = useState([]);

  const addToHistory = (entry) => {
    setHistory(prev => [{ ...entry, id: Date.now() }, ...prev.slice(0, 19)]);
  };

  const clearHistory = () => setHistory([]);

  return (
    <div className="app">
      <header className="header">
        <h1>QR Studio</h1>
        <p className="subtitle">Generate · Scan · Track</p>
      </header>

      <nav className="tabs">
        {['generate', 'scan', 'history'].map(tab => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'generate' ? '⚡ Generate' : tab === 'scan' ? '📷 Scan' : `🕒 History (${history.length})`}
          </button>
        ))}
      </nav>

      <main className="content">
        {activeTab === 'generate' && <Generator addToHistory={addToHistory} />}
        {activeTab === 'scan'     && <Scanner addToHistory={addToHistory} />}
        {activeTab === 'history'  && <History history={history} clearHistory={clearHistory} />}
      </main>
    </div>
  );
}