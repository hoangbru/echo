export const BrandIcon = ({
  icon,
  className,
}: {
  icon: any;
  className?: string;
}) => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill={`#${icon.hex}`}
  >
    <path d={icon.path} />
  </svg>
);
