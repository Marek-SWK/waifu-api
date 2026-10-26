import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Callback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const loginStarted = useRef(false);

  useEffect(() => {
    const code = searchParams.get('code');

    if (loginStarted.current) return;
    loginStarted.current = true;

    if (code) {
      const url = new URL(window.location.href);
      url.searchParams.delete('code');

      window.history.replaceState(
        window.history.state,
        '',
        url.pathname + url.search + url.hash
      );

      api.post('/auth/discord', { code })
        .then((response) => {
          login(response.data.token);
          
          // Redirect to original location or home
          const redirectPath = localStorage.getItem('auth_redirect') || '/';
          localStorage.removeItem('auth_redirect');
          navigate(redirectPath);
        })
        .catch((error) => {
          console.error('Login failed', error);
          navigate('/login');
        });
    } else {
      navigate('/login');
    }
  }, [searchParams, login, navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-xl">Logging in...</p>
    </div>
  );
};

export default Callback;
