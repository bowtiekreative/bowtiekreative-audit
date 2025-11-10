import React, { useState } from 'react';
import { motion } from 'framer-motion';
import LoginModal from './LoginModal';

function Header({ currentPage, setCurrentPage, isAdmin, setIsAdmin }) {
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <motion.div
              className="flex items-center cursor-pointer"
              onClick={() => setCurrentPage('home')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                BK
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-900">Bowtie Kreative</h1>
                <p className="text-xs text-gray-600">Digital Audit</p>
              </div>
            </motion.div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <button
                onClick={() => setCurrentPage('home')}
                className={`font-medium transition-colors ${
                  currentPage === 'home'
                    ? 'text-primary-600'
                    : 'text-gray-600 hover:text-primary-600'
                }`}
              >
                Audit
              </button>
              
              <a
                href="https://bookme.name/digitalstemcell/lite/schedule-a-consultation-appointment-1"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-gray-600 hover:text-primary-600 transition-colors"
              >
                Strategy Call
              </a>

              {isAdmin ? (
                <button
                  onClick={() => setCurrentPage('admin')}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Dashboard
                </button>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="px-4 py-2 border-2 border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
                >
                  Admin Login
                </button>
              )}
            </nav>

            {/* Mobile menu button */}
            <button className="md:hidden p-2 rounded-lg hover:bg-gray-100">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={() => {
          setIsAdmin(true);
          setCurrentPage('admin');
          setShowLoginModal(false);
        }}
      />
    </>
  );
}

export default Header;
