
import Login from './components/login'
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import Sidebar from "./components/sidebar";

function App() {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ flexGrow: 1, padding: '20px' }}>
        <AppRoutes />
      </main>
    </div>
  )
}

export default App
