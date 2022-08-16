import { openContractCall } from "@stacks/connect";
import { StacksMocknet } from "@stacks/network";
import { authenticate, userSession } from "./auth";
import { uintCV, FungibleConditionCode, makeStandardSTXPostCondition } from "@stacks/transactions";
export default async function callContract() {
    const contractAddress = 'STH4FEPVGPZ82GHCT7K0ZTCQRXXYPYM21JDFC5GX';
    const contractName = 'predicto';
    const network = new StacksMocknet;
    const token = 3
    const tok = uintCV(token)
    const functionArgs = [tok]
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
        functionName: "check-call",
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
