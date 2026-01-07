import { useScheme } from "@/hooks/use-schemes";
import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Loader2, ExternalLink, CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useCreateApplication, useVerifyApplication } from "@/hooks/use-applications";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export default function SchemeDetails() {
  const [, params] = useRoute("/schemes/:id");
  const id = Number(params?.id);
  const { data: scheme, isLoading } = useScheme(id);
  const { user } = useAuth();
  const { mutate: createApplication, isPending: isApplying } = useCreateApplication();
  const { toast } = useToast();

  const handleApply = () => {
    if (!user) {
      window.location.href = "/api/login";
      return;
    }
    
    // In a real app, this would open a dialog to collect more info
    createApplication(
      { userId: user.id || "temp-user", schemeId: id, status: "pending", submittedAt: new Date().toISOString() },
      {
        onSuccess: () => {
          toast({
            title: "Application Submitted",
            description: "Your application has been received and is pending verification.",
          });
        },
        onError: (err) => {
          toast({
            title: "Error",
            description: err.message,
            variant: "destructive",
          });
        }
      }
    );
  };

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (!scheme) return <div className="text-center py-20">Scheme not found</div>;

  const criteria = scheme.criteria as Record<string, any>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Link href="/schemes" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-4">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Schemes
      </Link>

      <div className="bg-card rounded-2xl border border-border shadow-xl overflow-hidden">
        {/* Header Banner */}
        <div className="bg-primary/5 p-8 border-b border-border">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="space-y-4">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary text-primary-foreground uppercase tracking-wide">
                {scheme.category}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold font-display text-foreground">{scheme.title}</h1>
              <p className="text-lg text-muted-foreground max-w-2xl">{scheme.description}</p>
            </div>
            <div className="flex flex-col gap-3 min-w-[160px]">
              <Button size="lg" className="shadow-lg shadow-primary/20" onClick={handleApply} disabled={isApplying}>
                {isApplying ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {isApplying ? "Applying..." : "Apply Now"}
              </Button>
              {scheme.applicationUrl && (
                <a href={scheme.applicationUrl} target="_blank" rel="noreferrer">
                  <Button variant="outline" className="w-full">
                    Official Website <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="p-8 grid md:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            <section>
              <h3 className="text-xl font-bold font-display mb-4 flex items-center gap-2">
                <CheckCircle className="text-green-600 h-5 w-5" />
                Eligibility Criteria
              </h3>
              <div className="bg-muted/30 rounded-xl p-6 border border-border space-y-3">
                {Object.entries(criteria).map(([key, value]) => (
                  <div key={key} className="flex items-start gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                    <div>
                      <span className="font-semibold text-foreground capitalize">{key.replace(/_/g, ' ')}:</span>
                      <span className="ml-2 text-muted-foreground">{String(value)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-xl font-bold font-display mb-4">Benefits</h3>
              <p className="text-muted-foreground leading-relaxed">{scheme.benefits}</p>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-xl border border-blue-100 dark:border-blue-900/30">
              <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-2">AI Verification</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
                Our AI system can instantly verify if you match these criteria based on your profile data.
              </p>
              <Button variant="secondary" className="w-full bg-blue-100 text-blue-700 hover:bg-blue-200 border-none">
                Check Eligibility
              </Button>
            </div>

            <div className="border border-border rounded-xl p-5">
              <h4 className="font-bold mb-2">Agency Details</h4>
              <p className="text-sm text-muted-foreground">{scheme.agency}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
