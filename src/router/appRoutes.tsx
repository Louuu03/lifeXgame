import { Routes, Route } from 'react-router-dom';
import App from '../pages/App';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      {/* <Route path="/products" element={<Products />} />
      <Route path="/about" element={<About />} /> */}
    </Routes>
  );
};

export default AppRoutes;
