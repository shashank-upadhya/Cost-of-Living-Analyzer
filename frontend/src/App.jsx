import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart3,
  TrendingUp,
  Sliders,
  Globe2,
  AlertCircle,
  X,
} from 'lucide-react';

import Header from './components/Header';
import SearchBar from './components/SearchBar';
import ActiveComparisons from './components/ActiveComparisons';
import InsightsBanner from './components/InsightsBanner';
import MetricScorecard from './components/MetricScorecard';
import HistoricalTrendChart from './components/HistoricalTrendChart';
import ComparisonBarChart from './components/ComparisonBarChart';
import CountryCityBreakdown from './components/CountryCityBreakdown';
import EmptyState from './components/EmptyState';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const App = () => {
  const [locations, setLocations] = useState([]);
  const [baselineIndex, setBaselineIndex] = useState(-1);
  const [activeTab, setActiveTab] = useState('scorecard');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const hasCountry = locations.some((l) => !l.isCity);
  const hasCity = locations.some((l) => l.isCity);

  useEffect(() => {
    if (activeTab === 'country' && !hasCountry) {
      setActiveTab('scorecard');
    }
  }, [hasCountry, activeTab]);

  const fetchLocationData = async (locationInfo) => {
    const isCity = locationInfo.type === 'city';
    const endpoint = isCity ? `${API_BASE}/api/post_city/` : `${API_BASE}/api/post_country/`;
    const payload = isCity
      ? { city_name: locationInfo.name }
      : { country_name: locationInfo.name };

    try {
      const res = await axios.post(endpoint, payload);
      return {
        id: `${locationInfo.type}_${locationInfo.name}_${Date.now()}`,
        name: locationInfo.name,
        fullName: locationInfo.fullName || res.data.name || locationInfo.name,
        isCity,
        rawData: res.data,
      };
    } catch (err) {
      const msg = err.response?.data?.error || `Failed to fetch data for ${locationInfo.name}.`;
      throw new Error(msg);
    }
  };

  const handleAddLocation = async (locInfo) => {
    if (locations.some((l) => l.name.toLowerCase() === locInfo.name.toLowerCase())) {
      return;
    }
    if (locations.length >= 4) {
      setErrorMessage('You can compare up to 4 locations at a time. Remove one to add another.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const newLoc = await fetchLocationData(locInfo);
      setLocations((prev) => [...prev, newLoc]);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveLocation = (name) => {
    setLocations((prev) => {
      const filtered = prev.filter((l) => l.name !== name);
      return filtered;
    });
    setBaselineIndex(-1);
  };

  const handleClearAll = () => {
    setLocations([]);
    setBaselineIndex(-1);
    setErrorMessage(null);
  };

  const handleSelectPreset = async (preset) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const promises = preset.locations.map((loc) => fetchLocationData(loc));
      const loaded = await Promise.all(promises);
      setLocations(loaded);
      setBaselineIndex(-1);
      setActiveTab('scorecard');
    } catch (err) {
      setErrorMessage(err.message || 'Failed to load comparison pack.');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedCountry = locations.find((l) => !l.isCity);

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] flex flex-col font-sans selection:bg-[#0071E3]/15 selection:text-[#0071E3]">
      {/* Apple-style Frosted Header */}
      <Header
        onSelectPreset={handleSelectPreset}
        onReset={handleClearAll}
        activeCount={locations.length}
      />

      {/* Main Content */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 space-y-6">
        
        {/* Soft Pastel Error Alert */}
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-2xl flex items-center justify-between text-sm shadow-sm">
            <div className="flex items-center space-x-2.5">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <span className="font-medium">{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-red-500 hover:text-red-700 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Search Bar */}
        <section>
          <SearchBar
            onAddLocation={handleAddLocation}
            activeLocations={locations}
            isLoading={isLoading}
          />
        </section>

        {/* Active Locations Strip */}
        {locations.length > 0 && (
          <section>
            <ActiveComparisons
              locations={locations}
              onRemoveLocation={handleRemoveLocation}
              onClearAll={handleClearAll}
              baselineIndex={baselineIndex}
              onSetBaseline={setBaselineIndex}
            />
          </section>
        )}

        {/* Insights Takeaway Banner */}
        {locations.length > 0 && (
          <section>
            <InsightsBanner
              locations={locations}
              baselineIndex={baselineIndex}
            />
          </section>
        )}

        {/* Apple Segmented View Switcher & Views */}
        {locations.length > 0 && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              {/* Apple Segmented Control */}
              <div className="bg-[#E5E5EA]/70 p-1 rounded-2xl flex items-center space-x-1 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('scorecard')}
                  className={`flex items-center space-x-1.5 py-2 px-3.5 rounded-xl text-xs sm:text-sm transition-all whitespace-nowrap ${
                    activeTab === 'scorecard'
                      ? 'bg-white text-[#1D1D1F] font-semibold shadow-sm'
                      : 'text-[#86868B] hover:text-[#1D1D1F] font-medium'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Metric Scorecards</span>
                </button>

                {hasCity && (
                  <button
                    onClick={() => setActiveTab('trends')}
                    className={`flex items-center space-x-1.5 py-2 px-3.5 rounded-xl text-xs sm:text-sm transition-all whitespace-nowrap ${
                      activeTab === 'trends'
                        ? 'bg-white text-[#1D1D1F] font-semibold shadow-sm'
                        : 'text-[#86868B] hover:text-[#1D1D1F] font-medium'
                    }`}
                  >
                    <TrendingUp className="w-4 h-4" />
                    <span>5-Year Trends</span>
                  </button>
                )}

                <button
                  onClick={() => setActiveTab('breakdown')}
                  className={`flex items-center space-x-1.5 py-2 px-3.5 rounded-xl text-xs sm:text-sm transition-all whitespace-nowrap ${
                    activeTab === 'breakdown'
                      ? 'bg-white text-[#1D1D1F] font-semibold shadow-sm'
                      : 'text-[#86868B] hover:text-[#1D1D1F] font-medium'
                  }`}
                >
                  <Sliders className="w-4 h-4" />
                  <span>Category Breakdown</span>
                </button>

                {hasCountry && (
                  <button
                    onClick={() => setActiveTab('country')}
                    className={`flex items-center space-x-1.5 py-2 px-3.5 rounded-xl text-xs sm:text-sm transition-all whitespace-nowrap ${
                      activeTab === 'country'
                        ? 'bg-white text-emerald-800 font-semibold shadow-sm'
                        : 'text-[#86868B] hover:text-[#1D1D1F] font-medium'
                    }`}
                  >
                    <Globe2 className="w-4 h-4 text-emerald-600" />
                    <span>Country Breakdown</span>
                  </button>
                )}
              </div>

              <div className="hidden sm:flex items-center space-x-1.5 text-xs text-[#86868B]">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Comparing {locations.length} location{locations.length > 1 ? 's' : ''}</span>
              </div>
            </div>

            {/* Tab Views */}
            {activeTab === 'scorecard' && (
              <MetricScorecard
                locations={locations}
                baselineIndex={baselineIndex}
              />
            )}

            {activeTab === 'trends' && (
              <HistoricalTrendChart locations={locations} />
            )}

            {activeTab === 'breakdown' && (
              <ComparisonBarChart locations={locations} />
            )}

            {activeTab === 'country' && selectedCountry && (
              <CountryCityBreakdown countryLocation={selectedCountry} />
            )}
          </section>
        )}

        {/* Empty State / Welcome Screen */}
        {locations.length === 0 && !isLoading && (
          <EmptyState onSelectPreset={handleSelectPreset} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-black/[0.04] bg-white/40 py-6 mt-12 text-xs text-[#86868B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <p>
            Data source: Numbeo open dataset (2020–2024). Baseline: New York City = 100.0.
          </p>
          <p className="font-mono text-slate-500">
            Built with React, Vite & Django REST Framework
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
