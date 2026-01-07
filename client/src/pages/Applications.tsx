import { useApplications } from "@/hooks/use-applications";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, FileText, Clock, CheckCircle2, XCircle } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Applications() {
  const { user } = useAuth();
  const { data: applications, isLoading } = useApplications();

  if (!user) {
    return (
      <div className="text-center py-20 space-y-4">
        <h2 className="text-2xl font-bold">Please Login</h2>
        <p className="text-muted-foreground">You need to be logged in to view your applications.</p>
        <Link href="/api/login"><Button>Login</Button></Link>
      </div>
    );
  }

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold font-display">My Applications</h1>

      {applications?.length === 0 ? (
        <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed border-border">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-xl font-semibold">No Applications Yet</h3>
          <p className="text-muted-foreground mb-6">Start by browsing available schemes.</p>
          <Link href="/schemes"><Button>Browse Schemes</Button></Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {applications?.map((app) => (
            <div key={app.id} className="bg-card rounded-xl p-6 border border-border shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                  app.status === 'approved' ? 'bg-green-100 text-green-600' : 
                  app.status === 'rejected' ? 'bg-red-100 text-red-600' : 
                  'bg-yellow-100 text-yellow-600'
                }`}>
                  {app.status === 'approved' ? <CheckCircle2 className="h-6 w-6" /> : 
                   app.status === 'rejected' ? <XCircle className="h-6 w-6" /> : 
                   <Clock className="h-6 w-6" />}
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Application ID: #{app.id}</div>
                  <h3 className="font-semibold text-lg">Scheme Application</h3>
                  <div className="text-sm text-muted-foreground">Submitted on {app.submittedAt ? format(new Date(app.submittedAt), 'PPP') : 'Unknown'}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                 <div className="text-right">
                   <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Status</div>
                   <div className={`font-bold capitalize ${
                      app.status === 'approved' ? 'text-green-600' : 
                      app.status === 'rejected' ? 'text-red-600' : 
                      'text-yellow-600'
                    }`}>
                     {app.status}
                   </div>
                 </div>
                 <Button variant="outline" size="sm">View Details</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
