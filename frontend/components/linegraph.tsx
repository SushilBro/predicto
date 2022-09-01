import redstone from "redstone-api"
import { useEffect} from 'react';
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { faker } from '@faker-js/faker';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Bitcoin Value According to the time',
    },
  },
};
let prices:number[]=[];
let timestamp:number[]=[];

export const price= async ()=>{
  const times=[5,10,15,20,25,30];
  prices=[];
  timestamp=[];
  for(let i=0;i<times.length;i++){
      let getValue= await redstone.query().symbol('BTC').hoursAgo(times[i]/60).exec()
      let getTime=getValue.timestamp
      prices.push(getValue.value)
      timestamp.push(getTime)
  }
  console.log(prices)
  console.log(timestamp)
  // return prices
}
const a =price().then((value)=>{return value});


const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
const check= [20234.956181999998, 20263.631916, 20285.79421531, 20261.066497, 20212.79175, 20148.724432]

export const data = {
  labels,
  datasets: [
    {
      label: 'Dataset',
      data: prices,
      borderColor: 'rgb(53, 162, 235)', 
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
};


export function LineGraph() {
  return <Line className='bg-black' options={options} data={data} />;
}
