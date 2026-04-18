import {useState, useEffect} from 'react';
import './App.css';
import Navbar from './components/Navbar/index.jsx';
import TaxSummary from './components/TaxSummary/index.jsx';
import Holdings from './components/Holdings/index.jsx';

import { fetchHoldings, fetchCapitalGains } from './api/mockApi.js';  

function App() {
  const [data, setData] = useState([]);
  const [tax, setTax] = useState(null);
  const [selectedHoldingIds, setSelectedHoldingIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const [holdingsData, taxData] = await Promise.all([
        fetchHoldings(),
        fetchCapitalGains()
      ]);
      const normalizedHoldings = holdingsData
        .map((holding, index) => ({
          ...holding,
          id: `${holding.coin}-${index}`,
        }))
        .sort((a, b) => a.coin.localeCompare(b.coin));

      setData(normalizedHoldings);
      setTax(taxData);
      setLoading(false);
    }
    loadData();
  }, []);

  const selectedHoldings = data.filter((holding) =>
    selectedHoldingIds.includes(holding.id)
  );

  const handleToggleHolding = (holdingId) => {
    setSelectedHoldingIds((prev) =>
      prev.includes(holdingId)
        ? prev.filter((id) => id !== holdingId)
        : [...prev, holdingId]
    );
  };

  const handleToggleAllHoldings = (isChecked) => {
    if (isChecked) {
      setSelectedHoldingIds(data.map((holding) => holding.id));
      return;
    }

    setSelectedHoldingIds([]);
  };

  return (
    <div className="bg-container">
      <Navbar />
      <div className="content-wrapper">
        {loading ? (
          <div className="loading">
            <div className="loading-spinner" aria-label="Loading" />
          </div>
        ) : (
          <>
            {tax && <TaxSummary tax={tax} selectedHoldings={selectedHoldings} />}
            {data.length > 0 && (
              <Holdings
                holdings={data}
                selectedHoldingIds={selectedHoldingIds}
                onToggleHolding={handleToggleHolding}
                onToggleAllHoldings={handleToggleAllHoldings}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}
export default App