module.exports = {
  buildDir: "artifacts",
  contractsDir: "contracts",
  testDir: "tests",
  skipContracts: ["module-1/", "module-2/", "mocks/"],
  skipTests: ["module-1/"],
  testingTimeOutInSec: 300,
  network: "none",
  testingFramework: "hardhat",
  minimal: false,
  tce: false,
};
