import { forwardRef,useState} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ReactReuseableDialog = ({ handleOpen, handleClose }) => {
  return (
    <div className='rounded-3xl'>
      <Dialog
        open={handleOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle className='font-bold bg-yellow-300 text-4xl'>Welcome!</DialogTitle>
        <DialogContent className=' w-80 h-80 rounded-3xl'>
          <DialogContentText id="alert-dialog-slide-description" >
            <h1 className='text-black font-semibold'>This Product is in Beta</h1>
            <h2>Once you enter position you cannot cancel or adjust it</h2>
            <li>I understand that i am using this product at my own risk. Any losses incurred due to my actions are my own responsibility</li>
            <li>I understand that this product is still in beta. I am participating at my own risk.</li>
            {/* <Checkbox color="primary" checked={checkAggrement1} onChange={handleChange} /> */}
            {/* <Checkbox color="primary" checked={checkAggrement2} onChange={handleChange} /> */}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button onClick={handleClose}>Agree</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
export default ReactReuseableDialog