const routes = [
  {
    id: 1,
    name: 'Blue Line',
    color: '#4f46e5',
    description: 'Downtown to Riverside',
    stops: [
      { name: 'Central Station', arrivals: [4, 9, 14] },
      { name: 'Market Square', arrivals: [6, 11, 18] },
      { name: 'Library Stop', arrivals: [8, 13, 20] },
      { name: 'Riverside Hub', arrivals: [5, 10, 16] }
    ]
  },
  {
    id: 2,
    name: 'Green Line',
    color: '#16a34a',
    description: 'University loop',
    stops: [
      { name: 'Campus Gate', arrivals: [3, 8, 12] },
      { name: 'Science Park', arrivals: [7, 13, 19] },
      { name: 'North Avenue', arrivals: [9, 15, 21] },
      { name: 'Student Center', arrivals: [5, 10, 17] }
    ]
  },
  {
    id: 3,
    name: 'Red Line',
    color: '#dc2626',
    description: 'Airport express',
    stops: [
      { name: 'Airport Terminal', arrivals: [2, 7, 11] },
      { name: 'City Hall', arrivals: [4, 12, 16] },
      { name: 'Transit Center', arrivals: [6, 14, 22] },
      { name: 'Old Town', arrivals: [8, 17, 24] }
    ]
  }
];

const allStops = routes.flatMap((route) =>
  route.stops.map((stop) => ({
    ...stop,
    route: route.name,
    color: route.color
  }))
);

const { useState, useMemo } = React;

function App() {
  const [selectedRoute, setSelectedRoute] = useState(routes[0]);
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedStop, setSelectedStop] = useState('Central Station');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStops = useMemo(() => {
    return allStops.filter((stop) => {
      const routeMatches = stop.route === selectedRoute.name;
      const queryMatches = stop.name.toLowerCase().includes(searchQuery.trim().toLowerCase());
      return routeMatches && queryMatches;
    });
  }, [searchQuery, selectedRoute]);

  const getArrivalTimes = () => {
    const currentStop = selectedRoute.stops.find((stop) => stop.name === selectedStop);

    if (!currentStop) {
      return [];
    }

    return currentStop.arrivals.map((arrival) => ({
      route: selectedRoute.name,
      color: selectedRoute.color,
      arrival
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-sky-50 text-slate-800">
      <header className="sticky top-0 z-10 border-b border-violet-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-500">Transit</div>
            <h1 className="text-2xl font-black text-slate-900">Quadra Tracker</h1>
          </div>

          <nav className="flex gap-3">
            <button onClick={() => setCurrentPage('home')} className="rounded-full border border-violet-200 px-4 py-2 text-sm font-semibold text-violet-700 hover:bg-violet-50">Home</button>
            <button onClick={() => setCurrentPage('stops')} className="rounded-full border border-violet-200 px-4 py-2 text-sm font-semibold text-violet-700 hover:bg-violet-50">Stops</button>
            <button onClick={() => setCurrentPage('arrivals')} className="rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-violet-200 hover:bg-violet-700">Arrivals</button>
          </nav>
        </div>
      </header>

      {currentPage === 'home' && (
        <main className="mx-auto max-w-7xl px-4 py-12">
          <section className="mb-12 text-center">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-violet-600">Live commute</p>
            <h2 className="text-5xl font-black text-slate-900">Track your next bus</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">Check route status, stop locations, and real-time arrival estimates across the city.</p>
          </section>

          <section className="grid gap-6 md:grid-cols-3">
            {routes.map((route) => (
              <div key={route.id} className="rounded-3xl border border-violet-100 bg-white p-6 shadow-lg shadow-violet-100">
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="h-4 w-4 rounded-full" style={{ backgroundColor: route.color }}></span>
                    <h3 className="text-2xl font-bold text-slate-900">{route.name}</h3>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">On time</span>
                </div>

                <p className="mb-5 text-sm text-slate-600">{route.description}</p>

                <div className="mb-6 space-y-2">
                  {route.stops.slice(0, 3).map((stop) => (
                    <div key={stop.name} className="flex items-center justify-between text-sm text-slate-600">
                      <span>{stop.name}</span>
                      <span className="font-semibold text-slate-800">{stop.arrivals[0]} min</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setSelectedRoute(route);
                    setSelectedStop(route.stops[0].name);
                    setCurrentPage('stops');
                  }}
                  className="w-full rounded-2xl px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: route.color }}
                >
                  View stops
                </button>
              </div>
            ))}
          </section>
        </main>
      )}

      {currentPage === 'stops' && (
        <div className="mx-auto max-w-7xl px-4 py-12">
          <h2 className="mb-8 text-center text-5xl font-black text-slate-900">Bus Stops</h2>
          <div className="mx-auto mb-8 max-w-md">
            <input
              type="text"
              placeholder="Search stops..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-violet-200 bg-white/80 px-4 py-3 text-slate-800 shadow-sm outline-none ring-0 placeholder:text-slate-400 focus:border-violet-500"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredStops.map((stop, idx) => (
              <div key={`${stop.route}-${stop.name}-${idx}`} className="flex items-center justify-between rounded-2xl border border-violet-100 bg-white p-5 shadow-md shadow-violet-50">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{stop.name}</h3>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: stop.color }}>{stop.route}</p>
                </div>

                <button
                  onClick={() => {
                    setSelectedStop(stop.name);
                    setCurrentPage('arrivals');
                  }}
                  className="rounded-xl px-4 py-2 text-sm font-semibold text-white transition-colors hover:opacity-90"
                  style={{ backgroundColor: stop.color }}
                >
                  Times
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {currentPage === 'arrivals' && (
        <div className="mx-auto max-w-4xl px-4 py-12">
          <h2 className="mb-4 text-center text-5xl font-black text-slate-900">Arrival Predictions</h2>
          {selectedStop && (
            <p className="mb-8 text-center text-lg text-slate-600">
              Showing arrivals for: <span className="font-bold text-violet-700">{selectedStop}</span>
            </p>
          )}

          <div className="space-y-4 rounded-3xl border border-violet-100 bg-white p-8 shadow-xl shadow-violet-100">
            {getArrivalTimes().map((item, idx) => (
              <div key={`${item.route}-${item.arrival}-${idx}`} className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <span className="h-4 w-4 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="text-lg font-bold text-slate-900">{item.route}</span>
                </div>

                <div className="text-right">
                  <span className="text-3xl font-black text-violet-600">{item.arrival}</span>
                  <span className="ml-2 text-sm text-slate-500">min</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);