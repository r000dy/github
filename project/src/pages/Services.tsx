import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  FileText,
  Users,
  Building,
  CreditCard,
  FileCheck,
  Lock,
  Search,
  ArrowRight,
  HelpCircle,
  ChevronRight,
  ShieldCheck
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Services = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

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
      icon: <FileText className="h-6 w-6 text-primary" />,
      title: "Service Information",
      description: "Browse available government services, requirements, and download necessary forms.",
      category: "Public"
    },
    {
      icon: <Users className="h-6 w-6 text-primary" />,
      title: "Public Records",
      description: "Access public government records, meeting minutes, and official publications.",
      category: "Public"
    },
    {
      icon: <Building className="h-6 w-6 text-primary" />,
      title: "Office Locations",
      description: "Find government offices, service centers, and operating hours near you.",
      category: "Public"
    },
  ];

  const secureServices = [
    {
      icon: <FileCheck className="h-6 w-6 text-accent" />,
      title: "Certificate Requests",
      description: "Request birth certificates, marriage certificates, and other official documents securely.",
      serviceType: "certificate",
      category: "Secure"
    },
    {
      icon: <CreditCard className="h-6 w-6 text-accent" />,
      title: "License Applications",
      description: "Apply for or renew business licenses, permits, and professional registrations.",
      serviceType: "license",
      category: "Secure"
    },
    {
      icon: <FileText className="h-6 w-6 text-accent" />,
      title: "Document Tracking",
      description: "Track your submitted documents and application status in real-time.",
      serviceType: "tracking",
      category: "Secure"
    },
  ];

  const allServices = [...publicServices, ...secureServices];

  const filteredServices = allServices.filter(service =>
    service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPublic = filteredServices.filter(s => s.category === "Public");
  const filteredSecure = filteredServices.filter(s => s.category === "Secure");

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden bg-primary text-primary-foreground">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10" />
        <div className="container mx-auto relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Government Services Portal</h1>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Access public information and secure government services in one unified platform
          </p>

          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="text"
              placeholder="Search for services (e.g., 'license', 'records')..."
              className="pl-10 h-12 bg-background text-foreground shadow-lg border-0"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Public Services */}
        {filteredPublic.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Public Services</h2>
                <p className="text-muted-foreground text-sm">Open access information and resources</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {filteredPublic.map((service, index) => (
                <Card key={index} className="hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 group">
                  <CardHeader>
                    <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      {service.icon}
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors">{service.title}</CardTitle>
                    <CardDescription className="text-base">{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="ghost" className="w-full justify-between group-hover:bg-primary/5">
                      Learn More
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Secure Services */}
        {filteredSecure.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-accent/10 rounded-lg">
                <ShieldCheck className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Secure Services</h2>
                <p className="text-muted-foreground text-sm">Authentication required for access</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {filteredSecure.map((service, index) => (
                <Card key={index} className="hover:shadow-xl transition-all duration-300 border-2 hover:border-accent/50 group">
                  <CardHeader>
                    <div className="bg-accent/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      {service.icon}
                    </div>
                    <CardTitle className="group-hover:text-accent transition-colors">{service.title}</CardTitle>
                    <CardDescription className="text-base">{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={() => handleSecureServiceClick((service as any).serviceType)}
                      className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                    >
                      {user ? "Access Service" : "Login to Access"}
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* No Results State */}
        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No services found</h3>
            <p className="text-muted-foreground">Try adjusting your search terms</p>
          </div>
        )}

        {/* Authentication CTA */}
        {!user && (
          <div className="mt-8 p-8 bg-gradient-to-r from-accent/10 to-primary/10 rounded-2xl border-2 border-accent/20 text-center relative overflow-hidden">
            <div className="relative z-10">
              <Lock className="h-10 w-10 text-accent mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-3">Secure Access Required</h3>
              <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                To access personalized government services, track applications, and manage your documents, please log in to your verified account.
              </p>
              <div className="flex justify-center gap-4">
                <Button asChild size="lg" className="shadow-lg">
                  <Link to="/auth">Login / Sign Up</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/contact">Contact Support</Link>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* FAQ Section */}
        <section className="mt-20 max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">Common questions about our services and processes</p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>How do I create a verified account?</AccordionTrigger>
              <AccordionContent>
                To create a verified account, click on the "Sign Up" button and provide your personal details. You'll need to verify your email address and provide identification documents for full access to secure services.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>What documents do I need for a birth certificate?</AccordionTrigger>
              <AccordionContent>
                Generally, you'll need a valid government-issued ID, proof of relationship (if requesting for someone else), and the appropriate fee. Specific requirements may vary by jurisdiction.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>How long does it take to process a request?</AccordionTrigger>
              <AccordionContent>
                Processing times vary by service. Digital certificates are often available immediately after approval, while physical documents may take 5-10 business days. You can track your request status in the dashboard.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>Is my personal information secure?</AccordionTrigger>
              <AccordionContent>
                Yes, we use bank-level encryption (256-bit SSL) to protect your data. We comply with all government data protection regulations and ISO 27001 standards.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </div>
    </div>
  );
};

export default Services;