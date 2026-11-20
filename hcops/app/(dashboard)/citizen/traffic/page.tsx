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

export default function TrafficReportPage() {
  const [formData, setFormData] = useState({
    reporterName: "",
    reporterPhone: "",
    reporterEmail: "",
    incidentType: "",
    description: "",
    location: "",
    incidentDate: "",
    vehiclePlateNumber: "",
    vehicleType: "",
    vehicleColor: "",
    injuredCount: 0,
    fatalitiesCount: 0,
    policeNotified: false
  });
  
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [reportNumber, setReportNumber] = useState("");
  const [error, setError] = useState("");

  const incidentTypes = [
    "ACCIDENT",
    "TRAFFIC_VIOLATION",
    "ROAD_HAZARD",
    "DRUNK_DRIVING",
    "RECKLESS_DRIVING",
    "HIT_AND_RUN",
    "OTHER"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const response = await fetch(`${apiUrl}/api/traffic-reports`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        setReportNumber(result.data.reportNumber);
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
                  Your traffic report has been received
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Report Number</p>
              <p className="text-2xl font-bold text-green-900">{reportNumber}</p>
            </div>
            <div className="flex gap-3">
              <Link href="/citizen">
                <Button variant="outline">Back to Services</Button>
              </Link>
              <Button onClick={() => setSubmitted(false)}>
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
        <h1 className="text-3xl font-bold">Report Traffic Incident</h1>
        <p className="text-muted-foreground mt-2">
          Submit details about traffic accidents, violations, or road hazards
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
                  value={formData.reporterPhone}
                  onChange={(e) => setFormData({ ...formData, reporterPhone: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reporterEmail">Email (Optional)</Label>
              <Input
                id="reporterEmail"
                type="email"
                value={formData.reporterEmail}
                onChange={(e) => setFormData({ ...formData, reporterEmail: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Incident Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="incidentType">Incident Type *</Label>
                <Select value={formData.incidentType} onValueChange={(value) => setFormData({ ...formData, incidentType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {incidentTypes.map((type) => (
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
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                required
                rows={5}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vehicle Information (if applicable)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vehiclePlateNumber">Plate Number</Label>
                <Input
                  id="vehiclePlateNumber"
                  value={formData.vehiclePlateNumber}
                  onChange={(e) => setFormData({ ...formData, vehiclePlateNumber: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicleType">Vehicle Type</Label>
                <Input
                  id="vehicleType"
                  value={formData.vehicleType}
                  onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicleColor">Color</Label>
                <Input
                  id="vehicleColor"
                  value={formData.vehicleColor}
                  onChange={(e) => setFormData({ ...formData, vehicleColor: e.target.value })}
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="injuredCount">Number of Injured</Label>
                <Input
                  id="injuredCount"
                  type="number"
                  min="0"
                  value={formData.injuredCount}
                  onChange={(e) => setFormData({ ...formData, injuredCount: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fatalitiesCount">Number of Fatalities</Label>
                <Input
                  id="fatalitiesCount"
                  type="number"
                  min="0"
                  value={formData.fatalitiesCount}
                  onChange={(e) => setFormData({ ...formData, fatalitiesCount: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="policeNotified"
                checked={formData.policeNotified}
                onChange={(e) => setFormData({ ...formData, policeNotified: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="policeNotified" className="font-normal cursor-pointer">
                Police already notified at scene
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
