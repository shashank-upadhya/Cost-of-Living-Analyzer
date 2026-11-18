import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import { METRIC_CONFIGS, LOCATION_COLORS } from '../constants/metrics';

const ComparisonBarChart = ({ locations }) => {
  if (!locations || locations.length === 0) return null;

  const getValue = (loc, key) => {
    if (loc.isCity) {
      return loc.rawData?.Index?.[key]?.[0] ?? 0;
    } else {
      return loc.rawData?.[key]?.[0] ?? 0;
    }
  };

  const labels = METRIC_CONFIGS.map(m => m.shortTitle);

  const datasets = locations.map((loc, idx) => {
    const color = LOCATION_COLORS[idx % LOCATION_COLORS.length];
    const data = METRIC_CONFIGS.map(m => getValue(loc, m.key));

    return {
      label: loc.name,
      data,
      backgroundColor: color.hex,
      borderRadius: 8,
      borderSkipped: false,
      barPercentage: 0.8,
      categoryPercentage: 0.85,
    };
  });

  const chartData = {
    labels,
    datasets,
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          color: '#1D1D1F',
          font: {
            family: '"Plus Jakarta Sans", -apple-system, sans-serif',
            size: 12,
            weight: 500,
          },
          usePointStyle: true,
          boxWidth: 7,
          padding: 16,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(29, 29, 31, 0.95)',
        titleColor: '#FFFFFF',
        bodyColor: '#E5E5EA',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        cornerRadius: 12,
        titleFont: {
          family: '"Plus Jakarta Sans", -apple-system, sans-serif',
          size: 13,
          weight: 600,
        },
        bodyFont: {
          family: '"JetBrains Mono", monospace',
          size: 12,
        },
        callbacks: {
          label: (context) => {
            const val = context.parsed.y;
            return ` ${context.dataset.label}: ${val.toFixed(1)} pts`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: '#F2F2F7',
          drawBorder: false,
        },
        ticks: {
          color: '#1D1D1F',
          font: {
            family: '"Plus Jakarta Sans", -apple-system, sans-serif',
            size: 12,
            weight: 500,
          },
        },
      },
      y: {
        grid: {
          color: '#F2F2F7',
          drawBorder: false,
        },
        ticks: {
          color: '#86868B',
          font: {
            family: '"JetBrains Mono", monospace',
            size: 11,
          },
        },
      },
    },
  };

  return (
    <div className="bg-white border border-black/[0.06] rounded-3xl p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
      <div className="mb-6">
        <h3 className="text-base font-semibold text-[#1D1D1F] tracking-tight">
          All Indices Breakdown
        </h3>
        <p className="text-xs text-[#86868B] mt-0.5">
          Side-by-side grouped view comparing all 6 macroeconomic dimensions (NYC = 100)
        </p>
      </div>

      <div className="h-[360px] w-full">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default ComparisonBarChart;
