import React, { useState, useEffect } from 'react';
import { Bus, MapPin, Clock, Navigation, Search, X } from 'lucide-react';

const TransportTracker = () => {
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedStop, setSelectedStop] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState('home');
  const [buses, setBuses] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [lastAnnouncedStop, setLastAnnouncedStop] = useState({});

  const routes = [
    { 
      id: 1, 
      name: 'Route 1 - MG Road Express', 
      color: '#8B5CF6', 
      stops: [
        { name: 'Majestic Bus Station', lat: 12.9766, lng: 77.5718 },
        { name: 'Vidhana Soudha', lat: 12.9796, lng: 77.5908 },
        { name: 'Cubbon Park', lat: 12.9763, lng: 77.5927 },
        { name: 'MG Road', lat: 12.9716, lng: 77.5946 },
        { name: 'Trinity Circle', lat: 12.9698, lng: 77.6178 }
      ]
    },
    { 
      id: 2, 
      name: 'Route 2 - Electronic City', 
      color: '#06B6D4', 
      stops: [
        { name: 'Silk Board', lat: 12.9179, lng: 77.6226 },
        { name: 'BTM Layout', lat: 12.9165, lng: 77.6101 },
        { name: 'Jayanagar 4th Block', lat: 12.9250, lng: 77.5937 },
        { name: 'Lalbagh', lat: 12.9507, lng: 77.5848 },
        { name: 'KR Market', lat: 12.9591, lng: 77.5744 }
      ]
    },
    { 
      id: 3, 
      name: 'Route 3 - Airport Express', 
      color: '#10B981', 
      stops: [
        { name: 'Kempegowda Airport', lat: 13.1986, lng: 77.7066 },
        { name: 'Hebbal', lat: 13.0358, lng: 77.5970 },
        { name: 'Yeshwanthpur', lat: 13.0280, lng: 77.5385 },
        { name: 'Rajajinagar', lat: 12.9916, lng: 77.5544 },
        { name: 'Majestic', lat: 12.9766, lng: 77.5718 }
      ]
    },
    { 
      id: 4, 
      name: 'Route 4 - Whitefield Tech', 
      color: '#F59E0B', 
      stops: [
        { name: 'Whitefield', lat: 12.9698, lng: 77.7499 },
        { name: 'ITPL', lat: 12.9850, lng: 77.7270 },
        { name: 'Marathahalli', lat: 12.9591, lng: 77.6974 },
        { name: 'HAL Airport', lat: 12.9500, lng: 77.6680 },
        { name: 'Indiranagar', lat: 12.9716, lng: 77.6412 }
      ]
    },
    { 
      id: 5, 
      name: 'Route 5 - Banashankari', 
      color: '#EF4444', 
      stops: [
        { name: 'Banashankari', lat: 12.9250, lng: 77.5480 },
        { name: 'RV College', lat: 12.9237, lng: 77.5629 },
        { name: 'JP Nagar', lat: 12.9081, lng: 77.5855 },
        { name: 'Wilson Garden', lat: 12.9509, lng: 77.5963 },
        { name: 'Shivajinagar', lat: 12.9899, lng: 77.6036 }
      ]
    }
  ];

  const announceStop = (stopName) => {
    const utterance = new SpeechSynthesisUtterance(`Next stop is ${stopName}`);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    const generateBuses = () => {
      return routes.map(route => {
        const stopIndex = Math.floor(Math.random() * (route.stops.length - 1));
        return {
          id: route.id,
          route: route.name,
          color: route.color,
          speed: Math.floor(Math.random() * 30) + 25,
          nextStop: route.stops[stopIndex + 1].name,
          passengers: Math.floor(Math.random() * 35) + 10,
          stopIndex,
          progress: Math.random()
        };
      });
    };

    setBuses(generateBuses());

    const interval = setInterval(() => {
      setBuses(prev => prev.map(bus => {
        const route = routes.find(r => r.id === bus.id);
        let { stopIndex, progress } = bus;
        
        progress += 0.008;
        
        // Announce when bus is 85% of the way to next stop
        if (progress >= 0.85 && progress < 0.86 && currentPage === 'map') {
          const announceKey = `${bus.id}-${stopIndex}`;
          if (!lastAnnouncedStop[announceKey]) {
            announceStop(route.stops[stopIndex + 1].name);
            setLastAnnouncedStop(prev => ({ ...prev, [announceKey]: true }));
          }
        }
        
        if (progress >= 1) {
          progress = 0;
          stopIndex = (stopIndex + 1) % (route.stops.length - 1);
        }

        return {
          ...bus,
          stopIndex,
          progress,
          nextStop: route.stops[stopIndex + 1].name,
          speed: Math.max(20, Math.min(55, bus.speed + (Math.random() - 0.5) * 3))
        };
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [currentPage, lastAnnouncedStop]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getArrivalTimes = () => {
    return routes.map(route => ({
      route: route.name,
      color: route.color,
      arrival: Math.floor(Math.random() * 20) + 2
    })).filter(() => Math.random() > 0.2);
  };

  const allStops = routes.flatMap(route => 
    route.stops.map(stop => ({ ...stop, route: route.name, color: route.color }))
  );

  const filteredStops = allStops.filter(stop => 
    stop.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <header className="bg-white/80 backdrop-blur-md border-b border-purple-100 fixed top-0 w-full z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setCurrentPage('home')}
              className="flex items-center gap-3"
            >
              <Bus className="w-8 h-8 text-slate-900" />
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Quadra Tracker</h1>
              </div>
            </button>

            <nav className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage('home')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  currentPage === 'home' ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-purple-300' : 'text-slate-600 hover:bg-purple-50'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => setCurrentPage('map')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  currentPage === 'map' ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-purple-300' : 'text-slate-600 hover:bg-purple-50'
                }`}
              >
                Map
              </button>
              <button
                onClick={() => setCurrentPage('routes')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  currentPage === 'routes' || currentPage === 'route-detail' ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-purple-300' : 'text-slate-600 hover:bg-purple-50'
                }`}
              >
                Routes
              </button>
              <button
                onClick={() => setCurrentPage('stops')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  currentPage === 'stops' ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-purple-300' : 'text-slate-600 hover:bg-purple-50'
                }`}
              >
                Stops
              </button>
              <button
                onClick={() => setCurrentPage('arrivals')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  currentPage === 'arrivals' ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-purple-300' : 'text-slate-600 hover:bg-purple-50'
                }`}
              >
                Arrivals
              </button>
            </nav>
          </div>
        </div>
      </header>

      <div className="pt-20">
        {currentPage === 'home' && (
          <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="text-center mb-16">
              <h1 className="text-6xl font-bold text-slate-900 mb-4">Quadra Tracker</h1>
              <p className="text-xl text-slate-600">Real-time public transport tracking</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <button 
                onClick={() => setCurrentPage('map')}
                className="relative bg-gradient-to-br from-violet-500 to-purple-600 p-8 rounded-3xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all text-left overflow-hidden group"
                style={{
                  transform: 'perspective(1000px) rotateX(2deg)',
                  boxShadow: '0 20px 60px -15px rgba(139, 92, 246, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.2)'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <div className="relative z-10">
                  <div className="bg-white/20 backdrop-blur-sm w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                    <Navigation className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-white drop-shadow-lg">Live Tracking</h3>
                  <p className="text-violet-100">Real-time bus locations</p>
                  <div className="mt-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-white/90 font-semibold">{buses.length} buses active</span>
                  </div>
                </div>
                <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
              </button>
              
              <button 
                onClick={() => setCurrentPage('arrivals')}
                className="relative bg-gradient-to-br from-cyan-500 to-blue-600 p-8 rounded-3xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all text-left overflow-hidden group"
                style={{
                  transform: 'perspective(1000px) rotateX(2deg)',
                  boxShadow: '0 20px 60px -15px rgba(6, 182, 212, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.2)'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <div className="relative z-10">
                  <div className="bg-white/20 backdrop-blur-sm w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                    <Clock className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-white drop-shadow-lg">Arrival Times</h3>
                  <p className="text-cyan-100">Accurate predictions</p>
                  <div className="mt-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-white/90 font-semibold">Live updates</span>
                  </div>
                </div>
                <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
              </button>
              
              <button 
                onClick={() => setCurrentPage('routes')}
                className="relative bg-gradient-to-br from-emerald-500 to-teal-600 p-8 rounded-3xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all text-left overflow-hidden group"
                style={{
                  transform: 'perspective(1000px) rotateX(2deg)',
                  boxShadow: '0 20px 60px -15px rgba(16, 185, 129, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.2)'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <div className="relative z-10">
                  <div className="bg-white/20 backdrop-blur-sm w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                    <MapPin className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-white drop-shadow-lg">Route Planning</h3>
                  <p className="text-emerald-100">Detailed information</p>
                  <div className="mt-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-white/90 font-semibold">{routes.length} routes available</span>
                  </div>
                </div>
                <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
              </button>
            </div>

            <div className="text-center mb-16">
              <button
                onClick={() => setCurrentPage('map')}
                className="bg-gradient-to-r from-violet-600 to-purple-600 text-white px-10 py-4 rounded-2xl text-lg font-semibold hover:shadow-2xl hover:shadow-purple-300 hover:scale-105 transition-all"
              >
                Start Tracking
              </button>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-10 rounded-3xl shadow-xl border border-purple-100">
              <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">System Status</h2>
              <div className="grid grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-5xl font-bold text-violet-600">{buses.length}</div>
                  <div className="text-slate-600 mt-2">Active Buses</div>
                </div>
                <div>
                  <div className="text-5xl font-bold text-cyan-600">{routes.length}</div>
                  <div className="text-slate-600 mt-2">Routes</div>
                </div>
                <div>
                  <div className="text-5xl font-bold text-emerald-600">{buses.reduce((sum, bus) => sum + bus.passengers, 0)}</div>
                  <div className="text-slate-600 mt-2">Passengers</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentPage === 'map' && (
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-purple-100 p-8">
              {selectedRoute && (
                <div className="mb-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 border border-purple-200 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-slate-900 text-lg">{selectedRoute.name}</h3>
                    <button onClick={() => setSelectedRoute(null)} className="hover:bg-white/50 rounded-lg p-2 transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {selectedRoute.stops.map((stop, idx) => (
                      <div key={idx} className="text-sm text-slate-700 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedRoute.color }}></div>
                        {stop.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 rounded-2xl p-8 border-2 border-purple-200 shadow-lg">
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">Live Bus Tracking Map</h2>
                  <p className="text-slate-600">Select a route below to view its path and stops</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
                  {routes.map(route => {
                    const bus = buses.find(b => b.id === route.id);
                    return (
                      <button
                        key={route.id}
                        onClick={() => setSelectedRoute(selectedRoute?.id === route.id ? null : route)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          selectedRoute?.id === route.id 
                            ? 'bg-white shadow-lg scale-105' 
                            : 'bg-white/50 hover:bg-white hover:shadow-md'
                        }`}
                        style={{ borderColor: route.color }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: route.color }}></div>
                          <span className="font-semibold text-sm">Route {route.id}</span>
                        </div>
                        {bus && (
                          <div className="text-xs text-slate-600">
                            <div>Speed: {Math.round(bus.speed)} km/h</div>
                            <div>{bus.passengers} passengers</div>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="bg-white rounded-xl p-6 shadow-inner">
                  <div className="aspect-video bg-gradient-to-br from-emerald-50 via-blue-50 to-amber-50 rounded-lg flex items-center justify-center relative overflow-hidden border-2 border-slate-200">
                    <svg width="100%" height="100%" viewBox="0 0 800 500" className="absolute">
                      <defs>
                        <pattern id="streets" width="80" height="80" patternUnits="userSpaceOnUse">
                          <rect width="80" height="80" fill="#f1f5f9"/>
                          <path d="M 80 40 L 0 40 M 40 0 L 40 80" stroke="#cbd5e1" strokeWidth="2"/>
                        </pattern>
                        <filter id="shadow">
                          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3"/>
                        </filter>
                      </defs>
                      
                      <rect width="800" height="500" fill="url(#streets)" />
                      
                      {/* Parks/Green spaces */}
                      <rect x="50" y="50" width="120" height="100" fill="#86efac" opacity="0.3" rx="8"/>
                      <rect x="600" y="320" width="150" height="130" fill="#86efac" opacity="0.3" rx="8"/>
                      <rect x="350" y="80" width="100" height="80" fill="#86efac" opacity="0.3" rx="8"/>
                      
                      {/* Buildings */}
                      <rect x="200" y="100" width="60" height="50" fill="#94a3b8" opacity="0.4" rx="4"/>
                      <rect x="500" y="200" width="70" height="60" fill="#94a3b8" opacity="0.4" rx="4"/>
                      <rect x="300" y="350" width="55" height="45" fill="#94a3b8" opacity="0.4" rx="4"/>
                      
                      {/* Water body */}
                      <ellipse cx="650" cy="150" rx="100" ry="60" fill="#7dd3fc" opacity="0.3"/>
                      
                      {selectedRoute && selectedRoute.stops.map((stop, idx) => {
                        if (idx === selectedRoute.stops.length - 1) return null;
                        
                        const x1 = 100 + (idx * 140) + (idx * 10);
                        const y1 = 250 + Math.sin(idx * 0.8) * 100 + Math.cos(idx * 0.5) * 50;
                        const x2 = 100 + ((idx + 1) * 140) + ((idx + 1) * 10);
                        const y2 = 250 + Math.sin((idx + 1) * 0.8) * 100 + Math.cos((idx + 1) * 0.5) * 50;
                        
                        const midX = (x1 + x2) / 2;
                        const midY = (y1 + y2) / 2 - 30;
                        
                        return (
                          <g key={idx}>
                            <path
                              d={`M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`}
                              stroke={selectedRoute.color}
                              strokeWidth="6"
                              fill="none"
                              strokeLinecap="round"
                              opacity="0.8"
                            />
                          </g>
                        );
                      })}
                      
                      {selectedRoute && selectedRoute.stops.map((stop, idx) => {
                        const x = 100 + (idx * 140) + (idx * 10);
                        const y = 250 + Math.sin(idx * 0.8) * 100 + Math.cos(idx * 0.5) * 50;
                        
                        return (
                          <g key={idx} filter="url(#shadow)">
                            <circle 
                              cx={x} 
                              cy={y} 
                              r="16" 
                              fill="white"
                              stroke={selectedRoute.color}
                              strokeWidth="4"
                            />
                            <circle 
                              cx={x} 
                              cy={y} 
                              r="8" 
                              fill={selectedRoute.color}
                            />
                            <rect
                              x={x - 40}
                              y={y + 25}
                              width="80"
                              height="22"
                              fill="white"
                              stroke={selectedRoute.color}
                              strokeWidth="2"
                              rx="4"
                            />
                            <text 
                              x={x} 
                              y={y + 40} 
                              textAnchor="middle" 
                              className="text-xs font-bold"
                              fill="#1e293b"
                            >
                              {stop.name.split(' ').slice(0, 2).join(' ')}
                            </text>
                          </g>
                        );
                      })}

                      {buses.map(bus => {
                        if (!selectedRoute || selectedRoute.id !== bus.id) return null;
                        
                        const x1 = 100 + (bus.stopIndex * 140) + (bus.stopIndex * 10);
                        const y1 = 250 + Math.sin(bus.stopIndex * 0.8) * 100 + Math.cos(bus.stopIndex * 0.5) * 50;
                        const x2 = 100 + ((bus.stopIndex + 1) * 140) + ((bus.stopIndex + 1) * 10);
                        const y2 = 250 + Math.sin((bus.stopIndex + 1) * 0.8) * 100 + Math.cos((bus.stopIndex + 1) * 0.5) * 50;
                        
                        const midX = (x1 + x2) / 2;
                        const midY = (y1 + y2) / 2 - 30;
                        
                        const t = bus.progress;
                        const x = Math.pow(1-t, 2) * x1 + 2 * (1-t) * t * midX + Math.pow(t, 2) * x2;
                        const y = Math.pow(1-t, 2) * y1 + 2 * (1-t) * t * midY + Math.pow(t, 2) * y2;
                        
                        return (
                          <g key={bus.id} filter="url(#shadow)">
                            <circle 
                              cx={x} 
                              cy={y} 
                              r="8" 
                              fill={bus.color}
                              opacity="0.3"
                            >
                              <animate 
                                attributeName="r" 
                                values="8;20;8" 
                                dur="2s" 
                                repeatCount="indefinite"
                              />
                            </circle>
                            <rect
                              x={x - 15}
                              y={y - 10}
                              width="30"
                              height="20"
                              fill={bus.color}
                              stroke="white"
                              strokeWidth="2"
                              rx="3"
                            />
                            <text 
                              x={x} 
                              y={y + 5} 
                              textAnchor="middle" 
                              className="text-sm"
                              fill="white"
                            >
                              🚌
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                  
                  {buses.filter(bus => !selectedRoute || selectedRoute.id === bus.id).map(bus => (
                    <div key={bus.id} className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-slate-900">{bus.route}</div>
                          <div className="text-sm text-slate-600">Next: {bus.nextStop}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold" style={{ color: bus.color }}>{Math.round(bus.speed)}</div>
                          <div className="text-xs text-slate-500">km/h</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {currentPage === 'routes' && (
          <div className="max-w-7xl mx-auto px-4 py-12">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-12 text-center">All Routes</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {routes.map(route => {
                const bus = buses.find(b => b.id === route.id);
                return (
                  <div key={route.id} className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-purple-100 p-8 hover:shadow-2xl transition-all">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-6 h-6 rounded-full" style={{ backgroundColor: route.color }}></div>
                      <h2 className="text-2xl font-semibold text-slate-900">{route.name}</h2>
                    </div>
                    
                    <div className="mb-6 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100 shadow-sm">
                      <div className="text-sm text-slate-600 mb-1">Current Status</div>
                      {bus && (
                        <div className="space-y-1">
                          <div className="font-semibold text-slate-900">Next Stop: {bus.nextStop}</div>
                          <div className="text-sm text-slate-600">Speed: {Math.round(bus.speed)} km/h | Passengers: {bus.passengers}</div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 mb-6">
                      <div className="text-sm font-semibold text-slate-600 mb-3">Route Stops:</div>
                      {route.stops.map((stop, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-slate-700 py-1">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: route.color }}></div>
                          <span>{stop.name}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          console.log('Setting route:', route);
                          setSelectedRoute(route);
                          setTimeout(() => setCurrentPage('map'), 100);
                        }}
                        className="flex-1 py-3 rounded-xl font-semibold text-white hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: route.color }}
                      >
                        View Map
                      </button>
                      <button
                        onClick={() => {
                          setSelectedRoute(route);
                          setTimeout(() => setCurrentPage('route-detail'), 100);
                        }}
                        className="flex-1 py-3 rounded-xl font-semibold bg-gradient-to-r from-purple-100 to-pink-100 text-purple-900 hover:from-purple-200 hover:to-pink-200 transition-all shadow-sm"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {currentPage === 'route-detail' && selectedRoute && (
          <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-purple-100 mb-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-8 h-8 rounded-full" style={{ backgroundColor: selectedRoute.color }}></div>
                <h1 className="text-4xl font-bold text-slate-900">{selectedRoute.name}</h1>
              </div>
              <div className="flex gap-6 text-sm text-slate-600">
                <div>Total Stops: {selectedRoute.stops.length}</div>
                <div>Route ID: {selectedRoute.id}</div>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-purple-100 p-8">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-6">All Stops</h2>
              <div className="space-y-4">
                {selectedRoute.stops.map((stop, idx) => (
                  <div key={idx} className="flex items-center justify-between p-5 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white" style={{ backgroundColor: selectedRoute.color }}>
                        {idx + 1}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{stop.name}</div>
                        <div className="text-sm text-slate-500">Lat: {stop.lat.toFixed(4)}, Lng: {stop.lng.toFixed(4)}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedStop(stop.name);
                        setCurrentPage('arrivals');
                      }}
                      className="px-5 py-2 rounded-xl font-semibold text-white hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: selectedRoute.color }}
                    >
                      Arrivals
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentPage === 'stops' && (
          <div className="max-w-7xl mx-auto px-4 py-12">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-8 text-center">Find Stops</h1>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-purple-100 p-6 mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search stops..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-purple-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white/80 backdrop-blur-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(searchQuery ? filteredStops : allStops).map((stop, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedStop(stop.name);
                    setCurrentPage('arrivals');
                  }}
                  className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-left hover:shadow-md hover:scale-105 transition-all"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stop.color }}></div>
                    <h3 className="font-semibold text-slate-900">{stop.name}</h3>
                  </div>
                  <p className="text-sm text-slate-500">{stop.route}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {currentPage === 'arrivals' && (
          <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-xl border border-purple-100 mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">{selectedStop || 'Select a stop'}</h1>
              <div className="text-slate-500 mt-2">Last updated: {currentTime.toLocaleTimeString()}</div>
            </div>
            
            {selectedStop ? (
              <div className="space-y-4">
                {getArrivalTimes().map((arrival, idx) => (
                  <div 
                    key={idx}
                    className="bg-white p-6 rounded-2xl border border-slate-200 flex items-center justify-between hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: arrival.color }}></div>
                      <div>
                        <div className="font-semibold text-slate-900">{arrival.route}</div>
                        <div className="text-sm text-slate-500">Next bus arriving</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-bold" style={{ color: arrival.color }}>{arrival.arrival}</div>
                      <div className="text-sm text-slate-500">minutes</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-purple-100 p-12 text-center">
                <Clock className="w-16 h-16 mx-auto mb-4 text-purple-400" />
                <p className="text-xl text-slate-600">No stop selected</p>
                <button 
                  onClick={() => setCurrentPage('stops')}
                  className="mt-4 px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-purple-300 transition-all"
                >
                  Browse Stops
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransportTracker;