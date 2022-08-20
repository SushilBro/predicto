import { openContractCall } from "@stacks/connect";
import { StacksMocknet } from "@stacks/network";
import { userSession,getUserData } from "./auth";
import { uintCV, FungibleConditionCode, makeStandardSTXPostCondition,standardPrincipalCV,trueCV,falseCV } from "@stacks/transactions";
import { predict, amount } from "../components/scrollableCards";
export default async function callContract() {
    //  const contractAddress = 'STH4FEPVGPZ82GHCT7K0ZTCQRXXYPYM21JDFC5GX';
     const contractAddress = userSession.loadUserData().profile.stxAddress.testnet;
     console.log(contractAddress)
    const contractName = 'predicto';
    const network = new StacksMocknet;
    const predictorAddress= 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
    const bettingAmount= amount;
    const cPredictorAddress=standardPrincipalCV(contractAddress)
    const cBettingAmount=uintCV(bettingAmount)
    console.log(amount)
    const tf=()=>{
        const t=trueCV()
        const f=falseCV()
        if(predict){
            return t;
        }
        else{
            return f;
        }
    }
    const functionArgs = [cPredictorAddress,cBettingAmount,tf()]
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
        onFinish: (data:any) => {
            console.log("Stacks Transaction:", data.stacksTransaction);
            console.log("Transaction ID:", data.txId);
            console.log("Raw transaction:", data.txRaw);
        }

    };
    await openContractCall(options);
}
