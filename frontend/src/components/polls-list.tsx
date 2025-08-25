"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PollCard } from "@/components/poll-card";
import { RefreshCw, Vote, AlertCircle } from "lucide-react";
import { ethers } from "ethers";
import VoterContract from "../../../ignition/deployments/chain-31337/artifacts/VoterModule#Voter.json";
import { BrowserProvider } from "ethers";

const mockPolls = [
  {
    id: 1,
    title: "Best Programming Language for Web Development",
    isActive: true,
    totalVotes: 156,
    candidates: [
      { id: 0, name: "JavaScript", voteCount: 89 },
      { id: 1, name: "TypeScript", voteCount: 45 },
      { id: 2, name: "Python", voteCount: 22 },
    ],
  },
  {
    id: 2,
    title: "Favorite Frontend Framework",
    isActive: true,
    totalVotes: 203,
    candidates: [
      { id: 0, name: "React", voteCount: 98 },
      { id: 1, name: "Vue.js", voteCount: 67 },
      { id: 2, name: "Angular", voteCount: 38 },
    ],
  },
  {
    id: 3,
    title: "Best Database for Modern Applications",
    isActive: false,
    totalVotes: 89,
    candidates: [
      { id: 0, name: "PostgreSQL", voteCount: 34 },
      { id: 1, nearme: "MongoDB", voteCount: 28 },
      { id: 2, name: "MySQL", voteCount: 27 },
    ],
  },
];

interface PollsListInterface {
  CONTRACT_ADDRESS: string;
  provider: BrowserProvider;
}
export function PollsList({ CONTRACT_ADDRESS, provider }: PollsListInterface) {
  const [polls, setPolls] = useState(mockPolls);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPolls = async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      // NOTE: fetch polls here

      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        VoterContract.abi,
        provider
      );

      console.log(contract);

      const polls = await contract.getAllPolls();
      console.log(polls);

      setPolls(mockPolls);
    } catch (err) {
      setError("Failed to load polls");
      console.error("Error loading polls:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadPolls();
  }, []);

  const handleRefresh = () => {
    loadPolls(true);
  };

  const handleVoteSuccess = () => {
    // Refresh polls after successful vote to update counts
    loadPolls(true);
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Active Polls</h2>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/3"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[1, 2, 3].map((j) => (
                    <div key={j}>
                      <div className="h-4 bg-muted rounded mb-2"></div>
                      <div className="h-2 bg-muted rounded"></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Polls</h2>
          <p className="text-muted-foreground">
            {polls.length === 0
              ? "No polls available"
              : `${polls.length} poll${polls.length === 1 ? "" : "s"} found`}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 bg-transparent"
        >
          <RefreshCw
            className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {polls.length === 0 && !error ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Vote className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Polls Yet</h3>
            <p className="text-muted-foreground">
              Be the first to create a poll and start voting!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {polls.map((poll) => (
            <PollCard
              key={poll.id}
              poll={poll}
              onVoteSuccess={handleVoteSuccess}
            />
          ))}
        </div>
      )}
    </div>
  );
}
