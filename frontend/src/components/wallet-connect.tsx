"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Wallet } from "lucide-react";

interface WalletConnectInterface {
  connect: () => void;
}

export function WalletConnect({ connect }: WalletConnectInterface) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
          <Wallet className="w-6 h-6 text-primary" />
        </div>
        <CardTitle className="text-lg">Connect Your Wallet</CardTitle>
        <CardDescription>
          Connect your MetaMask wallet to participate in polls and create new
          ones
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={connect} className="w-full cursor-pointer" size="lg">
          Connect Wallet
        </Button>
      </CardContent>
    </Card>
  );
}
