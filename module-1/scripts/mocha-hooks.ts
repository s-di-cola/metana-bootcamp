import hre from "hardhat";

export const mochaHooks = {
  beforeAll: async function (this: Mocha.Suite) {
    console.log("Compiling contracts...");
    await hre.run("compile");
    console.log("Compilation finished.");
  },
};
