import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBus, faCar, faTrain } from '@fortawesome/free-solid-svg-icons';
import { useState } from "react";

const ToggleButton = ({ children, onClick, isActive }) => {
    return (
      <button
        style={{
          backgroundColor: isActive ? '#007bff' : '#ccc',
          border: 'none',
          padding: '10px 20px',
          cursor: 'pointer',
          color: isActive ? '#fff' : '#000',
        }}
        onClick={onClick}
      >
        {children}
      </button>
    );
  };

export const ChangeTransportation = () => {
  const [busActive, setBusActive] = useState(false);
  const [carActive, setCarActive] = useState(false);
  const [trainActive, setTrainActive] = useState(false);
  
  return (
    <div className="flex justify-start">
      <ToggleButton
        onClick={() => setCarActive(!carActive)}
        isActive={carActive}
      >
        <FontAwesomeIcon icon={faCar} />
      </ToggleButton>
      <ToggleButton
        onClick={() => setBusActive(!busActive)}
        isActive={busActive}
      >
        <FontAwesomeIcon icon={faBus} />
      </ToggleButton>

      <ToggleButton
        onClick={() => setTrainActive(!trainActive)}
        isActive={trainActive}
      >
        <FontAwesomeIcon icon={faTrain} />
      </ToggleButton>
    </div>
  );
};