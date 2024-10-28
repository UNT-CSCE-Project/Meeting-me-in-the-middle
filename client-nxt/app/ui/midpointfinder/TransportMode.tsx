import React from 'react';
import { ButtonGroup, IconButton } from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import TrainIcon from '@mui/icons-material/Train';
import FlightIcon from '@mui/icons-material/Flight';

const TransportModeSelector: React.FC = () => {
  return (
    <ButtonGroup variant="contained" aria-label="outlined primary button group">
      <IconButton>
        <DirectionsCarIcon />
      </IconButton>
      <IconButton>
        <DirectionsBusIcon />
      </IconButton>
      <IconButton>
        <TrainIcon />
      </IconButton>
      <IconButton>
        <FlightIcon />
      </IconButton>
    </ButtonGroup>
  );
};

export default TransportModeSelector;
