import { lazy, Suspense } from "react";
import dynamicIconImports from "lucide-react/dynamicIconImports";

interface DynamicIconProps {
  name: string;
  className?: string;
}

const DynamicIcon = ({ name, className }: DynamicIconProps) => {
  const iconName = name as keyof typeof dynamicIconImports;
  if (!dynamicIconImports[iconName]) return null;
  
  const LucideIcon = lazy(dynamicIconImports[iconName]);

  return (
    <Suspense fallback={<div className="w-4 h-4" />}>
      <LucideIcon className={className} />
    </Suspense>
  );
};

export default DynamicIcon;
