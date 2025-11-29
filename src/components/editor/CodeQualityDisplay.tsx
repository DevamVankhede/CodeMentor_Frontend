import React from "react";
import { Zap } from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface CodeQualityDisplayProps {
  metrics: {
    error?: string;
    quality?: number;
    maintainability?: number;
    reliability?: number;
    security?: number;
    performance?: number;
    readability?: number;
  } | null;
}

const CodeQualityDisplay: React.FC<CodeQualityDisplayProps> = ({ metrics }) => {
  if (!metrics) {
    return (
      <div className="text-slate-400 text-center mt-8">
        <Zap className="w-8 h-8 mx-auto mb-2" />
        <p>No quality metrics available</p>
        <p className="text-xs mt-2">
          Click &quot;Quality&quot; to analyze your code
        </p>
      </div>
    );
  }

  if (metrics.error) {
    return <p className="text-red-400">{metrics.error}</p>;
  }

  // Transform metrics for RadarChart. Assuming metrics are 0-100 scale or can be normalized.
  const data = [
    { subject: "Complexity", A: metrics.complexity || 0, fullMark: 100 },
    {
      subject: "Maintainability",
      A: metrics.maintainability || 0,
      fullMark: 100,
    },
    { subject: "Readability", A: metrics.readability || 0, fullMark: 100 },
    // Add more metrics here as needed
  ];

  return (
    <div className="h-full w-full flex flex-col items-center justify-center">
      <h4 className="text-sm font-medium text-slate-300 mb-4">
        Code Quality Overview:
      </h4>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="var(--border-color)" />
          <PolarAngleAxis
            dataKey="subject"
            stroke="var(--text-secondary)"
            tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            stroke="var(--border-color)"
            tick={{ fill: "var(--text-secondary)", fontSize: 10 }}
          />
          <Radar
            name="Code Quality"
            dataKey="A"
            stroke="var(--brand-primary)"
            fill="var(--brand-primary)"
            fillOpacity={0.6}
          />
          <Legend
            wrapperStyle={{ position: "relative", marginTop: "10px" }}
            formatter={(value) => (
              <span style={{ color: "var(--text-secondary)" }}>{value}</span>
            )}
          />
        </RadarChart>
      </ResponsiveContainer>
      <p className="text-xs text-slate-500 mt-4">
        Metrics are simulated. In a real app, these would come from static
        analysis tools.
      </p>
    </div>
  );
};

export default CodeQualityDisplay;
