import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Globe, X, Plus, Loader2 } from 'lucide-react';
import locationsData from '../data/locations.json';

const POPULAR_SUGGESTIONS = [
  { name: 'Zurich', type: 'city' },
  { name: 'Tokyo', type: 'city' },
  { name: 'New York', type: 'city' },
  { name: 'London', type: 'city' },
  { name: 'Singapore', type: 'city' },
  { name: 'Switzerland', type: 'country' },
  { name: 'Japan', type: 'country' },
];

const SearchBar = ({ onAddLocation, activeLocations, isLoading }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const activeNames = activeLocations.map(l => l.name.toLowerCase());
  const isMaxReached = activeLocations.length >= 4;

  const filtered = query.trim().length > 0
    ? locationsData.filter(loc => {
        const q = query.toLowerCase();
        return (
          loc.name.toLowerCase().includes(q) ||
          loc.fullName.toLowerCase().includes(q) ||
          (loc.country && loc.country.toLowerCase().includes(q))
        );
      }).slice(0, 10)
    : [];

  const cities = filtered.filter(l => l.type === 'city');
  const countries = filtered.filter(l => l.type === 'country');
  const flattenedResults = [...cities, ...countries];

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleSelect = (loc) => {
    if (activeNames.includes(loc.name.toLowerCase())) {
      setIsOpen(false);
      return;
    }
    if (isMaxReached) {
      alert('You can compare up to 4 locations at a time. Remove one to add another.');
      return;
    }
    onAddLocation(loc);
    setQuery('');
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!isOpen || flattenedResults.length === 0) {
      if (e.key === 'Enter' && query.trim()) {
        const match = locationsData.find(
          l => l.name.toLowerCase() === query.trim().toLowerCase() ||
               l.fullName.toLowerCase() === query.trim().toLowerCase()
        );
        if (match) handleSelect(match);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev < flattenedResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev > 0 ? prev - 1 : flattenedResults.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < flattenedResults.length) {
        handleSelect(flattenedResults[highlightedIndex]);
      } else if (flattenedResults.length > 0) {
        handleSelect(flattenedResults[0]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="w-full relative" ref={containerRef}>
      {/* Search Input */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#86868B] group-focus-within:text-[#0071E3] transition-colors">
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-[#0071E3]" />
          ) : (
            <Search className="w-5 h-5 stroke-[2.2]" />
          )}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setHighlightedIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={
            isMaxReached
              ? 'Maximum 4 locations compared (remove one to add another)'
              : 'Search a city or country (e.g. Zurich, Tokyo, Switzerland)...'
          }
          disabled={isMaxReached || isLoading}
          className="w-full pl-12 pr-12 py-3.5 bg-white text-[#1D1D1F] placeholder-[#86868B] rounded-2xl border border-black/[0.08] focus:border-[#0071E3] focus:ring-4 focus:ring-[#0071E3]/10 focus:outline-none transition-all text-[15px] font-normal shadow-[0_2px_10px_rgba(0,0,0,0.03)] disabled:opacity-60 disabled:cursor-not-allowed"
        />

        {query && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#86868B] hover:text-[#1D1D1F]"
          >
            <div className="w-5 h-5 rounded-full bg-black/[0.06] hover:bg-black/[0.1] flex items-center justify-center transition-colors">
              <X className="w-3 h-3" />
            </div>
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && query.trim().length > 0 && (
        <div className="absolute left-0 right-0 mt-2 bg-white/95 backdrop-blur-2xl border border-black/[0.08] rounded-3xl shadow-[0_16px_36px_rgba(0,0,0,0.1)] overflow-hidden z-50 divide-y divide-black/[0.04] max-h-[380px] overflow-y-auto">
          {flattenedResults.length === 0 ? (
            <div className="p-6 text-center text-[#86868B] text-sm">
              <p className="font-medium text-[#1D1D1F]">No results found</p>
              <p className="text-xs text-[#86868B] mt-1">Try typing a city name like "Paris" or a country like "France"</p>
            </div>
          ) : (
            <>
              {cities.length > 0 && (
                <div className="p-2">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-[#86868B] uppercase tracking-wider flex items-center justify-between">
                    <span>Cities ({cities.length})</span>
                    <span className="text-[10px] text-slate-400 font-normal">2020–2024</span>
                  </div>
                  {cities.map((loc) => {
                    const isAlreadyAdded = activeNames.includes(loc.name.toLowerCase());
                    const overallIndex = flattenedResults.indexOf(loc);
                    const isHighlighted = overallIndex === highlightedIndex;

                    return (
                      <button
                        key={loc.fullName}
                        onClick={() => handleSelect(loc)}
                        disabled={isAlreadyAdded}
                        className={`w-full px-3 py-2.5 rounded-2xl text-left flex items-center justify-between transition-colors text-sm ${
                          isHighlighted ? 'bg-[#0071E3]/10 text-[#0071E3]' : 'hover:bg-[#F5F5F7] text-[#1D1D1F]'
                        } ${isAlreadyAdded ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <div className="flex items-center space-x-2.5 min-w-0">
                          <div className="w-7 h-7 rounded-xl bg-blue-50 text-[#0071E3] flex items-center justify-center shrink-0">
                            <MapPin className="w-3.5 h-3.5 stroke-[2.2]" />
                          </div>
                          <div className="truncate">
                            <span className="font-medium text-[#1D1D1F]">{loc.name}</span>
                            {loc.country && (
                              <span className="text-[#86868B] text-xs ml-1.5">
                                • {loc.country}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 shrink-0 ml-3">
                          <span className="text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                            City
                          </span>
                          {isAlreadyAdded ? (
                            <span className="text-xs text-[#86868B]">Added</span>
                          ) : (
                            <Plus className="w-4 h-4 text-[#86868B]" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {countries.length > 0 && (
                <div className="p-2">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-[#86868B] uppercase tracking-wider flex items-center justify-between">
                    <span>Countries ({countries.length})</span>
                    <span className="text-[10px] text-slate-400 font-normal">Averages & Top Cities</span>
                  </div>
                  {countries.map((loc) => {
                    const isAlreadyAdded = activeNames.includes(loc.name.toLowerCase());
                    const overallIndex = flattenedResults.indexOf(loc);
                    const isHighlighted = overallIndex === highlightedIndex;

                    return (
                      <button
                        key={loc.fullName}
                        onClick={() => handleSelect(loc)}
                        disabled={isAlreadyAdded}
                        className={`w-full px-3 py-2.5 rounded-2xl text-left flex items-center justify-between transition-colors text-sm ${
                          isHighlighted ? 'bg-[#34C759]/10 text-emerald-800' : 'hover:bg-[#F5F5F7] text-[#1D1D1F]'
                        } ${isAlreadyAdded ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <div className="flex items-center space-x-2.5 min-w-0">
                          <div className="w-7 h-7 rounded-xl bg-emerald-50 text-[#34C759] flex items-center justify-center shrink-0">
                            <Globe className="w-3.5 h-3.5 stroke-[2.2]" />
                          </div>
                          <span className="font-medium text-[#1D1D1F] truncate">{loc.name}</span>
                        </div>

                        <div className="flex items-center space-x-2 shrink-0 ml-3">
                          <span className="text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                            Country
                          </span>
                          {isAlreadyAdded ? (
                            <span className="text-xs text-[#86868B]">Added</span>
                          ) : (
                            <Plus className="w-4 h-4 text-[#86868B]" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Suggestion Chips */}
      {activeLocations.length === 0 && (
        <div className="mt-3 flex items-center flex-wrap gap-1.5 text-xs text-[#86868B]">
          <span className="text-slate-400 mr-1">Try:</span>
          {POPULAR_SUGGESTIONS.map((sug) => (
            <button
              key={sug.name}
              onClick={() => {
                const match = locationsData.find(l => l.name.toLowerCase() === sug.name.toLowerCase() && l.type === sug.type);
                if (match) handleSelect(match);
              }}
              className="px-3 py-1 rounded-full bg-white hover:bg-slate-50 border border-black/[0.06] shadow-sm text-[#1D1D1F] transition-all flex items-center space-x-1"
            >
              <span className="font-medium">{sug.name}</span>
              <span className="text-[10px] text-slate-400 font-normal">{sug.type}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
