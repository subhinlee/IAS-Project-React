import Landing from "./components/landing/Landing";
import Workspace from "./components/workspace/Workspace";
import React, { useState } from 'react';
import './App.css';

function App() {
  const [step, setStep] = useState(0);
  
  const stepChanged = (step) => {
    setStep(step);
  } 

  return (
    <div className="App">
      {step === 0 &&
        <Landing stepChanged={stepChanged}/>
      }
      {step === 1 &&
        <Workspace stepChanged={stepChanged}/>
      }
      
    </div>
  );
}

export default App;
