import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import SoilReports from './pages/SoilReports';
import Advisory from './pages/Advisory';
import Crops from './pages/Crops';
import Weather from './pages/Weather';
import { useFarmStore } from './store/farmStore';

function App() {
  const { activePage } = useFarmStore();

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <Dashboard />;
      case 'soil': return <SoilReports />;
      case 'advisory': return <Advisory />;
      case 'crops': return <Crops />;
      case 'weather': return <Weather />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-earth-50">
      <Sidebar />
      <main className="lg:ml-72 min-h-screen">
        <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8 pt-16 lg:pt-8">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}

export default App;
