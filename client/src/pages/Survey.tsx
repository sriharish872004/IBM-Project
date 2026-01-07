import { useState } from "react";
import { useCreateSurvey } from "@/hooks/use-surveys";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function Survey() {
  const { user } = useAuth();
  const { mutate: submitSurvey, isPending, isSuccess } = useCreateSurvey();
  const { toast } = useToast();
  
  const [answers, setAnswers] = useState({
    awarenessLevel: "",
    sourceOfInfo: "",
    difficulties: "",
    suggestions: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Login Required", description: "Please login to submit feedback.", variant: "destructive" });
      return;
    }

    // Calculate a simple score (1-100)
    const score = answers.awarenessLevel === "High" ? 100 : answers.awarenessLevel === "Medium" ? 60 : 20;

    submitSurvey({
      userId: user.id || "anonymous",
      responses: answers,
      awarenessScore: score
    });
  };

  if (isSuccess) {
    return (
      <div className="max-w-lg mx-auto py-20 text-center space-y-6">
        <motion.div 
          initial={{ scale: 0 }} 
          animate={{ scale: 1 }} 
          className="h-24 w-24 bg-green-100 text-green-600 rounded-full mx-auto flex items-center justify-center"
        >
          <CheckCircle2 className="h-12 w-12" />
        </motion.div>
        <h2 className="text-3xl font-bold font-display">Thank You!</h2>
        <p className="text-muted-foreground text-lg">
          Your feedback helps us bridge the gap and improve scheme delivery for everyone.
        </p>
        <Button onClick={() => window.location.href = '/'} variant="outline">Return Home</Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold font-display">Citizen Awareness Survey</h1>
        <p className="text-muted-foreground">
          Help us understand how well government schemes are reaching you. Your input directly influences policy improvements.
        </p>
      </div>

      <motion.form 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border shadow-lg rounded-2xl p-8 space-y-8"
        onSubmit={handleSubmit}
      >
        <div className="space-y-4">
          <Label className="text-base font-semibold">How aware are you of current government schemes?</Label>
          <RadioGroup 
            onValueChange={(val) => setAnswers({...answers, awarenessLevel: val})}
            className="grid grid-cols-3 gap-4"
          >
            {['High', 'Medium', 'Low'].map((level) => (
              <div key={level}>
                <RadioGroupItem value={level} id={level} className="peer sr-only" />
                <Label 
                  htmlFor={level}
                  className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-primary cursor-pointer transition-all"
                >
                  {level}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label className="text-base font-semibold">Where do you mostly get information about schemes?</Label>
          <Input 
            placeholder="e.g., Newspapers, Social Media, Local Leaders"
            value={answers.sourceOfInfo}
            onChange={(e) => setAnswers({...answers, sourceOfInfo: e.target.value})}
            required
            className="h-12 rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-base font-semibold">What difficulties do you face while applying?</Label>
          <Textarea 
            placeholder="Describe any challenges..."
            value={answers.difficulties}
            onChange={(e) => setAnswers({...answers, difficulties: e.target.value})}
            className="min-h-[100px] rounded-xl resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-base font-semibold">Any suggestions for improvement?</Label>
          <Textarea 
            placeholder="How can we make this better?"
            value={answers.suggestions}
            onChange={(e) => setAnswers({...answers, suggestions: e.target.value})}
            className="min-h-[100px] rounded-xl resize-none"
          />
        </div>

        <Button type="submit" size="lg" className="w-full text-lg h-12 shadow-lg shadow-primary/20" disabled={isPending}>
          {isPending ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
          Submit Feedback
        </Button>
      </motion.form>
    </div>
  );
}
