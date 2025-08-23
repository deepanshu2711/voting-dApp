"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Wallet, AlertCircle } from "lucide-react";
import { useWeb3 } from "@/hooks/use-web3";

export function WalletConnect() {
  const { isConnected, address, isLoading, error, connectWallet } = useWeb3();

  if (isConnected && address) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
            <Wallet className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-lg">Wallet Connected</CardTitle>
          <CardDescription>
            {address.slice(0, 6)}...{address.slice(-4)}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

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
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <Button
          onClick={connectWallet}
          disabled={isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? "Connecting..." : "Connect MetaMask"}
        </Button>
      </CardContent>
    </Card>
  );
}
