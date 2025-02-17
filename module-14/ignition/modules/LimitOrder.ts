import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const UNISWAP_ROUTER = "0xE592427A0AEce92De3Edee1F18E0157C05861564";
const EXECUTOR_RELAYER="0x3Fd2FbfcFA051455A34fcd931cb53772E370C0B0"
const EOA="0x88055326795DD479B39335CAb1c48357A66a6a6F"


export default buildModule("LimitOrder", (moduleBuilder)=>{
    const limitOrderContract = moduleBuilder.contract("LimitOrder", [UNISWAP_ROUTER, EXECUTOR_RELAYER, EOA]);
    return {limitOrder: limitOrderContract};
});
