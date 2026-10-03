import * as React from "react";

export interface ScallopEdgeSvgProps {
  className?: string;
}

/**
 * Scalloped Right Edge SVG pattern for coupon tickets and tear vouchers.
 */
export const ScallopEdgeSvg: React.FC<ScallopEdgeSvgProps> = ({
  className,
}) => (
  <svg
    viewBox="0 0 8 76"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
    preserveAspectRatio="none"
  >
    <path
      d="M0 0H8C6.5 3 6.5 6 8 9.5C6.5 12.5 6.5 15.5 8 19C6.5 22 6.5 25 8 28.5C6.5 31.5 6.5 34.5 8 38C6.5 41 6.5 44 8 47.5C6.5 50.5 6.5 53.5 8 57C6.5 60 6.5 63 8 66.5C6.5 69.5 6.5 72.5 8 76H0V0Z"
      fill="currentColor"
    />
  </svg>
);

export default ScallopEdgeSvg;
