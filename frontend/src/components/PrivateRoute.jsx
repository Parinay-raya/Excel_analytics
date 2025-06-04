import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();
  
  console.log('PrivateRoute: Checking authentication');
  console.log('PrivateRoute: Token exists?', !!token);
  console.log('PrivateRoute: Current path:', location.pathname);

  if (!token) {
    console.log('PrivateRoute: No token found, redirecting to login');
    // Redirect to login and remember the attempted URL for potential redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log('PrivateRoute: Token found, rendering protected content');
  return <>{children}</>;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired
};

export default PrivateRoute;