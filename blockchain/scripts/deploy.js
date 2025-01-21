const hre = require("hardhat");

async function main() {
    const OnlineVoting = await hre.ethers.getContractFactory("OnlineVoting");
    const onlineVoting = await OnlineVoting.deploy();

    await onlineVoting.deployed();

    console.log("OnlineVoting deployed to:", onlineVoting.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
