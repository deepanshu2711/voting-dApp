// SPDX-License-Identifier: MIT

pragma solidity ^0.8.28;

contract Voter {
    // A struct in solidity is like a custom data type similar to an object in js it group related peices of data into one object
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    struct Poll {
        uint id;
        string title;
        //mapping is like a key-value store
        //first is key secound is value
        mapping(uint => Candidate) candidates;
        uint candidatesCount;
        mapping(address => bool) voters;
        bool active;
    }

    //store all polls like a dictionary
    mapping(uint => Poll) public polls;
    uint public pollsCount;

    //like a logger message stored on blochkchain
    event PollCreated(uint pollId, string title);
    event Voted(uint pollId, address voter, uint candidateId);

    //storage → permanent on blockchain
    //memory → temporary, function-lifetime
    //calldata → temporary, read-only, cheaper

    //Value types → don’t need memory/storage.
    //Reference types → must explicitly use memory, storage, or calldata.

    //create a new poll with candidates name
    function createPoll(
        string calldata title,
        string[] calldata candidateNames
    ) public {
        pollsCount++;
        Poll storage p = polls[pollsCount];
        p.id = pollsCount;
        p.title = title;
        p.active = true;

        for (uint i = 0; i < candidateNames.length; i++) {
            p.candidatesCount++;
            p.candidates[p.candidatesCount] = Candidate(
                p.candidatesCount,
                candidateNames[i],
                0
            );
        }

        //when you emit an event it get written in a blockchain logs
        //Apps outside the blockchain can watch for it and react.
        emit PollCreated(pollsCount, title);
    }

    function vote(uint pollId, uint candidateId) public {
        Poll storage p = polls[pollId];
        require(p.active, "Poll not active");
        require(!p.voters[msg.sender], "Already voted in this Poll");
        require(
            candidateId > 0 && candidateId <= p.candidatesCount,
            "Invalid Candidate"
        );

        p.voters[msg.sender] = true;
        p.candidates[candidateId].voteCount++;

        emit Voted(pollId, msg.sender, candidateId);
    }

    //get candidated list from a poll
    function getPollCandidates(
        uint pollId
    ) public view returns (Candidate[] memory) {
        Poll storage p = polls[pollId];
        Candidate[] memory result = new Candidate[](p.candidatesCount);

        for (uint i = 1; i <= p.candidatesCount; i++) {
            result[i - 1] = p.candidates[i];
        }

        return result;
    }

    //get candidate details from a poll
    function getCandidate(
        uint pollId,
        uint candidateId
    ) public view returns (uint, string memory, uint) {
        Poll storage p = polls[pollId];
        require(
            candidateId > 0 && candidateId <= p.candidatesCount,
            "Invalid candidate"
        );
        Candidate memory c = p.candidates[candidateId];
        return (c.id, c.name, c.voteCount);
    }

    //get number of candidates in a poll
    function getCandidateCount(uint pollId) public view returns (uint) {
        return polls[pollId].candidatesCount;
    }

    // deactivate poll
    function closePoll(uint pollId) public {
        polls[pollId].active = false;
    }
}
