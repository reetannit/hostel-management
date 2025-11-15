import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar/Navbar';
import Carousel from './components/Carousel/Carousel';
import Features from './components/features/features';
import Gallery from './components/Gallery/Gallery';
import Testimonials from './components/Testimonials/Testimonials';
import Footer from './components/footer/footer';
import LoginPage from './components/Auth/Login';
import SignupPage from './components/Auth/Signup';
import Dashboard from './components/UserDash/HostelDashboard';
import HostelList from './pages/HostelList';
import './App.css';

const App = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Home Page Component
  const HomePage = () => (
    <>
      <Navbar scrollToSection={scrollToSection} />
      <Carousel scrollToSection={scrollToSection} />
      <Features />
      <div id="hostels">
        <HostelList />
      </div>
      <Gallery />
      <Testimonials />
      <Footer />
    </>
  );

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/hostels" element={<HostelList />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard/:id" element={<Dashboard />} />
      </Routes>
    </div>
  );
};

export default App;