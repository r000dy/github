import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Users, Building, CreditCard, FileCheck, Lock } from "lucide-react";

const Services = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
  }, []);

  const handleSecureServiceClick = (service: string) => {
    if (!user) {
      navigate("/auth");
    } else {
      navigate("/request", { state: { serviceType: service } });
    }
  };

  const publicServices = [
    {
      icon: <FileText className="h-8 w-8 text-primary" />,
      title: "Service Information",
      description: "Browse available government services and requirements",
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Public Records",
      description: "Access public government records and information",
    },
    {
      icon: <Building className="h-8 w-8 text-primary" />,
      title: "Office Locations",
      description: "Find government offices and service centers near you",
    },
  ];

  const secureServices = [
    {
      icon: <FileCheck className="h-8 w-8 text-accent" />,
      title: "Certificate Requests",
      description: "Request birth certificates, marriage certificates, and other official documents",
      serviceType: "certificate",
    },
    {
      icon: <CreditCard className="h-8 w-8 text-accent" />,
      title: "License Applications",
      description: "Apply for business licenses, permits, and registrations",
      serviceType: "license",
    },
    {
      icon: <FileText className="h-8 w-8 text-accent" />,
      title: "Document Tracking",
      description: "Track your submitted documents and application status",
      serviceType: "tracking",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Government Services</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Access both public information services and secure authenticated services
          </p>
        </div>

        {/* Public Services */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-primary rounded-full" />
            <h2 className="text-3xl font-bold">Public Services</h2>
            <span className="text-sm text-muted-foreground">(No login required)</span>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {publicServices.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow border-2">
                <CardHeader>
                  <div className="bg-primary/10 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                    {service.icon}
                  </div>
                  <CardTitle>{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Secure Services */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-accent rounded-full" />
            <h2 className="text-3xl font-bold">Secure Services</h2>
            <Lock className="h-5 w-5 text-accent" />
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {secureServices.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow border-2 border-accent/20">
                <CardHeader>
                  <div className="bg-accent/10 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                    {service.icon}
                  </div>
                  <CardTitle>{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => handleSecureServiceClick(service.serviceType)}
                    className="w-full"
                  >
                    {user ? "Access Service" : "Login to Access"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {!user && (
            <div className="mt-8 p-6 bg-accent/10 rounded-lg border-2 border-accent/20 text-center">
              <Lock className="h-8 w-8 text-accent mx-auto mb-3" />
              <p className="font-semibold mb-2">Secure services require authentication</p>
              <p className="text-sm text-muted-foreground mb-4">
                Login or create an account to access secure government services
              </p>
              <Button asChild>
                <Link to="/auth">Login / Sign Up</Link>
              </Button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Services;