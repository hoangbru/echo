import * as Icons from "lucide-react";

const IconComponent = ({
  name,
  className,
}: {
  name: string;
  className?: string;
}) => {
  const LucideIcon = (Icons as any)[name];
  if (!LucideIcon) return <Icons.Music className={className} />;
  return <LucideIcon className={className} />;
};

export default IconComponent;
