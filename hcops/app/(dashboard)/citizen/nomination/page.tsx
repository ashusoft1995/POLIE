"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, CheckCircle2, Loader2, Award } from "lucide-react";
import Link from "next/link";

export default function NominationPage() {
  const [formData, setFormData] = useState({
    nominatorName: "",
    nominatorPhone: "",
    nominatorEmail: "",
    officerName: "",
    officerBadgeNumber: "",
    department: "",
    category: "",
    reason: "",
    incidentDate: "",
    incidentLocation: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [nominationNumber, setNominationNumber] = useState("");
  const [error, setError] = useState("");

  const categories = [
    "BRAVERY",
    "PROFESSIONALISM",
    "COMMUNITY_SERVICE",
    "EXCEPTIONAL_DUTY",
    "LIFE_SAVING",
    "OTHER"
  ];

  const departments = [
    "DETECTIVE",
    "TRAFFIC",
    "PREVENTIVE",
    "HR",
    "ADMIN"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const response = await fetch(`${apiUrl}/api/nominations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        setNominationNumber(result.data.nominationNumber);
        setSubmitted(true);
      } else {
        setError(result.message || "Failed to submit nomination");
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
                <CardTitle className="text-green-900">Nomination Submitted Successfully</CardTitle>
                <CardDescription className="text-green-700">
                  Thank you for recognizing outstanding service
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Nomination Number</p>
              <p className="text-2xl font-bold text-green-900">{nominationNumber}</p>
            </div>
            <div className="flex gap-3">
              <Link href="/citizen">
                <Button variant="outline">Back to Services</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Award className="h-8 w-8 text-yellow-600" />
          <h1 className="text-3xl font-bold">Nominate Officer</h1>
        </div>
        <p className="text-muted-foreground">
          Recognize exceptional police officers for their outstanding service
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
            <CardTitle>Your Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nominatorName">Your Full Name *</Label>
                <Input id="nominatorName" required value={formData.nominatorName}
                  onChange={(e) => setFormData({ ...formData, nominatorName: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nominatorPhone">Your Phone *</Label>
                <Input id="nominatorPhone" required type="tel" value={formData.nominatorPhone}
                  onChange={(e) => setFormData({ ...formData, nominatorPhone: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="nominatorEmail">Your Email (Optional)</Label>
              <Input id="nominatorEmail" type="email" value={formData.nominatorEmail}
                onChange={(e) => setFormData({ ...formData, nominatorEmail: e.target.value })} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Officer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="officerName">Officer Name *</Label>
                <Input id="officerName" required placeholder="Officer's full name"
                  value={formData.officerName}
                  onChange={(e) => setFormData({ ...formData, officerName: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="officerBadgeNumber">Badge Number (if known)</Label>
                <Input id="officerBadgeNumber" placeholder="e.g., BADGE-001"
                  value={formData.officerBadgeNumber}
                  onChange={(e) => setFormData({ ...formData, officerBadgeNumber: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Select value={formData.department} onValueChange={(value) => setFormData({ ...formData, department: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Nomination Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="incidentDate">Date of Incident *</Label>
                <Input id="incidentDate" required type="datetime-local"
                  value={formData.incidentDate}
                  onChange={(e) => setFormData({ ...formData, incidentDate: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="incidentLocation">Location *</Label>
                <Input id="incidentLocation" required
                  value={formData.incidentLocation}
                  onChange={(e) => setFormData({ ...formData, incidentLocation: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Nomination *</Label>
              <Textarea id="reason" required rows={6}
                placeholder="Describe what the officer did and why they deserve recognition..."
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })} />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3 justify-end">
          <Link href="/citizen">
            <Button type="button" variant="outline">Cancel</Button>
          </Link>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Nomination
          </Button>
        </div>
      </form>
    </div>
  );
}
