import Link from "next/link";
import { ReactNode, ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface BaseProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  icon?: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

interface LinkProps extends BaseProps {
  href: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
  rel?: string;
  onClick?: () => void;
  type?: never;
}

interface ButtonElementProps
  extends BaseProps,
    Omit<
      ButtonHTMLAttributes<HTMLButtonElement>,
      "children" | "className" | "disabled"
    > {
  href?: never;
  target?: never;
  rel?: never;
}

export type ButtonProps = LinkProps | ButtonElementProps;

export default function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  fullWidth = false,
  icon,
  loading = false,
  disabled = false,
  className = "",
  target,
  rel,
  onClick,
  type = "button",
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const base = `
    group
    relative
    inline-flex
    items-center
    justify-center
    overflow-hidden
    rounded-full
    border
    font-light
    uppercase
    transition-all
    duration-500
    ease-[cubic-bezier(0.25,1,0.5,1)]
    select-none
    ${fullWidth ? "w-full" : ""}
    ${
      isDisabled
        ? "pointer-events-none opacity-50"
        : "hover:scale-[1.02]"
    }
  `;

  const sizes: Record<ButtonSize, string> = {
    sm: "h-10 px-5 text-[10px] tracking-[0.16em]",
    md: "h-14 px-7 md:px-8 text-xs tracking-widest",
    lg: "h-16 px-9 md:px-10 text-xs md:text-sm tracking-widest",
  };

  const variants: Record<ButtonVariant, string> = {
    primary: `
      border-transparent
      bg-[var(--foreground)]
      !text-[var(--background)]
      shadow-[0_10px_30px_rgba(0,0,0,0.06)]
      hover:bg-[#FF5A00]
      hover:!text-white
      hover:shadow-[0_14px_40px_rgba(255,90,0,0.18)]
    `,

    secondary: `
      border-[var(--border)]
      bg-[var(--surface)]
      text-[var(--foreground)]
      hover:border-[var(--border-strong)]
      hover:text-[#FF5A00]
    `,

    ghost: `
      border-transparent
      bg-transparent
      text-[var(--foreground)]
      hover:bg-[var(--surface)]
      hover:text-[#FF5A00]
    `,
  };

  const combinedClasses = `${base} ${sizes[size]} ${variants[variant]} ${className}`.trim();
  const computedRel = target === "_blank" && !rel ? "noopener noreferrer" : rel;

  const content = (
    <span
      className="
        relative
        z-10
        inline-flex
        items-center
        justify-center
        gap-2.5
        transition-transform
        duration-500
        ease-[cubic-bezier(0.25,1,0.5,1)]
        group-hover:-translate-y-[1px]
      "
    >
      {loading && (
        <svg
          className="h-3.5 w-3.5 animate-spin text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}

      <span>{children}</span>

      {!loading && icon && (
        <span
          className="
            inline-block
            transition-transform
            duration-500
            ease-[cubic-bezier(0.25,1,0.5,1)]
            group-hover:translate-x-1
          "
        >
          {icon}
        </span>
      )}
    </span>
  );

  if (href && !isDisabled) {
    return (
      <Link
        href={href}
        className={combinedClasses}
        onClick={onClick}
        target={target}
        rel={computedRel}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={combinedClasses}
      onClick={onClick}
      disabled={isDisabled}
      {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {content}
    </button>
  );
}