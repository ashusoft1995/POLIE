"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  AlertCircle, 
  Car, 
  UserX, 
  Award, 
  Search,
  ArrowRight 
} from "lucide-react";
import Link from "next/link";

export default function CitizenDashboard() {
  const services = [
    {
      title: "Report Crime",
      description: "Report criminal activities, theft, assault, or suspicious behavior",
      icon: AlertCircle,
      href: "/citizen/report",
      color: "text-red-600",
      bgColor: "bg-red-50",
      available: true
    },
    {
      title: "Traffic Incidents",
      description: "Report traffic accidents, violations, or road safety concerns",
      icon: Car,
      href: "/citizen/traffic",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      available: true
    },
    {
      title: "Missing Person",
      description: "Report missing persons or provide information about missing cases",
      icon: UserX,
      href: "/citizen/missing",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      available: true
    },
    {
      title: "Nominate Officer",
      description: "Nominate exceptional police officers for recognition",
      icon: Award,
      href: "/citizen/nomination",
      color: "text-green-600",
      bgColor: "bg-green-50",
      available: false
    },
    {
      title: "Track Report",
      description: "Check the status of your submitted reports",
      icon: Search,
      href: "/citizen/track",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      available: false
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Citizen Services</h1>
        <p className="text-muted-foreground mt-2">
          Report incidents, access services, and connect with Hossana Police
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <Card key={service.title} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg ${service.bgColor} flex items-center justify-center mb-3`}>
                  <Icon className={`h-6 w-6 ${service.color}`} />
                </div>
                <CardTitle className="flex items-center justify-between">
                  {service.title}
                  {!service.available && (
                    <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-1 rounded">
                      Coming Soon
                    </span>
                  )}
                </CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {service.available ? (
                  <Link href={service.href}>
                    <Button className="w-full" variant="outline">
                      Access Service
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                ) : (
                  <Button className="w-full" variant="outline" disabled>
                    Coming Soon
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Emergency Contact</CardTitle>
          <CardDescription className="text-blue-700">
            For immediate emergencies, please call: <strong className="text-xl">911</strong>
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
