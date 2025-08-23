"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, X, Vote, AlertCircle, CheckCircle } from "lucide-react";

export function CreatePollForm() {
  const [title, setTitle] = useState("");
  const [candidates, setCandidates] = useState(["", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const addCandidate = () => {
    if (candidates.length < 10) {
      setCandidates([...candidates, ""]);
    }
  };

  const removeCandidate = (index: number) => {
    if (candidates.length > 2) {
      setCandidates(candidates.filter((_, i) => i !== index));
    }
  };

  const updateCandidate = (index: number, value: string) => {
    const updated = [...candidates];
    updated[index] = value;
    setCandidates(updated);
  };

  const validateForm = () => {
    if (!title.trim()) {
      setFormError("Poll title is required");
      return false;
    }

    if (title.trim().length < 3) {
      setFormError("Poll title must be at least 3 characters long");
      return false;
    }

    const validCandidates = candidates.filter((c) => c.trim());
    if (validCandidates.length < 2) {
      setFormError("At least 2 candidates are required");
      return false;
    }

    const uniqueCandidates = new Set(
      validCandidates.map((c) => c.trim().toLowerCase())
    );
    if (uniqueCandidates.size !== validCandidates.length) {
      setFormError("All candidates must have unique names");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSuccess(false);

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Reset form on success
      setTitle("");
      setCandidates(["", ""]);
      setSuccess(true);

      // Hide success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setFormError("Failed to create poll. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Vote className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">Create New Poll</CardTitle>
            <CardDescription>
              Set up a new poll with multiple candidates for voting
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Success Message */}
          {success && (
            <Alert className="border-green-200 bg-green-50 text-green-800">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Poll created successfully! It's now live for voting.
              </AlertDescription>
            </Alert>
          )}

          {/* Error Messages */}
          {formError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          )}

          {/* Poll Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Poll Title
            </Label>
            <Input
              id="title"
              placeholder="Enter your poll question or title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full"
              maxLength={200}
            />
            <p className="text-xs text-muted-foreground">
              {title.length}/200 characters
            </p>
          </div>

          {/* Candidates */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Candidates</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addCandidate}
                disabled={candidates.length >= 10}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Candidate
              </Button>
            </div>

            <div className="space-y-3">
              {candidates.map((candidate, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-1">
                    <Input
                      placeholder={`Candidate ${index + 1} name`}
                      value={candidate}
                      onChange={(e) => updateCandidate(index, e.target.value)}
                      maxLength={100}
                    />
                  </div>
                  {candidates.length > 2 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeCandidate(index)}
                      className="flex-shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <p className="text-xs text-muted-foreground">
              Add 2-10 candidates. Each candidate must have a unique name.
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full"
              size="lg"
            >
              {isSubmitting ? "Creating Poll..." : "Create Poll"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
