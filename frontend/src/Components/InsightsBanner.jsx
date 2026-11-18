import React from 'react';
import { Home, Wallet, Award, CheckCircle2 } from 'lucide-react';

const InsightsBanner = ({ locations, baselineIndex }) => {
  if (!locations || locations.length === 0) return null;

  const getLatestVal = (loc, key) => {
    if (loc.isCity) {
      return loc.rawData?.Index?.[key]?.[0] ?? null;
    } else {
      return loc.rawData?.[key]?.[0] ?? null;
    }
  };

  // If comparing 2 or more locations
  if (locations.length >= 2) {
    let lowestCOI = locations[0];
    let highestCOI = locations[0];
    let lowestRent = locations[0];
    let highestLPP = locations[0];

    locations.forEach(loc => {
      const coi = getLatestVal(loc, 'coi');
      const ri = getLatestVal(loc, 'ri');
      const lpp = getLatestVal(loc, 'lppi');

      if (coi !== null && coi < getLatestVal(lowestCOI, 'coi')) lowestCOI = loc;
      if (coi !== null && coi > getLatestVal(highestCOI, 'coi')) highestCOI = loc;
      if (ri !== null && ri < getLatestVal(lowestRent, 'ri')) lowestRent = loc;
      if (lpp !== null && lpp > getLatestVal(highestLPP, 'lppi')) highestLPP = loc;
    });

    const diffCOI = Math.round(
      ((getLatestVal(highestCOI, 'coi') - getLatestVal(lowestCOI, 'coi')) / getLatestVal(lowestCOI, 'coi')) * 100
    );

    return (
      <div className="bg-white border border-black/[0.06] rounded-3xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
        <div className="flex items-center space-x-2 text-[#0071E3] text-xs font-semibold uppercase tracking-wider mb-3.5">
          <CheckCircle2 className="w-4 h-4" />
          <span>Quick Summary</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {/* Card 1: Lowest Consumer Cost */}
          <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-4 flex items-start space-x-3.5">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-[#0071E3] flex items-center justify-center shrink-0 mt-0.5">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-blue-900/70 font-medium">Lowest everyday costs</p>
              <h4 className="text-sm font-semibold text-[#1D1D1F] mt-0.5">
                {lowestCOI.name}
              </h4>
              <p className="text-xs text-slate-600 mt-1">
                Consumer prices are <span className="text-emerald-700 font-semibold">{diffCOI}% lower</span> than in {highestCOI.name}.
              </p>
            </div>
          </div>

          {/* Card 2: Lowest Rent */}
          <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-4 flex items-start space-x-3.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
              <Home className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-emerald-900/70 font-medium">Lowest apartment rent</p>
              <h4 className="text-sm font-semibold text-[#1D1D1F] mt-0.5">
                {lowestRent.name}
              </h4>
              <p className="text-xs text-slate-600 mt-1">
                Rent index of <span className="font-mono text-[#1D1D1F] font-semibold">{getLatestVal(lowestRent, 'ri')}</span> (NYC benchmark = 100).
              </p>
            </div>
          </div>

          {/* Card 3: Highest Purchasing Power */}
          <div className="bg-amber-50/60 border border-amber-100 rounded-2xl p-4 flex items-start space-x-3.5">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-amber-900/70 font-medium">Highest local salary value</p>
              <h4 className="text-sm font-semibold text-[#1D1D1F] mt-0.5">
                {highestLPP.name}
              </h4>
              <p className="text-xs text-slate-600 mt-1">
                Purchasing power index of <span className="font-mono text-emerald-700 font-semibold">{getLatestVal(highestLPP, 'lppi')}</span>.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Single location view
  const loc = locations[0];
  const coi = getLatestVal(loc, 'coi');
  const ri = getLatestVal(loc, 'ri');
  const lppi = getLatestVal(loc, 'lppi');

  const coiDiff = Math.round(coi - 100);
  const riDiff = Math.round(ri - 100);

  return (
    <div className="bg-white border border-black/[0.06] rounded-3xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
      <div className="flex items-center space-x-2 text-[#0071E3] text-xs font-semibold uppercase tracking-wider mb-2">
        <CheckCircle2 className="w-4 h-4" />
        <span>Comparison vs New York City (100)</span>
      </div>

      <p className="text-sm text-[#1D1D1F] leading-relaxed">
        In <strong className="font-semibold text-black">{loc.name}</strong>, consumer goods are{' '}
        <span className={coiDiff >= 0 ? 'text-rose-600 font-semibold' : 'text-emerald-600 font-semibold'}>
          {Math.abs(coiDiff)}% {coiDiff >= 0 ? 'higher' : 'lower'}
        </span>{' '}
        than New York City. Rent is{' '}
        <span className={riDiff >= 0 ? 'text-rose-600 font-semibold' : 'text-emerald-600 font-semibold'}>
          {Math.abs(riDiff)}% {riDiff >= 0 ? 'higher' : 'lower'}
        </span>
        , and local purchasing power is <span className="font-mono text-[#0071E3] font-semibold">{lppi}</span>.
      </p>
    </div>
  );
};

export default InsightsBanner;
