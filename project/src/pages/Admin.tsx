import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Shield, Users, FileText, MessageSquare, Check, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ServiceRequest {
  id: string;
  reference_number: string;
  service_type: string;
  description: string;
  status: string;
  created_at: string;
  user_id: string;
  admin_notes: string | null;
  profiles?: {
    full_name: string;
    email: string;
  };
}

interface Feedback {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [reviewDialog, setReviewDialog] = useState(false);
  const [reviewData, setReviewData] = useState({
    status: "",
    adminNotes: "",
    documentUrl: "",
  });

  // Announcement form
  const [announcementForm, setAnnouncementForm] = useState({
    title: "",
    content: "",
    priority: "normal",
  });

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .single();

      if (!roleData) {
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges",
          variant: "destructive",
        });
        navigate("/dashboard");
        return;
      }

      fetchData();
    } catch (error) {
      console.error("Error checking admin access:", error);
      navigate("/dashboard");
    }
  };

  const fetchData = async () => {
    try {
      const [requestsRes, feedbacksRes] = await Promise.all([
        supabase
          .from("service_requests")
          .select(`
            *,
            profiles:user_id (
              full_name,
              email
            )
          `)
          .order("created_at", { ascending: false }),
        supabase
          .from("feedback")
          .select("*")
          .order("created_at", { ascending: false }),
      ]);

      if (requestsRes.data) setRequests(requestsRes.data as any);
      if (feedbacksRes.data) setFeedbacks(feedbacksRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewRequest = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setReviewData({
      status: request.status,
      adminNotes: request.admin_notes || "",
      documentUrl: "",
    });
    setReviewDialog(true);
  };

  const submitReview = async () => {
    if (!selectedRequest) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const { error } = await supabase
        .from("service_requests")
        .update({
          status: reviewData.status,
          admin_notes: reviewData.adminNotes,
          document_url: reviewData.documentUrl || null,
          reviewed_by: session?.user.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", selectedRequest.id);

      if (error) throw error;

      toast({
        title: "Request Updated",
        description: "The service request has been reviewed successfully",
      });

      setReviewDialog(false);
      fetchData();
    } catch (error: any) {
      console.error("Error updating request:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const createAnnouncement = async () => {
    try {
      const { error } = await supabase.from("announcements").insert({
        title: announcementForm.title,
        content: announcementForm.content,
        priority: announcementForm.priority,
        published: true,
      });

      if (error) throw error;

      toast({
        title: "Announcement Created",
        description: "The announcement has been published successfully",
      });

      setAnnouncementForm({
        title: "",
        content: "",
        priority: "normal",
      });
    } catch (error: any) {
      console.error("Error creating announcement:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateFeedbackStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from("feedback")
        .update({ status })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: "Feedback status has been updated",
      });

      fetchData();
    } catch (error: any) {
      console.error("Error updating feedback:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
        <Navigation />
        <div className="container mx-auto px-4 py-16 text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{requests.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
              <FileText className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {requests.filter((r) => r.status === "pending").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">New Feedback</CardTitle>
              <MessageSquare className="h-4 w-4 text-info" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {feedbacks.filter((f) => f.status === "new").length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="requests" className="space-y-4">
          <TabsList>
            <TabsTrigger value="requests">Service Requests</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
            <TabsTrigger value="announcements">Announcements</TabsTrigger>
          </TabsList>

          <TabsContent value="requests" className="space-y-4">
            {requests.map((request) => (
              <Card key={request.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-lg capitalize">
                          {request.service_type.replace("-", " ")}
                        </CardTitle>
                        <Badge variant={
                          request.status === "pending" ? "secondary" :
                          request.status === "approved" ? "default" : "destructive"
                        }>
                          {request.status}
                        </Badge>
                      </div>
                      <CardDescription>
                        Ref: {request.reference_number} • 
                        User: {request.profiles?.full_name} ({request.profiles?.email}) •
                        {new Date(request.created_at).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Button onClick={() => handleReviewRequest(request)} size="sm">
                      Review
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-2">{request.description}</p>
                  {request.admin_notes && (
                    <div className="bg-muted p-2 rounded text-sm">
                      <strong>Admin Notes:</strong> {request.admin_notes}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="feedback" className="space-y-4">
            {feedbacks.map((feedback) => (
              <Card key={feedback.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{feedback.subject}</CardTitle>
                      <CardDescription>
                        From: {feedback.name} ({feedback.email}) •
                        {new Date(feedback.created_at).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Badge variant={
                      feedback.status === "new" ? "default" : "secondary"
                    }>
                      {feedback.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-3">{feedback.message}</p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateFeedbackStatus(feedback.id, "reviewed")}
                    >
                      Mark Reviewed
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateFeedbackStatus(feedback.id, "responded")}
                    >
                      Mark Responded
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="announcements">
            <Card>
              <CardHeader>
                <CardTitle>Create New Announcement</CardTitle>
                <CardDescription>
                  Publish announcements that will be visible on the homepage
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={announcementForm.title}
                    onChange={(e) =>
                      setAnnouncementForm({ ...announcementForm, title: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    rows={4}
                    value={announcementForm.content}
                    onChange={(e) =>
                      setAnnouncementForm({ ...announcementForm, content: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={announcementForm.priority}
                    onValueChange={(value) =>
                      setAnnouncementForm({ ...announcementForm, priority: value })
                    }
                  >
                    <SelectTrigger id="priority">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={createAnnouncement} className="w-full">
                  Publish Announcement
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={reviewDialog} onOpenChange={setReviewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Service Request</DialogTitle>
            <DialogDescription>
              Update the status and provide feedback for this request
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm"><strong>User:</strong> {selectedRequest.profiles?.full_name}</p>
                <p className="text-sm"><strong>Service:</strong> {selectedRequest.service_type}</p>
                <p className="text-sm"><strong>Description:</strong> {selectedRequest.description}</p>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={reviewData.status}
                  onValueChange={(value) =>
                    setReviewData({ ...reviewData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Admin Notes</Label>
                <Textarea
                  value={reviewData.adminNotes}
                  onChange={(e) =>
                    setReviewData({ ...reviewData, adminNotes: e.target.value })
                  }
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Document URL (optional)</Label>
                <Input
                  type="url"
                  placeholder="https://..."
                  value={reviewData.documentUrl}
                  onChange={(e) =>
                    setReviewData({ ...reviewData, documentUrl: e.target.value })
                  }
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewDialog(false)}>
              Cancel
            </Button>
            <Button onClick={submitReview}>
              Submit Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;