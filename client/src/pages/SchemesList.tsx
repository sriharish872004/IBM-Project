import { useState } from "react";
import { useSchemes } from "@/hooks/use-schemes";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, ChevronRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function SchemesList() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const { data: schemes, isLoading, error } = useSchemes({ search, category: category === "all" ? undefined : category });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-foreground">Government Schemes</h1>
          <p className="text-muted-foreground mt-1">Discover benefits tailored for you.</p>
        </div>
        <div className="flex gap-2">
          {/* <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Advanced Filters
          </Button> */}
        </div>
      </div>

      {/* Filters */}
      <div className="glass-panel p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search schemes by name..." 
            className="pl-10 bg-white/50 border-border"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full md:w-[200px] bg-white/50">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Education">Education</SelectItem>
            <SelectItem value="Health">Health</SelectItem>
            <SelectItem value="Agriculture">Agriculture</SelectItem>
            <SelectItem value="Housing">Housing</SelectItem>
            <SelectItem value="Small Business">Small Business</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="text-center py-20 text-destructive bg-destructive/5 rounded-xl border border-destructive/20">
          <p>Failed to load schemes. Please try again.</p>
        </div>
      ) : schemes?.length === 0 ? (
        <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed border-border">
          <p className="text-muted-foreground">No schemes found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {schemes?.map((scheme, idx) => (
            <motion.div
              key={scheme.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-card rounded-xl p-6 border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 flex flex-col md:flex-row gap-6 items-start"
            >
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary uppercase tracking-wide">
                    {scheme.category}
                  </span>
                  <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                    {scheme.agency}
                  </span>
                </div>
                <h3 className="text-xl font-bold font-display text-foreground">{scheme.title}</h3>
                <p className="text-muted-foreground line-clamp-2">{scheme.description}</p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <div className="text-xs font-medium px-2 py-1 bg-secondary rounded text-secondary-foreground">
                    Benefits: {scheme.benefits}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3 w-full md:w-auto min-w-[140px]">
                <Link href={`/schemes/${scheme.id}`}>
                  <Button className="w-full shadow-md shadow-primary/10 group">
                    View Details
                    <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Button variant="outline" className="w-full">
                  Check Eligibility
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
