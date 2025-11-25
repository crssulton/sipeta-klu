export default function AppLogo() {
    return (
        <>
            <img
                src="/assets/logo-klu.png"
                alt="KLU Logo"
                className="h-9 w-9 object-contain"
            />
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    SIPETA
                </span>
            </div>
        </>
    );
}
