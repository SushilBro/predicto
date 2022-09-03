import type { NextPage } from 'next'
import { useState } from 'react';
import Head from 'next/head'
import Image from 'next/image'
import Nav from '../components/Nav'
import ScrollableCards from '../components/scrollableCards'
import ReactReuseableDialog from '../components/CustomDialog'
import Footer from '../components/footer';
import { LineGraph } from '../components/linegraph';
const Home: NextPage = () => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  
  
  return(
    <div className='bg-purple-800	'>
    <Nav/>
    <ScrollableCards/>
    <ReactReuseableDialog handleOpen={open} handleClose={handleClose}></ReactReuseableDialog>
    <button onClick={handleClickOpen}>Open Dialog</button>
    {/* <button onClick={price}>Open Dialog</button> */}
    <LineGraph/>
    <Footer/>
    </div>
  )
}

export default Home
