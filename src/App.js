// src/App.js
import React from 'react';
import { AppProvider } from './components/AppContext';
import MusicUniverse from './components/MusicUniverse';

const App = () => (
  <AppProvider>
    <MusicUniverse />
  </AppProvider>
);

export default App;