import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import History from './pages/History';
import About from './pages/About';
import { useLocalStorage } from './hooks/useLocalStorage';

export default function App() {
  const [history, setHistory] = useLocalStorage('phishguard-history', []);
  const [result, setResult] = useState(null);

  const addToHistory = (entry) => {
    setHistory((prev) => [entry, ...prev].slice(0, 50));
  };

  const clearHistory = () => setHistory([]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-cyber-darker">
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <Home
                result={result}
                setResult={setResult}
                addToHistory={addToHistory}
              />
            }
          />
          <Route
            path="/history"
            element={<History history={history} clearHistory={clearHistory} />}
          />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
