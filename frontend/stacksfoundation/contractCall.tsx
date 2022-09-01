import { openContractCall } from "@stacks/connect";
import { StacksMocknet } from "@stacks/network";
import { userSession, getUserData } from "./auth";
import { uintCV, FungibleConditionCode, makeStandardSTXPostCondition, standardPrincipalCV, trueCV, falseCV, makeContractCall, AnchorMode, broadcastTransaction } from "@stacks/transactions";
import { predict, amount } from "../components/scrollableCards";
import redstone from "redstone-api"
export default async function callContract() {
    //  const contractAddress = 'STH4FEPVGPZ82GHCT7K0ZTCQRXXYPYM21JDFC5GX';
    const contractAddress = userSession.loadUserData().profile.stxAddress.testnet;
    console.log(contractAddress)
    const contractName = 'predicto';
    const network = new StacksMocknet;
    const predictorAddress = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
    const bettingAmount = amount;
    const cPredictorAddress = standardPrincipalCV(contractAddress)
    const cBettingAmount = uintCV(bettingAmount)
    console.log(amount)
    const tf = () => {
        const t = trueCV()
        const f = falseCV()
        if (predict) {
            return t;
        }
        else {
            return f;
        }
    }
    const functionArgs = [cPredictorAddress, cBettingAmount, tf()]
    const postConditionAddress = userSession.loadUserData().profile.stxAddress.testnet;
    const postConditionCode = FungibleConditionCode.LessEqual;
    const postConditionAmount = 1000000;
    const postConditions = [
        makeStandardSTXPostCondition(
            postConditionAddress,
            postConditionCode,
            postConditionAmount
        ),
    ];


    const options = {
        contractAddress,
        functionName: "check-play",
        contractName,
        functionArgs,
        network,
        postConditions,
        appDetails: {
            name: "Predicto",
            icon: window.location.origin + "/vercel.svg",
        },
        onFinish: (data: any) => {
            console.log("Stacks Transaction:", data.stacksTransaction);
            console.log("Transaction ID:", data.txId);
            console.log("Raw transaction:", data.txRaw);
        }

    };
    await openContractCall(options);
    // setInterval(autoCall, 6000)
}

export async function autoCall() {
    const contractAddress = userSession.loadUserData().profile.stxAddress.testnet;
    console.log(contractAddress)
    const contractName = 'predicto';
    const sender_key = userSession.loadUserData();
    console.log(sender_key);
    const network = new StacksMocknet;
    const bitcoinValueBefore = async () => {
        return await redstone.getPrice("BTC")
    }

    const tf = () => {
        const t = trueCV()
        const f = falseCV()
        if (predict) {
            return t;
        }
        else {
            return f;
        }
    }

    const functionArgs = [tf()]
    const postConditionAddress = userSession.loadUserData().profile.stxAddress.testnet;
    const postConditionCode = FungibleConditionCode.LessEqual;
    const postConditionAmount = 1000000;
    const postConditions = [
        makeStandardSTXPostCondition(
            postConditionAddress,
            postConditionCode,
            postConditionAmount
        ),
    ];


    const options = {
        contractAddress: contractAddress,
        contractName: 'predicto',
        functionName: 'prediction-result',
        functionArgs: [trueCV()],
        senderKey: 'b244296d5907de9864c0b0d51f98a13c52890be0404e83f273144cd5b9960eed01',
        validateWithAbi: true,
        network,
        postConditions,
        anchorMode: AnchorMode.OffChainOnly,
    };
    const transaction = await makeContractCall(options);

    const broadcastResponse = await broadcastTransaction(transaction, network);
    const txId = broadcastResponse.txid;
}
