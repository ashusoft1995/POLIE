"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";

export default function CrimeReportPage() {
  const [formData, setFormData] = useState({
    reporterName: "",
    reporterPhone: "",
    reporterEmail: "",
    reporterAddress: "",
    crimeType: "",
    description: "",
    incidentLocation: "",
    incidentDate: "",
    suspectDescription: "",
    isUrgent: false
  });
  
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [caseNumber, setCaseNumber] = useState("");
  const [error, setError] = useState("");

  const crimeTypes = [
    "THEFT",
    "ASSAULT",
    "FRAUD",
    "BURGLARY",
    "DOMESTIC_VIOLENCE",
    "CYBERCRIME",
    "OTHER"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8080/api/crime-reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        setCaseNumber(result.data.caseNumber);
        setSubmitted(true);
      } else {
        setError(result.message || "Failed to submit report");
      }
    } catch (err) {
      setError("Failed to connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
              <div>
                <CardTitle className="text-green-900">Report Submitted Successfully</CardTitle>
                <CardDescription className="text-green-700">
                  Your crime report has been received by Hossana Police
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Case Number</p>
              <p className="text-2xl font-bold text-green-900">{caseNumber}</p>
              <p className="text-sm text-green-700 mt-2">
                Please save this case number for your records. You can use it to track your report status.
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/citizen">
                <Button variant="outline">Back to Services</Button>
              </Link>
              <Button onClick={() => {
                setSubmitted(false);
                setFormData({
                  reporterName: "",
                  reporterPhone: "",
                  reporterEmail: "",
                  reporterAddress: "",
                  crimeType: "",
                  description: "",
                  incidentLocation: "",
                  incidentDate: "",
                  suspectDescription: "",
                  isUrgent: false
                });
              }}>
                Submit Another Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Report Crime</h1>
        <p className="text-muted-foreground mt-2">
          Submit a detailed crime report to Hossana Police Department
        </p>
      </div>

      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-900">
              <AlertCircle className="h-5 w-5" />
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Reporter Information</CardTitle>
            <CardDescription>Your contact details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reporterName">Full Name *</Label>
                <Input
                  id="reporterName"
                  required
                  value={formData.reporterName}
                  onChange={(e) => setFormData({ ...formData, reporterName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reporterPhone">Phone Number *</Label>
                <Input
                  id="reporterPhone"
                  required
                  type="tel"
                  placeholder="09XXXXXXXX"
                  value={formData.reporterPhone}
                  onChange={(e) => setFormData({ ...formData, reporterPhone: e.target.value })}
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reporterEmail">Email (Optional)</Label>
                <Input
                  id="reporterEmail"
                  type="email"
                  value={formData.reporterEmail}
                  onChange={(e) => setFormData({ ...formData, reporterEmail: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reporterAddress">Address *</Label>
                <Input
                  id="reporterAddress"
                  required
                  value={formData.reporterAddress}
                  onChange={(e) => setFormData({ ...formData, reporterAddress: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Incident Details</CardTitle>
            <CardDescription>Details about the crime</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="crimeType">Crime Type *</Label>
                <Select value={formData.crimeType} onValueChange={(value) => setFormData({ ...formData, crimeType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select crime type" />
                  </SelectTrigger>
                  <SelectContent>
                    {crimeTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.replace(/_/g, " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="incidentDate">Incident Date & Time *</Label>
                <Input
                  id="incidentDate"
                  required
                  type="datetime-local"
                  value={formData.incidentDate}
                  onChange={(e) => setFormData({ ...formData, incidentDate: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="incidentLocation">Incident Location *</Label>
              <Input
                id="incidentLocation"
                required
                placeholder="Where did the incident occur?"
                value={formData.incidentLocation}
                onChange={(e) => setFormData({ ...formData, incidentLocation: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                required
                rows={6}
                placeholder="Provide detailed description of what happened..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="suspectDescription">Suspect Description (Optional)</Label>
              <Textarea
                id="suspectDescription"
                rows={3}
                placeholder="Physical description, clothing, distinguishing features..."
                value={formData.suspectDescription}
                onChange={(e) => setFormData({ ...formData, suspectDescription: e.target.value })}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isUrgent"
                checked={formData.isUrgent}
                onChange={(e) => setFormData({ ...formData, isUrgent: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="isUrgent" className="font-normal cursor-pointer">
                Mark as urgent (requires immediate attention)
              </Label>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3 justify-end">
          <Link href="/citizen">
            <Button type="button" variant="outline">Cancel</Button>
          </Link>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Report
          </Button>
        </div>
      </form>
    </div>
  );
}
