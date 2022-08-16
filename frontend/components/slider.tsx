import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

const marks = [
  {
    value: 0,
    label: '0%',
  },
  {
    value: 25,
    label: '25%',
  },
  {
    value: 50,
    label: '50%',
  },
  {
    value: 75,
    label: '75%',
  },
  {
    value: 100,
    label: '100%',
  },
];

function valuetext(value: number) {
  return `${value} %`;
}

export default function DiscreteSliderLabel() {
  return (
    <Box sx={{color: 'white',width:'80%', fontSize: 34, fontWeight: 'medium' }} className="ml-8 ">
      <Slider
      sx={{}}
        aria-label="Always visible"
        defaultValue={0}
        getAriaValueText={valuetext}
        marks={marks}
        valueLabelDisplay="on"
        color='primary'
        step={10}
      />
    </Box>
  );
}
