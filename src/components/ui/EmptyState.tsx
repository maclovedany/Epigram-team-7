import { cn } from "@/lib/utils";
import Button from "./Button";
import Link from "next/link";

interface EmptyStateProps {
  title: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState = ({
  title,
  description,
  actionText,
  actionHref,
  onAction,
  className,
}: EmptyStateProps) => {
  const ActionButton = () => {
    if (!actionText) return null;

    if (actionHref) {
      return (
        <Link href={actionHref}>
          <Button variant="primary">{actionText}</Button>
        </Link>
      );
    }

    if (onAction) {
      return (
        <Button variant="primary" onClick={onAction}>
          {actionText}
        </Button>
      );
    }

    return null;
  };

  return (
    <div className={cn("text-center py-12", className)}>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      {description && <p className="text-gray-500 mb-6">{description}</p>}
      <ActionButton />
    </div>
  );
};
