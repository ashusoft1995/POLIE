"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TrackReportPage() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card className="border-amber-200 bg-amber-50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Construction className="h-8 w-8 text-amber-600" />
            <div>
              <CardTitle className="text-amber-900">Coming Soon</CardTitle>
              <p className="text-sm text-amber-700 mt-2">
                Report tracking feature is under development
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Link href="/citizen">
            <Button variant="outline" className="w-full">
              Back to Services
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
