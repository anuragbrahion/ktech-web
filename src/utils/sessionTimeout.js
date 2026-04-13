import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/slices/AuthSlice';
import { toast } from 'react-toastify';
import { getAuthFromStorage } from './globalFunction';

export const useSessionTimeout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    let inactivityTimer;
    const INACTIVITY_LIMIT = 30 * 60 * 1000;  
    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
         const auth = getAuthFromStorage();
       if (!auth || new Date().getTime() > auth.expiry) {
           toast.warning('Session expired due to inactivity');
          dispatch(logout());
          navigate('/login');
        }
      }, INACTIVITY_LIMIT);
    };

     const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, resetTimer);
    });

    resetTimer();

    return () => {
      clearTimeout(inactivityTimer);
      events.forEach(event => {
        document.removeEventListener(event, resetTimer);
      });
    };
  }, [dispatch, navigate]);
};