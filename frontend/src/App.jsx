import { useState } from 'react';
import axios from 'axios';
import city_data from '../../backend/json/list_of_cities.json';
import BarChart from './Components/BarChart';
import LineChart from './Components/LIneChart';
import PieChart from './Components/PieChart';
import DoughnutChart from './Components/DoughnutChart';
import BubbleChart from './Components/BubbleChart';
import { Plus, X, TrendingUp, MapPin, Search, BarChart3, PieChart as PieChartIcon, LineChart as LineChartIcon, DollarSign, Home, ShoppingCart, Coffee, Wallet } from 'lucide-react';

const App = () => {
  const [columns, setColumns] = useState([{ id: 1, inputValue: '', data: null, loading: false }]);
  const [nextId, setNextId] = useState(2);

  // Function to add a new column
  const addColumn = () => {
    const newColumn = {
      id: nextId,
      inputValue: '',
      data: null,
      loading: false
    };
    setColumns([...columns, newColumn]);
    setNextId(nextId + 1);
  };

  // Function to remove a column
  const removeColumn = (id) => {
    if (columns.length > 1) {
      setColumns(columns.filter(col => col.id !== id));
    }
  };

  // Function to update input value for a specific column
  const updateInputValue = (id, value) => {
    setColumns(columns.map(col => 
      col.id === id ? { ...col, inputValue: value } : col
    ));
  };

  // Function to set loading state for a specific column
  const setColumnLoading = (id, loading) => {
    setColumns(columns.map(col => 
      col.id === id ? { ...col, loading } : col
    ));
  };

  // Function to generate chart data for a specific column
  const generateChartData = (apiData, location, isCity) => {
    const data = isCity ? apiData.Index : apiData;
    const labels = isCity ? [2024, 2023, 2022, 2021, 2020] : (apiData.coi_label || [2024, 2023, 2022, 2021, 2020]);

    return {
      coiData: {
        labels: labels,
        datasets: [{
          label: `Cost of Living Index - ${location}`,
          data: data.coi,
          backgroundColor: ['#f72585', '#7209b7', '#3a0ca3', '#4361ee', '#4cc9f0'],
        }]
      },
      riData: {
        labels: labels,
        datasets: [{
          label: `Rent Index - ${location}`,
          data: data.ri,
          backgroundColor: isCity ? ['#3D5300', '#ABBA7C', '#FFE31A', '#F09319', '#37AFE1'] : ['#13d1ff', '#19a5ff', '#fee719', '#fe4f19', '#f00c18'],
        }]
      },
      coipriData: {
        labels: labels,
        datasets: [{
          borderColor: isCity ? '#3a0ca3' : '#f72585',
          label: `Cost of Living Plus Rent Index - ${location}`,
          data: data.coipri,
          backgroundColor: isCity ? ['#04e762', '#f5b700', '#dc0073', '#008bf8', '#89fc00'] : ['#feee00', '#fcd116', '#df00ff', '#9f00ff', '#8f03ff'],
        }]
      },
      giData: {
        labels: labels,
        datasets: [{
          indexAxis: 'y',
          label: `Groceries Index - ${location}`,
          data: data.gi,
          backgroundColor: isCity ? ['#feee00', '#fcd116', '#df00ff', '#9f00ff', '#8f03ff'] : ['#04e762', '#f5b700', '#dc0073', '#008bf8', '#89fc00'],
        }]
      },
      rpiData: {
        labels: labels,
        datasets: [{
          label: `Restaurant Price Index - ${location}`,
          data: data.rpi,
          backgroundColor: isCity ? ['#13d1ff', '#19a5ff', '#fee719', '#fe4f19', '#f00c18'] : ['#3D5300', '#ABBA7C', '#FFE31A', '#F09319', '#37AFE1'],
        }]
      },
      lppiData: {
        labels: labels,
        datasets: [{
          label: `Local Purchasing Power Index - ${location}`,
          data: data.lppi,
          backgroundColor: isCity ? ['#ffff00', '#aaff00', '#00ff15', '#00ffff', '#0095ff'] : ['#f72585', '#7209b7', '#3a0ca3', '#4361ee', '#4cc9f0'],
        }]
      }
    };
  };

  // Function to handle API request for a specific column
  const handleSubmit = (columnId) => {
    const column = columns.find(col => col.id === columnId);
    if (!column.inputValue) return;

    setColumnLoading(columnId, true);

    const a = Object.values(city_data);
    const b = column.inputValue;
    const c = b.charAt(0).toUpperCase() + b.substring(1).toLowerCase();
    
    if (a.includes(c)) {
      // City API call
      axios
        .post('http://localhost:8000/api/post_city/', {
          city_name: column.inputValue
        })
        .then((res) => {
          const chartData = generateChartData(res.data, column.inputValue, true);
          setColumns(columns.map(col => 
            col.id === columnId ? { 
              ...col, 
              data: {
                location: column.inputValue,
                isCity: true,
                rawData: res.data,
                charts: chartData
              },
              loading: false
            } : col
          ));
        })
        .catch((err) => {
          console.error(err);
          setColumnLoading(columnId, false);
        });
    } else {
      // Country API call
      axios
        .post('http://localhost:8000/api/post_country/', {
          country_name: column.inputValue
        })
        .then((res) => {
          const chartData = generateChartData(res.data, column.inputValue, false);
          setColumns(columns.map(col => 
            col.id === columnId ? { 
              ...col, 
              data: {
                location: column.inputValue,
                isCity: false,
                rawData: res.data,
                charts: chartData
              },
              loading: false
            } : col
          ));
        })
        .catch((err) => {
          console.error(err);
          setColumnLoading(columnId, false);
        });
    }
  };

  const handleKeyPress = (e, columnId) => {
    if (e.key === 'Enter') {
      handleSubmit(columnId);
    }
  };

  const chartConfigs = [
    { key: 'coiData', title: 'Cost of Living Index', icon: TrendingUp, color: 'from-blue-500 to-purple-600' },
    { key: 'riData', title: 'Rent Index', icon: Home, color: 'from-green-500 to-teal-600' },
    { key: 'coipriData', title: 'Cost of Living Plus Rent Index', icon: DollarSign, color: 'from-purple-500 to-pink-600' },
    { key: 'giData', title: 'Groceries Index', icon: ShoppingCart, color: 'from-orange-500 to-red-600' },
    { key: 'rpiData', title: 'Restaurant Price Index', icon: Coffee, color: 'from-teal-500 to-cyan-600' },
    { key: 'lppiData', title: 'Local Purchasing Power Index', icon: Wallet, color: 'from-indigo-500 to-blue-600' }
  ];

  const chartComponents = {
    coiData: BarChart,
    riData: DoughnutChart,
    coipriData: LineChart,
    giData: BarChart,
    rpiData: BubbleChart,
    lppiData: PieChart
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Cost of Living Analyzer
                </h1>
                <p className="text-sm text-gray-500">Compare living costs across cities and countries</p>
              </div>
            </div>
            <button
              onClick={addColumn}
              className="group px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center space-x-2"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
              <span className="font-medium">Add Comparison</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid gap-8" style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr)` }}>
          {columns.map((column, index) => (
            <div 
              key={column.id} 
              className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden transform hover:shadow-2xl transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Column Header */}
              <div className="bg-gradient-to-r from-gray-50 to-white p-6 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {column.data ? column.data.location : 'Enter Location'}
                    </h2>
                    {column.data && (
                      <span className="px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 text-sm rounded-full font-medium">
                        {column.data.isCity ? 'City' : 'Country'}
                      </span>
                    )}
                  </div>
                  {columns.length > 1 && (
                    <button
                      onClick={() => removeColumn(column.id)}
                      className="w-8 h-8 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg flex items-center justify-center transition-all duration-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Input Section */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="relative flex-1">
                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Enter a city or country name..."
                      value={column.inputValue}
                      onChange={(e) => updateInputValue(column.id, e.target.value)}
                      onKeyPress={(e) => handleKeyPress(e, column.id)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80"
                      disabled={column.loading}
                    />
                  </div>
                  <button
                    onClick={() => handleSubmit(column.id)}
                    disabled={column.loading || !column.inputValue}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 transition-all duration-200 flex items-center space-x-2"
                  >
                    {column.loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Loading...</span>
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4" />
                        <span>Analyze</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Charts */}
              {column.data && (
                <div className="p-6 space-y-6">
                  {chartConfigs.map((config) => {
                    const ChartComponent = chartComponents[config.key];
                    const IconComponent = config.icon;
                    
                    return (
                      <div key={config.key} className="group">
                        <div className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200">
                          <div className="flex items-center space-x-3 mb-4">
                            <div className={`w-8 h-8 bg-gradient-to-r ${config.color} rounded-lg flex items-center justify-center`}>
                              <IconComponent className="w-4 h-4 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800">{config.title}</h3>
                          </div>
                          <div className="bg-white rounded-lg border border-gray-100 p-4">
                            <ChartComponent chartData={column.data.charts[config.key]} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Empty State */}
              {!column.data && !column.loading && (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-600 mb-2">Ready to analyze</h3>
                  <p className="text-gray-500">Enter a location above and click "Analyze" to view cost of living data</p>
                </div>
              )}

              {/* Loading State */}
              {column.loading && (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <h3 className="text-lg font-medium text-gray-600 mb-2">Analyzing data...</h3>
                  <p className="text-gray-500">Please wait while we fetch cost of living information</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;