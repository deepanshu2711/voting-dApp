"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Vote, Users, Clock, CheckCircle, AlertCircle } from "lucide-react";

interface Candidate {
  id: number;
  name: string;
  voteCount: number;
}

interface Poll {
  id: number;
  title: string;
  isActive: boolean;
  totalVotes: number;
  candidates: Candidate[];
}

interface PollCardProps {
  poll: Poll;
  onVoteSuccess?: () => void;
}

export function PollCard({ poll, onVoteSuccess }: PollCardProps) {
  const [candidates, setCandidates] = useState<Candidate[]>(poll.candidates);
  const [isLoading, setIsLoading] = useState(true);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [voteSuccess, setVoteSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCandidates = async () => {
      try {
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 500));
        setCandidates(poll.candidates);
      } catch (err) {
        setError("Failed to load poll candidates");
      } finally {
        setIsLoading(false);
      }
    };

    loadCandidates();
  }, [poll.candidates]);

  const handleVote = async (candidateId: number) => {
    setIsVoting(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update vote count locally
      const updatedCandidates = candidates.map((candidate) =>
        candidate.id === candidateId
          ? { ...candidate, voteCount: candidate.voteCount + 1 }
          : candidate
      );
      setCandidates(updatedCandidates);

      setHasVoted(true);
      setVoteSuccess(true);
      onVoteSuccess?.();

      // Hide success message after 3 seconds
      setTimeout(() => setVoteSuccess(false), 3000);
    } catch (err) {
      setError("Failed to submit vote");
    } finally {
      setIsVoting(false);
    }
  };

  const totalVotes = candidates.reduce(
    (sum, candidate) => sum + candidate.voteCount,
    0
  );

  const getVotePercentage = (voteCount: number) => {
    if (totalVotes === 0) return 0;
    return Math.round((voteCount / totalVotes) * 100);
  };

  const getLeadingCandidate = () => {
    if (candidates.length === 0) return null;
    return candidates.reduce((leading, current) =>
      current.voteCount > leading.voteCount ? current : leading
    );
  };

  const leadingCandidate = getLeadingCandidate();

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{poll.title}</CardTitle>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{totalVotes} votes</span>
              </div>
              <div className="flex items-center gap-1">
                <Vote className="w-4 h-4" />
                <span>{candidates.length} candidates</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant={poll.isActive ? "default" : "secondary"}>
              {poll.isActive ? "Active" : "Closed"}
            </Badge>
            {!poll.isActive && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>Poll Ended</span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Success Message */}
        {voteSuccess && (
          <Alert className="border-green-200 bg-green-50 text-green-800">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Your vote has been recorded successfully!
            </AlertDescription>
          </Alert>
        )}

        {/* Error Message */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-2 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          /* Candidates List */
          <div className="space-y-3">
            {candidates.map((candidate) => {
              const percentage = getVotePercentage(candidate.voteCount);
              const isLeading =
                leadingCandidate?.id === candidate.id && totalVotes > 0;

              return (
                <div key={candidate.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{candidate.name}</span>
                      {isLeading && totalVotes > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          Leading
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">
                        {candidate.voteCount} votes ({percentage}%)
                      </span>
                      {poll.isActive && !hasVoted && (
                        <Button
                          size="sm"
                          onClick={() => handleVote(candidate.id)}
                          disabled={isVoting}
                          className="min-w-[60px]"
                        >
                          {isVoting ? "..." : "Vote"}
                        </Button>
                      )}
                    </div>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </div>
        )}

        {/* Voting Status */}
        {hasVoted && poll.isActive && (
          <Alert className="border-blue-200 bg-blue-50 text-blue-800">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              You have already voted in this poll
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
