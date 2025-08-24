import React from 'react';
import WaitlistLanding from './components/WaitlistLanding';
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <>
      <WaitlistLanding />
      <Analytics />
    </>
  );
}

export default App;
