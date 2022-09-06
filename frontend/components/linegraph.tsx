import redstone from "redstone-api"
import { useEffect } from 'react';
import { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);
let prices: number[] = [];
let timestamp: number[] = [];
// const a =price().then((value)=>{return value});
export function LineGraph() {
  const [charttime, setChartTime] = useState({})
  const [chartprice, setChartprice] = useState({})
  const options : any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Bitcoin Value According to the time',
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks:{
          beginAtZero: true,
          color: 'white',
          fontSize: 12,
      }
      },
      y: {
        grid: {
          display: false
        },
        ticks:{
          beginAtZero: true,
          color: 'white',
          fontSize: 12,
      }
      },
    },
  };

  useEffect(() => {
    const price = async () => {
      const times = [60,55,50,45,40,35,30, 25, 20, 15, 10, 5];
      prices = [];
      timestamp = [];
      for (let i = 0; i < times.length; i++) {
        let getValue = await redstone.query().symbol('BTC').hoursAgo(times[i] / 60).exec()
        let getTime = getValue.timestamp
        timestamp.push(getTime)
        prices.push(getValue.value)
      }
      // console.log(prices)
      // console.log(timestamp)
      // return prices
      // setChartTime(timestamp)
      setChartprice(prices)


    }
    price();
    console.log(timestamp)
  }, [])
  const data = {
    labels: timestamp.map((time) => {
      const hour = new Date(time).getHours()
      const minute = new Date(time).getMinutes()
      const times = hour + ":" + minute
      return times
    }),
    datasets: [
      {
        label: 'Price',
        data: chartprice,
        fill:true,
        lineTension: 0.8,
        borderColor: 'rgb(74 222 128)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        
      },
    ],
  };
  return <div className="relative h-60">
    <Line className='bg-indigo-800' options={options} data={data} />;
  </div>
}

