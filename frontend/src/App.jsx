import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, createBrowserRouter, RouterProvider } from 'react-router-dom';
// import LoginFormPage from './components/LoginFormPage';
// import SignupFormPage from './components/SignupFormPage';
import Navigation from './components/Navigation/Navigation-bonus';
import * as sessionActions from './store/session';
import { Modal } from './context/Modal';
import HomePage from './components/HomePage/HomePage';
import SpotDetailsPage from './components/SpotsDetails/SpotDetailsPage';
import SignUpForm from './components/SpotsDetails/CreateASpot';
import UpdateASpot from './components/SpotsDetails/UpdateASpot';
import GetCurrentUserSpots from './components/SpotsDetails/GetCurrentUserSpots';
function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
      <Modal/>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <HomePage/>
      },
      {
        path: 'spots/:spotId',
        element: <SpotDetailsPage/>
      },
      // {
      //   path: 'login',
      //   element: <LoginFormPage />
      // },
      // {
      //   path: 'signup',
      //   element: <SignupFormPage />
      // },

      {
        path: '/spots/new',
        element: <SignUpForm/>
      },
      {
        path: `/spots/current`,
        element: <GetCurrentUserSpots/>
      },
       
      {
        path: `/spots/:spotId/edit`,
        element: <UpdateASpot/>
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
