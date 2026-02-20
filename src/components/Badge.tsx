interface BadgeProps {
    variant: 'rips' | 'verified' | 'paryatan' | 'district';
    children: React.ReactNode;
}

const variantStyles: Record<BadgeProps['variant'], string> = {
    rips: 'badge badge-rips',
    verified: 'badge badge-verified',
    paryatan: 'badge badge-paryatan',
    district: 'badge badge-district',
};

const variantIcons: Record<BadgeProps['variant'], string> = {
    rips: '✅',
    verified: '🏛️',
    paryatan: '⭐',
    district: '📍',
};

export default function Badge({ variant, children }: BadgeProps) {
    return (
        <span className={variantStyles[variant]}>
            <span>{variantIcons[variant]}</span>
            {children}
        </span>
    );
}
