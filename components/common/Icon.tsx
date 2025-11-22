import React from "react";
import { cn } from "../../lib/utils/cn";
import {
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
  BanknotesIcon,
  BuildingLibraryIcon,
  CalendarIcon,
  ChartBarIcon,
  ChartPieIcon,
  CheckCircleIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
  CubeIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon,
  NoSymbolIcon,
  PencilSquareIcon,
  PlusIcon,
  SparklesIcon,
  TrashIcon,
  UserGroupIcon,
  WrenchScrewdriverIcon,
  XMarkIcon,
} from "./Icons";

export const ICON_REGISTRY = {
  overview: ChartPieIcon,
  assets: BuildingLibraryIcon,
  cashflow: BanknotesIcon,
  ratios: ChartBarIcon,
  capital: BanknotesIcon,
  equity: BuildingLibraryIcon,
  workingCapital: BanknotesIcon,
  repairs: WrenchScrewdriverIcon,
  orders: ClipboardDocumentListIcon,
  pending: ClockIcon,
  success: CheckCircleIcon,
  warning: ExclamationTriangleIcon,
  danger: NoSymbolIcon,
  info: InformationCircleIcon,
  close: XMarkIcon,
  search: MagnifyingGlassIcon,
  add: PlusIcon,
  edit: PencilSquareIcon,
  delete: TrashIcon,
  customers: UserGroupIcon,
  stock: CubeIcon,
  progressUp: ArrowTrendingUpIcon,
  progressDown: ArrowTrendingDownIcon,
  calendar: CalendarIcon,
  highlight: SparklesIcon,
  money: BanknotesIcon,
} as const;

export type IconName = keyof typeof ICON_REGISTRY;
export type IconTone =
  | "default"
  | "muted"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info";
export type IconSize = "sm" | "md" | "lg" | "xl";

const sizeClasses: Record<IconSize, string> = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
  xl: "w-8 h-8",
};

const toneClasses: Record<IconTone, string> = {
  default: "text-pin-gray-600 dark:text-pin-dark-300",
  muted: "text-pin-gray-400 dark:text-pin-dark-500",
  primary: "text-pin-blue-600 dark:text-pin-blue-400",
  success: "text-green-600 dark:text-green-400",
  warning: "text-yellow-600 dark:text-yellow-400",
  danger: "text-red-600 dark:text-red-400",
  info: "text-blue-600 dark:text-blue-400",
};

type SvgProps = Omit<React.SVGProps<SVGSVGElement>, "ref">;

export interface StandardIconProps extends SvgProps {
  name: IconName;
  tone?: IconTone;
  size?: IconSize;
}

export const Icon: React.FC<StandardIconProps> = ({
  name,
  tone = "default",
  size = "md",
  className,
  ...props
}) => {
  const IconComponent = ICON_REGISTRY[name];

  return (
    <IconComponent
      {...props}
      className={cn(
        "shrink-0",
        sizeClasses[size],
        toneClasses[tone],
        className
      )}
    />
  );
};
