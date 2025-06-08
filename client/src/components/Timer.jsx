import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Timer = ({ timeLimit = 30, onTimeUp }) => {
  const [time, setTime] = useState(timeLimit); 

  useEffect(() => {
    const interval = setTimeout(() => {
      if (time > 0) {
        setTime(time - 1);
      } else {
        clearTimeout(interval);
        onTimeUp(); 
      }
    }, 1000);

    return () => clearTimeout(interval);
  }, [time, onTimeUp]);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  // Fixed small size for the timer
  const timerStyle = { fontSize: '16px', padding: '10px 20px', width: '200px' };

  return (
    <div 
      className="position-absolute top-0 end-0 m-3" 
      style={timerStyle}
    >
      <div className="bg-light rounded-3 p-3 shadow-sm text-center">
        {/* <h5 className="text-dark fw-bold mb-2">Time Left</h5> */}
        <div className="text-primary">
          Time Left {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </div>
      </div>
    </div>
  );
};

export default Timer;
