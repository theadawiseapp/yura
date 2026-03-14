export function YuraLogo({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M50 20 C35 8, 10 15, 15 38 C18 52, 35 65, 50 85 C50 85, 50 100, 50 100"
        stroke="#FF5F6D"
        strokeWidth="10"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M50 20 C65 8, 90 15, 85 38 C82 52, 65 60, 50 70"
        stroke="#FF5F6D"
        strokeWidth="10"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
