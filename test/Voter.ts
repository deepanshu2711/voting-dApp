import type { Voter } from "../types/ethers-contracts/Voter.js";

import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("Testing Voter Connect", () => {
  let voter: Voter;

  beforeEach(async () => {
    voter = await ethers.deployContract("Voter");
    await voter.createPoll("This is a testing poll", [
      "Candidate 1",
      "Candidate 2",
    ]);
  });

  it("Should create a poll", async () => {
    expect(await voter.pollsCount()).to.equal(1);

    await expect(voter.createPoll("Another poll", ["A", "B"]))
      .to.emit(voter, "PollCreated")
      .withArgs(2, "Another poll");
  });

  it("Should vote for a candidate in poll", async () => {
    const [owner] = await ethers.getSigners();

    await expect(voter.vote(1, 1))
      .to.emit(voter, "Voted")
      .withArgs(1, owner.address, 1);
  });

  it("Should ger candidates of a poll", async () => {
    const candidates = await voter.getPollCandidates(1);
    expect(candidates.length).to.equal(2);
  });

  it("Should get Candidate Details", async () => {
    const candidate = await voter.getCandidate(1, 1);
    expect(candidate[1]).to.equal("Candidate 1");
  });

  it("Should get candidate count", async () => {
    const candidateCount = await voter.getCandidateCount(1);
    expect(candidateCount).to.equal(2);
  });

  it("Should close the poll", async () => {
    await voter.closePoll(1);
    const poll = await voter.polls(1);

    expect(poll.active).to.equal(false);
  });
});
