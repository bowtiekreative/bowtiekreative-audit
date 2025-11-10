import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AuditForm from './pages/AuditForm';
import AdminDashboard from './pages/AdminDashboard';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isAdmin, setIsAdmin] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <AuditForm />;
      case 'admin':
        return <AdminDashboard onLogout={() => {
          setIsAdmin(false);
          setCurrentPage('home');
        }} />;
      case 'privacy':
        return <PrivacyPolicy />;
      case 'terms':
        return <TermsConditions />;
      default:
        return <AuditForm />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
      />
      
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
}

export default App;
