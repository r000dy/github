import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  ArrowRight,
  FileText,
  Users,
  Shield,
  Bell,
  Megaphone,
  CheckCircle2,
  Clock,
  TrendingUp,
  Award,
  Lock,
  Zap,
  Globe,
  HeadphonesIcon
} from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: string;
  created_at: string;
}

const Index = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    const { data } = await supabase
      .from("announcements")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(3);

    if (data) setAnnouncements(data);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "destructive";
      case "high": return "warning";
      case "normal": return "info";
      default: return "secondary";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent pointer-events-none" />
        <div className="container mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary/10 border border-primary/20 rounded-full mb-8 hover:bg-primary/15 transition-colors">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-primary">Certified Government Services Platform</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent leading-tight tracking-tight">
            Your Digital Government
            <br />
            <span className="text-4xl md:text-6xl">Portal</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
            Access secure government services, track your requests in real-time, and stay informed with official announcements—all in one trusted platform
          </p>

          <div className="flex gap-4 justify-center flex-wrap mb-12">
            <Button asChild size="lg" className="shadow-xl hover:shadow-2xl transition-all h-14 px-8 text-base">
              <Link to="/services">
                Browse Services
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-14 px-8 text-base border-2 hover:bg-accent/10">
              <Link to="/auth">Get Started Free</Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <span>ISO 27001 Certified</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-success" />
              <span>256-bit Encryption</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-success" />
              <span>Government Approved</span>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-primary to-accent">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center text-primary-foreground">
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold">50K+</div>
              <div className="text-sm md:text-base opacity-90">Active Users</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold">200K+</div>
              <div className="text-sm md:text-base opacity-90">Requests Processed</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold">99.9%</div>
              <div className="text-sm md:text-base opacity-90">Uptime</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold">24/7</div>
              <div className="text-sm md:text-base opacity-90">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Choose Our Platform</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience government services reimagined with cutting-edge technology and user-centric design
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-primary hover:shadow-xl transition-all duration-300 group">
              <CardContent className="pt-8 pb-6">
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Secure & Trusted</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Military-grade encryption and bank-level security protocols protect all your sensitive information with multi-layer authentication
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-accent hover:shadow-xl transition-all duration-300 group">
              <CardContent className="pt-8 pb-6">
                <div className="bg-gradient-to-br from-accent/10 to-accent/5 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Zap className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Lightning Fast</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Process requests in minutes, not days. Our optimized infrastructure ensures rapid response times for all services
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-success hover:shadow-xl transition-all duration-300 group">
              <CardContent className="pt-8 pb-6">
                <div className="bg-gradient-to-br from-success/10 to-success/5 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <FileText className="h-8 w-8 text-success" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Digital Documents</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Request, track, and download certificates, permits, and official documents instantly from anywhere
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary hover:shadow-xl transition-all duration-300 group">
              <CardContent className="pt-8 pb-6">
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Real-Time Tracking</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Monitor your request status with live updates and notifications at every step of the process
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-accent hover:shadow-xl transition-all duration-300 group">
              <CardContent className="pt-8 pb-6">
                <div className="bg-gradient-to-br from-accent/10 to-accent/5 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <HeadphonesIcon className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-2xl font-bold mb-3">24/7 Support</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Expert assistance available round the clock through multiple channels including chat, email, and phone
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-success hover:shadow-xl transition-all duration-300 group">
              <CardContent className="pt-8 pb-6">
                <div className="bg-gradient-to-br from-success/10 to-success/5 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Globe className="h-8 w-8 text-success" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Accessible Anywhere</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Access services from any device, anywhere in the world with our responsive, mobile-first platform
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Announcements Section */}
      {announcements.length > 0 && (
        <section className="py-20 px-4 bg-card/30">
          <div className="container mx-auto">
            <div className="flex items-center justify-center gap-3 mb-12">
              <Bell className="h-7 w-7 text-primary" />
              <h2 className="text-4xl font-bold">Latest Announcements</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {announcements.map((announcement) => (
                <Card key={announcement.id} className="hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <Megaphone className="h-5 w-5 text-primary" />
                      </div>
                      <Badge variant={getPriorityColor(announcement.priority) as any} className="text-xs">
                        {announcement.priority}
                      </Badge>
                    </div>
                    <h3 className="font-bold mb-3 text-xl">{announcement.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-4">
                      {announcement.content}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      {new Date(announcement.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Social Proof Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Trusted by Citizens Nationwide</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of satisfied users who have simplified their government interactions
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Award key={i} className="h-5 w-5 fill-warning text-warning" />
                  ))}
                </div>
                <p className="text-muted-foreground italic mb-4">
                  "The most efficient government portal I've ever used. Saved me hours of waiting in lines!"
                </p>
                <div className="font-semibold">Sarah Johnson</div>
                <div className="text-sm text-muted-foreground">Business Owner</div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Award key={i} className="h-5 w-5 fill-warning text-warning" />
                  ))}
                </div>
                <p className="text-muted-foreground italic mb-4">
                  "Incredibly secure and user-friendly. I can track all my documents in one place."
                </p>
                <div className="font-semibold">Michael Chen</div>
                <div className="text-sm text-muted-foreground">Software Engineer</div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Award key={i} className="h-5 w-5 fill-warning text-warning" />
                  ))}
                </div>
                <p className="text-muted-foreground italic mb-4">
                  "Outstanding customer support and lightning-fast processing. Highly recommended!"
                </p>
                <div className="font-semibold">Emily Rodriguez</div>
                <div className="text-sm text-muted-foreground">Healthcare Professional</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-r from-primary via-accent to-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 pointer-events-none" />
        <div className="container mx-auto text-center text-primary-foreground relative z-10">
          <TrendingUp className="h-16 w-16 mx-auto mb-6 opacity-90" />
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Experience?
          </h2>
          <p className="text-lg md:text-xl mb-10 opacity-95 max-w-3xl mx-auto leading-relaxed">
            Join over 50,000 citizens already using our secure platform for seamless government service access. Get started in less than 2 minutes.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button asChild size="lg" variant="secondary" className="h-14 px-10 text-base shadow-xl hover:shadow-2xl">
              <Link to="/auth">Create Free Account</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-14 px-10 text-base border-2 border-white/30 text-white hover:bg-white/10">
              <Link to="/services">Explore Services</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold text-primary">GovPortal</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your trusted partner for secure and efficient government services.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/services" className="hover:text-primary transition-colors">All Services</Link></li>
                <li><Link to="/request" className="hover:text-primary transition-colors">Submit Request</Link></li>
                <li><Link to="/dashboard" className="hover:text-primary transition-colors">Track Status</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
                <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">FAQs</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Security</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-8 text-center">
            <p className="text-sm text-muted-foreground mb-2">
              © 2025 GovPortal. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground font-medium">
              Secure • Trusted • Transparent
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;