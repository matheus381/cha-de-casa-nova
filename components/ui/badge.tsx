import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-violet-500/15 text-violet-300',
        secondary:
          'border-zinc-800 bg-zinc-900/80 text-zinc-400',
        success:
          'border-emerald-500/20 bg-emerald-500/10 text-emerald-400',
        destructive:
          'border-rose-500/20 bg-rose-500/10 text-rose-400',
        outline: 'border-zinc-700 text-zinc-300',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants>) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
