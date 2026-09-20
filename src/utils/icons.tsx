// Icon components for shell navigation and UI elements

type IconProps = {
  className?: string;
};

export function TeachersIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Cap */}
      <path d="M2 9l10-5 10 5-10 5-10-5z" />

      {/* Tassel */}
      <path d="M22 9v6" />

      {/* Base */}
      <path d="M6 11v4c0 1.5 2.7 3 6 3s6-1.5 6-3v-4" />
    </svg>
  );
}

export function PupilsIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Head */}
      <circle cx="12" cy="8" r="3" />

      {/* Shoulders */}
      <path d="M6.5 19c.8-3 2.9-5 5.5-5s4.7 2 5.5 5" />
    </svg>
  );
}




export function SchoolsIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 10l9-6 9 6" />
      <path d="M5 10v10h14V10" />
      <path d="M10 20v-4h4v4" />
      <path d="M8 13h.01" />
      <path d="M16 13h.01" />
      <path d="M12 6v2" />
    </svg>
  );
}


export function ClassSizeIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Center person */}
      <circle cx="12" cy="9" r="2.5" />
      <path d="M8.5 18c.5-2.5 2-4 3.5-4s3 .8 3.5 4" />

      {/* Left person */}
      <circle cx="6.5" cy="11" r="1.5" />
      <path d="M4.5 18c.3-1.5 1.2-2.5 2.2-2.8" />

      {/* Right person */}
      <circle cx="17.5" cy="11" r="1.5" />
      <path d="M19.5 18c-.3-1.5-1.2-2.5-2.2-2.8" />
    </svg>
  );
}

export function StudentTeacherRelationIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
      <path d="M5 12h14" />
      <circle cx="12" cy="17.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function MaleIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="10" cy="14" r="5" />
      <path d="M14 10l6-6" />
      <path d="M15 4h5v5" />
    </svg>
  );
}

export function GlobeIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />

      <path d="M3 12h18" />
      <path d="M12 3a14 14 0 0 1 0 18" />
      <path d="M12 3a14 14 0 0 0 0 18" />
    </svg>
  );
}

