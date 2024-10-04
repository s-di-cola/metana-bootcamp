import { HardhatUserConfig, task } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import "@nomiclabs/hardhat-solhint";
import { glob } from "glob";
import path from "path";

// Define the base configuration
const config: HardhatUserConfig = {
  solidity: "0.8.27",
  paths: {
    sources: "./contracts", // This will be overridden in the compile task
    tests: "./test", // This will be overridden in the test task
  },
};

// Helper function to find contract directories
const findContractDirs = (rootDir: string) => {
  const contractPaths = glob.sync("module-*/deliverables/**/*.sol", {
    cwd: rootDir,
    ignore: ["**/node_modules/**"],
  });
  return [...new Set(contractPaths.map(path.dirname))];
};

// Helper function to find all Solidity files
const findSolidityFiles = (rootDir: string) => {
  return glob.sync("module-*/deliverables/**/*.sol", {
    cwd: rootDir,
    ignore: ["**/node_modules/**"],
    absolute: true,
  });
};

// Override the default compile task
task(
  "compile",
  "Compiles the entire project, running all compilations",
).setAction(async (taskArgs, hre, runSuper) => {
  const rootDir = hre.config.paths.root;
  const contractDirs = findContractDirs(rootDir);

  for (const contractDir of contractDirs) {
    console.log(`Compiling contracts in ${contractDir}...`);
    hre.config.paths.sources = path.join(rootDir, contractDir);
    await runSuper(taskArgs);
  }
});

// Custom test task
task("test", "Runs mocha tests in all module-x/test folders").setAction(
  async (taskArgs, hre, runSuper) => {
    const rootDir = hre.config.paths.root;
    const testFolders = glob.sync("module-*/test", { cwd: rootDir });

    await hre.run("compile");

    for (const testFolder of testFolders) {
      console.log(`Running tests in ${testFolder}...`);
      hre.config.paths.tests = path.join(rootDir, testFolder);
      await runSuper(taskArgs);
    }
  },
);

// Custom check task
task("check", "Runs solhint on all Solidity files in the project").setAction(
  async (taskArgs, hre, runSuper) => {
    const rootDir = hre.config.paths.root;
    const solidityFiles = findSolidityFiles(rootDir);

    console.log(`Checking ${solidityFiles.length} Solidity files...`);

    for (const file of solidityFiles) {
      console.log(`Checking ${path.relative(rootDir, file)}...`);
      hre.config.paths.sources = path.dirname(file);
      await runSuper({ files: [file], ...taskArgs });
    }

    console.log("Check completed.");
  },
);

export default config;
