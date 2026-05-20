import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme';

import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ReleaseNotes from './pages/ReleaseNotes';
import HelpCenter from './pages/HelpCenter';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <HashRouter>
        <Routes>
          {/* Main Layout Wrapping Route */}
          <Route path="/" element={<Layout />}>
            {/* Index redirects immediately to /dashboard */}
            <Route index element={<Navigate to="/dashboard" replace />} />

            {/* Core pages */}
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="release-notes" element={<ReleaseNotes />} />
            <Route path="help-center" element={<HelpCenter />} />

            {/* Fallback pattern */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </HashRouter>
    </ThemeProvider>
  );
}
