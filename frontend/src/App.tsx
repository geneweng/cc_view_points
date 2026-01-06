import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ViewPointsPage from './pages/ViewPointsPage';
import ViewPointDetailPage from './pages/ViewPointDetailPage';
import AddViewPointPage from './pages/AddViewPointPage';
import EditViewPointPage from './pages/EditViewPointPage';
import MapPage from './pages/MapPage';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/viewpoints" element={<ViewPointsPage />} />
          <Route path="/viewpoints/new" element={<AddViewPointPage />} />
          <Route path="/viewpoints/:id" element={<ViewPointDetailPage />} />
          <Route path="/viewpoints/:id/edit" element={<EditViewPointPage />} />
          <Route path="/map" element={<MapPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
