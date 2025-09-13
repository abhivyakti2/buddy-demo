import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import NotificationToast from './components/common/NotificationToast';
import Home from './pages/Home';
import Room from './pages/Room';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <NotificationToast />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/room/:roomId" element={<Room />} />
            <Route path="/join/:code" element={<Home />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;