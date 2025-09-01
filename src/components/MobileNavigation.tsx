import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Users, 
  Target, 
  DollarSign, 
  BarChart3, 
  Settings,
  Grid,
  UserCheck
} from "lucide-react";

interface MobileNavigationProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export function MobileNavigation({ activeView, onViewChange }: MobileNavigationProps) {
  const navItems = [
    { id: "dashboard", icon: TrendingUp, label: "Dashboard" },
    { id: "leads", icon: Users, label: "Leads" },
    { id: "kanban", icon: Grid, label: "Pipeline" },
    { id: "goals", icon: Target, label: "Metas" },
    { id: "financial", icon: DollarSign, label: "Financeiro" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-card z-50">
      <div className="flex justify-around py-2">
        {navItems.map((item) => (
          <Button
            key={item.id}
            variant={activeView === item.id ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewChange(item.id)}
            className="flex flex-col items-center gap-1 h-auto py-2 px-3"
          >
            <item.icon className="h-4 w-4" />
            <span className="text-xs">{item.label}</span>
          </Button>
        ))}
      </div>
    </nav>
  );
}