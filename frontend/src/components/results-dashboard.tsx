"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import {
  BarChart3,
  Users,
  Vote,
  TrendingUp,
  Clock,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface Candidate {
  id: number;
  name: string;
  voteCount: number;
}

interface PollWithCandidates {
  id: number;
  title: string;
  isActive: boolean;
  candidates: Candidate[];
  totalVotes: number;
}

const mockPollsData: PollWithCandidates[] = [
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
      { id: 1, name: "MongoDB", voteCount: 28 },
      { id: 2, name: "MySQL", voteCount: 27 },
    ],
  },
  {
    id: 4,
    title: "Preferred Cloud Platform",
    isActive: true,
    totalVotes: 134,
    candidates: [
      { id: 0, name: "AWS", voteCount: 67 },
      { id: 1, name: "Vercel", voteCount: 45 },
      { id: 2, name: "Azure", voteCount: 22 },
    ],
  },
];

export function ResultsDashboard() {
  const [polls, setPolls] = useState<PollWithCandidates[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPollsWithCandidates = async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      // Simulate loading delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setPolls(mockPollsData);
    } catch (err) {
      setError("Failed to load dashboard data");
      console.error("Error loading dashboard:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadPollsWithCandidates();
  }, []);

  const handleRefresh = () => {
    loadPollsWithCandidates(true);
  };

  const handleClosePoll = async (pollId: number) => {
    try {
      // Simulate closing poll
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Update poll status locally
      setPolls((prevPolls) =>
        prevPolls.map((poll) =>
          poll.id === pollId ? { ...poll, isActive: false } : poll
        )
      );
    } catch (err) {
      setError("Failed to close poll");
    }
  };

  // Calculate statistics
  const totalPolls = polls.length;
  const activePolls = polls.filter((poll) => poll.isActive).length;
  const closedPolls = polls.filter((poll) => !poll.isActive).length;
  const totalVotes = polls.reduce((sum, poll) => sum + poll.totalVotes, 0);

  // Prepare chart data
  const pollVotesData = polls.slice(0, 5).map((poll) => ({
    name:
      poll.title.length > 20 ? poll.title.substring(0, 20) + "..." : poll.title,
    votes: poll.totalVotes,
    pollId: poll.id,
  }));

  const statusData = [
    { name: "Active", value: activePolls, color: "hsl(var(--chart-1))" },
    { name: "Closed", value: closedPolls, color: "hsl(var(--chart-2))" },
  ];

  if (isLoading) {
    return (
      <div className="w-full max-w-6xl space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Results Dashboard</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-8 bg-muted rounded"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Results Dashboard</h2>
          <p className="text-muted-foreground">
            Analytics and insights from all polls
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

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Polls</CardTitle>
            <Vote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPolls}</div>
            <p className="text-xs text-muted-foreground">
              All time polls created
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Polls</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {activePolls}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently accepting votes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVotes}</div>
            <p className="text-xs text-muted-foreground">Across all polls</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Closed Polls</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{closedPolls}</div>
            <p className="text-xs text-muted-foreground">Voting completed</p>
          </CardContent>
        </Card>
      </div>

      {polls.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <BarChart3 className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Data Available</h3>
            <p className="text-muted-foreground">
              Create some polls to see analytics and results here!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Votes per Poll Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Votes per Poll
              </CardTitle>
              <CardDescription>
                Vote distribution across recent polls
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  votes: {
                    label: "Votes",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={pollVotesData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="votes" fill="var(--color-votes)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Poll Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Poll Status
              </CardTitle>
              <CardDescription>
                Distribution of active vs closed polls
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  active: {
                    label: "Active",
                    color: "hsl(var(--chart-1))",
                  },
                  closed: {
                    label: "Closed",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Poll Management */}
      {polls.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Poll Management
            </CardTitle>
            <CardDescription>Manage and close active polls</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {polls.map((poll) => (
                <div
                  key={poll.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <h4 className="font-medium">{poll.title}</h4>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span>{poll.totalVotes} votes</span>
                      <span>{poll.candidates.length} candidates</span>
                      <Badge variant={poll.isActive ? "default" : "secondary"}>
                        {poll.isActive ? "Active" : "Closed"}
                      </Badge>
                    </div>
                  </div>
                  {poll.isActive && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleClosePoll(poll.id)}
                      className="ml-4"
                    >
                      Close Poll
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
