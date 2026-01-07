import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Search, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const { user } = useAuth();

  const features = [
    {
      icon: Search,
      title: "Smart Discovery",
      desc: "AI analyzes your profile to find relevant government schemes you didn't know about."
    },
    {
      icon: CheckCircle2,
      title: "Eligibility Check",
      desc: "Instant verification using advanced AI to determine if you qualify before applying."
    },
    {
      icon: ShieldCheck,
      title: "Fraud Detection",
      desc: "Secure, transparent system ensuring benefits reach only the deserving citizens."
    }
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-primary text-primary-foreground p-8 md:p-16 lg:p-24 shadow-2xl">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary/60" />
        
        <div className="relative z-10 max-w-3xl space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 text-sm font-medium backdrop-blur-sm border border-white/10 mb-4">
              AI-Powered Governance
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display leading-tight">
              Bridging the Gap Between <br/>
              <span className="text-accent">Citizens & Benefits</span>
            </h1>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl leading-relaxed"
          >
            A unified platform to discover, verify, and apply for government schemes. 
            We ensure that every eligible citizen gets their due benefits with zero friction.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 pt-4"
          >
            {user ? (
              <Link href="/schemes">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold text-lg h-12 px-8 shadow-lg shadow-black/10">
                  Find Schemes
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <Link href="/api/login">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold text-lg h-12 px-8 shadow-lg shadow-black/10">
                  Login to Start
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            )}
            <Link href="/survey">
              <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 font-medium text-lg h-12 px-8">
                Check Awareness
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="group p-8 rounded-2xl bg-white border border-border shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300"
          >
            <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <feature.icon className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold font-display mb-3 text-foreground group-hover:text-primary transition-colors">
              {feature.title}
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {feature.desc}
            </p>
          </motion.div>
        ))}
      </section>

      {/* Stats / Impact Section */}
      <section className="bg-muted/30 rounded-3xl p-12 text-center border border-border">
        <h2 className="text-3xl font-bold font-display mb-12">Making a Real Impact</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Active Schemes", value: "50+" },
            { label: "Citizens Served", value: "10k+" },
            { label: "Claims Verified", value: "98%" },
            { label: "Fraud Prevented", value: "₹2Cr+" },
          ].map((stat, idx) => (
            <div key={idx} className="space-y-2">
              <div className="text-4xl font-bold text-primary">{stat.value}</div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
