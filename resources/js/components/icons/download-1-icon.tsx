export default function DownloadIcon({
    className = 'h-10 w-10',
}: {
    className?: string;
}) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className}>
            <path
                d="M12 5v14m0 0l-5-5m5 5l5-5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
