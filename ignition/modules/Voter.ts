import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("VoterModule", (m) => {
  const voter = m.contract("Voter");
  return { voter };
});
