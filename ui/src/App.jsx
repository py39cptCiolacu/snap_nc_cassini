import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import components and pages
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import FormPage from './pages/FormPage';

function App() {
  return (
    <Router>
      <div className="app">
        {/* Header is always displayed */}
        <Header />

        {/* Main content */}
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/form" element={<FormPage />} />
          </Routes>
        </main>

        {/* Footer is always displayed */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;