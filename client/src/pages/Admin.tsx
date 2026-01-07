import { useSurveyStats } from "@/hooks/use-surveys";
import { Loader2, TrendingUp, AlertTriangle, Users } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Admin() {
  const { data: stats, isLoading } = useSurveyStats();

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  // Mock data for charts since the API returns aggregated stats
  const chartData = [
    { name: 'Rural', awareness: 45 },
    { name: 'Urban', awareness: 78 },
    { name: 'Suburban', awareness: 62 },
    { name: 'Remote', awareness: 30 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-display">Admin Dashboard</h1>
        <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">System Status: Active</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg text-primary"><Users className="h-5 w-5" /></div>
            <h3 className="font-semibold text-muted-foreground">Total Surveys</h3>
          </div>
          <p className="text-3xl font-bold">{stats?.totalSurveys || 0}</p>
        </div>

        <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg text-green-600"><TrendingUp className="h-5 w-5" /></div>
            <h3 className="font-semibold text-muted-foreground">Avg. Awareness</h3>
          </div>
          <p className="text-3xl font-bold">{stats?.averageAwareness || 0}%</p>
        </div>

        <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600"><AlertTriangle className="h-5 w-5" /></div>
            <h3 className="font-semibold text-muted-foreground">Gap Identified</h3>
          </div>
          <p className="text-lg font-medium leading-tight">{stats?.gapAnalysis ? "Significant rural gap detected" : "Analyzing..."}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm h-[400px]">
          <h3 className="font-bold mb-6">Regional Awareness Breakdown</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="awareness" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
          <h3 className="font-bold mb-4">AI Gap Analysis</h3>
          <div className="bg-muted/30 p-4 rounded-lg border border-border text-sm leading-relaxed text-muted-foreground">
            {stats?.gapAnalysis || "AI is currently analyzing survey responses to identify demographic and regional gaps in scheme awareness. Preliminary data suggests lower penetration in remote agricultural sectors."}
          </div>
        </div>
      </div>
    </div>
  );
}
