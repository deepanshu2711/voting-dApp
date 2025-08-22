import { expect } from "chai";
import { network } from "hardhat";
import { Voter } from "../types/ethers-contracts/Voter.js";

const { ethers } = await network.connect();

describe("Testing Voter Connect", () => {
  let voter: Voter;

  beforeEach(async () => {
    voter = await ethers.deployContract("Voter");
  });
  it("Should create a poll", async () => {
    const poll = await voter.createPoll("This is a testing poll", [
      "Candidate 1",
      "Candidate 2",
    ]);

    expect(await voter.pollsCount()).to.equal(1);

    await expect(voter.createPoll("Another poll", ["A", "B"]))
      .to.emit(voter, "PollCreated")
      .withArgs(2, "Another poll");
  });
});
