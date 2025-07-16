import React from "react";
import { Icons } from "../assets/icons";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: keyof typeof Icons;
  className?: string;
}

export const Icon: React.FC<IconProps> = ({ name, className = '', ...props }) => {
  const SvgIcon = Icons[name];

  return SvgIcon ? (
    <SvgIcon className={className} aria-hidden="true" {...props} />
  ) : null;
};
