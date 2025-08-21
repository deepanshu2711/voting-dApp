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

    //create a new poll with candidates name

    function createPoll(string title, string[] candidateNames) public {
        pollsCount++;
        Poll p = polls[pollsCount]
        p.id = pollsCount;
        p.title = title;
        p.active = true;

        for (uint i = 0 ; i< candidateNames.length; i++){
          p.candidatesCount++;
          p.candidates[p.candidatesCount] = Candidate(p.candidatesCount, candidateNames[i], 0);
        }

        //when you emit an event it get written in a blockchain logs
        //Apps outside the blockchain can watch for it and react.
        emit PollCreated(pollsCount,title)
    }
}
