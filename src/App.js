import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from '../src/hocs/Layout'
import OptionList from './components/OptionList';
import { AuthProvider } from './context/Authcontext'; 
import ProductPage from './components/ProducPage';
import ProspectList from './components/ProspectList';
import UseCases from './components/UseCases';
import Profile from './components/Profile';
import UseCaseDetails from './components/UseCaseDetails';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Layout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          {/* <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          /> */}
          <Route path="/product/:productId/options" element={<OptionList/>} />
          <Route path="/product/:productId/options/productpage" element={<ProductPage/>}/>
          <Route path="/product/:productId/options/prospectList" element ={<ProspectList/>}/>
          <Route path="/product/:productId/options/useCases" element ={<UseCases/>}/>
          <Route path="/product/:productId/options/useCases/:useCaseId" element ={<UseCaseDetails/>} />
          <Route path = "/profile" element={<Profile/>} />
        </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
};

export default App;
