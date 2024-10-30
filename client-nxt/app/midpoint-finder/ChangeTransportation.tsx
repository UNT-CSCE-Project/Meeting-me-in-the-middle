import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBus, faCar, faTrain } from '@fortawesome/free-solid-svg-icons';
import { useState, MouseEventHandler } from "react";

interface ToggleButtonProps {
    children: React.ReactNode;
    onClick: MouseEventHandler;
    isActive: boolean;
  }  

const ToggleButton: React.FC<ToggleButtonProps> = ({ children, onClick, isActive }) => {
    return (
      <button
        style={{
          backgroundColor: isActive ? '#ccc' : 'white',
          border: '1px solid #000',
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