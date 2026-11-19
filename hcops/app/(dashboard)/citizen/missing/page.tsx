"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, CheckCircle2, Loader2, UserX } from "lucide-react";
import Link from "next/link";

export default function MissingPersonPage() {
  const [formData, setFormData] = useState({
    reporterName: "",
    reporterPhone: "",
    reporterEmail: "",
    reporterRelationship: "",
    missingPersonName: "",
    missingPersonAge: "",
    gender: "",
    height: "",
    weight: "",
    physicalDescription: "",
    lastSeenWearing: "",
    lastSeenLocation: "",
    lastSeenDate: "",
    circumstances: "",
    medicalConditions: "",
    isCritical: false
  });
  
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [caseNumber, setCaseNumber] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8080/api/missing-persons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          missingPersonAge: parseInt(formData.missingPersonAge) || 0,
          height: formData.height ? parseFloat(formData.height) : null,
          weight: formData.weight ? parseFloat(formData.weight) : null
        })
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
                  Missing person report has been received by authorities
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Case Number</p>
              <p className="text-2xl font-bold text-green-900">{caseNumber}</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-amber-900 mb-2">⚠️ Important Notice</p>
              <p className="text-sm text-amber-800">
                If this is a critical or urgent case, please also contact the emergency hotline: <strong>911</strong>
              </p>
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
          <UserX className="h-8 w-8 text-orange-600" />
          <h1 className="text-3xl font-bold">Report Missing Person</h1>
        </div>
        <p className="text-muted-foreground">
          Submit detailed information about the missing person
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
                <Label htmlFor="reporterName">Your Full Name *</Label>
                <Input id="reporterName" required value={formData.reporterName}
                  onChange={(e) => setFormData({ ...formData, reporterName: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reporterPhone">Your Phone *</Label>
                <Input id="reporterPhone" required type="tel" value={formData.reporterPhone}
                  onChange={(e) => setFormData({ ...formData, reporterPhone: e.target.value })} />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reporterEmail">Your Email (Optional)</Label>
                <Input id="reporterEmail" type="email" value={formData.reporterEmail}
                  onChange={(e) => setFormData({ ...formData, reporterEmail: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reporterRelationship">Relationship to Missing Person *</Label>
                <Input id="reporterRelationship" required placeholder="e.g., Parent, Spouse, Friend"
                  value={formData.reporterRelationship}
                  onChange={(e) => setFormData({ ...formData, reporterRelationship: e.target.value })} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Missing Person Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="missingPersonName">Full Name *</Label>
                <Input id="missingPersonName" required value={formData.missingPersonName}
                  onChange={(e) => setFormData({ ...formData, missingPersonName: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="missingPersonAge">Age *</Label>
                <Input id="missingPersonAge" required type="number" min="0" value={formData.missingPersonAge}
                  onChange={(e) => setFormData({ ...formData, missingPersonAge: e.target.value })} />
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
                <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input id="height" type="number" placeholder="170" value={formData.height}
                  onChange={(e) => setFormData({ ...formData, height: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input id="weight" type="number" placeholder="65" value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="physicalDescription">Physical Description *</Label>
              <Textarea id="physicalDescription" required rows={3}
                placeholder="Hair color, eye color, skin tone, distinguishing features..."
                value={formData.physicalDescription}
                onChange={(e) => setFormData({ ...formData, physicalDescription: e.target.value })} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Last Seen Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lastSeenLocation">Location *</Label>
                <Input id="lastSeenLocation" required value={formData.lastSeenLocation}
                  onChange={(e) => setFormData({ ...formData, lastSeenLocation: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastSeenDate">Date & Time *</Label>
                <Input id="lastSeenDate" required type="datetime-local" value={formData.lastSeenDate}
                  onChange={(e) => setFormData({ ...formData, lastSeenDate: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastSeenWearing">Clothing Description *</Label>
              <Textarea id="lastSeenWearing" required rows={2}
                placeholder="What was the person wearing when last seen?"
                value={formData.lastSeenWearing}
                onChange={(e) => setFormData({ ...formData, lastSeenWearing: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="circumstances">Circumstances *</Label>
              <Textarea id="circumstances" required rows={4}
                placeholder="Describe the circumstances of the disappearance..."
                value={formData.circumstances}
                onChange={(e) => setFormData({ ...formData, circumstances: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="medicalConditions">Medical Conditions (if any)</Label>
              <Textarea id="medicalConditions" rows={2}
                placeholder="Any medical conditions, medications, or special needs..."
                value={formData.medicalConditions}
                onChange={(e) => setFormData({ ...formData, medicalConditions: e.target.value })} />
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="isCritical" checked={formData.isCritical}
                onChange={(e) => setFormData({ ...formData, isCritical: e.target.checked })}
                className="rounded" />
              <Label htmlFor="isCritical" className="font-normal cursor-pointer">
                Mark as critical (vulnerable person, medical emergency, etc.)
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
