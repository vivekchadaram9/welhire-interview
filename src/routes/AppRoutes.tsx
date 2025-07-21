import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from '../features/auth/pages/LoginPage';
import AuthLayout from '../layouts/AuthLayout';
import NotFound from '../components/NotFound';
import { Interview } from '../features/interview/Component';
import InterviewLayout from '../layouts/InterviewLayout';

const AppRoutes = () => (
  <Router>
    <Routes>
      {/* public routes */}
      <Route element={<AuthLayout />}>
        <Route path='/' element={<LoginPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route
          element={
            // <ProtectedRoute>
            <InterviewLayout />
            //   </ProtectedRoute>
          }
        >
          <Route path='/interview' element={<Interview />} />
        </Route>
      </Route>
      {/* Private Routes */}

      <Route path='*' element={<NotFound />} />
    </Routes>
  </Router>
);

export default AppRoutes;