import AppRoutes from './routes/AppRoutes';
import Sidebar from "./components/sidebar";
import Navbar from './components/navbar';

function App() {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ flexGrow: 1}}>
        <Navbar />
        <div style={{ padding: '20px' }}>
          <AppRoutes />
        </div>
      </main>
    </div>
  )
}

export default App
