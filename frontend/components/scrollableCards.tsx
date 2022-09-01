import { useRef, useState, useEffect } from "react";
import { useDraggable } from 'react-use-draggable-scroll'
import { Hexagon } from "./hexagon";
import ReactCardFlip from "react-card-flip";
import { ArrowBack, ArrowDownward, ArrowUpward } from "@mui/icons-material";
import { bottomNavigationActionClasses, TextField } from "@mui/material";
import DiscreteSliderLabel from "./slider";
import { authenticate, userSession } from "../stacksfoundation/auth";
import redstone from "redstone-api"
import callContract from "../stacksfoundation/contractCall";
import { autoCall } from "../stacksfoundation/contractCall";
export let predict = true;
export let amount = "";
export default function ScrollableCards() {
    const ref = useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>;
    const { events } = useDraggable(ref);
    const [flip, setFlipped] = useState(false);
    const [userData, setUserData] = useState({});
    let [up_down, setUPDown] = useState(true);
    const [loggedIn, setLoggedIn] = useState(false);
    const handleOnChange = (event: any) => {
        amount = event.target.value;
        parseInt(amount)
    }
    useEffect(() => {
        if (userSession.isSignInPending()) {
            userSession.handlePendingSignIn().then((userData) => {
                setUserData(userData);
            })
        }
        else if (userSession.isUserSignedIn()) {
            setLoggedIn(true);
            setUserData(userSession.loadUserData());
        }
    }, []);
    const setUP = (e: any) => {
        flipCard();
        if (up_down) {
            setUPDown(false)
        }
        up_down = true
        predict = true;
        console.log(predict)

    }
    const setDown = (e: any) => {
        flipCard()
        if (!up_down) {
            setUPDown(true)
        }
        predict = false;
        up_down = false
        console.log(predict)

    }

    const flipCard = () => {
        // e.preventDefault();
        if (flip) {
            setFlipped(false)
        }
        else {
            setFlipped(true)
        }
    }
    const changePredict = () => {
        if (up_down) {
            setUPDown(false)
            predict = true;
            console.log(predict)
        }
        else if (!up_down) {
            setUPDown(true)
            predict = false;
            console.log(predict)
        }
    }
    let prices: number[] = [];
    let timestamp: number[] = [];
    const price = async () => {
        const times = [5, 10, 15, 20, 25, 30];
        prices = [];
        timestamp = [];
        for (let i = 0; i < times.length; i++) {
            let getValue = await redstone.query().symbol('BTC').hoursAgo(times[i] / 60).exec()
            let getTime = getValue.timestamp
            prices.push(getValue.value)
            timestamp.push(getTime)
        }
        console.log(prices)
        console.log(timestamp)
        // return prices
    }

    return (
        <div
            className="flex max-w-full mt-20 space-x-3 overflow-x-scroll scrollbar-hide "
            {...events}
            ref={ref} // add reference and events to the wrapping div
        >
            <div className="flex-none w-80 h-96 bg-black rounded-3xl hover:opacity-80">
                <div className="max-w-full bg-yellow-300 py-5 rounded-t-3xl">
                </div>
                <Hexagon>

                    <div className='w-72 h-40 border-2 rounded-xl -ml-6 bg-black border-green-300'>
                        <h1 className='ml-3 text-white'>Closed Price</h1>
                        <ClosedPrice />
                    </div>
                </Hexagon>
            </div>
            <div className="flex-none w-80 h-96 bg-black rounded-3xl">
                <div className="max-w-full bg-yellow-300 py-5 rounded-t-3xl">
                </div>
                <Hexagon>
                    <div className='w-72 h-40 border-2 rounded-xl -ml-6 bg-black border-green-300'>
                        <h1 className='ml-3 text-white'>Closed Price</h1>
                        <ClosedPrice />
                    </div>
                </Hexagon>
            </div>
            <div className="flex-none w-80 h-96 bg-black rounded-3xl">
                <div className="max-w-full bg-yellow-300 py-5 rounded-t-3xl">
                </div>
                <Hexagon>
                    <div className='w-72 h-40 border-2 rounded-xl -ml-6 bg-black border-green-300'>
                        <h1 className='ml-3 text-white'>Closed Price</h1>
                        <ClosedPrice />
                    </div>
                </Hexagon>
            </div>
            <div className="flex-none w-80 h-96 bg-black rounded-3xl">
                <div className="max-w-full bg-yellow-300 py-5 rounded-t-3xl">
                </div>
                <Hexagon>
                    <div className='w-72 h-40 border-2 rounded-xl -ml-6 bg-black border-green-300'>
                        <h1 className='ml-3 text-white'>Last Price</h1>
                        <ClosedPrice />
                        <button className="text-white bg-red-800" onClick={price}>check backend</button>
                    </div>
                </Hexagon>
            </div>
            <ReactCardFlip isFlipped={flip} flipDirection="horizontal" flipSpeedBackToFront={0.9} flipSpeedFrontToBack={0.9}>
                <div className="flex-none w-80 h-96 bg-black rounded-3xl">
                    <div className="max-w-full bg-yellow-300 py-5 rounded-t-3xl">
                    </div>
                    <Hexagon>
                        <div className='w-72 h-40 border-2 rounded-xl -ml-6 bg-black border-green-300'>
                            <div className="">
                                <h1 className='ml-3 mt-3 text-white font-bold inline-block'>Prize Pool</h1>
                                {/* <h1 className='ml-24 text-white font-bold inline-block'>{}</h1> */}
                                <Bitcoinprize></Bitcoinprize>

                            </div>
                            <button onClick={setUP} className="text-white mt-3 py-2 px-24 ml-3 font-bold mb-2 text-center rounded-lg bg-green-400 none">Enter UP</button>
                            <button onClick={setDown} className="text-white py-2 px-20 ml-3 font-bold mb-2 text-center rounded-lg bg-pink-500">Enter DOWN</button>
                        </div>
                    </Hexagon>
                </div>
                <div className="flex-none w-80 h-96 bg-black rounded-3xl">
                    <div className="max-w-full bg-yellow-300 py-5 rounded-t-3xl font-bold text-green">
                        <ArrowBack onClick={flipCard} htmlColor="green" className="hover: cursor-pointer mx-5 inline"></ArrowBack>
                        Set Position
                        <div className="inline ml-20 p-1 rounded-md bg-green-600">
                            {(!up_down ?
                                <button className="text-white" onClick={changePredict}>
                                    <ArrowUpward htmlColor="white" className="mb-2 inline"></ArrowUpward>
                                    UP
                                </button>
                                : <button className="text-white" onClick={changePredict}>
                                    <ArrowDownward htmlColor="white" className="mb-2 inline"></ArrowDownward>
                                    Down
                                </button>
                            )}


                        </div>
                    </div>
                    <div className="my-4">
                        <h1 className="text-white ml-4 my-2 inline mr-3 font-bold mr-44">Commit</h1>
                        <h1 className="text-white font-bold mr-16 inline">Cake</h1>
                    </div>

                    <TextField color="primary" disabled={!loggedIn} onChange={handleOnChange}
                        InputProps={{ inputProps: { min: 0 }, style: { color: 'white' } }} type='number' defaultValue={0}
                        className="disabled: hover: cursor-not-allowed ml-6 bg-gray-600 rounded-2xl w-10/12"
                    />
                    <label className="text-white ml-48">Balance: 0.0</label>
                    <DiscreteSliderLabel />
                    {(loggedIn ?
                        <button onClick={callContract} className="text-white py-2 px-20 ml-12 font-bold mb-2 text-center rounded-lg bg-green-500">Enable</button>
                        : <button onClick={authenticate} className="text-white py-2 px-20 ml-12 font-bold mb-2 text-center rounded-lg bg-green-500">Sign In</button>
                    )}
                    <p className="text-white mx-4">You won't be able to remove or change your position once you enter it.</p>
                </div>
            </ReactCardFlip>

            <div className="flex-none w-80 h-96 bg-black rounded-3xl">
                <div className="max-w-full bg-yellow-300 py-5 rounded-t-3xl">
                </div>
                <Hexagon />
            </div>
            <div className="flex-none w-80 h-96 bg-black rounded-3xl">
                <div className="max-w-full bg-yellow-300 py-5 rounded-t-3xl">
                </div>
                <Hexagon>
                    <div className='w-72 h-40 border-2 rounded-xl -ml-6 bg-black border-green-300'>
                        <h1 className='ml-3 text-white'>Closed Price</h1>
                        <ClosedPrice />
                    </div>
                </Hexagon>
            </div>

        </div>

    )
}
export function ClosedPrice() {
    return (
        <div className="ml-3 grid grid-rows-3 grid-flow-col gap-4 text-white">
            <div>$3.125</div>
            <div>Locked Price: </div>
            <div>Prize Pool:</div>
            <div>01</div>
            <div>02</div>
            <div>03</div>
        </div>
    );
}
export function Bitcoinprize() {
    const [bitvalue, setBitvalue] = useState(0);
    const [time, setTime] = useState();
    useEffect(() => {
        setTimeout(async () => {
            setBitvalue((await redstone.getPrice("BTC")).value)
        }, 100)
    }, [])
    return <h1 className="text-white">{bitvalue}</h1>
}


