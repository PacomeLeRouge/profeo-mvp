import { Badge } from "@/components/ui/badge";
import { roleMeta, type AppRole } from "@/lib/role-ui";
import { cn } from "@/lib/utils";

type RoleBadgeProps = {
  role: AppRole;
  className?: string;
  size?: "sm" | "md";
};

export function RoleBadge({ role, className, size = "md" }: RoleBadgeProps) {
  const meta = roleMeta[role];
  const Icon = meta.icon;

  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1.5 border-border bg-card/90 font-semibold text-foreground shadow-sm",
        role === "student" && "surface-brand-tint",
        role === "tutor" && "border-primary/30 bg-primary/10 text-foreground",
        size === "sm" && "px-2.5 py-1 text-[11px]",
        size === "md" && "px-3 py-1.5 text-xs",
        className
      )}
    >
      <Icon className={cn(size === "sm" ? "size-3" : "size-3.5")} aria-hidden />
      {meta.label}
    </Badge>
  );
}
