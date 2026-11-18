import React from 'react';
import { Globe2, RefreshCw } from 'lucide-react';
import { PRESET_COMPARISONS } from '../constants/metrics';

const Header = ({ onSelectPreset, onReset, activeCount }) => {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-black/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-b from-[#0071E3] to-[#005bb5] flex items-center justify-center shadow-sm shadow-[#0071E3]/20">
              <Globe2 className="w-5 h-5 text-white stroke-[2]" />
            </div>
            <div>
              <h1 className="text-base font-semibold text-[#1D1D1F] tracking-tight">
                Cost of Living Analyzer
              </h1>
              <p className="text-xs text-[#86868B] tracking-tight">
                Compare rent, groceries, and local purchasing power • NYC = 100
              </p>
            </div>
          </div>

          {/* Quick Examples & Reset */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="hidden lg:inline text-xs text-[#86868B] mr-1">
              Examples:
            </span>

            {PRESET_COMPARISONS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => onSelectPreset(preset)}
                className="text-xs font-medium px-3 py-1.5 rounded-full bg-black/[0.04] hover:bg-black/[0.07] active:bg-black/[0.1] text-[#1D1D1F] transition-all whitespace-nowrap"
                title={preset.description}
              >
                {preset.name}
              </button>
            ))}

            {activeCount > 0 && (
              <button
                onClick={onReset}
                className="text-xs font-medium px-3 py-1.5 rounded-full bg-red-50 hover:bg-red-100/80 active:bg-red-200 text-red-600 transition-all flex items-center space-x-1 ml-1"
                title="Reset comparisons"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;
