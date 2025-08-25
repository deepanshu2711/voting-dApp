"use client";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Plus, Vote, BarChart3 } from "lucide-react";
import { PollsList } from "@/components/polls-list";
import { CreatePollForm } from "@/components/create-poll-form";
import { ResultsDashboard } from "@/components/results-dashboard";
import { WalletConnect } from "@/components/wallet-connect";
import { useConnectWallet } from "@/hooks/useConnectWallet";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"polls" | "create" | "results">(
    "polls"
  );
  const { connect, address, provider } = useConnectWallet();
  const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Decentralized Voting Platform
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Create transparent, secure polls on the blockchain. Vote with
            confidence knowing every ballot is recorded immutably.
          </p>
        </div>

        {!address ? (
          <div className="flex items-center justify-center">
            <WalletConnect connect={connect} />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex justify-center">
              <div className="flex items-center gap-2 p-1 bg-muted rounded-lg">
                <Button
                  variant={activeTab === "polls" ? "default" : "ghost"}
                  onClick={() => setActiveTab("polls")}
                  className="flex items-center gap-2"
                >
                  <Vote className="w-4 h-4" />
                  View Polls
                </Button>
                <Button
                  variant={activeTab === "create" ? "default" : "ghost"}
                  onClick={() => setActiveTab("create")}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create Poll
                </Button>
                <Button
                  variant={activeTab === "results" ? "default" : "ghost"}
                  onClick={() => setActiveTab("results")}
                  className="flex items-center gap-2"
                >
                  <BarChart3 className="w-4 h-4" />
                  Results
                </Button>
              </div>
            </div>

            {provider && (
              <div className="flex justify-center">
                {activeTab === "polls" && (
                  <PollsList
                    CONTRACT_ADDRESS={CONTRACT_ADDRESS}
                    provider={provider}
                  />
                )}
                {activeTab === "create" && <CreatePollForm />}
                {activeTab === "results" && <ResultsDashboard />}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
