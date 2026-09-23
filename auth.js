const { useState, useEffect } = React;

// Storage Keys
const ACCOUNT_KEY = "mdt-account";
const USERS_DB_KEY = "mdt-users-db";
const PROJECTS_KEY = "mdt-projects";
const OTP_EXPIRY_KEY = "mdt-otp-expiry-ts";
const PENDING_ACCOUNT_KEY = "mdt-pending-account";
const OTP_TIMER_SECONDS = 60; // 60-second OTP countdown for resend availability and expiration

function getRemainingOtpSeconds() {
  try {
    const saved = localStorage.getItem(OTP_EXPIRY_KEY);
    if (!saved) return 0;
    const expiry = parseInt(saved, 10);
    if (isNaN(expiry)) return 0;
    const diff = Math.ceil((expiry - Date.now()) / 1000);
    return diff > 0 ? diff : 0;
  } catch (e) {
    return 0;
  }
}

const ALL_COUNTRIES = [
  { name: "Afghanistan", code: "af", flag: "🇦🇫" },
  { name: "Albania", code: "al", flag: "🇦🇱" },
  { name: "Algeria", code: "dz", flag: "🇩🇿" },
  { name: "Andorra", code: "ad", flag: "🇦🇩" },
  { name: "Angola", code: "ao", flag: "🇦🇴" },
  { name: "Antigua and Barbuda", code: "ag", flag: "🇦🇬" },
  { name: "Argentina", code: "ar", flag: "🇦🇷" },
  { name: "Armenia", code: "am", flag: "🇦🇲" },
  { name: "Australia", code: "au", flag: "🇦🇺" },
  { name: "Austria", code: "at", flag: "🇦🇹" },
  { name: "Azerbaijan", code: "az", flag: "🇦🇿" },
  { name: "Bahamas", code: "bs", flag: "🇧🇸" },
  { name: "Bahrain", code: "bh", flag: "🇧🇭" },
  { name: "Bangladesh", code: "bd", flag: "🇧🇩" },
  { name: "Barbados", code: "bb", flag: "🇧🇧" },
  { name: "Belarus", code: "by", flag: "🇧🇾" },
  { name: "Belgium", code: "be", flag: "🇧🇪" },
  { name: "Belize", code: "bz", flag: "🇧🇿" },
  { name: "Benin", code: "bj", flag: "🇧🇯" },
  { name: "Bhutan", code: "bt", flag: "🇧🇹" },
  { name: "Bolivia", code: "bo", flag: "🇧🇴" },
  { name: "Bosnia and Herzegovina", code: "ba", flag: "🇧🇦" },
  { name: "Botswana", code: "bw", flag: "🇧🇼" },
  { name: "Brazil", code: "br", flag: "🇧🇷" },
  { name: "Brunei", code: "bn", flag: "🇧🇳" },
  { name: "Bulgaria", code: "bg", flag: "🇧🇬" },
  { name: "Burkina Faso", code: "bf", flag: "🇧🇫" },
  { name: "Burundi", code: "bi", flag: "🇧🇮" },
  { name: "Cabo Verde", code: "cv", flag: "🇨🇻" },
  { name: "Cambodia", code: "kh", flag: "🇰🇭" },
  { name: "Cameroon", code: "cm", flag: "🇨🇲" },
  { name: "Canada", code: "ca", flag: "🇨🇦" },
  { name: "Central African Republic", code: "cf", flag: "🇨🇫" },
  { name: "Chad", code: "td", flag: "🇹🇩" },
  { name: "Chile", code: "cl", flag: "🇨🇱" },
  { name: "China", code: "cn", flag: "🇨🇳" },
  { name: "Colombia", code: "co", flag: "🇨🇴" },
  { name: "Comoros", code: "km", flag: "🇰🇲" },
  { name: "Congo", code: "cg", flag: "🇨🇬" },
  { name: "Congo (DRC)", code: "cd", flag: "🇨🇩" },
  { name: "Costa Rica", code: "cr", flag: "🇨🇷" },
  { name: "Croatia", code: "hr", flag: "🇭🇷" },
  { name: "Cuba", code: "cu", flag: "🇨🇺" },
  { name: "Cyprus", code: "cy", flag: "🇨🇾" },
  { name: "Czech Republic", code: "cz", flag: "🇨🇿" },
  { name: "Denmark", code: "dk", flag: "🇩🇰" },
  { name: "Djibouti", code: "dj", flag: "🇩🇯" },
  { name: "Dominica", code: "dm", flag: "🇩🇲" },
  { name: "Dominican Republic", code: "do", flag: "🇩🇴" },
  { name: "East Timor (Timor-Leste)", code: "tl", flag: "🇹🇱" },
  { name: "Ecuador", code: "ec", flag: "🇪🇨" },
  { name: "Egypt", code: "eg", flag: "🇪🇬" },
  { name: "El Salvador", code: "sv", flag: "🇸🇻" },
  { name: "Equatorial Guinea", code: "gq", flag: "🇬🇶" },
  { name: "Eritrea", code: "er", flag: "🇪🇷" },
  { name: "Estonia", code: "ee", flag: "🇪🇪" },
  { name: "Eswatini", code: "sz", flag: "🇸🇿" },
  { name: "Ethiopia", code: "et", flag: "🇪🇹" },
  { name: "Fiji", code: "fj", flag: "🇫🇯" },
  { name: "Finland", code: "fi", flag: "🇫🇮" },
  { name: "France", code: "fr", flag: "🇫🇷" },
  { name: "Gabon", code: "ga", flag: "🇬🇦" },
  { name: "Gambia", code: "gm", flag: "🇬🇲" },
  { name: "Georgia", code: "ge", flag: "🇬🇪" },
  { name: "Germany", code: "de", flag: "🇩🇪" },
  { name: "Ghana", code: "gh", flag: "🇬🇭" },
  { name: "Greece", code: "gr", flag: "🇬🇷" },
  { name: "Grenada", code: "gd", flag: "🇬🇩" },
  { name: "Guatemala", code: "gt", flag: "🇬🇹" },
  { name: "Guinea", code: "gn", flag: "🇬🇳" },
  { name: "Guinea-Bissau", code: "gw", flag: "🇬🇼" },
  { name: "Guyana", code: "gy", flag: "🇬🇾" },
  { name: "Haiti", code: "ht", flag: "🇭🇹" },
  { name: "Honduras", code: "hn", flag: "🇭🇳" },
  { name: "Hungary", code: "hu", flag: "🇭🇺" },
  { name: "Iceland", code: "is", flag: "🇮🇸" },
  { name: "India", code: "in", flag: "🇮🇳" },
  { name: "Indonesia", code: "id", flag: "🇮🇩" },
  { name: "Iran", code: "ir", flag: "🇮🇷" },
  { name: "Iraq", code: "iq", flag: "🇮🇶" },
  { name: "Ireland", code: "ie", flag: "🇮🇪" },
  { name: "Israel", code: "il", flag: "🇮🇱" },
  { name: "Italy", code: "it", flag: "🇮🇹" },
  { name: "Ivory Coast", code: "ci", flag: "🇨🇮" },
  { name: "Jamaica", code: "jm", flag: "🇯🇲" },
  { name: "Japan", code: "jp", flag: "🇯🇵" },
  { name: "Jordan", code: "jo", flag: "🇯🇴" },
  { name: "Kazakhstan", code: "kz", flag: "🇰🇿" },
  { name: "Kenya", code: "ke", flag: "🇰🇪" },
  { name: "Kiribati", code: "ki", flag: "🇰🇮" },
  { name: "Kosovo", code: "xk", flag: "🇽🇰" },
  { name: "Kuwait", code: "kw", flag: "🇰🇼" },
  { name: "Kyrgyzstan", code: "kg", flag: "🇰🇬" },
  { name: "Laos", code: "la", flag: "🇱🇦" },
  { name: "Latvia", code: "lv", flag: "🇱🇻" },
  { name: "Lebanon", code: "lb", flag: "🇱🇧" },
  { name: "Lesotho", code: "ls", flag: "🇱🇸" },
  { name: "Liberia", code: "lr", flag: "🇱🇷" },
  { name: "Libya", code: "ly", flag: "🇱🇾" },
  { name: "Liechtenstein", code: "li", flag: "🇱🇮" },
  { name: "Lithuania", code: "lt", flag: "🇱🇹" },
  { name: "Luxembourg", code: "lu", flag: "🇱🇺" },
  { name: "Madagascar", code: "mg", flag: "🇲🇬" },
  { name: "Malawi", code: "mw", flag: "🇲🇼" },
  { name: "Malaysia", code: "my", flag: "🇲🇾" },
  { name: "Maldives", code: "mv", flag: "🇲🇻" },
  { name: "Mali", code: "ml", flag: "🇲🇱" },
  { name: "Malta", code: "mt", flag: "🇲🇹" },
  { name: "Marshall Islands", code: "mh", flag: "🇲🇭" },
  { name: "Mauritania", code: "mr", flag: "🇲🇷" },
  { name: "Mauritius", code: "mu", flag: "🇲🇺" },
  { name: "Mexico", code: "mx", flag: "🇲🇽" },
  { name: "Micronesia", code: "fm", flag: "🇫🇲" },
  { name: "Moldova", code: "md", flag: "🇲🇩" },
  { name: "Monaco", code: "mc", flag: "🇲🇨" },
  { name: "Mongolia", code: "mn", flag: "🇲🇳" },
  { name: "Montenegro", code: "me", flag: "🇲🇪" },
  { name: "Morocco", code: "ma", flag: "🇲🇦" },
  { name: "Mozambique", code: "mz", flag: "🇲🇿" },
  { name: "Myanmar", code: "mm", flag: "🇲🇲" },
  { name: "Namibia", code: "na", flag: "🇳🇦" },
  { name: "Nauru", code: "nr", flag: "🇳🇷" },
  { name: "Nepal", code: "np", flag: "🇳🇵" },
  { name: "Netherlands", code: "nl", flag: "🇳🇱" },
  { name: "New Zealand", code: "nz", flag: "🇳🇿" },
  { name: "Nicaragua", code: "ni", flag: "🇳🇮" },
  { name: "Niger", code: "ne", flag: "🇳🇪" },
  { name: "Nigeria", code: "ng", flag: "🇳🇬" },
  { name: "North Korea", code: "kp", flag: "🇰🇵" },
  { name: "North Macedonia", code: "mk", flag: "🇲🇰" },
  { name: "Norway", code: "no", flag: "🇳🇴" },
  { name: "Oman", code: "om", flag: "🇴🇲" },
  { name: "Pakistan", code: "pk", flag: "🇵🇰" },
  { name: "Palau", code: "pw", flag: "🇵🇼" },
  { name: "Palestine", code: "ps", flag: "🇵🇸" },
  { name: "Panama", code: "pa", flag: "🇵🇦" },
  { name: "Papua New Guinea", code: "pg", flag: "🇵🇬" },
  { name: "Paraguay", code: "py", flag: "🇵🇾" },
  { name: "Peru", code: "pe", flag: "🇵🇪" },
  { name: "Philippines", code: "ph", flag: "🇵🇭" },
  { name: "Poland", code: "pl", flag: "🇵🇱" },
  { name: "Portugal", code: "pt", flag: "🇵🇹" },
  { name: "Qatar", code: "qa", flag: "🇶🇦" },
  { name: "Romania", code: "ro", flag: "🇷🇴" },
  { name: "Russia", code: "ru", flag: "🇷🇺" },
  { name: "Rwanda", code: "rw", flag: "🇷🇼" },
  { name: "Saint Kitts and Nevis", code: "kn", flag: "🇰🇳" },
  { name: "Saint Lucia", code: "lc", flag: "🇱🇨" },
  { name: "Saint Vincent and the Grenadines", code: "vc", flag: "🇻🇨" },
  { name: "Samoa", code: "ws", flag: "🇼🇸" },
  { name: "San Marino", code: "sm", flag: "🇸🇲" },
  { name: "Sao Tome and Principe", code: "st", flag: "🇸🇹" },
  { name: "Saudi Arabia", code: "sa", flag: "🇸🇦" },
  { name: "Senegal", code: "sn", flag: "🇸🇳" },
  { name: "Serbia", code: "rs", flag: "🇷🇸" },
  { name: "Seychelles", code: "sc", flag: "🇸🇨" },
  { name: "Sierra Leone", code: "sl", flag: "🇸🇱" },
  { name: "Singapore", code: "sg", flag: "🇸🇬" },
  { name: "Slovakia", code: "sk", flag: "🇸🇰" },
  { name: "Slovenia", code: "si", flag: "🇸🇮" },
  { name: "Solomon Islands", code: "sb", flag: "🇸🇧" },
  { name: "Somalia", code: "so", flag: "🇸🇴" },
  { name: "South Africa", code: "za", flag: "🇿🇦" },
  { name: "South Korea", code: "kr", flag: "🇰🇷" },
  { name: "South Sudan", code: "ss", flag: "🇸🇸" },
  { name: "Spain", code: "es", flag: "🇪🇸" },
  { name: "Sri Lanka", code: "lk", flag: "🇱🇰" },
  { name: "Sudan", code: "sd", flag: "🇸🇩" },
  { name: "Suriname", code: "sr", flag: "🇸🇷" },
  { name: "Sweden", code: "se", flag: "🇸🇪" },
  { name: "Switzerland", code: "ch", flag: "🇨🇭" },
  { name: "Syria", code: "sy", flag: "🇸🇾" },
  { name: "Taiwan", code: "tw", flag: "🇹🇼" },
  { name: "Tajikistan", code: "tj", flag: "🇹🇯" },
  { name: "Tanzania", code: "tz", flag: "🇹🇿" },
  { name: "Thailand", code: "th", flag: "🇹🇭" },
  { name: "Togo", code: "tg", flag: "🇹🇬" },
  { name: "Tonga", code: "to", flag: "🇹🇴" },
  { name: "Trinidad and Tobago", code: "tt", flag: "🇹🇹" },
  { name: "Tunisia", code: "tn", flag: "🇹🇳" },
  { name: "Turkey", code: "tr", flag: "🇹🇷" },
  { name: "Turkmenistan", code: "tm", flag: "🇹🇲" },
  { name: "Tuvalu", code: "tv", flag: "🇹🇻" },
  { name: "Uganda", code: "ug", flag: "🇺🇬" },
  { name: "Ukraine", code: "ua", flag: "🇺🇦" },
  { name: "United Arab Emirates", code: "ae", flag: "🇦🇪" },
  { name: "United Kingdom", code: "gb", flag: "🇬🇧" },
  { name: "United States", code: "us", flag: "🇺🇸" },
  { name: "Uruguay", code: "uy", flag: "🇺🇾" },
  { name: "Uzbekistan", code: "uz", flag: "🇺🇿" },
  { name: "Vanuatu", code: "vu", flag: "🇻🇺" },
  { name: "Vatican City", code: "va", flag: "🇻🇦" },
  { name: "Venezuela", code: "ve", flag: "🇻🇪" },
  { name: "Vietnam", code: "vn", flag: "🇻🇳" },
  { name: "Yemen", code: "ye", flag: "🇾🇪" },
  { name: "Zambia", code: "zm", flag: "🇿🇲" },
  { name: "Zimbabwe", code: "zw", flag: "🇿🇼" },
];

function getTimeGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good Morning";
  if (hour >= 12 && hour < 17) return "Good Afternoon";
  return "Good Evening";
}

// Clean SVG Icon component
function Icon({ name, size = 20, className = "" }) {
  const iconProps = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className: `svg-icon ${className}`
  };

  switch (name) {
    case "home":
      return (
        <svg {...iconProps}>
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      );
    case "academy":
      return (
        <svg {...iconProps}>
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
      );
    case "learning":
      return (
        <svg {...iconProps}>
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          <line x1="8" y1="6" x2="16" y2="6" />
          <line x1="8" y1="10" x2="14" y2="10" />
        </svg>
      );
    case "projects":
      return (
        <svg {...iconProps}>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
        </svg>
      );
    case "portfolio":
      return (
        <svg {...iconProps}>
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      );
    case "community":
      return (
        <svg {...iconProps}>
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case "opportunities":
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="10" />
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      );
    case "notifications":
      return (
        <svg {...iconProps}>
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      );
    case "settings":
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      );
    case "bell":
      return (
        <svg {...iconProps}>
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      );
    case "search":
      return (
        <svg {...iconProps}>
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      );
    case "play":
      return (
        <svg {...iconProps} fill="currentColor">
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
      );
    case "lock":
      return (
        <svg {...iconProps}>
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      );
    case "lessons":
      return (
        <svg {...iconProps}>
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      );
    case "pencil":
      return (
        <svg {...iconProps}>
          <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
        </svg>
      );
    case "check":
      return (
        <svg {...iconProps}>
          <polyline points="20 6 9 17 4 12" />
        </svg>
      );
    case "fire":
      return (
        <svg {...iconProps} fill="currentColor">
          <path d="M12 23c-4.97 0-9-4.03-9-9 0-3.65 2.17-6.8 5.37-8.15.42-.18.89.1.94.55.08.77.34 2.1 1.19 2.6 1.15-2.2 2.87-4.5 4.5-6.5.3-.37.88-.28 1.05.17C17.5 6.5 21 11.2 21 14c0 4.97-4.03 9-9 9zm0-14c-1.2 1.5-2.4 3.2-3 5-.3.9-.1 1.9.5 2.6.6.7 1.5 1.1 2.5 1.1s1.9-.4 2.5-1.1c.6-.7.8-1.7.5-2.6-.6-1.8-1.8-3.5-3-5z"/>
        </svg>
      );
    case "badge-fire":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="#ffffff" className={className}>
          <path d="M12 23c-4.97 0-9-4.03-9-9 0-3.65 2.17-6.8 5.37-8.15.42-.18.89.1.94.55.08.77.34 2.1 1.19 2.6 1.15-2.2 2.87-4.5 4.5-6.5.3-.37.88-.28 1.05.17C17.5 6.5 21 11.2 21 14c0 4.97-4.03 9-9 9zm0-14c-1.2 1.5-2.4 3.2-3 5-.3.9-.1 1.9.5 2.6.6.7 1.5 1.1 2.5 1.1s1.9-.4 2.5-1.1c.6-.7.8-1.7.5-2.6-.6-1.8-1.8-3.5-3-5z"/>
        </svg>
      );
    case "badge-project":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="#ffffff" className={className}>
          <rect x="3" y="3" width="8" height="8" rx="2.5" />
          <rect x="13" y="3" width="8" height="8" rx="2.5" />
          <rect x="3" y="13" width="8" height="8" rx="2.5" />
          <rect x="13" y="13" width="8" height="8" rx="2.5" />
        </svg>
      );
    case "badge-quiz":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
          <path d="M21.5 12A9.5 9.5 0 1 1 17.5 4.5L21.5 8" />
          <polyline points="21.5 3 21.5 8 16.5 8" />
          <polyline points="8.5 12.5 11 15 16 9.5" />
        </svg>
      );
    case "badge-skill":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="#ffffff" className={className}>
          <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
          <path d="M5 13.18v4c0 2.5 3.13 4.82 7 4.82s7-2.32 7-4.82v-4l-7 3.82-7-3.82z" />
        </svg>
      );
    case "close":
      return (
        <svg {...iconProps}>
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      );
    case "chart":
      return (
        <svg {...iconProps}>
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      );
    case "monitor":
      return (
        <svg {...iconProps}>
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      );
    case "trophy":
      return (
        <svg {...iconProps}>
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
          <path d="M4 22h16" />
          <path d="M10 14.66V17c0 .55-.45 1-1 1H7" />
          <path d="M14 14.66V17c0 .55.45 1 1 1h2" />
          <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
        </svg>
      );
    case "check-square":
      return (
        <svg {...iconProps}>
          <polyline points="9 11 12 14 22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
      );
    case "in-progress-book":
      return (
        <svg {...iconProps}>
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
          <circle cx="12" cy="12" r="3" />
          <polyline points="12 10 12 12 13.5 12" />
        </svg>
      );
    case "award-ribbon":
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="8" r="6" />
          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
        </svg>
      );
    case "folder":
      return (
        <svg {...iconProps}>
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
      );
    case "plus":
      return (
        <svg {...iconProps}>
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      );
    default:
      return null;
  }
}

// Course Catalog with rich lesson metadata for the Ongoing Course view
const academyCourses = [
  {
    id: "uiux-1",
    category: "Design",
    title: "UI/UX Design Fundamentals",
    module: "Designing User Interfaces",
    meta: "3 Lessons • Beginner",
    lessonsCount: 3,
    level: "Beginner",
    description: "Design clean, usable interfaces from wireframe to prototype. Learn type hierarchy, layouts, and responsive design.",
    status: "in-progress",
    btnLabel: "Continue Learning",
    btnStyle: "light",
    thumbnail: "Images/course-uiux.png",
    heroThumbnail: "Images/home-hero-uiux.png",
    instructor: "Joseph Joestar",
    instructorRole: "Product Designer. Tutor",
    instructorAvatar: "Images/tutor-joseph.png",
    videoUrl: "https://www.youtube.com/embed/c9Wg6Cb_YlU",
    duration: "22 mins",
    curriculum: [
      {
        title: "What is Typography",
        duration: "6 min",
        done: true,
        savedTimestamp: 0,
        description: "Explore the core building blocks of digital typography, font weights, and how text shapes user experiences across devices.",
        tags: ["Typography", "Hierarchy", "Fundamentals"]
      },
      {
        title: "Type Anatomy",
        duration: "9 min",
        done: true,
        savedTimestamp: 0,
        description: "Deep dive into x-height, ascenders, descenders, kerning, and baseline grids to build balanced interfaces.",
        tags: ["Type Anatomy", "Grids", "Spacing"]
      },
      {
        title: "Choosing Typefaces",
        duration: "7 min",
        done: false,
        savedTimestamp: 120,
        description: "A typeface sets the tone before a single word is read. Learn how to choose typefaces that match a product's personality, judge readability at different sizes, and pair a display face with a body face without clashing.",
        tags: ["Readability", "Type Pairing", "Hierarchy"]
      }
    ]
  },
  {
    id: "mkt-1",
    category: "Marketing",
    title: "Digital Marketing",
    module: "Audience Growth & Analytics",
    meta: "3 Lessons • Beginner",
    lessonsCount: 3,
    level: "Beginner",
    description: "Grow an audience with content, social media channels, and actionable analytics.",
    status: "in-progress",
    btnLabel: "Continue Learning",
    btnStyle: "light",
    thumbnail: "Images/course-marketing.png",
    instructor: "Leo Martins",
    instructorRole: "Growth Marketer. Tutor",
    instructorAvatar: "Images/tutor-leo.png",
    videoUrl: "https://www.youtube.com/embed/bixR-KIJKYM",
    duration: "21 mins",
    curriculum: [
      {
        title: "Digital Marketing Landscape for Creators",
        duration: "10 min",
        done: true,
        savedTimestamp: 0,
        description: "Understand inbound channels, creator ecosystems, and identifying where your target audience hangs out online.",
        tags: ["Strategy", "Ecosystem", "Foundations"]
      },
      {
        title: "Building a Content Calendar",
        duration: "6 min",
        done: false,
        savedTimestamp: 0,
        description: "Build content pillars and scheduling frameworks that attract and retain loyal followers.",
        tags: ["Content Strategy", "Calendar", "Personas"]
      },
      {
        title: "Search & Social Analytics Mastery",
        duration: "5 min",
        done: false,
        savedTimestamp: 0,
        description: "Interpret impressions, engagement rates, click-throughs, and convert data insights into higher performing posts.",
        tags: ["Analytics", "Metrics", "Optimization"]
      }
    ]
  },
  {
    id: "media-1",
    category: "Media",
    title: "Content Creation",
    module: "Video Production & Storytelling",
    meta: "3 Lessons • Beginner",
    lessonsCount: 3,
    level: "Beginner",
    description: "Shoot, edit, and publish video content that engages audiences from the very first second.",
    status: "in-progress",
    btnLabel: "Continue Learning",
    btnStyle: "light",
    thumbnail: "Images/course-content.png",
    instructor: "Priya Shah",
    instructorRole: "Creator. Tutor",
    instructorAvatar: "Images/tutor-priya.png",
    videoUrl: "https://www.youtube.com/embed/nLRL_NcnK-4",
    duration: "21 mins",
    curriculum: [
      {
        title: "Camera Angles, Lighting & Phone Setups",
        duration: "10 min",
        done: true,
        savedTimestamp: 0,
        description: "Set up cinematic 3-point lighting and frame compelling video shots using your smartphone camera.",
        tags: ["Lighting", "Framing", "Mobile Production"]
      },
      {
        title: "Building a Content Calendar",
        duration: "6 min",
        done: false,
        savedTimestamp: 0,
        description: "Learn psychological hooks, narrative arcs, and pacing techniques to maintain high retention on short-form video.",
        tags: ["Hook", "Storyboarding", "Retention"]
      },
      {
        title: "Premiere & CapCut Editing Masterclass",
        duration: "5 min",
        done: false,
        savedTimestamp: 0,
        description: "Pacing cuts, seamless transitions, dynamic sound effects, and color grading for YouTube and TikTok.",
        tags: ["Editing", "CapCut", "Premiere"]
      }
    ]
  },
  {
    id: "creative-1",
    category: "Design",
    title: "Into to Creative Thinking",
    module: "Creative Problem Solving",
    meta: "4 Lessons • Beginner",
    lessonsCount: 4,
    level: "Beginner",
    description: "Unlock breakthrough ideas, overcome creative blocks, and build strong thinking habits.",
    status: "completed",
    btnLabel: "Review Course",
    btnStyle: "light",
    thumbnail: "Images/course-thinking.png",
    instructor: "Leo Martins",
    instructorRole: "Growth Marketer. Tutor",
    instructorAvatar: "Images/tutor-leo.png",
    videoUrl: "https://www.youtube.com/embed/bixR-KIJKYM",
    duration: "24 mins",
    curriculum: [
      {
        title: "Foundations of Divergent Thinking",
        duration: "6 min",
        done: true,
        savedTimestamp: 360,
        description: "Learn how to expand options before narrowing down to solutions.",
        tags: ["Creativity", "Thinking", "Ideation"]
      },
      {
        title: "Overcoming Creative Blocks & Fear",
        duration: "7 min",
        done: true,
        savedTimestamp: 420,
        description: "Actionable frameworks to jumpstart creative flow when you feel stuck.",
        tags: ["Mindset", "Productivity", "Focus"]
      },
      {
        title: "Analogies, Lateral Jumps & Mind Maps",
        duration: "6 min",
        done: true,
        savedTimestamp: 360,
        description: "Connect unrelated concepts to create novel ideas and innovative solutions.",
        tags: ["Mind Mapping", "Innovation", "Brainstorming"]
      },
      {
        title: "Complete",
        duration: "5 min",
        done: true,
        savedTimestamp: 300,
        description: "Synthesize your learnings into daily habits for lifelong creative thinking.",
        tags: ["Review", "Summary", "Mastery"]
      }
    ]
  },

  {
    id: "web-1",
    category: "Web Development",
    title: "Intro to Web Development",
    module: "Frontend Coding Essentials",
    meta: "4 Lessons • Beginner",
    lessonsCount: 4,
    level: "Beginner",
    description: "Build your first responsive website from scratch with HTML5, modern CSS, and Flexbox.",
    status: "enroll",
    btnLabel: "Enroll Now",
    btnStyle: "solid",
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    instructor: "Alex Rivera",
    instructorRole: "Senior Frontend Engineer",
    instructorAvatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=120&q=80",
    videoUrl: "https://www.youtube.com/embed/mU6anWqZJcc",
    duration: "32 mins",
    curriculum: [
      {
        title: "How the Web Works: HTML Document Structure",
        duration: "10 min",
        done: false,
        savedTimestamp: 0,
        description: "Learn how browsers parse HTML tags, semantic elements, and build accessible webpage foundations.",
        tags: ["HTML5", "Semantics", "Web Structure"]
      },
      {
        title: "Styling with Modern CSS & Flexbox",
        duration: "18 min",
        done: false,
        savedTimestamp: 0,
        description: "Master CSS box model, colors, custom fonts, and 1D flexbox layouts that adapt smoothly to screen sizes.",
        tags: ["CSS3", "Flexbox", "Responsive"]
      },
      {
        title: "Building a Responsive Portfolio Landing Page",
        duration: "32 min",
        done: false,
        savedTimestamp: 0,
        description: "Code a real personal showcase page with hero section, project grid, and mobile hamburger navigation.",
        tags: ["Projects", "Portfolio", "Hands-on"]
      },
      {
        title: "Deploying Your Website to GitHub Pages & Vercel",
        duration: "12 min",
        done: false,
        savedTimestamp: 0,
        description: "Publish your website live to the world with a public URL using free GitHub Pages and Vercel hosting.",
        tags: ["Deployment", "Git", "Hosting"]
      }
    ]
  },
  {
    id: "design-2",
    category: "Design",
    title: "Personal Branding",
    module: "Creative Identity & Case Studies",
    meta: "4 Lessons • Intermediate",
    lessonsCount: 4,
    level: "Intermediate",
    description: "Craft a compelling story, portfolio case study, and online presence that stands out.",
    status: "enroll",
    btnLabel: "Enroll Now",
    btnStyle: "solid",
    thumbnail: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
    instructor: "Sophie Turner",
    instructorRole: "Creative Director",
    instructorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80",
    videoUrl: "https://www.youtube.com/embed/G6Y_oEw8Poc",
    duration: "19 mins",
    curriculum: [
      {
        title: "Defining Your Creative Identity & Niche",
        duration: "9 min",
        done: false,
        savedTimestamp: 0,
        description: "Identify your unique strengths, visual style, and target audience in the creator ecosystem.",
        tags: ["Branding", "Positioning", "Identity"]
      },
      {
        title: "Crafting a Compelling Case Study",
        duration: "14 min",
        done: false,
        savedTimestamp: 0,
        description: "Structure design problem-solving stories with problem statement, user research, wireframes, and final impact.",
        tags: ["Case Studies", "Storytelling", "UX"]
      },
      {
        title: "Building Your Online Portfolio Space",
        duration: "19 min",
        done: false,
        savedTimestamp: 0,
        description: "Select the right platform and design a clean layout that showcases your best builds.",
        tags: ["Portfolio", "Presentation", "UI"]
      },
      {
        title: "Networking & Reaching Out to Opportunities",
        duration: "11 min",
        done: false,
        savedTimestamp: 0,
        description: "Write effective intro emails and connect with mentors, peers, and collaborators.",
        tags: ["Outreach", "Networking", "Career"]
      }
    ]
  },
  {
    id: "biz-1",
    category: "Business",
    title: "Build Your First Business",
    module: "Idea Validation & Launch",
    meta: "4 Lessons • Beginner",
    lessonsCount: 4,
    level: "Beginner",
    description: "Turn a useful idea into a simple plan, launch strategy, and first offer.",
    status: "enroll",
    btnLabel: "Enroll Now",
    btnStyle: "solid",
    thumbnail: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
    instructor: "David Sterling",
    instructorRole: "Startup Mentor",
    instructorAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80",
    videoUrl: "https://www.youtube.com/embed/1vRz2aG1O9s",
    duration: "28 mins",
    curriculum: [
      {
        title: "Finding Problems Worth Solving as a Teen",
        duration: "12 min",
        done: false,
        savedTimestamp: 0,
        description: "Spot everyday frictions and unmet needs that people are willing to pay for.",
        tags: ["Ideation", "Market Research", "Opportunities"]
      },
      {
        title: "The 1-Page Business Model Canvas",
        duration: "15 min",
        done: false,
        savedTimestamp: 0,
        description: "Map out value propositions, customer segments, channels, and revenue streams quickly on 1 page.",
        tags: ["Business Model", "Strategy", "Lean"]
      },
      {
        title: "Creating Your First Minimum Viable Product",
        duration: "28 min",
        done: false,
        savedTimestamp: 0,
        description: "Build a prototype or pilot service in under 48 hours to validate demand with real users.",
        tags: ["MVP", "Validation", "Prototyping"]
      },
      {
        title: "Getting Your First 10 Customers",
        duration: "14 min",
        done: false,
        savedTimestamp: 0,
        description: "Reach your first buyers through direct outreach, localized word-of-mouth, and early bird perks.",
        tags: ["Sales", "Launch", "Customers"]
      }
    ]
  },
  {
    id: "coding-basics",
    category: "Tech",
    title: "Coding Basics",
    module: "Frontend Coding Essentials",
    meta: "4 Lessons • Beginner",
    lessonsCount: 4,
    level: "Beginner",
    description: "Dive into HTML, CSS, and JavaScript. Understand the logic behind the web and build your very first interactive site.",
    status: "enroll",
    btnLabel: "Enroll Now",
    btnStyle: "solid",
    thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
    instructor: "Elena Rivera",
    instructorRole: "Software Engineer",
    instructorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80",
    videoUrl: "https://www.youtube.com/embed/mU6anWqZJcc",
    duration: "32 mins",
    curriculum: [
      {
        title: "How the Web Works: HTML Structure",
        duration: "10 min",
        done: false,
        savedTimestamp: 0,
        description: "Understand the fundamentals of HTML, document hierarchies, and semantic page structure.",
        tags: ["HTML", "Web", "Fundamentals"]
      },
      {
        title: "Styling with CSS & Modern Flexbox",
        duration: "12 min",
        done: false,
        savedTimestamp: 0,
        description: "Bring pages to life with color palettes, typography, and responsive 1D flexbox layouts.",
        tags: ["CSS", "Layout", "Styling"]
      },
      {
        title: "Interactive JavaScript Basics",
        duration: "15 min",
        done: false,
        savedTimestamp: 0,
        description: "Add user interactions, button events, and dynamic DOM manipulation.",
        tags: ["JavaScript", "Logic", "Interaction"]
      },
      {
        title: "Deploying Your First Project Live",
        duration: "10 min",
        done: false,
        savedTimestamp: 0,
        description: "Publish your interactive site to the web with a free public URL on GitHub Pages.",
        tags: ["Deployment", "Projects", "Portfolio"]
      }
    ]
  },
  {
    id: "ai-prompt-engineering",
    category: "AI & Tech",
    title: "AI & Prompt Engineering",
    module: "Generative AI & Smart Workflows",
    meta: "4 Lessons • Intermediate",
    lessonsCount: 4,
    level: "Intermediate",
    description: "Explore modern AI models, smart workflows, and build practical AI tools that supercharge your study and creativity.",
    status: "enroll",
    btnLabel: "Enroll Now",
    btnStyle: "solid",
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    instructor: "Dr. Aris Thorne",
    instructorRole: "AI Researcher",
    instructorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
    videoUrl: "https://www.youtube.com/embed/jC4v5AS4RIM",
    duration: "26 mins",
    curriculum: [
      {
        title: "Understanding Large Language Models",
        duration: "7 min",
        done: false,
        savedTimestamp: 0,
        description: "Learn how modern transformer models process context, tokens, and generate human-like reasoning.",
        tags: ["AI Fundamentals", "LLMs", "Concepts"]
      },
      {
        title: "Prompt Engineering Frameworks",
        duration: "11 min",
        done: false,
        savedTimestamp: 0,
        description: "Master zero-shot, few-shot, and chain-of-thought prompt patterns for high-precision outputs.",
        tags: ["Prompting", "Techniques", "Workflows"]
      },
      {
        title: "Building Custom AI Assistants & Tools",
        duration: "18 min",
        done: false,
        savedTimestamp: 0,
        description: "Create personalized study bots, code generators, and creative writing companions.",
        tags: ["AI Tools", "Automation", "Hands-on"]
      },
      {
        title: "AI Safety, Ethics & Future Horizons",
        duration: "8 min",
        done: false,
        savedTimestamp: 0,
        description: "Navigate bias, hallucination detection, intellectual property, and responsible usage.",
        tags: ["Ethics", "Safety", "Future"]
      }
    ]
  },
  {
    id: "financial-smarts",
    category: "Finance",
    title: "Financial Smarts & Wealth",
    module: "Money Management for Teens",
    meta: "4 Lessons • Beginner",
    lessonsCount: 4,
    level: "Beginner",
    description: "Master budgeting, smart investing basics, credit knowledge, and compound interest to build early financial freedom.",
    status: "enroll",
    btnLabel: "Enroll Now",
    btnStyle: "solid",
    thumbnail: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=800&q=80",
    instructor: "Chloe Zhang",
    instructorRole: "Wealth Educator",
    instructorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80",
    videoUrl: "https://www.youtube.com/embed/bixR-KIJKYM",
    duration: "20 mins",
    curriculum: [
      {
        title: "The Power of Compound Growth Early On",
        duration: "6 min",
        done: false,
        savedTimestamp: 0,
        description: "Discover the exponential math of saving and investing in your teens versus your thirties.",
        tags: ["Compound Interest", "Growth", "Foundations"]
      },
      {
        title: "Budgeting That Fits Your Real Life",
        duration: "8 min",
        done: false,
        savedTimestamp: 0,
        description: "Set up the 50/30/20 rule, track spending without stress, and automate emergency savings.",
        tags: ["Budgeting", "Cash Flow", "Habits"]
      },
      {
        title: "Introduction to Index Funds & Investing",
        duration: "12 min",
        done: false,
        savedTimestamp: 0,
        description: "Understand stocks, ETFs, mutual funds, risk diversification, and long-term holding.",
        tags: ["Investing", "Stocks", "ETFs"]
      },
      {
        title: "Avoiding Debt Traps & Building Credit",
        duration: "9 min",
        done: false,
        savedTimestamp: 0,
        description: "Learn how credit scores work and how to leverage smart financial habits safely.",
        tags: ["Credit", "Debt", "Security"]
      }
    ]
  },
  {
    id: "habit-mastery",
    category: "Growth",
    title: "High Performance Habits",
    module: "Productivity & Routine Design",
    meta: "3 Lessons • Beginner",
    lessonsCount: 3,
    level: "Beginner",
    description: "Build unstoppable focus, overcome procrastination, and design daily study routines that keep you ahead without burnout.",
    status: "enroll",
    btnLabel: "Enroll Now",
    btnStyle: "solid",
    thumbnail: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80",
    instructor: "David Miller",
    instructorRole: "Mindset Coach",
    instructorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80",
    videoUrl: "https://www.youtube.com/embed/G6Y_oEw8Poc",
    duration: "18 mins",
    curriculum: [
      {
        title: "The Anatomy of a Habit Loop",
        duration: "6 min",
        done: false,
        savedTimestamp: 0,
        description: "Deconstruct cue, craving, response, and reward to replace friction with effortless action.",
        tags: ["Habit Loop", "Psychology", "Behavior"]
      },
      {
        title: "Designing Frictionless Focus Environments",
        duration: "8 min",
        done: false,
        savedTimestamp: 0,
        description: "Eliminate phone distractions, curate deep work zones, and leverage 90-minute ultradian cycles.",
        tags: ["Deep Work", "Focus", "Environment"]
      },
      {
        title: "Weekly Review & Overcoming Slumps",
        duration: "7 min",
        done: false,
        savedTimestamp: 0,
        description: "Establish Sunday resets and bounce back immediately when daily routines get off track.",
        tags: ["Review", "Resilience", "Mindset"]
      }
    ]
  },
  {
    id: "teen-leadership",
    category: "Leadership",
    title: "Public Speaking & Leadership",
    module: "Executive Communication & Influence",
    meta: "4 Lessons • Beginner",
    lessonsCount: 4,
    level: "Beginner",
    description: "Command attention on stage, communicate ideas persuasively, and lead project teams with empathy and authority.",
    status: "enroll",
    btnLabel: "Enroll Now",
    btnStyle: "solid",
    thumbnail: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80",
    instructor: "Maya Fox",
    instructorRole: "Leadership Coach",
    instructorAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80",
    videoUrl: "https://www.youtube.com/embed/nLRL_NcnK-4",
    duration: "22 mins",
    curriculum: [
      {
        title: "Conquering Stage Fright & Body Language",
        duration: "7 min",
        done: false,
        savedTimestamp: 0,
        description: "Techniques to calm adrenaline, project vocal power, and stand with natural authority.",
        tags: ["Public Speaking", "Confidence", "Delivery"]
      },
      {
        title: "Structuring Persuasive Presentations",
        duration: "9 min",
        done: false,
        savedTimestamp: 0,
        description: "Craft presentations with memorable 3-point narratives, hook openings, and emotional call-to-actions.",
        tags: ["Storytelling", "Slides", "Persuasion"]
      },
      {
        title: "Leading Teams & Effective Collaboration",
        duration: "12 min",
        done: false,
        savedTimestamp: 0,
        description: "Delegate tasks clearly, run constructive feedback sessions, and resolve team tensions.",
        tags: ["Teamwork", "Management", "Empathy"]
      },
      {
        title: "Everyday Influence & Networking",
        duration: "8 min",
        done: false,
        savedTimestamp: 0,
        description: "Pitch ideas to mentors, teachers, and partners with clarity and poise.",
        tags: ["Networking", "Influence", "Pitching"]
      }
    ]
  },
  {
    id: "uiux-design",
    category: "Design",
    title: "UI/UX Design",
    module: "Designing User Interfaces",
    meta: "5 Lessons • Beginner",
    lessonsCount: 5,
    level: "Beginner",
    description: "Learn the fundamentals of user interface and experience design. Create stunning digital products that people love to use.",
    status: "enroll",
    btnLabel: "Enroll Now",
    btnStyle: "solid",
    thumbnail: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80",
    instructor: "Joseph Joestar",
    instructorRole: "Product Designer, Tutor",
    instructorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
    videoUrl: "https://www.youtube.com/embed/c9Wg6Cb_YlU",
    duration: "18 mins",
    curriculum: [
      {
        title: "What is Typography & Visual Hierarchy",
        duration: "3 min",
        done: false,
        savedTimestamp: 0,
        description: "Explore core building blocks of digital typography and font weights.",
        tags: ["Typography", "Hierarchy", "Fundamentals"]
      },
      {
        title: "Layouts, Spacing & Responsive Grids",
        duration: "4 min",
        done: false,
        savedTimestamp: 0,
        description: "Deep dive into 8pt grid systems, padding, and UI component spacing.",
        tags: ["Grids", "Layout", "Spacing"]
      },
      {
        title: "Choosing Color Schemes for Accessibility",
        duration: "5 min",
        done: false,
        savedTimestamp: 0,
        description: "Pick color palettes that pass WCAG contrast and express brand emotion.",
        tags: ["Colors", "Contrast", "Accessibility"]
      },
      {
        title: "Interactive Wireframes to High-Fidelity",
        duration: "6 min",
        done: false,
        savedTimestamp: 0,
        description: "Translate paper sketches into clickable prototypes with Figma.",
        tags: ["Figma", "Prototypes", "UI"]
      }
    ]
  },
  {
    id: "digital-content-creation",
    category: "Media",
    title: "Digital Content Creation",
    module: "Video Production & Storytelling",
    meta: "4 Lessons • Intermediate",
    lessonsCount: 4,
    level: "Intermediate",
    description: "Master the art of storytelling across video, audio, and social media. Build an audience and brand your voice.",
    status: "enroll",
    btnLabel: "Enroll Now",
    btnStyle: "solid",
    thumbnail: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=80",
    instructor: "Marcus Reed",
    instructorRole: "Filmmaker & YouTube Creator",
    instructorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
    videoUrl: "https://www.youtube.com/embed/nLRL_NcnK-4",
    duration: "25 mins",
    curriculum: [
      {
        title: "Camera Angles, Lighting & Phone Setups",
        duration: "8 min",
        done: false,
        savedTimestamp: 0,
        description: "Set up cinematic 3-point lighting and frame compelling video shots using your smartphone camera.",
        tags: ["Lighting", "Framing", "Mobile Production"]
      },
      {
        title: "Storyboarding & Hooking the Audience in 3s",
        duration: "10 min",
        done: false,
        savedTimestamp: 0,
        description: "Learn psychological hooks, narrative arcs, and pacing techniques to maintain high retention.",
        tags: ["Hook", "Storyboarding", "Retention"]
      },
      {
        title: "Premiere & CapCut Editing Masterclass",
        duration: "25 min",
        done: false,
        savedTimestamp: 0,
        description: "Pacing cuts, seamless transitions, dynamic sound effects, and color grading for YouTube and TikTok.",
        tags: ["Editing", "CapCut", "Premiere"]
      },
      {
        title: "Sound Design, Music & Publishing Strategy",
        duration: "15 min",
        done: false,
        savedTimestamp: 0,
        description: "Select copyright-free music tracks, EQ voiceovers, and optimize video thumbnails.",
        tags: ["Audio", "Thumbnails", "Publishing"]
      }
    ]
  },
  {
    id: "teen-entrepreneurship",
    category: "Business",
    title: "Teen Entrepreneurship 101",
    module: "Idea Validation & Launch",
    meta: "4 Lessons • Beginner",
    lessonsCount: 4,
    level: "Beginner",
    description: "Transform your innovative ideas into a real venture. Learn customer discovery, rapid prototyping, and pitching.",
    status: "enroll",
    btnLabel: "Enroll Now",
    btnStyle: "solid",
    thumbnail: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
    instructor: "Alex Vance",
    instructorRole: "Startup Mentor",
    instructorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
    videoUrl: "https://www.youtube.com/embed/1vRz2aG1O9s",
    duration: "28 mins",
    curriculum: [
      {
        title: "Finding Problems Worth Solving as a Teen",
        duration: "12 min",
        done: false,
        savedTimestamp: 0,
        description: "Spot everyday frictions and unmet needs that people are willing to pay for.",
        tags: ["Ideation", "Market Research", "Opportunities"]
      },
      {
        title: "The 1-Page Business Model Canvas",
        duration: "15 min",
        done: false,
        savedTimestamp: 0,
        description: "Map out value propositions, customer segments, channels, and revenue streams quickly on 1 page.",
        tags: ["Business Model", "Strategy", "Lean"]
      },
      {
        title: "Creating Your First Minimum Viable Product",
        duration: "28 min",
        done: false,
        savedTimestamp: 0,
        description: "Build a prototype or pilot service in under 48 hours to validate demand with real users.",
        tags: ["MVP", "Validation", "Prototyping"]
      },
      {
        title: "Getting Your First 10 Customers",
        duration: "14 min",
        done: false,
        savedTimestamp: 0,
        description: "Reach your first buyers through direct outreach, localized word-of-mouth, and early bird perks.",
        tags: ["Sales", "Launch", "Customers"]
      }
    ]
  }
];

// Helper to parse duration strings like "6:15", "5 min", "18 mins" into seconds
function parseDurationToSeconds(dur) {
  if (!dur) return 300;
  if (typeof dur === "number") return dur;
  if (dur.includes(":")) {
    const parts = dur.split(":").map(Number);
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  const match = dur.match(/(\d+)/);
  return match ? parseInt(match[1], 10) * 60 : 300;
}

// Format seconds into readable MM:SS
function formatSeconds(sec) {
  if (!sec || isNaN(sec)) return "00:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

// Calculate course completion % based on curriculum video durations
function getCourseProgress(course) {
  if (!course || !course.curriculum || !Array.isArray(course.curriculum) || course.curriculum.length === 0) return 0;
  const totalSeconds = course.curriculum.reduce((acc, l) => acc + parseDurationToSeconds(l ? l.duration : "5 min"), 0);
  const doneSeconds = course.curriculum.filter((l) => l && l.done).reduce((acc, l) => acc + parseDurationToSeconds(l ? l.duration : "5 min"), 0);
  return totalSeconds > 0 ? Math.round((doneSeconds / totalSeconds) * 100) : 0;
}

// 6 Showcase Projects matching Images/project-tab.png
const SHOWCASE_PROJECTS_TEMPLATES = [
  {
    id: "proj-social-growth",
    category: "Marketing",
    title: "Social Media Growth Campaign",
    description: "A 30-day content calendar for a fictional streetwear brand, including platform strategy, post formats, and engagement hooks.",
    status: "in-progress",
    statusLabel: "In Progress",
    xp: 80,
    updatedDate: "Updated Sept 1",
    image: "Images/course-marketing.png",
    tags: ["Content Strategy", "Copywriting", "Analytics"],
    featured: true
  },
  {
    id: "proj-portfolio-site",
    category: "Design",
    title: "Personal Portfolio Website",
    description: "A responsive portfolio site built from scratch using Figma designs and HTML/CSS, showcasing my projects and bio.",
    status: "completed",
    statusLabel: "Completed",
    xp: 50,
    updatedDate: "Updated Aug 12",
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80",
    tags: ["UI/UX", "Typography", "Layout"],
    featured: false
  },
  {
    id: "proj-poster-series",
    category: "Design",
    title: "Young Creators Poster Series",
    description: "A set of three motivational posters designed for the Young Creators Challenge. Focused on bold typography and color harmony.",
    status: "draft",
    statusLabel: "Draft",
    xp: 40,
    updatedDate: "Updated Aug 12",
    image: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=600&q=80",
    tags: ["Graphic Design", "Color Theory", "Branding"],
    featured: false
  },
  {
    id: "proj-social-campaign-grid",
    category: "Marketing",
    title: "Social Media Growth Campaign",
    description: "A 30-day content calendar for a fictional streetwear brand, including platform strategy, post formats, and engagement hooks.",
    status: "in-progress",
    statusLabel: "In Progress",
    xp: 80,
    updatedDate: "Updated Sept 1",
    image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=600&q=80",
    tags: ["Content Strategy", "Copywriting", "Analytics"],
    featured: false
  },
  {
    id: "proj-mini-documentary",
    category: "Media",
    title: "Mini Documentary: My Neighbourhood",
    description: "A 3-minute short film shot on a phone, exploring stories from my local area. Practice in framing, pacing, and sound design.",
    status: "completed",
    statusLabel: "Completed",
    xp: 70,
    updatedDate: "Updated Aug 30",
    image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=600&q=80",
    tags: ["Filming", "Editing", "Storytelling"],
    featured: false
  },
  {
    id: "proj-local-cafe",
    category: "Design",
    title: "Landing Page for a Local Café",
    description: "A clean, mobile-first landing page for a family friend's café. This is a real client project building responsive layout skills.",
    status: "in-progress",
    statusLabel: "In Progress",
    xp: 60,
    updatedDate: "Updated Sep 2",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80",
    tags: ["UI/UX", "Responsive Design", "Copywriting"],
    featured: false
  },
  {
    id: "proj-podcast-identity",
    category: "Design",
    title: "Brand Identity for a Podcast",
    description: "Logo, color palette, and typography guide for a teen-run podcast called 'Unfiltered.' Built brand guidelines from scratch.",
    status: "draft",
    statusLabel: "Draft",
    xp: 45,
    updatedDate: "Updated Sep 3",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80",
    tags: ["Branding", "Logo Design", "Typography"],
    featured: false
  }
];

// Calculate level progression where XP requirement increases as levels go higher
// Level 1: 500 XP, Level 2: 750 XP, Level 3: 1,000 XP, Level 4: 1,250 XP, Level 5: 1,500 XP...
function getLevelInfo(totalXp) {
  let level = 1;
  let xpAccumulated = 0;

  while (true) {
    // XP needed specifically to complete the current level (increases with each level)
    const xpRequiredThisLevel = 500 + (level - 1) * 250;

    if (totalXp < xpAccumulated + xpRequiredThisLevel) {
      const currentLevelXp = Math.max(0, totalXp - xpAccumulated);
      const levelProgressPct = Math.min(
        Math.max(Math.round((currentLevelXp / xpRequiredThisLevel) * 100), 0),
        100
      );
      const xpToNext = xpRequiredThisLevel - currentLevelXp;
      return {
        userLevel: level,
        currentLevelXp,
        xpRequiredThisLevel,
        levelProgressPct,
        xpToNext
      };
    }

    xpAccumulated += xpRequiredThisLevel;
    level++;
  }
}

function readStorage(key, fallback) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

// Ensure saved user courses are upgraded and merged with rich course catalog properties
function mergeWithCatalog(savedCourses) {
  if (!savedCourses || !Array.isArray(savedCourses) || savedCourses.length === 0) {
    return academyCourses;
  }
  return academyCourses.map((catalogCourse) => {
    const saved = savedCourses.find((c) => c && c.id === catalogCourse.id);
    if (!saved) return catalogCourse;
    const isShowcaseCourse = ["uiux-1", "mkt-1", "media-1", "creative-1"].includes(catalogCourse.id);
    return {
      ...saved,
      ...catalogCourse,
      ...saved,
      module: catalogCourse.module || saved.module || "General Module",
      instructor: catalogCourse.instructor || saved.instructor || "Instructor",
      instructorRole: catalogCourse.instructorRole || saved.instructorRole || "Tutor",
      instructorAvatar: catalogCourse.instructorAvatar || saved.instructorAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
      thumbnail: catalogCourse.thumbnail || saved.thumbnail,
      heroThumbnail: catalogCourse.heroThumbnail || saved.heroThumbnail,
      instructor: catalogCourse.instructor || saved.instructor,
      instructorRole: catalogCourse.instructorRole || saved.instructorRole,
      instructorAvatar: catalogCourse.instructorAvatar || saved.instructorAvatar,
      module: catalogCourse.module || saved.module,
      videoUrl: catalogCourse.videoUrl || saved.videoUrl,
      curriculum: isShowcaseCourse
        ? catalogCourse.curriculum
        : catalogCourse.curriculum.map((catalogLesson, idx) => {
            const savedLesson = saved.curriculum && saved.curriculum[idx];
            return savedLesson
              ? {
                  ...catalogLesson,
                  ...savedLesson,
                  description: catalogLesson.description || (savedLesson && savedLesson.description) || "Lesson overview",
                  tags: catalogLesson.tags || (savedLesson && savedLesson.tags) || ["Fundamentals"]
                }
              : catalogLesson;
          })
    };
  });
}

// Create clean course list starting with 0% progress for new accounts
function getFreshCourses() {
  return academyCourses.map((course) => ({
    ...course,
    enrolled: false,
    status: "not-started",
    curriculum: course.curriculum.map((lesson) => ({
      ...lesson,
      done: false,
      savedTimestamp: 0
    }))
  }));
}

// Fresh 0-state data template for brand new accounts
function createFreshUserData(user) {
  return {
    email: user.email,
    userLevel: 1,
    userXp: 0,
    streak: 0,
    lastStreakDate: null,
    coursesList: getFreshCourses(),
    projects: []
  };
}

// Default Daniel demo account
const defaultAccount = {
  name: "Daniel",
  email: "daniel@mydearteenager.com",
  password: "password123",
  avatar: "Images/avatar-daniel.png",
  country: "United States"
};

// Default Daniel demo starter progress (starts with UI/UX course ongoing at Choosing Typefaces, Level 4)
const defaultDemoData = {
  email: "daniel@mydearteenager.com",
  userLevel: 4,
  userXp: 2400,
  streak: 1,
  lastStreakDate: null,
  coursesList: academyCourses,
  projects: []
};

// Calculate difference in whole calendar days between two YYYY-MM-DD strings
function getDaysDifference(dateStr1, dateStr2) {
  if (!dateStr1 || !dateStr2) return Infinity;
  const [y1, m1, d1] = dateStr1.split("-").map(Number);
  const [y2, m2, d2] = dateStr2.split("-").map(Number);
  const date1 = new Date(y1, m1 - 1, d1);
  const date2 = new Date(y2, m2 - 1, d2);
  const diffMs = Math.abs(date2.getTime() - date1.getTime());
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

// Reset streak to 0 if the user missed an entire calendar day without logging in / recording a streak
function checkAndResetStreak(userData) {
  if (!userData) return userData;
  if (!userData.lastStreakDate || !userData.streak) {
    return userData;
  }

  const todayStr = new Date().toISOString().slice(0, 10);
  const daysDiff = getDaysDifference(userData.lastStreakDate, todayStr);

  // If 2 or more days have elapsed since last check-in, an entire day was missed -> reset streak
  if (daysDiff > 1) {
    return {
      ...userData,
      streak: 0,
      lastStreakDate: null
    };
  }

  return userData;
}

function getUserDataKey(email) {
  return `mdt-userdata-${(email || "").toLowerCase().trim()}`;
}

function loadUserData(email, fallbackData = null) {
  if (!email) return createFreshUserData({ email: "" });
  const key = getUserDataKey(email);
  const stored = readStorage(key, null);
  if (stored) {
    const verified = checkAndResetStreak(stored);
    if (verified.streak !== stored.streak || verified.lastStreakDate !== stored.lastStreakDate) {
      localStorage.setItem(key, JSON.stringify(verified));
    }
    return {
      ...verified,
      coursesList: mergeWithCatalog(verified.coursesList)
    };
  }

  const initial = fallbackData || createFreshUserData({ email });
  const verifiedInitial = checkAndResetStreak(initial);
  verifiedInitial.coursesList = mergeWithCatalog(verifiedInitial.coursesList);
  localStorage.setItem(key, JSON.stringify(verifiedInitial));
  return verifiedInitial;
}

function saveUserData(email, data) {
  if (!email) return;
  const key = getUserDataKey(email);
  localStorage.setItem(key, JSON.stringify(data));
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save user data to localStorage:", e);
  }
}

// 12 High-Value Interests & Skills matching 04 - Choose Your Interests.png + additional skills
const INTEREST_SKILLS = [
  {
    id: "design-creativity",
    title: "Design & Creativity",
    desc: "Create, design and bring ideas to life"
  },
  {
    id: "technology-coding",
    title: "Technology & Coding",
    desc: "Build software and understand systems"
  },
  {
    id: "content-creation",
    title: "Content Creation",
    desc: "Make videos, write, and share stories"
  },
  {
    id: "communication",
    title: "Communication",
    desc: "Public speaking and clear messaging"
  },
  {
    id: "entrepreneurship",
    title: "Entrepreneurship",
    desc: "Start ventures and innovate"
  },
  {
    id: "personal-development",
    title: "Personal Development",
    desc: "Grow habits and manage time"
  },
  {
    id: "ai-machine-learning",
    title: "AI & Machine Learning",
    desc: "Explore generative AI, smart tools, and prompts"
  },
  {
    id: "financial-literacy",
    title: "Financial Literacy",
    desc: "Master money, budgeting, and investing basics"
  },
  {
    id: "leadership-teamwork",
    title: "Leadership & Teamwork",
    desc: "Lead projects, collaborate, and inspire others"
  },
  {
    id: "science-engineering",
    title: "Science & Engineering",
    desc: "STEM discovery, mechanics, and experiments"
  },
  {
    id: "health-wellness",
    title: "Health & Wellness",
    desc: "Physical vitality, nutrition, and mental balance"
  },
  {
    id: "career-college",
    title: "Career & College Prep",
    desc: "Explore future pathways, portfolios, and goals"
  }
];

function renderInterestIcon(id) {
  switch (id) {
    case "design-creativity":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/>
          <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/>
          <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/>
          <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/>
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.992 6.012 17.488 2 12 2z"/>
        </svg>
      );
    case "technology-coding":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6"/>
          <polyline points="8 6 2 12 8 18"/>
        </svg>
      );
    case "content-creation":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m22 8-6 4 6 4V8Z"/>
          <rect width="14" height="12" x="2" y="6" rx="2" ry="2"/>
        </svg>
      );
    case "communication":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      );
    case "entrepreneurship":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18h6"/>
          <path d="M10 22h4"/>
          <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/>
        </svg>
      );
    case "personal-development":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
          <polyline points="17 6 23 6 23 12"/>
        </svg>
      );
    case "ai-machine-learning":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      );
    case "financial-literacy":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="14" x="2" y="5" rx="2"/>
          <line x1="2" x2="22" y1="10" y2="10"/>
          <circle cx="16" cy="14" r="1.5"/>
        </svg>
      );
    case "leadership-teamwork":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      );
    case "science-engineering":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="2"/>
          <path d="M16.24 7.76a6 6 0 1 0-8.49 8.49"/>
          <path d="M7.76 7.76a6 6 0 1 1 8.49 8.49"/>
        </svg>
      );
    case "health-wellness":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
        </svg>
      );
    case "career-college":
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
          <path d="M6 12v5c3 3 9 3 12 0v-5"/>
        </svg>
      );
    default:
      return null;
  }
}

// 12 High-Value Goals matching 05 - Choose Your Goals.png + additional goals
const GOAL_OPTIONS = [
  { id: "learn-skill", title: "Learn a new skill" },
  { id: "build-projects", title: "Build useful projects" },
  { id: "improve-confidence", title: "Improve my confidence" },
  { id: "career-future", title: "Prepare for my future career" },
  { id: "build-portfolio", title: "Build a portfolio" },
  { id: "discover-opportunities", title: "Discover opportunities" },
  { id: "better-habits", title: "Develop better learning habits" },
  { id: "explore-strengths", title: "Explore what I'm good at" },
  { id: "connect-mentors", title: "Connect with mentors & peers" },
  { id: "verified-certificates", title: "Earn verified certificates" },
  { id: "start-venture", title: "Start a project or venture" },
  { id: "master-focus", title: "Master focus & time habits" }
];

function renderGoalIcon(id) {
  switch (id) {
    case "learn-skill":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        </svg>
      );
    case "build-projects":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
        </svg>
      );
    case "improve-confidence":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
          <path d="M4 22h16"/>
          <path d="M10 14.66V17c0 .55-.45 1-1 1H8v4h8v-4h-1c-.55 0-1-.45-1-1v-2.34"/>
          <path d="M6 2h12v7a6 6 0 0 1-12 0V2z"/>
        </svg>
      );
    case "career-future":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="14" x="2" y="7" rx="2" ry="2"/>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
        </svg>
      );
    case "build-portfolio":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>
          <polygon points="12 10 13.2 12.5 16 12.8 14 14.7 14.5 17.5 12 16.1 9.5 17.5 10 14.7 8 12.8 10.8 12.5 12 10" fill="currentColor" stroke="none"/>
        </svg>
      );
    case "discover-opportunities":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor"/>
        </svg>
      );
    case "better-habits":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7z"/>
          <path d="M9 21h6"/>
          <circle cx="12" cy="9" r="2"/>
        </svg>
      );
    case "explore-strengths":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9"/>
          <circle cx="12" cy="12" r="3"/>
          <line x1="12" y1="3" x2="12" y2="9"/>
          <line x1="12" y1="15" x2="12" y2="21"/>
          <line x1="3" y1="12" x2="9" y2="12"/>
          <line x1="15" y1="12" x2="21" y2="12"/>
        </svg>
      );
    case "connect-mentors":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      );
    case "verified-certificates":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="6"/>
          <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
        </svg>
      );
    case "start-venture":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
          <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
          <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
          <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
        </svg>
      );
    case "master-focus":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <circle cx="12" cy="12" r="6"/>
          <circle cx="12" cy="12" r="2" fill="currentColor"/>
        </svg>
      );
    default:
      return null;
  }
}

// Catalog of learning paths matching 06 - Personalise My Learning.png + personalized pathways
const RECOMMENDED_PATHS_CATALOG = [
  {
    id: "uiux-design",
    title: "UI/UX Design",
    category: "Design",
    level: "Beginner",
    duration: "4 wks",
    xp: 500,
    desc: "Learn the fundamentals of user interface and experience design. Create stunning digital products that people love to use.",
    instructorName: "Sarah J.",
    instructorRole: "Design Lead",
    instructorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
    image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80",
    matchingSkills: ["design-creativity", "technology-coding"],
    matchingGoals: ["build-portfolio", "learn-skill", "build-projects", "explore-strengths"]
  },
  {
    id: "digital-content",
    title: "Digital Content Creation",
    category: "Media",
    level: "Intermediate",
    duration: "6 wks",
    xp: 500,
    desc: "Master the art of storytelling across video, audio, and social media. Build an audience and brand your voice.",
    instructorName: "Marcus T.",
    instructorRole: "Content Creator",
    instructorAvatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80",
    image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=600&q=80",
    matchingSkills: ["content-creation", "communication"],
    matchingGoals: ["discover-opportunities", "explore-strengths", "build-projects", "connect-mentors"]
  },
  {
    id: "coding-basics",
    title: "Coding Basics",
    category: "Tech",
    level: "Beginner",
    duration: "8 wks",
    xp: 500,
    desc: "Dive into HTML, CSS, and JavaScript. Understand the logic behind the web and build your very first interactive site.",
    instructorName: "Elena R.",
    instructorRole: "Software Eng",
    instructorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80",
    matchingSkills: ["technology-coding", "ai-machine-learning", "science-engineering"],
    matchingGoals: ["build-projects", "learn-skill", "career-future", "start-venture"]
  },
  {
    id: "teen-entrepreneurship",
    title: "Teen Entrepreneurship 101",
    category: "Business",
    level: "Beginner",
    duration: "5 wks",
    xp: 500,
    desc: "Transform your innovative ideas into a real venture. Learn customer discovery, rapid prototyping, and pitching.",
    instructorName: "Alex Vance",
    instructorRole: "Startup Mentor",
    instructorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80",
    matchingSkills: ["entrepreneurship", "communication", "financial-literacy"],
    matchingGoals: ["start-venture", "career-future", "build-projects"]
  },
  {
    id: "ai-prompt-engineering",
    title: "AI & Prompt Engineering",
    category: "AI & Tech",
    level: "Intermediate",
    duration: "4 wks",
    xp: 500,
    desc: "Explore modern AI models, smart workflows, and build practical AI tools that supercharge your study and creativity.",
    instructorName: "Dr. Aris Thorne",
    instructorRole: "AI Researcher",
    instructorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
    matchingSkills: ["ai-machine-learning", "technology-coding", "science-engineering"],
    matchingGoals: ["learn-skill", "discover-opportunities", "better-habits"]
  },
  {
    id: "financial-smarts",
    title: "Financial Smarts & Wealth",
    category: "Finance",
    level: "Beginner",
    duration: "4 wks",
    xp: 500,
    desc: "Master budgeting, smart investing basics, credit knowledge, and compound interest to build early financial freedom.",
    instructorName: "Chloe Zhang",
    instructorRole: "Wealth Educator",
    instructorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80",
    image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=600&q=80",
    matchingSkills: ["financial-literacy", "entrepreneurship"],
    matchingGoals: ["career-future", "better-habits"]
  },
  {
    id: "habit-mastery",
    title: "High Performance Habits",
    category: "Growth",
    level: "Beginner",
    duration: "3 wks",
    xp: 500,
    desc: "Build unstoppable focus, overcome procrastination, and design daily study routines that keep you ahead without burnout.",
    instructorName: "David Miller",
    instructorRole: "Mindset Coach",
    instructorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80",
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=600&q=80",
    matchingSkills: ["personal-development", "health-wellness"],
    matchingGoals: ["better-habits", "master-focus", "improve-confidence"]
  },
  {
    id: "teen-leadership",
    title: "Public Speaking & Leadership",
    category: "Leadership",
    level: "Beginner",
    duration: "4 wks",
    xp: 500,
    desc: "Command attention on stage, communicate ideas persuasively, and lead project teams with empathy and authority.",
    instructorName: "Maya Fox",
    instructorRole: "Leadership Coach",
    instructorAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80",
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=600&q=80",
    matchingSkills: ["leadership-teamwork", "communication"],
    matchingGoals: ["improve-confidence", "connect-mentors", "explore-strengths"]
  }
];

function getPersonalizedRecommendations(selectedInterests = [], selectedGoals = []) {
  const scored = RECOMMENDED_PATHS_CATALOG.map((course, idx) => {
    let score = 0;
    (course.matchingSkills || []).forEach((skill) => {
      if (selectedInterests.includes(skill)) score += 2.5;
    });
    (course.matchingGoals || []).forEach((goal) => {
      if (selectedGoals.includes(goal)) score += 1.5;
    });
    return { ...course, score, originalIndex: idx };
  });

  // Sort by score descending; if score tied, preserve catalog order
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.originalIndex - b.originalIndex;
  });

  return scored.slice(0, 3);
}

function AuthPage() {
  const [account, setAccount] = useState(() => {
    const stored = readStorage(ACCOUNT_KEY, null);
    if (stored) return stored;
    const hash = (window.location.hash || "").replace("#", "").toLowerCase();
    if (["dashboard", "learning", "academy", "home", "course", "projects"].includes(hash)) {
      return defaultAccount;
    }
    return null;
  });
  const [view, setView] = useState(() => {
    const storedAccount = readStorage(ACCOUNT_KEY, null);
    const hash = (window.location.hash || "").replace("#", "").toLowerCase();
    if (storedAccount || ["dashboard", "learning", "academy", "home", "course", "projects"].includes(hash)) {
      return "dashboard";
    }
    // Only OTP page continues across reload so the countdown timer continues from where it stopped
    if (hash === "otp" || hash === "verify") {
      return "otp";
    }
    // Every other page starts again from the beginning (welcome)
    if (hash === "signup" || hash === "register") {
      return "signup";
    }
    if (hash === "login") {
      return "login";
    }
    // Every other unauthenticated page starts again from the beginning (welcome)
    if (hash && hash !== "welcome") {
      try {
        history.replaceState(null, "", window.location.pathname);
      } catch (e) {}
    }
    return "welcome";
  });
  const [isViewTransitioning, setIsViewTransitioning] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState("forward");

  function transitionToView(targetView, direction = "forward") {
    if (view === targetView) return;
    setIsViewTransitioning(true);
    setTransitionDirection(direction);
    setTimeout(() => {
      setView(targetView);
      setNotice("");
      setIsViewTransitioning(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 220);
  }

  // Pending signup details awaiting OTP verification (persisted across page refreshes)
  const [pendingAccount, setPendingAccount] = useState(() => {
    try {
      const saved = localStorage.getItem(PENDING_ACCOUNT_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  // OTP 6-digit state
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [otpTimer, setOtpTimer] = useState(() => {
    const remaining = getRemainingOtpSeconds();
    const hash = (window.location.hash || "").replace("#", "").toLowerCase();
    if ((hash === "otp" || hash === "verify") && remaining === 0 && !localStorage.getItem(OTP_EXPIRY_KEY)) {
      const expiry = Date.now() + OTP_TIMER_SECONDS * 1000;
      try { localStorage.setItem(OTP_EXPIRY_KEY, expiry.toString()); } catch (e) {}
      return OTP_TIMER_SECONDS;
    }
    return remaining;
  });
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isResendingOtp, setIsResendingOtp] = useState(false);
  const [otpNotice, setOtpNotice] = useState("");
  const [showSpamTip, setShowSpamTip] = useState(false);

  // Onboarding "First, let's get to know you" state
  const [onboardingName, setOnboardingName] = useState("");
  const [onboardingAge, setOnboardingAge] = useState(null);
  const [onboardingCountry, setOnboardingCountry] = useState("United States");
  const [onboardingAvatar, setOnboardingAvatar] = useState(null);
  const [onboardingNotice, setOnboardingNotice] = useState("");
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");

  // Onboarding "What are you interested in learning?" state (starts with 0 selected)
  const [selectedInterests, setSelectedInterests] = useState([]);

  function toggleInterest(interestId) {
    setSelectedInterests((prev) =>
      prev.includes(interestId)
        ? prev.filter((id) => id !== interestId)
        : [...prev, interestId]
    );
  }

  // Onboarding "What do you want to achieve?" state (starts with 0 selected matching 05 - Choose Your Goals.png)
  const [selectedGoals, setSelectedGoals] = useState([]);

  function toggleGoal(goalId) {
    setSelectedGoals((prev) =>
      prev.includes(goalId)
        ? prev.filter((id) => id !== goalId)
        : [...prev, goalId]
    );
  }

  // Personalized learning path recommendations (adapts dynamically to selectedInterests & selectedGoals)
  const recommendedPaths = getPersonalizedRecommendations(selectedInterests, selectedGoals);
  const topRecommendedCourse = recommendedPaths[0] || RECOMMENDED_PATHS_CATALOG[0];
  const [selectedPathCourses, setSelectedPathCourses] = useState([]);

  const effectiveSelectedPathCourses = selectedPathCourses.length > 0
    ? selectedPathCourses
    : recommendedPaths.map((p) => p.id);

  function togglePathCourse(courseId) {
    setSelectedPathCourses((prev) => {
      const current = prev.length > 0 ? prev : recommendedPaths.map((p) => p.id);
      return current.includes(courseId)
        ? current.filter((id) => id !== courseId)
        : [...current, courseId];
    });
  }

  useEffect(() => {
    if (!isCountryDropdownOpen) return;
    const handleClickOutside = (e) => {
      const dropdownWrap = document.querySelector(".about-you-country-custom-select");
      if (dropdownWrap && !dropdownWrap.contains(e.target)) {
        setIsCountryDropdownOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsCountryDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isCountryDropdownOpen]);

  function handlePhotoUpload(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setOnboardingNotice("Please select a valid image (PNG, JPG, JPEG, WEBP).");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setOnboardingNotice("Image file should be smaller than 10MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          const maxDim = 160;
          let w = img.width;
          let h = img.height;
          if (w > h) {
            if (w > maxDim) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            }
          } else {
            if (h > maxDim) {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, w, h);
          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.85);
          setOnboardingAvatar(compressedDataUrl);
          setOnboardingNotice("");
        } catch (err) {
          setOnboardingAvatar(e.target.result);
          setOnboardingNotice("");
        }
      };
      img.onerror = () => {
        setOnboardingNotice("Failed to load image. Please select a valid image file.");
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  function handleOnboardingComplete(options = {}) {
    const preferredName = (onboardingName || "").trim() || (pendingAccount?.name ? pendingAccount.name.split(" ")[0] : (form.name ? form.name.split(" ")[0] : "Learner"));
    const originalFullName = pendingAccount?.fullName || pendingAccount?.name || form.name || preferredName;

    const usersDb = readStorage(USERS_DB_KEY, [defaultAccount]);
    const finalAccount = {
      ...(pendingAccount || defaultAccount),
      name: preferredName,
      fullName: originalFullName,
      avatar: onboardingAvatar || pendingAccount?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      age: onboardingAge,
      country: onboardingCountry || "United States",
      interests: selectedInterests,
      goals: selectedGoals,
      personalizedPaths: effectiveSelectedPathCourses,
      email: (pendingAccount?.email || form.email || "teen@mydearteenager.com").trim().toLowerCase()
    };

    const updatedUsersDb = [...usersDb.filter((u) => u.email.toLowerCase() !== finalAccount.email.toLowerCase()), finalAccount];
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(updatedUsersDb));
    localStorage.setItem(ACCOUNT_KEY, JSON.stringify(finalAccount));
    try {
      const updatedUsersDb = [...usersDb.filter((u) => u.email.toLowerCase() !== finalAccount.email.toLowerCase()), finalAccount];
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(updatedUsersDb));
      localStorage.setItem(ACCOUNT_KEY, JSON.stringify(finalAccount));
    } catch (storageErr) {
      console.warn("Storage quota exceeded, retrying with fallback avatar", storageErr);
      try {
        const fallbackAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80";
        finalAccount.avatar = fallbackAvatar;
        const compactUsersDb = [...usersDb.filter((u) => u.email.toLowerCase() !== finalAccount.email.toLowerCase()), finalAccount];
        localStorage.setItem(USERS_DB_KEY, JSON.stringify(compactUsersDb));
        localStorage.setItem(ACCOUNT_KEY, JSON.stringify(finalAccount));
      } catch (e) {
        console.error("Critical storage error:", e);
      }
    }

    const freshData = createFreshUserData(finalAccount);
    saveUserData(finalAccount.email, freshData);

    setAccount(finalAccount);
    setUserXp(freshData.userXp);
    setStreak(freshData.streak);
    setLastStreakDate(freshData.lastStreakDate);
    setCoursesList(freshData.coursesList);
    setProjects(freshData.projects);
    setNotice("");
    setPendingAccount(null);
    try {
      localStorage.removeItem(PENDING_ACCOUNT_KEY);
      localStorage.removeItem(OTP_EXPIRY_KEY);
    } catch (e) {}

    transitionToView("dashboard", "forward");
    const targetHash = (options && options.targetView) || "home";
    if (options && options.targetView) {
      setDashboardView(options.targetView);
    } else {
      setDashboardView("home");
    }
    if (options && options.openCourse) {
      setTimeout(() => {
        const found = freshData.coursesList.find((c) => c.id === options.openCourse.id) || options.openCourse;
        openCourseVideo(found);
      }, 300);
    }
    try { history.replaceState(null, "", window.location.pathname); } catch (e) {}
    try { history.replaceState(null, "", "#" + targetHash); } catch (e) {}
  }

  // OTP Countdown timer: syncs with persistent timestamp in localStorage across page refreshes
  useEffect(() => {
    if (view !== "otp") return;

    const syncRemaining = () => {
      const remaining = getRemainingOtpSeconds();
      setOtpTimer(remaining);
      return remaining;
    };

    const current = syncRemaining();
    if (current <= 0) return;

    const interval = setInterval(() => {
      const rem = syncRemaining();
      if (rem <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [view, otpTimer > 0]);

  function formatOtpTimer(sec) {
    const safeSec = Math.max(0, sec || 0);
    const m = Math.floor(safeSec / 60);
    const s = safeSec % 60;
    return `${m < 10 ? "0" + m : m}:${s < 10 ? "0" + s : s}`;
  }

  const [userRole, setUserRole] = useState("teenager"); // "teenager" | "parent"
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [notice, setNotice] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "", agreeTerms: false });
  const [project, setProject] = useState({ title: "", skill: "", description: "" });
  const [dashboardView, setDashboardView] = useState(() => {
    const hash = (window.location.hash || "").replace("#", "").toLowerCase();
    if (hash === "academy" || hash === "learning" || hash === "course" || hash === "projects") return hash;
    return "home";
  }); // "home" | "academy" | "learning" | "course" | "projects"
  const [projectFilterTab, setProjectFilterTab] = useState("all"); // "all" | "in-progress" | "drafts" | "completed" | "submitted"
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [viewingProject, setViewingProject] = useState(null);
  const [newProjectForm, setNewProjectForm] = useState({
    title: "",
    category: "",
    description: "",
    tags: "",
    status: "in-progress",
    xp: 50,
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80"
  });
  const [learningTab, setLearningTab] = useState("in-progress"); // "in-progress" | "completed"
  const [academyCategory, setAcademyCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [enrollmentModalCourse, setEnrollmentModalCourse] = useState(null);

  // Ongoing Course page view state
  const [activeCourseId, setActiveCourseId] = useState("uiux-1");
  const [activeLessonIndex, setActiveLessonIndex] = useState(2);

  // Active lesson video watch timestamp and static initial start second (prevents iframe from reloading while watching)
  const [lessonWatchTimestamp, setLessonWatchTimestamp] = useState(0);
  const [lessonInitialStartTime, setLessonInitialStartTime] = useState(0);
  const [liveVideoDuration, setLiveVideoDuration] = useState("");
  const [liveVideoDurationSec, setLiveVideoDurationSec] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);

  // Initialize data isolated specifically for current active account
  const activeUserData = account
    ? loadUserData(account.email, account.email === defaultAccount.email ? defaultDemoData : null)
    : createFreshUserData({ email: "" });

  const [userXp, setUserXp] = useState(activeUserData.userXp || 0);
  const [streak, setStreak] = useState(activeUserData.streak || 0);
  const [lastStreakDate, setLastStreakDate] = useState(activeUserData.lastStreakDate);
  const [coursesList, setCoursesList] = useState(activeUserData.coursesList || academyCourses);
  const [projects, setProjects] = useState(activeUserData.projects || []);

  // Dynamic scaling level & progress calculations (XP requirements increase with higher levels; bar resets to 0% upon entering new level)
  const { userLevel, currentLevelXp, xpRequiredThisLevel, levelProgressPct, xpToNext } = getLevelInfo(userXp);
  const weeklyXpGoalPct = Math.min(Math.round((userXp / 400) * 100), 100);

  // Current calendar day (YYYY-MM-DD) for 1-click-per-day streak enforcement
  const todayDateStr = new Date().toISOString().slice(0, 10);

  const preferredUsername =
    (onboardingName || "").trim() ||
    (pendingAccount?.name ? pendingAccount.name.split(" ")[0] : (form?.name ? form.name.split(" ")[0] : (account?.name ? account.name.split(" ")[0] : "Learner")));

  const userInterestTitles =
    selectedInterests.length > 0
      ? selectedInterests.map((id) => {
          const opt = INTEREST_SKILLS.find((o) => o.id === id);
          return opt ? opt.title : id;
        })
      : ["Coding", "Digital Art", "Financial Lit"];

  const userGoalTitles =
    selectedGoals.length > 0
      ? selectedGoals.map((id) => {
          const opt = GOAL_OPTIONS.find((o) => o.id === id);
          return opt ? opt.title : id;
        })
      : ["Build a personal portfolio website", "Understand basic budgeting"];
  const isStreakClaimedToday = lastStreakDate === todayDateStr;

  // Helper to persist saved playback timestamp for a course lesson into localStorage
  function updateLessonSavedTimestamp(courseId, lessonIdx, seconds) {
    setCoursesList((prev) => {
      const updated = prev.map((c) => {
        if (c.id === courseId) {
          const updatedCurr = (c.curriculum || []).map((l, idx) =>
            idx === lessonIdx ? { ...l, savedTimestamp: seconds } : l
          );
          return { ...c, curriculum: updatedCurr };
        }
        return c;
      });
      persistUserProgress({ coursesList: updated });
      return updated;
    });
  }

  // Persist current user state changes into localStorage
  function persistUserProgress(updates) {
    if (!account || !account.email) return;
    const currentPayload = {
      email: account.email,
      userLevel,
      userXp,
      streak,
      lastStreakDate,
      coursesList,
      projects,
      ...updates
    };
    saveUserData(account.email, currentPayload);
  }

  // On load / session resume, verify if an entire day was missed and reset streak if needed
  useEffect(() => {
    if (!account || !account.email) return;
    if (lastStreakDate && streak > 0) {
      const daysDiff = getDaysDifference(lastStreakDate, todayDateStr);
      if (daysDiff > 1) {
        setStreak(0);
        setLastStreakDate(null);
        persistUserProgress({
          streak: 0,
          lastStreakDate: null
        });
      }
    }
  }, [account, lastStreakDate, todayDateStr]);

  // Sync initial playback timestamp whenever a course or lesson is opened
  useEffect(() => {
    if (dashboardView === "course") {
      const course = coursesList.find((c) => c.id === activeCourseId) || coursesList[0];
      if (course && course.curriculum && course.curriculum[activeLessonIndex]) {
        const saved = Math.floor(course.curriculum[activeLessonIndex].savedTimestamp || 0);
        setLessonInitialStartTime(saved);
        setLessonWatchTimestamp(saved);
        setLiveVideoDurationSec(0);
        setIsVideoPlaying(true);
      }
    }
  }, [activeCourseId, activeLessonIndex, dashboardView]);

  // Dynamically listen to YouTube iframe postMessages to detect exact duration and pause/play state
  useEffect(() => {
    if (dashboardView !== "course") {
      setLiveVideoDuration("");
      setLiveVideoDurationSec(0);
      setIsVideoPlaying(true);
      return;
    }

    const handleMessage = (event) => {
      try {
        if (typeof event.data === "string") {
          const data = JSON.parse(event.data);

          // Track YouTube player state (1: playing, 2: paused, 0: ended)
          if (data.event === "onStateChange") {
            const state = data.info;
            if (state === 1) {
              setIsVideoPlaying(true);
            } else if (state === 2 || state === 0) {
              setIsVideoPlaying(false);
            }
          }

          if (data.event === "infoDelivery" && data.info) {
            if (typeof data.info.playerState === "number") {
              if (data.info.playerState === 1) {
                setIsVideoPlaying(true);
              } else if (data.info.playerState === 2 || data.info.playerState === 0) {
                setIsVideoPlaying(false);
              }
            }

            // Sync exact playback time from YouTube player if available
            if (typeof data.info.currentTime === "number") {
              const exactCurrent = Math.floor(data.info.currentTime);
              if (exactCurrent >= 0) {
                setLessonWatchTimestamp(exactCurrent);
                updateLessonSavedTimestamp(activeCourseId, activeLessonIndex, exactCurrent);
              }
            }

            // Sync exact video duration
            if (typeof data.info.duration === "number") {
              const exactSec = Math.round(data.info.duration);
              if (exactSec > 0) {
                setLiveVideoDurationSec(exactSec);
                const m = Math.floor(exactSec / 60);
                const s = exactSec % 60;
                setLiveVideoDuration(`${m}:${s.toString().padStart(2, "0")}`);
              }
            }
          }
        }
      } catch (e) {
        // ignore non-json messages
      }
    };

    window.addEventListener("message", handleMessage);

    // Initial and recurring listening handshake to YouTube iframe
    const handshakeTimer = setInterval(() => {
      const iframe = document.querySelector(".ongoing-video-container iframe");
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage(JSON.stringify({ event: "listening" }), "*");
      }
    }, 1200);

    return () => {
      window.removeEventListener("message", handleMessage);
      clearInterval(handshakeTimer);
    };
  }, [dashboardView, activeCourseId, activeLessonIndex]);

  // Continuously track watch seconds ONLY when video is playing; STOP timer when paused
  useEffect(() => {
    if (dashboardView !== "course" || !isVideoPlaying) return;

    const timer = setInterval(() => {
      setLessonWatchTimestamp((prev) => {
        const next = prev + 1;
        if (next % 4 === 0) {
          updateLessonSavedTimestamp(activeCourseId, activeLessonIndex, next);
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [dashboardView, isVideoPlaying, activeCourseId, activeLessonIndex]);

  // Hash routing listener: Only OTP retains page state on initial load/reload so the timer can continue from where it stopped
  // Hash routing listener: Keeps authenticated users in the dashboard while supporting deep-links and back/forward browser navigation
  useEffect(() => {
    const handleHash = () => {
      const hash = (window.location.hash || "").replace("#", "").toLowerCase();
      const currentAccount = account || readStorage(ACCOUNT_KEY, null);

      if (currentAccount) {
        if (view !== "dashboard") {
          setView("dashboard");
        }
        if (["home", "academy", "learning", "course", "projects"].includes(hash)) {
          setDashboardView(hash);
        } else if (hash === "in-progress" || hash === "completed") {
          setDashboardView("learning");
          setLearningTab(hash);
        } else if (!hash) {
          setDashboardView("home");
        }
        return;
      }

      if (hash === "otp" || hash === "verify") {
        setView("otp");
      } else if (hash === "welcome" || !hash) {
        setView("welcome");
      } else if (hash === "signup" || hash === "register") {
        setView("signup");
      } else if (hash === "login") {
        setView("login");
      }
    };
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, [account, view]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    if (!showUserDropdown) return;
    const handleOutsideClick = (e) => {
      const dropdownWrap = document.querySelector(".sidebar-profile-wrapper");
      if (dropdownWrap && !dropdownWrap.contains(e.target)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [showUserDropdown]);

  function updateForm(event) {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    setNotice("");
  }

  function submitAuth(event) {
    if (event && event.preventDefault) event.preventDefault();
    const cleanEmail = (form.email || "").trim().toLowerCase();
    const usersDb = readStorage(USERS_DB_KEY, [defaultAccount]);

    if (view === "signup") {
      if (!form.name.trim()) {
        setNotice("Please enter your full name.");
        return;
      }
      if (!cleanEmail) {
        setNotice("Please enter your email address.");
        return;
      }
      if (form.password.length < 6) {
        setNotice("Your password needs at least 6 characters.");
        return;
      }
      if (form.password !== form.confirmPassword) {
        setNotice("Passwords do not match. Please confirm your password.");
        return;
      }
      if (!form.agreeTerms) {
        setNotice("Please agree to the Terms of Service and Privacy Policy.");
        return;
      }

      // Check if email already exists in system (1 email = 1 account rule)
      const existingUser = usersDb.find((u) => u.email.toLowerCase() === cleanEmail);
      if (existingUser) {
        setNotice("An account with this email address already exists. Please log in instead.");
        return;
      }

      const pending = {
        name: form.name.trim() || (userRole === "parent" ? "Parent / Mentor" : "Teen Learner"),
        fullName: form.name.trim() || (userRole === "parent" ? "Parent / Mentor" : "Teen Learner"),
        email: cleanEmail,
        password: form.password,
        role: userRole,
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
      };

      // Transition to OTP verification stage
      setPendingAccount(pending);
      try {
        localStorage.setItem(PENDING_ACCOUNT_KEY, JSON.stringify(pending));
        const expiry = Date.now() + OTP_TIMER_SECONDS * 1000;
        localStorage.setItem(OTP_EXPIRY_KEY, expiry.toString());
      } catch (e) {}
      setOtpDigits(["", "", "", "", "", ""]);
      setOtpTimer(OTP_TIMER_SECONDS);
      setOtpNotice("");
      setShowSpamTip(false);
      setNotice("");
      transitionToView("otp", "forward");
      window.location.hash = "otp";
      return;
    }

    if (view === "login") {
      const foundUser = usersDb.find(
        (u) => u.email.toLowerCase() === cleanEmail && u.password === form.password
      );

      if (!foundUser) {
        setNotice("Those details do not match an account yet. Check your email/password or create one.");
        return;
      }

      localStorage.setItem(ACCOUNT_KEY, JSON.stringify(foundUser));
      setAccount(foundUser);

      // Load this specific user's saved data
      const userSavedData = loadUserData(
        foundUser.email,
        foundUser.email === defaultAccount.email ? defaultDemoData : null
      );
      setUserXp(userSavedData.userXp);
      setStreak(userSavedData.streak);
      setLastStreakDate(userSavedData.lastStreakDate);
      setCoursesList(userSavedData.coursesList);
      setProjects(userSavedData.projects || []);
      setNotice("");
      setView("dashboard");
      setDashboardView("home");
      window.location.hash = "home";
      return;
    }
  }

  // ============================================================================
  // BACKEND INTEGRATION HOOKS & HANDLERS FOR OTP VERIFICATION
  // ============================================================================
  // These functions manage the 6-digit OTP verification flow.
  // When connecting to your real backend API:
  // 1. In `handleVerifyOtp`: send POST request to your verification endpoint,
  //    e.g. POST /api/auth/verify-otp with { email, code }.
  // 2. In `handleResendOtp`: send POST request to trigger a new code,
  //    e.g. POST /api/auth/resend-otp with { email }.
  // ============================================================================

  function handleOtpDigitChange(index, rawValue) {
    const cleaned = rawValue.replace(/\D/g, "").slice(-1);
    const updated = [...otpDigits];
    updated[index] = cleaned;
    setOtpDigits(updated);
    setOtpNotice("");

    // Auto-advance to next box if digit was entered
    if (cleaned && index < 5) {
      const nextInput = document.getElementById(`otp-digit-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  }

  function handleOtpKeyDown(index, event) {
    if (event.key === "Backspace") {
      if (!otpDigits[index] && index > 0) {
        // Move back to previous box on backspace if current is empty
        const prevInput = document.getElementById(`otp-digit-${index - 1}`);
        if (prevInput) {
          prevInput.focus();
          const updated = [...otpDigits];
          updated[index - 1] = "";
          setOtpDigits(updated);
        }
      }
    } else if (event.key === "ArrowLeft" && index > 0) {
      const prevInput = document.getElementById(`otp-digit-${index - 1}`);
      if (prevInput) prevInput.focus();
    } else if (event.key === "ArrowRight" && index < 5) {
      const nextInput = document.getElementById(`otp-digit-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  }

  function handleOtpPaste(event) {
    event.preventDefault();
    const pasted = (event.clipboardData.getData("text") || "").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;

    const updated = ["", "", "", "", "", ""];
    for (let i = 0; i < pasted.length; i++) {
      updated[i] = pasted[i];
    }
    setOtpDigits(updated);
    setOtpNotice("");

    const targetFocus = Math.min(pasted.length, 5);
    const targetInput = document.getElementById(`otp-digit-${targetFocus}`);
    if (targetInput) targetInput.focus();
  }

  function handleVerifyOtp(event) {
    if (event && event.preventDefault) event.preventDefault();
    const code = otpDigits.join("");

    if (code.length < 6) {
      setOtpNotice("Please enter all 6 digits of your verification code.");
      return;
    }

    if (getRemainingOtpSeconds() <= 0 && otpTimer <= 0) {
      setOtpNotice("Your verification code has expired. Please click 'Resend Code' below to receive a new code.");
      return;
    }

    setIsVerifyingOtp(true);
    setOtpNotice("");

    /*
      -------------------------------------------------------------------------
      BACKEND INTEGRATION EXAMPLE:
      -------------------------------------------------------------------------
      try {
        const response = await fetch('/api/auth/verify-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: pendingAccount?.email || form.email,
            code: code
          })
        });
        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Invalid or expired code.');
        }
        // Save session data returned from server...
      } catch (err) {
        setIsVerifyingOtp(false);
        setOtpNotice(err.message || 'Verification failed. Please try again.');
        return;
      }
      -------------------------------------------------------------------------
    */

    // Simulated verification delay (Frontend flow):
    setTimeout(() => {
      setIsVerifyingOtp(false);
      const usersDb = readStorage(USERS_DB_KEY, [defaultAccount]);
      const targetAccount = pendingAccount || {
        name: form.name.trim() || (userRole === "parent" ? "Parent / Mentor" : "Teen Learner"),
        email: (form.email || "teen@mydearteenager.com").trim().toLowerCase(),
        password: form.password || "password123",
        role: userRole,
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
      };

      // Save to registered database and active session
      const updatedUsersDb = [...usersDb.filter((u) => u.email.toLowerCase() !== targetAccount.email.toLowerCase()), targetAccount];
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(updatedUsersDb));
      localStorage.setItem(ACCOUNT_KEY, JSON.stringify(targetAccount));

      // Brand new account starts fresh with everything at zero
      const freshData = createFreshUserData(targetAccount);
      saveUserData(targetAccount.email, freshData);

      setAccount(targetAccount);
      setUserXp(freshData.userXp);
      setStreak(freshData.streak);
      setLastStreakDate(freshData.lastStreakDate);
      setCoursesList(freshData.coursesList);
      setProjects(freshData.projects);
      setNotice("");
      setPendingAccount(null);
      try {
        localStorage.removeItem(OTP_EXPIRY_KEY);
        localStorage.removeItem(PENDING_ACCOUNT_KEY);
      } catch (e) {}

      // Transition to onboarding ("First, let's get to know you")
      if (targetAccount.name) {
        setOnboardingName(targetAccount.name.split(" ")[0]);
      }
      transitionToView("about-you", "forward");
      try { history.replaceState(null, "", window.location.pathname); } catch (e) {}
    }, 700);
  }

  function handleResendOtp() {
    if (otpTimer > 0 || isResendingOtp) return;
    setIsResendingOtp(true);
    setOtpNotice("");

    setTimeout(() => {
      setIsResendingOtp(false);
      const newExpiry = Date.now() + OTP_TIMER_SECONDS * 1000;
      try {
        localStorage.setItem(OTP_EXPIRY_KEY, newExpiry.toString());
      } catch (e) {}
      setOtpTimer(OTP_TIMER_SECONDS);
      setOtpDigits(["", "", "", "", "", ""]);
      setOtpNotice("A new 6-digit verification code has been dispatched to your email!");
      const firstBox = document.getElementById("otp-digit-0");
      if (firstBox) firstBox.focus();
    }, 500);
  }

  function handleMagicLink() {
    const targetEmail = pendingAccount?.email || form.email || "";
    window.location.href = `mailto:${targetEmail}?subject=Verify%20MyDearTeenager%20Account`;
  }

  function logout() {
    setAccount(null);
    localStorage.removeItem(ACCOUNT_KEY);
    setView("welcome");
    window.location.hash = "";
    setForm({ name: "", email: "", password: "" });
    setNotice("");
  }

  function handleCreateProjectSubmit(event) {
    if (event && event.preventDefault) event.preventDefault();
    const formEl = event && event.target;
    const cleanTitle = (
      newProjectForm.title ||
      (formEl && formEl.querySelector && formEl.querySelector("input[type=text]")?.value) ||
      ""
    ).trim();

    if (!cleanTitle) {
      setNotice("Please enter a project title.");
      return;
    }

    const catVal =
      newProjectForm.category ||
      (formEl && formEl.querySelector && formEl.querySelector("select")?.value) ||
      "";

    if (!catVal) {
      setNotice("Please choose a category.");
      return;
    }

    const descVal = (
      newProjectForm.description ||
      (formEl && formEl.querySelector && formEl.querySelector("textarea")?.value) ||
      ""
    ).trim() || "A creative project built to apply new skills, showcase my work, and build my portfolio.";


    const rawTags =
      newProjectForm.tags ||
      (formEl && formEl.querySelectorAll && formEl.querySelectorAll("input[type=text]")[1]?.value) ||
      "";

    if (!rawTags.trim()) {
      setNotice("Please enter your skills (e.g. UI/UX, Typography).");
      return;
    }

    const tagsArray = rawTags.split(",").map((t) => t.trim()).filter(Boolean);


    // Pick a high-quality cover photo based on the selected category
    const categoryCoverImages = {
      Design: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80",
      Marketing: "Images/course-marketing.png",
      Media: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=600&q=80",
      Business: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
      "Web-Development": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80",
      Branding: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80",
      Copywriting: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80",
      "Cyber Security": "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80",
      "Data Analysis": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
      "Forex Trading": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80",
      Other: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=600&q=80"
    };

    const chosenImage = categoryCoverImages[catVal] || categoryCoverImages.Design;

    const created = {
      id: "proj-" + Date.now(),
      title: cleanTitle,
      category: catVal,
      description: descVal,
      tags: tagsArray.length > 0 ? tagsArray : ["Creative", catVal],
      status: "in-progress",
      statusLabel: "In Progress",
      xp: 60,
      updatedDate: "Updated Just now",
      image: chosenImage,
      featured: projects.length === 0
    };

    const nextProjects = [created, ...projects];
    setProjects(nextProjects);
    persistUserProgress({ projects: nextProjects });
    setIsCreateProjectOpen(false);
    setNewProjectForm({
      title: "",
      category: "",
      description: "",
      tags: "",
      status: "in-progress",
      xp: 50,
      image: ""
    });
    setNotice(`Project "${created.title}" created successfully!`);
    setTimeout(() => setNotice(""), 3500);
  }

  function handleLoadShowcaseProjects() {
    setProjects(SHOWCASE_PROJECTS_TEMPLATES);
    persistUserProgress({ projects: SHOWCASE_PROJECTS_TEMPLATES });
    setNotice("Showcase projects loaded! All project cards and featured banner are now visible.");
    setTimeout(() => setNotice(""), 3500);
  }

  function handleClearProjectsToZero() {
    setProjects([]);
    persistUserProgress({ projects: [] });
    setNotice("All projects reset to 0.");
    setTimeout(() => setNotice(""), 3500);
  }

  function handleToggleProjectStatus(projectId) {
    const updated = projects.map((p) => {
      if (p.id === projectId) {
        const nextStatus = p.status === "completed" ? "in-progress" : "completed";
        return {
          ...p,
          status: nextStatus,
          statusLabel: nextStatus === "completed" ? "Completed" : "In Progress",
          updatedDate: "Updated Just now"
        };
      }
      return p;
    });
    setProjects(updated);
    persistUserProgress({ projects: updated });
    if (viewingProject && viewingProject.id === projectId) {
      setViewingProject((prev) => ({
        ...prev,
        status: prev.status === "completed" ? "in-progress" : "completed",
        statusLabel: prev.status === "completed" ? "In Progress" : "Completed"
      }));
    }
  }

  function handleDeleteProject(projectId) {
    const updated = projects.filter((p) => p.id !== projectId);
    setProjects(updated);
    persistUserProgress({ projects: updated });
    if (viewingProject && viewingProject.id === projectId) {
      setViewingProject(null);
    }
    setNotice("Project removed.");
    setTimeout(() => setNotice(""), 3000);
  }

 
  function enrollCourse(courseId, shouldOpen = false) {
    const target = coursesList.find((c) => c.id === courseId) || academyCourses.find((c) => c.id === courseId);
    if (!target) return;
    const updatedCourses = coursesList.map((c) => {
      if (c.id === target.id) {
        return { ...c, enrolled: true, status: "in-progress" };
      }
      return c;
    });
    setCoursesList(updatedCourses);
    persistUserProgress({ coursesList: updatedCourses });
    setNotice(`Enrolled in "${target.title}"!`);
    setTimeout(() => setNotice(""), 3500);
    setEnrollmentModalCourse(null);
    if (shouldOpen) {
      setActiveCourseId(target.id);
      let targetIdx = 0;
      if (target.curriculum && Array.isArray(target.curriculum)) {
        const firstUndone = target.curriculum.findIndex((l) => !l.done);
        targetIdx = firstUndone !== -1 ? firstUndone : 0;
      }
      setActiveLessonIndex(targetIdx);
      const initialTime =
        target.curriculum && target.curriculum[targetIdx]
          ? Math.floor(target.curriculum[targetIdx].savedTimestamp || 0)
          : 0;
      setLessonInitialStartTime(initialTime);
      setLessonWatchTimestamp(initialTime);
      setDashboardView("course");
    }
  }

  function unenrollCourse(courseId) {
    const target = coursesList.find((c) => c.id === courseId);
    const title = target ? target.title : "Course";
    const updatedCourses = coursesList.map((c) => {
      if (c.id === courseId) {
        return {
          ...c,
          enrolled: false,
          status: "not-started",
          curriculum: (c.curriculum || []).map((l) => ({ ...l, done: false, savedTimestamp: 0 }))
        };
      }
      return c;
    });
    setCoursesList(updatedCourses);
    persistUserProgress({ coursesList: updatedCourses });
    setNotice(`Unenrolled from "${title}".`);
    setTimeout(() => setNotice(""), 3500);
    if (dashboardView === "course" && activeCourseId === courseId) {
      setDashboardView("academy");
    }
  }

  function openCourseVideo(course, lessonIndex = null) {
    const targetCourse = (course && coursesList.find((c) => c.id === course.id)) || course || coursesList[0] || academyCourses[0];
    const isEnrolled = Boolean(targetCourse.enrolled || getCourseProgress(targetCourse) > 0);

    if (!isEnrolled) {
      setEnrollmentModalCourse(targetCourse);
      return;
    }

    setActiveCourseId(targetCourse.id);

    let targetIdx = 0;
    if (typeof lessonIndex === "number") {
      targetIdx = lessonIndex;
    } else if (targetCourse.curriculum && Array.isArray(targetCourse.curriculum)) {
      const firstUndone = targetCourse.curriculum.findIndex((l) => !l.done);
      targetIdx = firstUndone !== -1 ? firstUndone : 0;
    }

    setActiveLessonIndex(targetIdx);
    const initialTime =
      targetCourse.curriculum && targetCourse.curriculum[targetIdx]
        ? Math.floor(targetCourse.curriculum[targetIdx].savedTimestamp || 0)
        : 0;
    setLessonInitialStartTime(initialTime);
    setLessonWatchTimestamp(initialTime);

    setDashboardView("course");
  }

  
  function incrementStreak() {
    if (isStreakClaimedToday) return;

    
    const isConsecutive = lastStreakDate && getDaysDifference(lastStreakDate, todayDateStr) === 1;
    const nextStreak = isConsecutive ? (streak < 14 ? streak + 1 : 1) : 1;
    const nextXp = userXp + 50;
    const { userLevel: nextLevel } = getLevelInfo(nextXp);

    setStreak(nextStreak);
    setLastStreakDate(todayDateStr);
    setUserXp(nextXp);

    persistUserProgress({
      streak: nextStreak,
      lastStreakDate: todayDateStr,
      userXp: nextXp,
      userLevel: nextLevel
    });
  }

  
  function completeCurrentOngoingLesson() {
    const targetCourseId = activeCourseId || (coursesList[0] && coursesList[0].id) || "uiux-1";
    const currentCourse = coursesList.find((c) => c.id === targetCourseId) || coursesList[0];
    if (!currentCourse || !currentCourse.curriculum) return;

    const currentLesson = currentCourse.curriculum[safeActiveLessonIndex];
    if (!currentLesson) return;

    const updatedCourses = coursesList.map((c) => {
      if (c.id === targetCourseId) {
        const updatedCurriculum = c.curriculum.map((l, idx) =>
          idx === safeActiveLessonIndex ? { ...l, done: true, savedTimestamp: 0 } : l
        );
        return { ...c, curriculum: updatedCurriculum };
      }
      return c;
    });

    setCoursesList(updatedCourses);

    
    if (!currentLesson.done) {
      const nextXp = userXp + 60;
      const { userLevel: nextLevel } = getLevelInfo(nextXp);
      setUserXp(nextXp);

      persistUserProgress({
        coursesList: updatedCourses,
        userXp: nextXp,
        userLevel: nextLevel
      });
    } else {
      persistUserProgress({ coursesList: updatedCourses });
    }

    // Automatically advance to the next uncompleted lesson in this course
    const nextUndoneIdx = currentCourse.curriculum.findIndex((l, idx) => idx > safeActiveLessonIndex && !l.done);
    if (nextUndoneIdx !== -1) {
      setActiveLessonIndex(nextUndoneIdx);
      const nextSaved = Math.floor(currentCourse.curriculum[nextUndoneIdx].savedTimestamp || 0);
      setLessonInitialStartTime(nextSaved);
      setLessonWatchTimestamp(nextSaved);
    }
  }

  // Filter courses by category and search query
  const userPersonalizedIds = (account && account.personalizedPaths) || [];
  const isPersonalizedTab = academyCategory === "Personalized for You";
  const filteredCourses = coursesList.filter((course) => {
    const matchesCategory =
      academyCategory === "All"
        ? true
        : isPersonalizedTab
        ? userPersonalizedIds.includes(course.id) || (userPersonalizedIds.length === 0 && ["coding-basics", "ai-prompt-engineering", "uiux-design", "uiux-1"].includes(course.id))
        : course.category.toLowerCase() === academyCategory.toLowerCase();
    const matchesSearch =
      searchQuery.trim() === "" ||
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categoriesList = ["All", "Personalized for You", "Design", "Tech", "AI & Tech", "Media", "Business", "Finance", "Growth", "Leadership", "Marketing", "Web Development"];

  // Filter courses that are strictly ongoing (user enrolled or started watching, and not 100% completed)
  const ongoingCourses = coursesList.filter((course) => {
    const pct = getCourseProgress(course);
    const hasStartedWatching = course.curriculum && course.curriculum.some((l) => l.done || (l.savedTimestamp && l.savedTimestamp > 0));
    return (course.enrolled || hasStartedWatching || pct > 0) && pct < 100;
  });

  const featuredOngoingCourse = ongoingCourses.length > 0 ? ongoingCourses[0] : null;
  const otherOngoingCourses = ongoingCourses.length > 1 ? ongoingCourses.slice(1) : [];

  // Currently active course and active lesson for the Ongoing Course page with robust fallbacks
  const currentOngoingCourse =
    coursesList.find((c) => c.id === activeCourseId) ||
    coursesList[0] ||
    academyCourses[0];

  const currentCurriculum =
    currentOngoingCourse && currentOngoingCourse.curriculum && currentOngoingCourse.curriculum.length > 0
      ? currentOngoingCourse.curriculum
      : academyCourses[0].curriculum;

  const safeActiveLessonIndex = Math.min(
    Math.max(activeLessonIndex, 0),
    currentCurriculum.length - 1
  );

  const currentOngoingLesson =
    currentCurriculum[safeActiveLessonIndex] ||
    currentCurriculum[0] || {
      title: "Introduction",
      duration: "5 min",
      done: false,
      description: "Lesson details",
      tags: ["Fundamentals"]
    };

  const currentCourseDoneCount = currentCurriculum.filter((l) => l.done).length;
  const currentCourseTotalCount = currentCurriculum.length;
  const currentCourseModulePct = currentCourseTotalCount > 0 ? Math.round((currentCourseDoneCount / currentCourseTotalCount) * 100) : 0;

  // Active lesson total duration and dynamic remaining seconds to collect XP
  const currentLessonTotalSec =
    liveVideoDurationSec > 0
      ? liveVideoDurationSec
      : parseDurationToSeconds(currentOngoingLesson.duration || "5 min");

  const currentLessonRemainingSec = Math.max(0, currentLessonTotalSec - lessonWatchTimestamp);

  // Dynamic stats calculated from projects (all start at 0 when projects is empty)
  const totalProjectsCount = projects.length;
  const completedProjectsCount = projects.filter((p) => p.status === "completed").length;
  const inProgressProjectsCount = projects.filter((p) => p.status === "in-progress").length;
  const draftProjectsCount = projects.filter((p) => p.status === "draft").length;
  const submittedProjectsCount = projects.filter((p) => p.status === "submitted").length;
  const xpFromProjectsCount = projects.reduce((sum, p) => sum + (p.xp || 0), 0);

  const filteredProjects = projects.filter((p) => {
    if (projectFilterTab === "in-progress") return p.status === "in-progress";
    if (projectFilterTab === "drafts") return p.status === "draft";
    if (projectFilterTab === "completed") return p.status === "completed";
    if (projectFilterTab === "submitted") return p.status === "submitted";
    return true; // "all"
  });

  const featuredProject = projects.find((p) => p.featured) || projects.find((p) => p.status === "in-progress") || projects[0];

  // Turns "Create New Project" button from light purple to sharp purple upon filling all required fields
  const isCreateProjectFormReady = Boolean(
    (newProjectForm.title || "").trim() &&
    newProjectForm.category &&
    (newProjectForm.tags || "").trim()
  );

  // If user is logged in and on dashboard view, show Dashboard
  if (account && view === "dashboard") {
    return (
      <div className="dashboard-app">
        {/* Left Sidebar */}
        <aside className="dashboard-sidebar">
          <a
            className="dashboard-logo"
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              setDashboardView("home");
              try { history.replaceState(null, "", "#home"); } catch (err) {}
            }}
            title="MyDearTeenager Dashboard"
          >
            <span className="brand-logo-text">
              <span className="logo-purple">MyDear</span>
              <span className="logo-dark">Teenager</span>
            </span>
          </a>

          <nav className="dashboard-nav">
            <a
              className={dashboardView === "home" ? "selected" : ""}
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                setDashboardView("home");
                try { history.replaceState(null, "", "#home"); } catch (err) {}
              }}
            >
              <Icon name="home" size={20} />
              <span>Home</span>
            </a>

            <a
              className={dashboardView === "academy" ? "selected" : ""}
              href="#academy"
              onClick={(e) => {
                e.preventDefault();
                setDashboardView("academy");
                try { history.replaceState(null, "", "#academy"); } catch (err) {}
              }}
            >
              <Icon name="academy" size={20} />
              <span>Skill Academy</span>
            </a>

            <a
              className={dashboardView === "learning" ? "selected" : ""}
              href="#learning"
              onClick={(e) => {
                e.preventDefault();
                setDashboardView("learning");
                try { history.replaceState(null, "", "#learning"); } catch (err) {}
              }}
            >
              <Icon name="learning" size={20} />
              <span>My Learning</span>
            </a>

            <a
              className={dashboardView === "projects" ? "selected" : ""}
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                setDashboardView("projects");
                try { history.replaceState(null, "", "#projects"); } catch (err) {}
              }}
            >
              <Icon name="projects" size={20} />
              <span>Projects</span>
            </a>

            <a href="#portfolio" onClick={(e) => e.preventDefault()}>
              <Icon name="portfolio" size={20} />
              <span>Portfolio</span>
            </a>

            <a href="#community" onClick={(e) => e.preventDefault()}>
              <Icon name="community" size={20} />
              <span>Community</span>
            </a>

            <a href="#opportunities" onClick={(e) => e.preventDefault()}>
              <Icon name="opportunities" size={20} />
              <span>Opportunities</span>
            </a>
          </nav>

          <div className="sidebar-bottom">
            <a href="#notifications" onClick={(e) => e.preventDefault()}>
              <Icon name="notifications" size={20} />
              <span>Notifications</span>
            </a>
            <a href="#settings" onClick={(e) => e.preventDefault()}>
              <Icon name="settings" size={20} />
              <span>Settings</span>
            </a>

            <div className="sidebar-profile-card sidebar-profile-wrapper">
              {showUserDropdown && (
                <div className="sidebar-profile-dropdown">
                  <div className="dropdown-user-header">
                    <img
                      className="dropdown-avatar-thumb"
                      src={account.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
                      alt={account.name || "User"}
                    />
                    <div className="dropdown-user-text">
                      <strong>{account.fullName || account.name || "Daniel"}</strong>
                      <small>{account.email}</small>
                    </div>
                  </div>
                  <hr className="dropdown-divider" />
                  <button
                    type="button"
                    className="dropdown-logout-btn"
                    onClick={() => {
                      setShowUserDropdown(false);
                      logout();
                    }}
                  >
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16 17 21 12 16 7"></polyline>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    <span>Log Out</span>
                  </button>
                </div>
              )}
              <div
                className="sidebar-profile-inner"
                onClick={() => setShowUserDropdown((prev) => !prev)}
                title="Account menu"
              >
                <img
                  className="profile-img"
                  src={account.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
                  alt={account.name || "User"}
                />
                <div className="profile-info">
                  <strong>{account.fullName || account.name || "Daniel"}</strong>
                  <small>★ Level {userLevel} learner</small>
                </div>
                <span className="profile-arrow">{showUserDropdown ? "⌃" : "⌄"}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Dashboard Area */}
        <main className="dashboard-main">
          {/* Topbar */}
          <header className="dashboard-topbar">
            <label className="dashboard-search">
              <Icon name="search" size={18} className="search-icon" />
              <input
                placeholder="What do you want to learn?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </label>

            <div className="topbar-actions">
              <button className="icon-button notification-btn" aria-label="Notifications">
                <Icon name="bell" size={20} />
                <span className="notification-dot"></span>
              </button>

              <div className="topbar-profile">
                <img
                  className="profile-img-sm"
                  src={account.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
                  alt={account.name || "User"}
                />
                <span className="topbar-username">{account.name || "Daniel"}</span>
              </div>
            </div>
          </header>

          {/* VIEW 1: ONGOING COURSE PAGE (Matching Ongoing course.jpeg exactly) */}
          {dashboardView === "course" && (() => {
            const isCurrentCourseEnrolled = Boolean(currentOngoingCourse.enrolled || getCourseProgress(currentOngoingCourse) > 0);
            return (
              <section className="dashboard-content ongoing-course-view-content">
                {!isCurrentCourseEnrolled ? (
                  <div className="course-locked-barrier">
                    <div className="locked-barrier-card">
                      <div className="locked-badge-icon">
                        <Icon name="lock" size={28} />
                      </div>
                      <span className="locked-category-pill">{currentOngoingCourse.category || "Skill Track"}</span>
                      <h2 className="locked-barrier-title">{currentOngoingCourse.title}</h2>
                      <p className="locked-barrier-desc">
                        {currentOngoingCourse.description ||
                          "Enroll in this course to access full video lessons, track your progress, earn XP, and build practical skills."}
                      </p>
                      <div className="locked-meta-details">
                        <span>⏱ {currentOngoingCourse.duration || "4 modules"}</span>
                        <span>📚 {currentCurriculum.length} lessons</span>
                        <span>⭐ +{currentCurriculum.length * 60} XP total</span>
                      </div>
                      <div className="locked-actions-row">
                        <button
                          type="button"
                          className="enroll-primary-btn"
                          onClick={() => enrollCourse(currentOngoingCourse.id, true)}
                        >
                          Enroll Now & Start Course →
                        </button>
                        <button
                          type="button"
                          className="locked-back-btn"
                          onClick={() => setDashboardView("academy")}
                        >
                          Back to Academy
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="ongoing-layout-grid">
                    {/* Left/Center Column: Breadcrumb, Lesson Title, Video, About Card */}
                    <div className="ongoing-main-col">
                      <div className="ongoing-breadcrumb-row">
                        <button className="ongoing-back-btn" onClick={() => setDashboardView("academy")}>
                          ←
                        </button>
                        <span className="ongoing-breadcrumb-title">
                          {currentOngoingCourse.title} · {currentOngoingCourse.module || "Designing User Interfaces"}
                        </span>
                        <button
                          type="button"
                          className="ongoing-unenroll-btn"
                          onClick={() => unenrollCourse(currentOngoingCourse.id)}
                          title="Unenroll from this course"
                        >
                          ✕ Unenroll
                        </button>
                      </div>

                      <h1 className="ongoing-lesson-title">{currentOngoingLesson.title}</h1>

                      {/* Polished Video Playback Tracker & Restart Controls */}
                      <div className="video-playback-tracker-bar">
                        <div className="playback-info">
                          <span className={`live-dot ${isVideoPlaying ? "is-playing" : "is-paused"}`}></span>
                          <div>
                            {!isVideoPlaying ? (
                              <span>
                                <span className="playback-paused-text">⏸ Paused at {formatSeconds(lessonWatchTimestamp)}</span>{" "}
                                <span className="playback-duration">· {liveVideoDuration || currentOngoingLesson.duration} total</span>
                              </span>
                            ) : lessonInitialStartTime > 4 ? (
                              <span>
                                <span className="playback-resuming-text">Resuming from {formatSeconds(lessonWatchTimestamp)}</span>{" "}
                                <span className="playback-duration">· {liveVideoDuration || currentOngoingLesson.duration} total</span>
                              </span>
                            ) : (
                              <span>
                                <span>Playing: {formatSeconds(lessonWatchTimestamp)}</span>{" "}
                                <span className="playback-duration">· {liveVideoDuration || currentOngoingLesson.duration} total</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {lessonWatchTimestamp > 4 && (
                          <button
                            className="restart-video-link"
                            onClick={() => {
                              setLessonInitialStartTime(0);
                              setLessonWatchTimestamp(0);
                              updateLessonSavedTimestamp(activeCourseId, safeActiveLessonIndex, 0);
                            }}
                            title="Restart this lesson from the beginning"
                          >
                            <span>↺</span>
                            <span>Restart from 0:00</span>
                          </button>
                        )}
                      </div>

                      <div className="ongoing-video-container">
                        <iframe
                          key={`${currentOngoingCourse.id}-${safeActiveLessonIndex}-${lessonInitialStartTime}`}
                          src={`${(currentOngoingLesson.videoUrl || currentOngoingCourse.videoUrl)}?enablejsapi=1&autoplay=1&rel=0${
                            lessonInitialStartTime > 4 ? `&start=${lessonInitialStartTime}` : ""
                          }`}
                          title={currentOngoingLesson.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>

                      {/* About This Lesson Card */}
                      <div className="about-lesson-card">
                        <h3>About this lesson</h3>
                        <p>
                          {currentOngoingLesson.description ||
                            "A typeface sets the tone before a single word is read. Learn how to choose typefaces that match a product's personality, judge readability at different sizes, and pair a display face with a body face without clashing."}
                        </p>
                        <div className="lesson-tags-row">
                          {(currentOngoingLesson.tags || ["Readability", "Type Pairing", "Hierarchy"]).map((tag) => (
                            <span key={tag} className="lesson-tag-pill">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Module Progress, Lessons Curriculum, Action Button */}
                    <div className="ongoing-side-col">
                      {/* Module Progress Card */}
                      <div className="module-progress-card">
                        <div className="module-progress-header">
                          <strong>Module Progress</strong>
                          <span>
                            {currentCourseDoneCount}/{currentCourseTotalCount}
                          </span>
                        </div>

                        <div className="meter purple-meter" style={{ marginBottom: ".5rem" }}>
                          <span style={{ width: `${currentCourseModulePct}%` }}></span>
                        </div>

                        <div className="module-meta-row">
                          <span className="ongoing-meta-pill">
                            ⏱ {currentOngoingLesson.done ? "Completed" : `${formatSeconds(currentLessonRemainingSec)} left`}
                          </span>
                          <span className="ongoing-meta-pill xp-pill">⭐ +60 XP</span>
                        </div>

                        <div className="module-instructor-box">
                          <img
                            src={
                              currentOngoingCourse.instructorAvatar ||
                              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                            }
                            alt={currentOngoingCourse.instructor}
                          />
                          <div>
                            <strong>{currentOngoingCourse.instructor}</strong>
                            <small>{currentOngoingCourse.instructorRole}</small>
                          </div>
                        </div>
                      </div>

                      {/* Lessons List Card */}
                      <div className="ongoing-curriculum-card">
                        <h3>Lessons</h3>
                        <div className="ongoing-lessons-list">
                          {currentCurriculum.map((lesson, idx) => {
                            const isActive = idx === safeActiveLessonIndex;
                            const isDone = lesson.done;
                            const lessonSavedTime = Math.floor(lesson.savedTimestamp || 0);

                            let subtitleText = lesson.duration;
                            if (isDone) {
                              subtitleText = `Completed ✓ · ${lesson.duration}`;
                            } else if (isActive) {
                              const displayTotal = liveVideoDuration || lesson.duration;
                              subtitleText = !isVideoPlaying
                                ? `⏸ Paused at ${formatSeconds(lessonWatchTimestamp)} / ${displayTotal}`
                                : `▶ ${formatSeconds(lessonWatchTimestamp)} / ${displayTotal}`;
                            } else if (lessonSavedTime > 4) {
                              subtitleText = `Resumes at ${formatSeconds(lessonSavedTime)} / ${lesson.duration}`;
                            }

                            return (
                              <div
                                key={idx}
                                className={`ongoing-lesson-row ${isActive ? "is-active" : ""}`}
                                onClick={() => {
                                  setActiveLessonIndex(idx);
                                  const initialTime = Math.floor((lesson && lesson.savedTimestamp) || 0);
                                  setLessonInitialStartTime(initialTime);
                                  setLessonWatchTimestamp(initialTime);
                                  setLiveVideoDurationSec(0);
                                  setIsVideoPlaying(true);
                                }}
                              >
                                <div className="ongoing-lesson-row-left">
                                  <span
                                    className={`lesson-state-icon ${
                                      isDone ? "done" : isActive ? "active" : "upcoming"
                                    }`}
                                  >
                                    {isDone ? "✓" : isActive ? "▶" : idx + 1}
                                  </span>
                                  <div className="lesson-row-info">
                                    <h4>{lesson.title}</h4>
                                    <small>{subtitleText}</small>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Mark As Complete Button */}
                      <button
                        className={`ongoing-mark-complete-btn ${currentOngoingLesson.done ? "is-completed" : ""}`}
                        onClick={completeCurrentOngoingLesson}
                      >
                        {currentOngoingLesson.done ? "Lesson Completed ✓ (+60 XP)" : "Mark as complete →"}
                      </button>
                    </div>
                  </div>
                )}

                {/* Bottom motivational status banner */}
                <div className="dashboard-status-footer" style={{ marginTop: "3rem" }}>
                  <p>
                    You're on track for Level {userLevel + 1} — keep showing up, {account.name || "Daniel"}.
                    <Icon name="pencil" size={16} className="footer-pencil-icon" />
                  </p>
                </div>
              </section>
            );
          })()}

          {/* VIEW 2: MY LEARNING (Matching Images/Home.png & Home-completed.png) */}
          {dashboardView === "learning" && (() => {
            const inProgressCourses = ongoingCourses;
            const completedCourses = coursesList.filter((c) => getCourseProgress(c) >= 100);
            const resumingCourse = inProgressCourses.find((c) => c.id === "uiux-1") || inProgressCourses[0] || null;
            const resumingProgressPct = resumingCourse ? getCourseProgress(resumingCourse) : 0;
            const resumingActiveLesson =
              resumingCourse &&
              ((resumingCourse.curriculum && resumingCourse.curriculum.find((l) => !l.done)) ||
                (resumingCourse.curriculum && resumingCourse.curriculum[0]));
            const resumingActiveLessonIdx =
              resumingCourse && resumingCourse.curriculum
                ? resumingCourse.curriculum.findIndex((l) => !l.done)
                : 0;

            return (
              <section className="dashboard-content my-learning-view-content">
                {/* Header Block */}
                <div className="my-learning-header-block">
                  <span className="my-learning-breadcrumb-label">My Learning</span>
                  <h1 className="my-learning-main-title">Pick up where you left off</h1>
                  <p className="my-learning-main-subtitle">
                    All the skills you're building, with your progress saved lesson by lesson.
                  </p>
                </div>

                {/* Hero Resuming Banner matching Home.png & Home-completed.png */}
                {resumingCourse && (
                  <div
                    className="my-learning-hero-banner"
                    onClick={() => openCourseVideo(resumingCourse, resumingActiveLessonIdx !== -1 ? resumingActiveLessonIdx : 0)}
                  >
                    <div className="hero-banner-thumb-wrap">
                      <img
                        src={resumingCourse.heroThumbnail || resumingCourse.thumbnail || "Images/home-hero-uiux.png"}
                        alt={resumingCourse.title}
                        className="hero-banner-thumb"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "Images/home-hero-uiux.png";
                        }}
                      />
                    </div>

                    <div className="hero-banner-body">
                      <div className="hero-banner-header-row">
                        <div className="hero-banner-info-left">
                          <span className="hero-resuming-badge">Resuming</span>
                          <h2 className="hero-course-title">{resumingCourse.title}</h2>
                          <p className="hero-course-subtitle">
                            Module: {resumingCourse.module || "Designing User Interfaces"} · Lesson:{" "}
                            {resumingActiveLesson ? resumingActiveLesson.title : "Creating Effective Layouts"}
                          </p>
                        </div>
                        <button
                          type="button"
                          className="hero-continue-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            openCourseVideo(resumingCourse, resumingActiveLessonIdx !== -1 ? resumingActiveLessonIdx : 0);
                          }}
                        >
                          <span>Continue</span>
                          <span className="hero-play-icon">▶</span>
                        </button>
                      </div>

                      <div className="hero-progress-track">
                        <div
                          className="hero-progress-fill"
                          style={{ width: `${resumingProgressPct}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab Switcher: In Progress / Completed */}
                <div className="learning-tabs-switcher">
                  <button
                    type="button"
                    className={`learning-tab-btn ${learningTab === "in-progress" ? "active" : ""}`}
                    onClick={() => setLearningTab("in-progress")}
                  >
                    In Progress
                  </button>
                  <button
                    type="button"
                    className={`learning-tab-btn ${learningTab === "completed" ? "active" : ""}`}
                    onClick={() => setLearningTab("completed")}
                  >
                    Completed
                  </button>
                </div>

                {/* Tab Content */}
                {learningTab === "in-progress" ? (
                  inProgressCourses.length > 0 ? (
                    <div className="my-learning-grid">
                      {inProgressCourses.map((course) => {
                        const progressPct = getCourseProgress(course);
                        const activeLesson =
                          (course.curriculum && course.curriculum.find((l) => !l.done)) ||
                          (course.curriculum && course.curriculum[0]) || { title: "Getting Started" };
                        const activeLessonIdx =
                          course.curriculum ? course.curriculum.findIndex((l) => !l.done) : 0;

                        // Distinct accent colors matching Home.png
                        const themeColor =
                          course.id === "uiux-1" || course.category === "Design"
                            ? "#5c3cd6"
                            : course.id === "mkt-1" || course.category === "Marketing"
                            ? "#2563eb"
                            : course.id === "media-1" || course.category === "Media"
                            ? "#ea580c"
                            : "#5c3cd6";

                        return (
                          <article
                            key={course.id}
                            className="my-learning-card"
                            onClick={() => openCourseVideo(course, activeLessonIdx !== -1 ? activeLessonIdx : 0)}
                          >
                            <div className="card-thumb-wrap">
                              <img
                                src={course.thumbnail}
                                alt={course.title}
                                className="card-thumb-img"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "Images/course-uiux.png";
                                }}
                              />
                            </div>

                            <div className="card-body">
                              <div className="card-top-info">
                                <h3 className="card-title">{course.title}</h3>
                                <p className="card-next-lesson">
                                  Next: {activeLesson.title}
                                </p>
                              </div>

                              <div className="card-progress-section">
                                <div className="card-progress-row">
                                  <span className="card-progress-label">Progress</span>
                                  <span className="card-progress-pct" style={{ color: themeColor }}>
                                    {progressPct}%
                                  </span>
                                </div>
                                <div className="card-progress-track">
                                  <div
                                    className="card-progress-fill"
                                    style={{ width: `${progressPct}%`, backgroundColor: themeColor }}
                                  ></div>
                                </div>
                              </div>

                              <div className="card-footer-row">
                                <div className="card-instructor-info">
                                  <img
                                    src={course.instructorAvatar || "Images/tutor-joseph.png"}
                                    alt={course.instructor || "Instructor"}
                                    className="card-instructor-avatar"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = "Images/tutor-joseph.png";
                                    }}
                                  />
                                  <div className="card-instructor-text">
                                    <h4 className="card-instructor-name">{course.instructor || "Instructor"}</h4>
                                    <p className="card-instructor-role">{course.instructorRole || "Tutor"}</p>
                                  </div>
                                </div>

                                <div className="card-learning-actions">
                                  <button
                                    type="button"
                                    className="card-continue-btn"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openCourseVideo(course, activeLessonIdx !== -1 ? activeLessonIdx : 0);
                                    }}
                                  >
                                    <span>Continue</span>
                                    <span className="card-arrow-icon">--→</span>
                                  </button>
                                  <button
                                    type="button"
                                    className="learning-unenroll-btn"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      unenrollCourse(course.id);
                                    }}
                                    title="Unenroll from this course"
                                  >
                                    Drop
                                  </button>
                                </div>
                              </div>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="no-learning-courses">
                      <h3>No ongoing courses right now!</h3>
                      <p>
                        Explore our courses in the Skill Academy, start learning, and your ongoing progress will automatically appear here.
                      </p>
                      <button
                        className="primary-button inline-purple-btn"
                        style={{ display: "inline-flex", margin: "0 auto" }}
                        onClick={() => setDashboardView("academy")}
                      >
                        Explore Skill Academy →
                      </button>
                    </div>
                  )
                ) : (
                  /* Completed Tab Content matching Home-completed.png */
                  completedCourses.length > 0 ? (
                    <div className="my-learning-grid">
                      {completedCourses.map((course) => {
                        return (
                          <article
                            key={course.id}
                            className="my-learning-card"
                            onClick={() => openCourseVideo(course, 0)}
                          >
                            <div className="card-thumb-wrap">
                              <img
                                src={course.thumbnail}
                                alt={course.title}
                                className="card-thumb-img"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "Images/course-thinking.png";
                                }}
                              />
                            </div>

                            <div className="card-body">
                              <div className="card-top-info">
                                <h3 className="card-title">{course.title}</h3>
                                <p className="card-next-lesson">
                                  Next: Complete
                                </p>
                              </div>

                              <div className="card-progress-section">
                                <div className="card-progress-row">
                                  <span className="card-progress-label">Progress</span>
                                  <span className="card-progress-pct" style={{ color: "#22c55e" }}>
                                    100%
                                  </span>
                                </div>
                                <div className="card-progress-track">
                                  <div
                                    className="card-progress-fill"
                                    style={{ width: "100%", backgroundColor: "#22c55e" }}
                                  ></div>
                                </div>
                              </div>

                              <div className="card-footer-row">
                                <div className="card-instructor-info">
                                  <img
                                    src={course.instructorAvatar || "Images/tutor-leo.png"}
                                    alt={course.instructor || "Instructor"}
                                    className="card-instructor-avatar"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = "Images/tutor-leo.png";
                                    }}
                                  />
                                  <div className="card-instructor-text">
                                    <h4 className="card-instructor-name">{course.instructor || "Instructor"}</h4>
                                    <p className="card-instructor-role">{course.instructorRole || "Tutor"}</p>
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  className="card-continue-btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openCourseVideo(course, 0);
                                  }}
                                >
                                  <span>Review</span>
                                  <span className="card-arrow-icon">--→</span>
                                </button>
                              </div>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="completed-tab-placeholder">
                      <div className="completed-placeholder-icon">🏆</div>
                      <h3>No completed courses yet</h3>
                      <p>
                        Courses you finish will appear here along with your certificates of completion. Keep showing up and learning!
                      </p>
                      <button
                        type="button"
                        className="completed-browse-btn"
                        onClick={() => setLearningTab("in-progress")}
                      >
                        View In Progress Courses →
                      </button>
                    </div>
                  )
                )}

                {/* Bottom motivational status banner matching Home.png */}
                <div className="dashboard-status-footer" style={{ marginTop: "4rem" }}>
                  <p>
                    You're on track for Level {userLevel + 1} — keep showing up, {account.name || "Daniel"}.{" "}
                    <span className="footer-pencil-emoji" role="img" aria-label="pencil">🖌️</span>
                  </p>
                </div>
              </section>
            );
          })()}


          {/* VIEW 3: SKILL ACADEMY (Matching dashdord-skill academy.jpeg) */}
          {dashboardView === "academy" && (
            <section className="dashboard-content academy-view-content">
              <div className="academy-header-block">
                <span className="academy-breadcrumb-label">Skill Academy</span>
                <h1 className="academy-main-title">Explore skills to learn</h1>
                <p className="academy-main-subtitle">
                  Hand-picked skill tracks to help you grow. Enroll in anything that sparks your curiosity.
                </p>

                {/* Category Pills Filter */}
                <div className="category-pill-group">
                  {categoriesList.map((category) => (
                    <button
                      key={category}
                      className={`category-pill ${academyCategory === category ? "active" : ""}`}
                      onClick={() => setAcademyCategory(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Course Cards Grid */}
              <div className="academy-courses-grid">
                {filteredCourses.length > 0 ? (
                  filteredCourses.map((course) => {
                    const progress = getCourseProgress(course);
                    const isEnrolled = Boolean(course.enrolled || progress > 0);
                    const isCompleted = progress === 100;

                    let btnText = "Start Learning";
                    let btnTheme = "btn-light-purple";

                    if (isCompleted) {
                      btnText = "Completed (100%) ✓";
                      btnTheme = "btn-light-purple";
                    } else if (progress > 0) {
                      btnText = `Continue (${progress}%)`;
                      btnTheme = "btn-light-purple";
                    }

                    return (
                      <article
                        key={course.id}
                        className={`academy-course-card ${isEnrolled ? "card-is-enrolled" : ""}`}
                        onClick={() => {
                          if (isEnrolled) {
                            openCourseVideo(course);
                          } else {
                            setEnrollmentModalCourse(course);
                          }
                        }}
                      >
                        <div className="card-thumbnail-container">
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="card-thumbnail"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80";
                            }}
                          />
                          <div className="thumbnail-play-overlay">
                            <span className="play-circle">
                              <Icon name={isEnrolled ? "play" : "lock"} size={20} />
                            </span>
                          </div>
                        </div>

                        <div className="card-body">
                          <div className="card-meta">
                            <Icon name="lessons" size={16} className="meta-icon" />
                            <span>{course.meta}</span>
                            {userPersonalizedIds.includes(course.id) && (
                              <span className="curated-badge-pill">★ Recommended</span>
                            )}
                            {isEnrolled && (
                              <span className="enrolled-badge-pill">✓ Enrolled</span>
                            )}
                          </div>

                          <h3 className="card-title">{course.title}</h3>
                          <p className="card-desc">{course.description}</p>

                          <div className="card-footer-action">
                            {!isEnrolled ? (
                              <button
                                className="card-action-btn btn-solid-purple"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  enrollCourse(course.id, false);
                                }}
                              >
                                <span>Enroll Now</span>
                                <span className="action-arrow">+</span>
                              </button>
                            ) : (
                              <div className="card-enrolled-actions-row">
                                <button
                                  className={`card-action-btn ${btnTheme}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openCourseVideo(course);
                                  }}
                                >
                                  <span>{btnText}</span>
                                  <span className="action-arrow">→</span>
                                </button>
                                <button
                                  type="button"
                                  className="card-unenroll-btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    unenrollCourse(course.id);
                                  }}
                                  title="Unenroll from this course"
                                >
                                  Unenroll
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </article>
                    );
                  })
                ) : (
                  <div className="no-courses-found">
                    <p>No skill tracks found matching your filter.</p>
                    <button className="primary-button inline-btn" onClick={() => { setAcademyCategory("All"); setSearchQuery(""); }}>
                      Reset filters
                    </button>
                  </div>
                )}
              </div>

              {/* Bottom motivational status banner */}
              <div className="dashboard-status-footer">
                <p>
                  You're on track for Level {userLevel + 1} — keep showing up, {account.name || "Daniel"}.
                  <Icon name="pencil" size={16} className="footer-pencil-icon" />
                </p>
              </div>
            </section>
          )}

          {/* VIEW 4: HOME DASHBOARD (Matching Dashboard-home.jpeg exactly) */}
          {dashboardView === "home" && (
            <section className="dashboard-content home-view-content">
              {/* 1. Hero Banner */}
              <div className="dashboard-hero">
                <div className="hero-text-side">
                  <span className="hero-pill">
                    {streak === 0 ? "Start your daily streak" : (streak === 1 ? "On a 1 day streak" : `On a ${streak} day streak`)}
                  </span>
                  <h1>{getTimeGreeting()}, {account.name || "Daniel"}</h1>
                  <p>Small steps every day. Keep building the future you want.</p>
                  <small>You're making great progress this week. Keep your learning streak going.</small>
                  <div className="hero-actions">
                    <button
                      className="hero-btn-white"
                      onClick={() => {
                        if (featuredOngoingCourse) {
                          openCourseVideo(featuredOngoingCourse);
                        } else {
                          setDashboardView("academy");
                        }
                      }}
                    >
                      {featuredOngoingCourse ? "Resume Learning →" : "Start Learning →"}
                    </button>
                    <button className="hero-btn-outline" onClick={() => setDashboardView("academy")}>
                      Explore Skills →
                    </button>
                  </div>
                </div>
              </div>

              {/* 2. Top Summary 4 Cards (Weekly Streak, Level & Courses, Total XP, Projects) */}
              <div className="summary-grid-4">
                {/* Card 1: Weekly Streak */}
                <section className="summary-card streak-card">
                  <div className="card-top-badge">
                    <span className="card-label">🔥 Weekly Streak</span>
                    <span className="pill-xp">+{userXp} XP this week</span>
                  </div>
                  <strong className="summary-card-title">{streak} {streak === 1 ? "Day" : "Days"}</strong>
                  <div className="week-days-14">
                    <div className="week-days-row">
                      {["01", "02", "03", "04", "05", "06", "07"].map((day, index) => (
                        <span className={index < streak ? "done" : ""} key={day}>
                          {day}
                          <b>✓</b>
                        </span>
                      ))}
                    </div>
                    <div className="week-days-row">
                      {["08", "09", "10", "11", "12", "13", "14"].map((day, index) => (
                        <span className={index + 7 < streak ? "done" : ""} key={day}>
                          {day}
                          <b>✓</b>
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    type="button"
                    className={`orange-button ${isStreakClaimedToday ? "disabled-btn" : ""}`}
                    onClick={incrementStreak}
                    disabled={isStreakClaimedToday}
                    title={isStreakClaimedToday ? "Streak already recorded for today! Come back tomorrow to continue your streak." : "Click to keep your daily streak going"}
                  >
                    {isStreakClaimedToday ? (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "middle" }}>
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        <span>Streak Kept for Today!</span>
                      </>
                    ) : (
                      <>
                        <span className="streak-flame-icon">🔥</span>
                        <span>{streak === 0 ? "Start Daily Streak" : "Keep It Going"}</span>
                      </>
                    )}
                  </button>
                </section>

                {/* Card 2: Current Level & Active Courses */}
                <section className="summary-card level-courses-card">
                  <div className="level-top-half">
                    <div className="card-header-icon-row">
                      <div>
                        <div className="card-label">Current Level</div>
                        <strong className="summary-card-title">Level {userLevel || 4}</strong>
                      </div>
                      <span className="card-corner-icon purple-icon-box">
                        <Icon name="chart" size={16} />
                      </span>
                    </div>
                    <div className="meter-group">
                      <div className="meter-label-row">
                        <small>To Level {userLevel + 1}</small>
                        <b>{levelProgressPct}%</b>
                      </div>
                      <div className="meter purple-meter">
                        <span style={{ width: `${levelProgressPct}%` }}></span>
                      </div>

                      <div className="meter-label-row">
                        <small>Weekly XP Goal</small>
                        <b>{weeklyXpGoalPct}%</b>
                      </div>
                      <div className="meter orange-meter">
                        <span style={{ width: `${weeklyXpGoalPct}%` }}></span>
                      </div>
                    </div>
                  </div>

                  <div className="card-inner-divider"></div>

                  <div className="courses-bottom-half">
                    <div className="card-header-icon-row">
                      <div>
                        <div className="card-label">Courses</div>
                        <strong className="summary-card-title-sm">{ongoingCourses.length} Active</strong>
                      </div>
                      <span className="card-corner-icon blue-icon-box">
                        <Icon name="monitor" size={16} />
                      </span>
                    </div>
                    <div className="courses-dots-list">
                      {ongoingCourses.length === 0 ? (
                        <p style={{ fontSize: "0.78rem", color: "#94a3b8", margin: "0.4rem 0", fontStyle: "italic" }}>
                          No active courses yet
                        </p>
                      ) : (
                        ongoingCourses.slice(0, 3).map((c, i) => {
                          const dotClasses = ["dot-purple", "dot-blue", "dot-dark-purple"];
                          return (
                            <div className="course-dot-item" key={c.id}>
                              <span><i className={dotClasses[i % dotClasses.length]}>●</i> {c.title}</span>
                              <b>{getCourseProgress(c)}%</b>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </section>

                {/* Card 3: Total XP & Chart */}
                <section className="summary-card xp-chart-card">
                  <div className="card-header-icon-row">
                    <div>
                      <div className="card-label">Total XP</div>
                      <strong className="summary-card-title">{userXp.toLocaleString()} <small>XP</small></strong>
                    </div>
                    <span className="card-corner-icon orange-icon-box">
                      <Icon name="trophy" size={16} />
                    </span>
                  </div>
                  <div className="meter-label-row" style={{ marginTop: ".3rem", marginBottom: ".55rem" }}>
                    <small>This Week</small>
                    <b style={{ color: "#4c4660" }}>+{userXp} XP</b>
                  </div>
                  <div className="xp-bar-chart-7">
                    <div className="xp-bar-col"><span style={{ height: "45%" }}></span></div>
                    <div className="xp-bar-col"><span style={{ height: "65%" }}></span></div>
                    <div className="xp-bar-col"><span style={{ height: "35%" }}></span></div>
                    <div className="xp-bar-col"><span style={{ height: "55%" }}></span></div>
                    <div className="xp-bar-col active"><span style={{ height: "95%" }}></span></div>
                    <div className="xp-bar-col"><span style={{ height: "30%" }}></span></div>
                    <div className="xp-bar-col"><span style={{ height: "40%" }}></span></div>
                  </div>
                </section>

                {/* Card 4: Projects */}
                <section className="summary-card projects-status-card">
                  <div className="card-header-icon-row">
                    <div>
                      <div className="card-label">Projects</div>
                      <strong className="summary-card-title">{projects.length} Completed</strong>
                    </div>
                    <span className="card-corner-icon green-icon-box">
                      <Icon name="check" size={16} />
                    </span>
                  </div>

                  <div className="card-inner-divider"></div>

                  <div className="projects-shipped-section">
                    <div className="card-label" style={{ marginBottom: ".45rem" }}>Recently Shipped</div>
                    {projects.length === 0 ? (
                      <p style={{ fontSize: "0.78rem", color: "#94a3b8", margin: "0.4rem 0", fontStyle: "italic" }}>
                        No projects completed yet
                      </p>
                    ) : (
                      <ul className="shipped-projects-list">
                        {projects.slice(0, 3).map((p) => (
                          <li key={p.id}>
                            <span className="check-green-icon">✓</span>
                            <span>{p.title}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </section>
              </div>

              {/* 3. Continue Learning Section (Dynamic: Empty when 0 ongoing courses, Real cards when enrolled) */}
              <section className="continue-learning-home-section" id="learning">
                <div className="section-heading">
                  <div>
                    <h2>Continue Learning</h2>
                    <p>{ongoingCourses.length > 0 ? "Pick up where you left off." : "You have not enrolled in any courses yet."}</p>
                  </div>
                  <a
                    href="#academy"
                    className="section-header-link"
                    onClick={(e) => {
                      e.preventDefault();
                      setDashboardView("academy");
                    }}
                  >
                    View all courses →
                  </a>
                </div>

                {ongoingCourses.length === 0 ? (
                  <div className="continue-learning-empty-box">
                    <div className="empty-learning-icon-circle">
                      <Icon name="monitor" size={28} />
                    </div>
                    <h3>No courses in progress</h3>
                    <p>You haven't enrolled or started watching any courses yet. Explore our Skills Academy to begin your learning journey!</p>
                    <button
                      type="button"
                      className="empty-enroll-btn"
                      onClick={() => setDashboardView("academy")}
                    >
                      Explore Skills Academy →
                    </button>
                  </div>
                ) : (
                  <div className="continue-learning-grid-layout">
                    {/* Left Large Featured Card (Dynamic!) */}
                    {featuredOngoingCourse && (
                      <div
                        className="featured-course-banner-card"
                        onClick={() => openCourseVideo(featuredOngoingCourse)}
                      >
                        <div className="featured-thumb-laptop-mockup">
                          <img
                            src={featuredOngoingCourse.thumbnail}
                            alt={featuredOngoingCourse.title}
                          />
                          <div className="laptop-play-btn-circle">
                            <Icon name="play" size={24} />
                          </div>
                        </div>

                        <div className="featured-banner-content">
                          <div className="featured-header-row">
                            <h3>{featuredOngoingCourse.title}</h3>
                            <span className="duration-pill-lavender">⏱ {featuredOngoingCourse.duration || "18 Mins"}</span>
                          </div>
                          <p className="featured-module-label">
                            Module: <strong>{featuredOngoingCourse.curriculum && featuredOngoingCourse.curriculum[0] && featuredOngoingCourse.curriculum[0].tags ? featuredOngoingCourse.curriculum[0].tags[0] : "Core Track"}</strong>
                          </p>
                          <p className="featured-lesson-label">
                            Lesson: <strong>{featuredOngoingCourse.curriculum && featuredOngoingCourse.curriculum.find((l) => !l.done) ? featuredOngoingCourse.curriculum.find((l) => !l.done).title : (featuredOngoingCourse.curriculum[0] && featuredOngoingCourse.curriculum[0].title ? featuredOngoingCourse.curriculum[0].title : "Lesson 1")}</strong>
                          </p>

                          <div className="featured-course-progress-block">
                            <div className="progress-text-row">
                              <small>Course Progress</small>
                              <b>{getCourseProgress(featuredOngoingCourse)}%</b>
                            </div>
                            <div className="meter purple-meter">
                              <span style={{ width: `${getCourseProgress(featuredOngoingCourse)}%` }}></span>
                            </div>
                          </div>

                          <div className="featured-instructor-action-row">
                            <div className="instructor-mini-profile">
                              <img
                                src={featuredOngoingCourse.instructorAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"}
                                alt={featuredOngoingCourse.instructor}
                              />
                              <div>
                                <strong>{featuredOngoingCourse.instructor}</strong>
                                <small>{featuredOngoingCourse.instructorRole || "Tutor"}</small>
                              </div>
                            </div>

                            <button
                              type="button"
                              className="featured-continue-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                openCourseVideo(featuredOngoingCourse);
                              }}
                            >
                              <span>Continue Learning</span>
                              <span>→</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Right Stacked Mini Ongoing Cards (Dynamic!) */}
                    <div className="mini-courses-stacked-col">
                      {otherOngoingCourses.length > 0 ? (
                        otherOngoingCourses.slice(0, 2).map((course) => {
                          const pct = getCourseProgress(course);
                          return (
                            <div
                              className="mini-ongoing-card"
                              key={course.id}
                              onClick={() => openCourseVideo(course)}
                            >
                              <div className="mini-card-thumb">
                                <img
                                  src={course.thumbnail}
                                  alt={course.title}
                                />
                              </div>
                              <div className="mini-card-info">
                                <div className="mini-card-top-row">
                                  <h4>{course.title}</h4>
                                  <b className="blue-pct">{pct}%</b>
                                </div>
                                <small className="mini-category">{course.category}</small>
                                <div className="meter blue-meter">
                                  <span style={{ width: `${pct}%` }}></span>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div
                          className="mini-ongoing-card mini-enroll-prompt-card"
                          onClick={() => setDashboardView("academy")}
                        >
                          <div className="mini-prompt-content">
                            <h4>Explore More Skills</h4>
                            <small>Enroll in additional courses to expand your skill set.</small>
                            <span className="browse-more-link">Browse Academy →</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </section>

              {/* 4. Middle 2-Column: "Your Next Step" & "Your Growth" */}
              <div className="next-growth-grid-2">
                {/* Left: Your Next Step */}
                <section className="dashboard-panel next-step-panel">
                  <span className="next-step-badge-pill">✦ Your Next Step</span>
                  {featuredOngoingCourse ? (
                    <>
                      <div className="next-step-content-row">
                        <div className="next-step-icon-square">
                          <Icon name="monitor" size={24} />
                        </div>
                        <div>
                          <h3>
                            {featuredOngoingCourse.curriculum && featuredOngoingCourse.curriculum.find((l) => !l.done)
                              ? featuredOngoingCourse.curriculum.find((l) => !l.done).title
                              : "Continue Your Course"}
                          </h3>
                          <p>
                            {featuredOngoingCourse.title} • {getCourseProgress(featuredOngoingCourse)}% completed
                          </p>
                        </div>
                      </div>

                      <div className="next-step-tags-row">
                        <span className="next-tag-pill">⏱ 15 Min</span>
                        <span className="next-tag-pill xp-orange-tag">⭐ +50 XP</span>
                      </div>

                      <button
                        type="button"
                        className="start-lesson-full-btn"
                        onClick={() => openCourseVideo(featuredOngoingCourse)}
                      >
                        ▶ Resume Lesson
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="next-step-content-row">
                        <div className="next-step-icon-square">
                          <Icon name="monitor" size={24} />
                        </div>
                        <div>
                          <h3>Start Your First Course</h3>
                          <p>Browse our curated tracks and start building real skills.</p>
                        </div>
                      </div>

                      <div className="next-step-tags-row">
                        <span className="next-tag-pill">⏱ 15 Min</span>
                        <span className="next-tag-pill xp-orange-tag">⭐ +50 XP</span>
                      </div>

                      <button
                        type="button"
                        className="start-lesson-full-btn"
                        onClick={() => setDashboardView("academy")}
                      >
                        ▶ Browse Courses
                      </button>
                    </>
                  )}
                </section>

                {/* Right: Your Growth */}
                <section className="dashboard-panel your-growth-panel">
                  <div className="growth-header-row">
                    <div>
                      <h2>Your Growth</h2>
                      <p>Level up by earning XP</p>
                    </div>
                  </div>

                  <div className="growth-body-row">
                    <div className="growth-level-donut-box">
                      <svg className="level-donut-svg" viewBox="0 0 100 100">
                        <circle
                          className="donut-bg-ring"
                          cx="50"
                          cy="50"
                          r="40"
                          strokeWidth="8"
                        />
                        <circle
                          className="donut-fill-ring"
                          cx="50"
                          cy="50"
                          r="40"
                          strokeWidth="8"
                          strokeDasharray={251.32}
                          strokeDashoffset={251.32 * (1 - levelProgressPct / 100)}
                        />
                      </svg>
                      <div className="donut-center-text">
                        <small>Level</small>
                        <strong>{userLevel || 4}</strong>
                      </div>
                    </div>

                    <div className="growth-xp-info-col">
                      <div className="growth-xp-number">
                        <strong>{userXp.toLocaleString()}</strong> <small>/3000 XP</small>
                      </div>
                      <div className="growth-xp-pill-bar">
                        <span>✦ {xpToNext} XP to Level {userLevel + 1}</span>
                        <div className="pill-meter-bar">
                          <span style={{ width: `${levelProgressPct}%` }}></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              {/* 5. Recent Achievements */}
              <section className="dashboard-panel achievements-panel" id="portfolio">
                <div className="section-heading">
                  <div>
                    <h2>Recent Achievements</h2>
                    <p>Badges you've picked up on your journey</p>
                  </div>
                  <a href="#portfolio" className="section-header-link" onClick={(e) => e.preventDefault()}>
                    View All →
                  </a>
                </div>

                <div className="achievement-cards-row-4">
                  <article className="achievement-card">
                    <div className="achievement-icon-box orange-box">
                      <Icon name="badge-fire" size={32} />
                    </div>
                    <strong>{streak > 0 ? `${streak} Day Streak` : "Daily Streak"}</strong>
                    <small>{streak > 0 ? `Learned ${streak} ${streak === 1 ? "day" : "days"} straight` : "Log in daily to build streak"}</small>
                  </article>

                  <article className="achievement-card">
                    <div className="achievement-icon-box blue-box">
                      <Icon name="badge-project" size={32} />
                    </div>
                    <strong>First Project</strong>
                    <small>Shipped your first build</small>
                  </article>

                  <article className="achievement-card">
                    <div className="achievement-icon-box green-box">
                      <Icon name="badge-quiz" size={32} />
                    </div>
                    <strong>Quiz Champion</strong>
                    <small>Aced 5 quizzes in a row</small>
                  </article>

                  <article className="achievement-card">
                    <div className="achievement-icon-box purple-box">
                      <Icon name="badge-skill" size={32} />
                    </div>
                    <strong>Skill Explorer</strong>
                    <small>Tried 3 new skill tracks</small>
                  </article>
                </div>
              </section>

              {/* 6. Opportunities for You (Dark Card) */}
              <section className="opportunities-dark-container" id="opportunities">
                <div className="opp-header-row">
                  <div>
                    <h2>Opportunities for You</h2>
                    <p>Discover ways to put your skills to action</p>
                  </div>
                  <a href="#opportunities" className="browse-all-link" onClick={(e) => e.preventDefault()}>Browse All →</a>
                </div>

                <div className="opportunities-3-cards-grid">
                  <article className="opp-dark-card">
                    <div className="opp-top-tags-row">
                      <span className="opp-pill-tag purple-tag">Competition</span>
                      <span className="opp-meta-category">Design</span>
                    </div>
                    <h3>Young Creators Challenge</h3>
                    <p>Submit an original design project and win mentorship + prizes.</p>
                    <div className="opp-footer-row">
                      <span className="opp-deadline">⏱ Deadline: Sept 12</span>
                      <button className="opp-view-btn">View All →</button>
                    </div>
                  </article>

                  <article className="opp-dark-card">
                    <div className="opp-top-tags-row">
                      <span className="opp-pill-tag green-tag">Scholarships</span>
                      <span className="opp-meta-category">All Skills</span>
                    </div>
                    <h3>Future Leaders Scholarship</h3>
                    <p>Full funding for a year of premium skill tracks and workshops.</p>
                    <div className="opp-footer-row">
                      <span className="opp-deadline">⏱ Deadline: Sept 20</span>
                      <button className="opp-view-btn">View All →</button>
                    </div>
                  </article>

                  <article className="opp-dark-card">
                    <div className="opp-top-tags-row">
                      <span className="opp-pill-tag blue-tag">Workshop</span>
                      <span className="opp-meta-category">Marketing</span>
                    </div>
                    <h3>Digital Skills Workshop</h3>
                    <p>A hands-on live session on building your first online portfolio.</p>
                    <div className="opp-footer-row">
                      <span className="opp-deadline">⏱ Deadline: Sept 28</span>
                      <button className="opp-view-btn">View All →</button>
                    </div>
                  </article>
                </div>
              </section>

              {/* 7. Bottom 2-Column: Coming Up & Recent Updates */}
              <div className="coming-updates-grid-2">
                {/* Left: Coming Up */}
                <section className="dashboard-panel coming-up-panel">
                  <h2>Coming Up</h2>
                  <div className="coming-event-box">
                    <div className="calendar-date-badge">
                      <span>Tue</span>
                      <strong>17</strong>
                    </div>
                    <div className="event-info-side">
                      <div className="event-live-pill">📹 Live Design Q&A</div>
                      <div className="event-time-text">Tomorrow · 4pm</div>
                      <div className="event-instructor-row">
                        <img
                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80"
                          alt="Joseph Joestar"
                        />
                        <span>With Joseph Joestar</span>
                      </div>
                    </div>
                  </div>
                  <button className="view-details-outline-btn">View Details</button>
                </section>

                {/* Right: Recent Updates */}
                <section className="dashboard-panel recent-updates-panel">
                  <div className="section-heading">
                    <div>
                      <h2>Recent Updates</h2>
                    </div>
                    <a href="#updates" className="section-header-link" onClick={(e) => e.preventDefault()}>See all</a>
                  </div>
                  <div className="updates-list">
                    <div className="update-list-item">
                      <span className="update-circle-icon orange-circle">🔥</span>
                      <div className="update-content">
                        <p>{streak > 0 ? `You earned the ${streak} day streak` : "Start a learning streak today"}</p>
                        <small>2hrs ago</small>
                      </div>
                    </div>
                    <div className="update-list-item">
                      <span className="update-circle-icon blue-circle">💬</span>
                      <div className="update-content">
                        <p>Your tutor left feedback on your project.</p>
                        <small>5hrs ago</small>
                      </div>
                    </div>
                    <div className="update-list-item">
                      <span className="update-circle-icon green-circle">🌱</span>
                      <div className="update-content">
                        <p>A new opportunity matching your interests was added.</p>
                        <small>Yesterday</small>
                      </div>
                    </div>
                    <div className="update-list-item">
                      <span className="update-circle-icon purple-circle">🎓</span>
                      <div className="update-content">
                        <p>You completed Module 3.</p>
                        <small>Yesterday</small>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              {/* 8. Bottom Motivational Status Footer */}
              <div className="dashboard-status-footer" style={{ marginTop: "2.5rem" }}>
                <p>
                  You're on track for Level {userLevel + 1} — keep showing up, {account.name || "Daniel"}. 🪄
                </p>
              </div>
            </section>
          )}

          {/* VIEW 5: PROJECTS WORKSPACE (Matching Images/project-tab.png) */}
          {dashboardView === "projects" && (
            <section className="dashboard-content projects-view-content">
              {/* Top Breadcrumb & Header Row */}
              <div className="projects-top-header">
                <div className="projects-header-left">
                  <span className="projects-breadcrumb">Projects</span>
                  <h1 className="projects-main-title">Build. Ship. Grow</h1>
                  <p className="projects-main-subtitle">
                    Your personal project workspace — from early ideas to portfolio-ready work.
                  </p>
                </div>
                <div className="projects-header-actions">
                  {projects.length > 0 && (
                    <button
                      type="button"
                      className="projects-reset-btn"
                      onClick={handleClearProjectsToZero}
                      title="Reset all projects back to 0 count"
                    >
                      Reset to 0
                    </button>
                  )}
                  <button
                    type="button"
                    className="new-project-primary-btn"
                    onClick={() => setIsCreateProjectOpen(true)}
                  >
                    <Icon name="plus" size={18} />
                    <span>New Project</span>
                  </button>
                </div>
              </div>

              {/* 4 Stat Cards Row (Total Projects, Completed, In Progress, XP from projects) */}
              <div className="projects-stats-grid">
                {/* Stat 1: Total Projects */}
                <div className="projects-stat-card">
                  <div className="stat-icon-wrap stat-icon-purple">
                    <Icon name="projects" size={24} />
                  </div>
                  <div className="stat-info-col">
                    <span className="stat-label">Total Projects</span>
                    <strong className="stat-value">{totalProjectsCount}</strong>
                  </div>
                </div>

                {/* Stat 2: Completed */}
                <div className="projects-stat-card">
                  <div className="stat-icon-wrap stat-icon-green">
                    <Icon name="check-square" size={24} />
                  </div>
                  <div className="stat-info-col">
                    <span className="stat-label">Completed</span>
                    <strong className="stat-value">{completedProjectsCount}</strong>
                  </div>
                </div>

                {/* Stat 3: In Progress */}
                <div className="projects-stat-card">
                  <div className="stat-icon-wrap stat-icon-blue">
                    <Icon name="in-progress-book" size={24} />
                  </div>
                  <div className="stat-info-col">
                    <span className="stat-label">In Progress</span>
                    <strong className="stat-value">{inProgressProjectsCount}</strong>
                  </div>
                </div>

                {/* Stat 4: XP from projects */}
                <div className="projects-stat-card">
                  <div className="stat-icon-wrap stat-icon-orange">
                    <Icon name="award-ribbon" size={24} />
                  </div>
                  <div className="stat-info-col">
                    <span className="stat-label">XP from projects</span>
                    <strong className="stat-value">{xpFromProjectsCount}</strong>
                  </div>
                </div>
              </div>

              {/* "Down Side": Empty state if 0 projects, or Featured Project + Filter Tabs + Grid */}
              {projects.length === 0 ? (
                /* Empty state when 0 projects exist (counts are 0) */
                <div className="projects-empty-state-card">
                  <div className="empty-state-icon-circle">
                    <Icon name="projects" size={36} />
                  </div>
                  <h2 className="empty-state-title">Your Project Workspace is Ready</h2>
                  <p className="empty-state-desc">
                    You don't have any projects yet. All counts start at 0. Start building your first project to showcase your skills, earn XP, and populate your portfolio.
                  </p>
                </div>
              ) : (
                /* Down side when projects exist: Featured Banner + Filter Tabs + Cards Grid */
                <div className="projects-populated-section">
                  {/* Featured Project Banner (if available) */}
                  {featuredProject && (
                    <div className="featured-project-card">
                      <div className="featured-content-col">
                        <div className="featured-pill-badge">
                          <span>✦ Featured Project</span>
                        </div>
                        <h2 className="featured-project-title">{featuredProject.title}</h2>
                        <p className="featured-project-desc">{featuredProject.description}</p>
                        <div className="featured-meta-row">
                          <span className={`featured-status-pill ${featuredProject.status === "completed" ? "status-completed" : "status-inprogress"}`}>
                            ● {featuredProject.statusLabel || (featuredProject.status === "completed" ? "Completed" : "In Progress")}
                          </span>
                          <span className="featured-xp-pill">
                            ★ + {featuredProject.xp || 50} XP
                          </span>
                          <span className="featured-date-text">{featuredProject.updatedDate || "Updated recently"}</span>
                        </div>
                      </div>
                      <div className="featured-media-col">
                        <img
                          src={featuredProject.image || "Images/course-marketing.png"}
                          alt={featuredProject.title}
                          className="featured-media-img"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=600&q=80";
                          }}
                        />
                        <button
                          type="button"
                          className="open-project-overlay-btn"
                          onClick={() => setViewingProject(featuredProject)}
                        >
                          <Icon name="folder" size={18} />
                          <span>Open Project</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Filter Tabs Row */}
                  <div className="project-filter-tabs-row">
                    <button
                      type="button"
                      className={`project-tab-btn ${projectFilterTab === "all" ? "active" : ""}`}
                      onClick={() => setProjectFilterTab("all")}
                    >
                      All <span className="tab-count-badge">{totalProjectsCount}</span>
                    </button>
                    <button
                      type="button"
                      className={`project-tab-btn ${projectFilterTab === "in-progress" ? "active" : ""}`}
                      onClick={() => setProjectFilterTab("in-progress")}
                    >
                      In Progress <span className="tab-count-badge">{inProgressProjectsCount}</span>
                    </button>
                    <button
                      type="button"
                      className={`project-tab-btn ${projectFilterTab === "drafts" ? "active" : ""}`}
                      onClick={() => setProjectFilterTab("drafts")}
                    >
                      Drafts <span className="tab-count-badge">{draftProjectsCount}</span>
                    </button>
                    <button
                      type="button"
                      className={`project-tab-btn ${projectFilterTab === "completed" ? "active" : ""}`}
                      onClick={() => setProjectFilterTab("completed")}
                    >
                      Completed <span className="tab-count-badge">{completedProjectsCount}</span>
                    </button>
                    <button
                      type="button"
                      className={`project-tab-btn ${projectFilterTab === "submitted" ? "active" : ""}`}
                      onClick={() => setProjectFilterTab("submitted")}
                    >
                      Submitted <span className="tab-count-badge">{submittedProjectsCount}</span>
                    </button>
                  </div>

                  {/* 3-Column Project Cards Grid */}
                  <div className="projects-cards-grid">
                    {filteredProjects.map((proj) => (
                      <article key={proj.id} className="project-card-item">
                        <div className="project-card-media-wrap">
                          <img
                            src={proj.image || "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80"}
                            alt={proj.title}
                            className="project-card-img"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80";
                            }}
                          />
                        </div>
                        <div className="project-card-body">
                          <span className="project-card-category">{proj.category || "Design"}</span>
                          <h3 className="project-card-title">{proj.title}</h3>
                          <p className="project-card-desc">{proj.description}</p>
                          <div className="project-card-tags-row">
                            {(proj.tags || []).map((tag, tIdx) => (
                              <span key={tIdx} className="project-tag-pill">{tag}</span>
                            ))}
                          </div>
                        </div>
                        <div className="project-card-footer">
                          <span className="project-card-date">{proj.updatedDate || "Updated recently"}</span>
                          <button
                            type="button"
                            className="project-card-view-btn"
                            onClick={() => setViewingProject(proj)}
                          >
                            View
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}

              {/* Motivational Footer */}
              <div className="dashboard-status-footer" style={{ marginTop: "3rem" }}>
                <p>
                  You're on track for Level {userLevel + 1} — keep showing up, {account.name || "Daniel"}. 🖉
                </p>
              </div>
            </section>
          )}
        </main>

        {/* Enrollment Preview Modal */}
        {enrollmentModalCourse && (
          <div className="enrollment-modal-backdrop" onClick={() => setEnrollmentModalCourse(null)}>
            <div className="enrollment-modal-card" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setEnrollmentModalCourse(null)}
                aria-label="Close modal"
              >
                ✕
              </button>
              <div className="enrollment-modal-media">
                <img
                  src={enrollmentModalCourse.thumbnail}
                  alt={enrollmentModalCourse.title}
                  className="enrollment-modal-thumb"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80";
                  }}
                />
                <span className="enrollment-modal-category">
                  {enrollmentModalCourse.category || "Skill Track"}
                </span>
              </div>
              <div className="enrollment-modal-body">
                <div className="enrollment-meta-row">
                  <span>⏱ {enrollmentModalCourse.duration || "4 modules"}</span>
                  <span>📚 {(enrollmentModalCourse.curriculum && enrollmentModalCourse.curriculum.length) || 3} Lessons</span>
                  <span>⭐ +{((enrollmentModalCourse.curriculum && enrollmentModalCourse.curriculum.length) || 3) * 60} XP</span>
                </div>
                <h2 className="enrollment-modal-title">{enrollmentModalCourse.title}</h2>
                <p className="enrollment-modal-desc">{enrollmentModalCourse.description}</p>

                {enrollmentModalCourse.instructor && (
                  <div className="enrollment-modal-instructor">
                    <img
                      src={enrollmentModalCourse.instructorAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"}
                      alt={enrollmentModalCourse.instructor}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80";
                      }}
                    />
                    <div>
                      <strong>{enrollmentModalCourse.instructor}</strong>
                      <small>{enrollmentModalCourse.instructorRole || "Skill Tutor"}</small>
                    </div>
                  </div>
                )}

                <div className="enrollment-modal-curriculum">
                  <h4>Curriculum Overview</h4>
                  <div className="enrollment-lessons-preview">
                    {(enrollmentModalCourse.curriculum || []).map((lesson, idx) => (
                      <div key={idx} className="preview-lesson-item">
                        <span className="preview-lesson-num">{idx + 1}</span>
                        <span className="preview-lesson-title">{lesson.title}</span>
                        <span className="preview-lesson-duration">{lesson.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="enrollment-modal-actions">
                  <button
                    type="button"
                    className="enroll-primary-btn"
                    onClick={() => enrollCourse(enrollmentModalCourse.id, true)}
                  >
                    Enroll Now & Start Course →
                  </button>
                  <button
                    type="button"
                    className="enroll-secondary-btn"
                    onClick={() => enrollCourse(enrollmentModalCourse.id, false)}
                  >
                    Enroll (Keep Browsing)
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Create New Project Modal (Matching Images/new-project.png) */}
        {isCreateProjectOpen && (
          <div className="np-backdrop-overlay" onClick={() => setIsCreateProjectOpen(false)}>
            <div className="np-modal-outer-frame" onClick={(e) => e.stopPropagation()}>

              {/* Card 1: Header Card */}
              <div className="np-header-card">
                <div className="np-header-left">
                  <div className="np-icon-box">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#334155">
                      <rect x="3" y="3" width="7" height="7" rx="1.5" />
                      <rect x="14" y="3" width="7" height="7" rx="1.5" />
                      <rect x="3" y="14" width="7" height="7" rx="1.5" />
                      <path d="M17.5 13v3.5H14v2h3.5V22h2v-3.5H23v-2h-3.5V13h-2z" />
                    </svg>
                  </div>
                  <div className="np-title-group">
                    <h2 className="np-title-text">New Project</h2>
                    <p className="np-subtitle-text">Start Something New</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="np-circle-close-btn"
                  onClick={() => setIsCreateProjectOpen(false)}
                  aria-label="Close modal"
                >
                  ✕
                </button>
              </div>

              {/* Card 2: Form Card */}
              <div className="np-form-card">
                <form onSubmit={handleCreateProjectSubmit} className="np-project-form">

                  {/* Field 1: Project Title */}
                  <div className="np-input-group">
                    <label className="np-label">Project Title</label>
                    <input
                      type="text"
                      required
                      className="np-field-input"
                      placeholder="e.g Personal Portfolio Website"
                      value={newProjectForm.title}
                      onChange={(e) => setNewProjectForm({ ...newProjectForm, title: e.target.value })}
                    />
                  </div>

                  {/* Field 2: Category (matching Images/category-options.png) */}
                  <div className="np-input-group">
                    <label className="np-label">Category</label>
                    <div
                      className={`np-select-container np-custom-selector ${isCategoryOpen ? "open" : ""}`}
                      onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                    >
                      <span className={`np-selector-text ${newProjectForm.category ? "has-value" : ""}`}>
                        {newProjectForm.category || "Choose a Category"}
                      </span>
                      <span className="np-select-arrow">
                        {isCategoryOpen ? (
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="18 15 12 9 6 15" />
                          </svg>
                        ) : (
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        )}
                      </span>
                    </div>

                    {/* Category Options Panel matching Images/category-options.png */}
                    {isCategoryOpen && (
                      <div className="np-category-options-panel">
                        {[
                          "Design",
                          "Marketing",
                          "Media",
                          "Business",
                          "Web-Development",
                          "Branding",
                          "Copywriting",
                          "Cyber Security",
                          "Data Analysis",
                          "Forex Trading",
                          "Other"
                        ].map((cat) => {
                          const isSelected = newProjectForm.category === cat;
                          return (
                            <button
                              key={cat}
                              type="button"
                              className={`np-cat-option-btn ${isSelected ? "selected" : ""}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setNewProjectForm({ ...newProjectForm, category: cat });
                                setIsCategoryOpen(false);
                              }}
                            >
                              {cat}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Field 3: Description (Optional) */}
                  <div className="np-input-group">
                    <label className="np-label">Description (Optional)</label>
                    <textarea
                      rows={3}
                      className="np-field-input np-field-textarea"
                      placeholder="What are you making and why?"
                      value={newProjectForm.description}
                      onChange={(e) => setNewProjectForm({ ...newProjectForm, description: e.target.value })}
                    />
                  </div>

                  {/* Field 4: Skills (Comma seperated) - Note exact spelling from image */}
                  <div className="np-input-group">
                    <label className="np-label">Skills (Comma seperated)</label>
                    <input
                      type="text"
                      className="np-field-input"
                      placeholder="e.g UI/UX, Typography, Layout"
                      value={newProjectForm.tags}
                      onChange={(e) => setNewProjectForm({ ...newProjectForm, tags: e.target.value })}
                    />
                  </div>

                  {/* Field 5: Action Buttons */}
                  <div className="np-actions-row">
                    <button
                      type="button"
                      className="np-btn-cancel"
                      onClick={() => setIsCreateProjectOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={`np-btn-submit ${isCreateProjectFormReady ? "ready" : ""}`}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-1 8h-3v3h-2v-3h-3v-2h3V9h2v3h3v2z" />
                      </svg>
                      <span>Create New Project</span>
                    </button>
                  </div>

                </form>
              </div>

            </div>
          </div>
        )}

        {/* Project View / Detail Modal */}
        {viewingProject && (
          <div className="project-modal-backdrop" onClick={() => setViewingProject(null)}>
            <div className="project-modal-card project-detail-card" onClick={(e) => e.stopPropagation()}>
              <div className="project-modal-header">
                <span className="project-card-category">{viewingProject.category || "Design"}</span>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setViewingProject(null)}
                  aria-label="Close modal"
                >
                  ✕
                </button>
              </div>
              <div className="project-detail-media">
                <img src={viewingProject.image} alt={viewingProject.title} />
              </div>
              <div className="project-detail-body">
                <div className="featured-meta-row" style={{ marginBottom: "1rem" }}>
                  <span className={`featured-status-pill ${viewingProject.status === "completed" ? "status-completed" : "status-inprogress"}`}>
                    ● {viewingProject.statusLabel || (viewingProject.status === "completed" ? "Completed" : "In Progress")}
                  </span>
                  <span className="featured-xp-pill">
                    ★ + {viewingProject.xp || 50} XP
                  </span>
                  <span className="featured-date-text">{viewingProject.updatedDate}</span>
                </div>
                <h2 className="project-detail-title">{viewingProject.title}</h2>
                <p className="project-detail-desc">{viewingProject.description}</p>
                <div className="project-card-tags-row" style={{ marginTop: "1.2rem" }}>
                  {(viewingProject.tags || []).map((t, idx) => (
                    <span key={idx} className="project-tag-pill">{t}</span>
                  ))}
                </div>
              </div>
              <div className="project-modal-actions" style={{ justifyContent: "space-between" }}>
                <button
                  type="button"
                  className="project-delete-btn"
                  onClick={() => handleDeleteProject(viewingProject.id)}
                >
                  Delete Project
                </button>
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <button
                    type="button"
                    className="project-status-toggle-btn"
                    onClick={() => handleToggleProjectStatus(viewingProject.id)}
                  >
                    {viewingProject.status === "completed" ? "Mark In Progress" : "Mark as Completed ✓"}
                  </button>
                  <button
                    type="button"
                    className="new-project-primary-btn"
                    onClick={() => setViewingProject(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Auth / Welcome / Signup / Login Views
  return (
    <div className="welcome-page-shell">
      {/* 1. Top Navbar with logo image at the left end */}
      <header className="welcome-navbar">
        <div className="welcome-nav-inner">
          <a className="welcome-brand-link" href="index.html" title="Back to Home">
            <img
              src="./Images/logo.png"
              alt="MyDearTeenager"
              className="welcome-brand-logo-img"
            />
          </a>
          <div className="welcome-nav-user">
            {view === "signup" ? (
              <div className="navbar-stepper">
                <span className="navbar-step-text">Step 02 of 07</span>
                <div className="navbar-step-segments">
                  <span className="step-bar step-done"></span>
                  <span className="step-bar step-active"></span>
                  <span className="step-bar step-pending"></span>
                  <span className="step-bar step-pending"></span>
                  <span className="step-bar step-pending"></span>
                  <span className="step-bar step-pending"></span>
                  <span className="step-bar step-pending"></span>
                </div>
              </div>
            ) : view === "about-you" ? (
              <div className="navbar-stepper">
                <span className="navbar-step-text">Step 03 of 07</span>
                <div className="navbar-step-segments">
                  <span className="step-bar step-done"></span>
                  <span className="step-bar step-done"></span>
                  <span className="step-bar step-active"></span>
                  <span className="step-bar step-pending"></span>
                  <span className="step-bar step-pending"></span>
                  <span className="step-bar step-pending"></span>
                  <span className="step-bar step-pending"></span>
                </div>
              </div>
            ) : view === "interests" ? (
              <div className="navbar-stepper">
                <span className="navbar-step-text">Step 04 of 07</span>
                <div className="navbar-step-segments">
                  <span className="step-bar step-done"></span>
                  <span className="step-bar step-done"></span>
                  <span className="step-bar step-done"></span>
                  <span className="step-bar step-active"></span>
                  <span className="step-bar step-pending"></span>
                  <span className="step-bar step-pending"></span>
                  <span className="step-bar step-pending"></span>
                </div>
              </div>
            ) : view === "goals" ? (
              <div className="navbar-stepper">
                <span className="navbar-step-text">Step 05 of 07</span>
                <div className="navbar-step-segments">
                  <span className="step-bar step-done"></span>
                  <span className="step-bar step-done"></span>
                  <span className="step-bar step-done"></span>
                  <span className="step-bar step-done"></span>
                  <span className="step-bar step-active"></span>
                  <span className="step-bar step-pending"></span>
                  <span className="step-bar step-pending"></span>
                </div>
              </div>
            ) : view === "personalise" ? (
              <div className="navbar-stepper">
                <span className="navbar-step-text">Step 06 of 07</span>
                <div className="navbar-step-segments">
                  <span className="step-bar step-done"></span>
                  <span className="step-bar step-done"></span>
                  <span className="step-bar step-done"></span>
                  <span className="step-bar step-done"></span>
                  <span className="step-bar step-done"></span>
                  <span className="step-bar step-active"></span>
                  <span className="step-bar step-pending"></span>
                </div>
              </div>
            ) : view === "ready" ? (
              <div className="navbar-stepper">
                <span className="navbar-step-text">Step 07 of 07</span>
                <div className="navbar-step-segments">
                  <span className="step-bar step-done"></span>
                  <span className="step-bar step-done"></span>
                  <span className="step-bar step-done"></span>
                  <span className="step-bar step-done"></span>
                  <span className="step-bar step-done"></span>
                  <span className="step-bar step-done"></span>
                  <span className="step-bar step-active"></span>
                </div>
              </div>
            ) : view === "otp" ? (
              <div className="otp-header-badge-group">
                <span className="otp-safe-badge">
                  <span className="otp-green-dot"></span>
                  Safe &amp; Secure
                </span>
                <button
                  type="button"
                  className="otp-help-btn"
                  title="Need help with verification?"
                  aria-label="Help"
                  onClick={() => alert("Verification Help:\n\nA 6-digit verification code has been dispatched to your email address.\n\n• Check your inbox and enter the 6 digits.\n• If you don't see it within 2 minutes, check your Spam or Junk folder.\n• You can also click 'Resend Code' to request a new code.")}
                >
                  ?
                </button>
              </div>
            ) : (
              <button
                className="welcome-profile-avatar-btn"
                onClick={() => {
                  if (account) {
                    setView("dashboard");
                  } else {
                    setView(view === "login" ? "welcome" : "login");
                    setNotice("");
                  }
                }}
                aria-label="Account"
                title={account ? `Logged in as ${account.name || "User"}` : "Log in"}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 2. Main Stage */}
      {view === "welcome" ? (
        /* Welcome Overview matching sign-up-page.png */
        <main className={`welcome-main-stage ${isViewTransitioning ? (transitionDirection === "forward" ? "view-exit-forward" : "view-exit-backward") : (transitionDirection === "forward" ? "view-enter-forward" : "view-enter-backward")}`}>
          {/* Illustration Card */}
          <div className="welcome-card-wrap">
            <img
              className="welcome-card-img"
              src="./Images/sign-up-img.svg?v=3"
              alt="MyDearTeenager Learning Journey"
            />
          </div>

          {/* Heading */}
          <h1 className="welcome-title">
            Welcome to<br />
            <span className="welcome-brand-name">
              <span className="purple-text">MyDear</span>
              <span className="dark-text">Teenager</span>{" "}
              <span className="hand-emoji">👋</span>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="welcome-subtitle">
            Learn practical skills, build better habits, and prepare<br />
            for your future one step at a time.
          </p>

          {/* Buttons Stack */}
          <div className="welcome-actions">
            <button
              className="welcome-primary-btn"
              onClick={(e) => {
                e.currentTarget.classList.add("btn-launching");
                transitionToView("signup", "forward");
              }}
            >
              Let's Get Started →
            </button>

            <button
              className="welcome-secondary-btn"
              onClick={(e) => {
                e.currentTarget.classList.add("btn-launching");
                transitionToView("login", "forward");
              }}
            >
              I already have an account
            </button>
          </div>
        </main>
      ) : view === "signup" ? (
        /* Sign Up Form View - EXACT match to sign-up-form.png */
        <main className={`signup-flow-stage ${isViewTransitioning ? (transitionDirection === "forward" ? "view-exit-forward" : "view-exit-backward") : (transitionDirection === "forward" ? "view-enter-forward" : "view-enter-backward")}`}>
          {/* Heading & Subtitle matching sign-up-form.png */}
          <div className="signup-heading-block">
            <h1 className="signup-title">Let's get you started</h1>
            <p className="signup-subtitle">
              Create your account and start building your learning journey.
            </p>
          </div>

          {/* Card Wrapper with exact background circles matching sign-up-form.png */}
          <div className="signup-card-wrapper">
            <div className="signup-bg-circle signup-bg-circle-top" aria-hidden="true"></div>
            <div className="signup-bg-circle signup-bg-circle-bottom" aria-hidden="true"></div>

            <form className="signup-card-container" onSubmit={submitAuth}>
            {/* Role Switcher Tabs */}
            <div className="role-selector-pills">
              <button
                type="button"
                className={`role-pill-btn ${userRole === "teenager" ? "active" : ""}`}
                onClick={() => setUserRole("teenager")}
              >
                I am a teenager / learner
              </button>
              <button
                type="button"
                className={`role-pill-btn ${userRole === "parent" ? "active" : ""}`}
                onClick={() => setUserRole("parent")}
              >
                I am a parent / mentor
              </button>
            </div>

            {/* Field 1: Full Name */}
            <div className="signup-field-group">
              <label className="signup-field-label">Full Name</label>
              <div className="signup-input-wrapper">
                <span className="input-prefix-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <input
                  name="name"
                  type="text"
                  className="signup-text-input"
                  value={form.name}
                  onChange={updateForm}
                  placeholder="Jane Doe"
                  required
                />
              </div>
            </div>

            {/* Field 2: Email Address */}
            <div className="signup-field-group">
              <label className="signup-field-label">Email Address</label>
              <div className="signup-input-wrapper">
                <span className="input-prefix-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </span>
                <input
                  name="email"
                  type="email"
                  className="signup-text-input"
                  value={form.email}
                  onChange={updateForm}
                  placeholder="jane@example.com"
                  required
                />
              </div>
            </div>

            {/* Field 3: Password */}
            <div className="signup-field-group">
              <label className="signup-field-label">Password</label>
              <div className="signup-input-wrapper">
                <span className="input-prefix-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className="signup-text-input"
                  value={form.password}
                  onChange={updateForm}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="input-suffix-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Field 4: Confirm Password */}
            <div className="signup-field-group">
              <label className="signup-field-label">Confirm Password</label>
              <div className="signup-input-wrapper">
                <span className="input-prefix-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    <circle cx="12" cy="16" r="1" />
                  </svg>
                </span>
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  className="signup-text-input"
                  value={form.confirmPassword}
                  onChange={updateForm}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="input-suffix-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirmPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Checkbox: Terms of Service */}
            <div className="signup-checkbox-row">
              <input
                id="agreeTerms"
                name="agreeTerms"
                type="checkbox"
                className="signup-custom-checkbox"
                checked={form.agreeTerms || false}
                onChange={updateForm}
                required
              />
              <label htmlFor="agreeTerms" className="signup-checkbox-label">
                I agree to the <a href="#" onClick={(e) => e.preventDefault()}>Terms of Service</a> and <a href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
              </label>
            </div>

            {notice && <p className="signup-notice-box" role="alert">{notice}</p>}

            {/* Hidden submit trigger so Enter key works inside inputs */}
            <button type="submit" style={{ display: "none" }} aria-hidden="true"></button>
          </form>
        </div>

          {/* Already have an account link */}
          <div className="signup-bottom-switch">
            Already have an account?{" "}
            <button
              type="button"
              className="signup-switch-link"
              onClick={() => transitionToView("login", "forward")}
            >
              Log in
            </button>
          </div>

          {/* Floating Bottom Action Dock matching sign-up-form.png */}
          <div className="signup-bottom-dock">
            <button
              type="button"
              className="dock-back-btn"
              onClick={() => transitionToView("welcome", "backward")}
            >
              ← Back
            </button>
            <button
              type="button"
              className="dock-create-btn"
              onClick={submitAuth}
            >
              Create My Account →
            </button>
          </div>
        </main>
      ) : view === "otp" ? (
        /* OTP Verification Screen - EXACT match to Images/otp.png */
        <main className={`otp-page-stage ${isViewTransitioning ? (transitionDirection === "forward" ? "view-exit-forward" : "view-exit-backward") : (transitionDirection === "forward" ? "view-enter-forward" : "view-enter-backward")}`}>
          <div className="otp-stage-center">
            <div className="otp-card-container">
              {/* 1. Envelope Icon with Security Badge */}
              <div className="otp-icon-header">
                <div className="otp-icon-bubble">
                  <svg className="otp-envelope-svg" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <span className="otp-icon-lock-badge" title="Secure OTP">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </span>
                </div>
              </div>

              {/* 2. Main Title */}
              <h1 className="otp-title">Check your email </h1>

              {/* 3. Subtitle */}
              <p className="otp-subtitle">We sent a 6-digit verification code to</p>

              {/* 4. Target Email Badge Pill */}
              <div className="otp-email-pill-wrap">
                <span className="otp-email-pill">
                  {pendingAccount?.email || form.email || "davidtosin@example.com"}
                </span>
              </div>

              {/* 5. OTP 6-Digit Form */}
              <form className="otp-form" onSubmit={handleVerifyOtp}>
                <label className="otp-input-label" htmlFor="otp-digit-0">
                  ENTER 6-DIGIT VERIFICATION CODE
                </label>

                <div className="otp-boxes-grid">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-digit-${idx}`}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      autoComplete={idx === 0 ? "one-time-code" : "off"}
                      maxLength={1}
                      placeholder="•"
                      className={`otp-digit-input ${digit ? "has-value" : ""}`}
                      value={digit}
                      onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      onPaste={handleOtpPaste}
                      aria-label={`Verification digit ${idx + 1}`}
                      autoFocus={idx === 0}
                    />
                  ))}
                </div>

                {/* 6. Timer & Change Email Row */}
                <div className="otp-timer-row">
                  <span className="otp-timer-text">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="otp-clock-icon">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    {otpTimer > 0 ? (
                      <>Code expires in <strong>{formatOtpTimer(otpTimer)}</strong></>
                    ) : (
                      <span className="otp-timer-expired-badge">Code expired</span>
                    )}
                  </span>
                  <button
                    type="button"
                    className="otp-change-email-btn"
                    onClick={() => transitionToView("signup", "backward")}
                  >
                    Change email
                  </button>
                </div>

                {/* Notice / Feedback box */}
                {otpNotice && (
                  <div className={`otp-notice-box ${otpNotice.includes("sent") || otpNotice.includes("dispatched") ? "is-success" : "is-error"}`} role="alert">
                    {otpNotice}
                  </div>
                )}

                {/* 7. Verify & Continue Button */}
                <button
                  type="submit"
                  className="otp-verify-btn"
                  disabled={isVerifyingOtp}
                >
                  {isVerifyingOtp ? "Verifying..." : "Verify & Continue →"}
                </button>
              </form>

              {/* 8. Direct Link Divider */}
              <div className="otp-divider">
                <span className="otp-divider-text">Or prefer a direct link?</span>
              </div>

              {/* 9. Magic Link Button */}
              <button
                type="button"
                className="otp-magic-link-btn"
                onClick={handleMagicLink}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                Open Email App &amp; Click Magic Link
              </button>

              {/* 10. Resend Code & Check Spam Row */}
              <div className="otp-resend-row">
                <span className="otp-resend-prompt">Didn't receive the email?</span>
                {otpTimer > 0 ? (
                  <span className="otp-resend-countdown-hint">
                    Resend in <strong className="otp-countdown-val">{formatOtpTimer(otpTimer)}</strong>
                  </span>
                ) : (
                  <button
                    type="button"
                    className="otp-resend-link is-ready"
                    onClick={handleResendOtp}
                    disabled={isResendingOtp}
                  >
                    {isResendingOtp ? "Sending..." : "Resend Code"}
                  </button>
                )}
                <span className="otp-dot-separator">·</span>
                <button
                  type="button"
                  className="otp-spam-link"
                  onClick={() => setShowSpamTip(!showSpamTip)}
                >
                  Check Spam
                </button>
              </div>

              {showSpamTip && (
                <div className="otp-spam-tip">
                  💡 <strong>Spam Folder Tip:</strong> Sometimes emails land in your Spam or Junk folder. Mark emails from MyDearTeenager as "Not Spam" to receive future access links!
                </div>
              )}

              {/* 11. Security Trust Badge */}
              <div className="otp-trust-shield">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <polyline points="9 12 11 14 15 10" />
                </svg>
                <span>MDT Teenager-Safe Privacy Shield • Never shared with third parties</span>
              </div>
            </div>

            {/* 12. Back to Create Account */}
            <div className="otp-back-section">
              <button
                type="button"
                className="otp-back-to-signup-btn"
                onClick={() => transitionToView("signup", "backward")}
              >
                ← Back to Create Account
              </button>
            </div>
          </div>

          {/* 13. Legal & Safety Footer (Matching otp.png horizontal layout) */}
          <footer className="otp-page-footer">
            <div className="otp-footer-inner">
              <span className="otp-copyright">© 2026 MyDearTeenager. All rights reserved.</span>
              <div className="otp-legal-links">
                <a href="#privacy" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
                <a href="#terms" onClick={(e) => e.preventDefault()}>Terms of Service</a>
                <a href="#safety" onClick={(e) => e.preventDefault()}>Safety Center</a>
              </div>
            </div>
          </footer>
        </main>
      ) : view === "about-you" ? (
        /* "First, let's get to know you" - EXACT match to Images/tell-us-about-you.png */
        <main className={`about-you-stage ${isViewTransitioning ? (transitionDirection === "forward" ? "view-exit-forward" : "view-exit-backward") : (transitionDirection === "forward" ? "view-enter-forward" : "view-enter-backward")}`}>
          {/* Title & Subtitle */}
          <div className="about-you-heading">
            <h1 className="about-you-title">First, let's get to know you</h1>
            <p className="about-you-subtitle">
              This helps us make <span className="logo-purple">MyDear</span><span className="logo-dark">Teenager</span> feel more personal to you.
            </p>
          </div>

          {/* Desktop 2-Column Grid */}
          <div className="about-you-desktop-grid">
            {/* Left Column: Photo Upload Card */}
            <div className="about-you-avatar-card">
              <h3 className="about-you-card-section-title">Profile Picture</h3>
              <p className="about-you-card-section-sub">Add a photo or avatar so mentors and peers recognize you.</p>

              <div
                className={`about-you-avatar-circle ${onboardingAvatar ? "has-image" : ""}`}
                onClick={() => {
                  const fileIn = document.getElementById("onboarding-avatar-file-input");
                  if (fileIn) fileIn.click();
                }}
                title="Click to select a profile picture"
              >
                {onboardingAvatar ? (
                  <img
                    src={onboardingAvatar}
                    alt="Profile Preview"
                    className="about-you-avatar-preview"
                  />
                ) : (
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="about-you-camera-svg">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                    <line x1="19" y1="10" x2="19" y2="14" />
                    <line x1="17" y1="12" x2="21" y2="12" />
                  </svg>
                )}
              </div>

              <input
                id="onboarding-avatar-file-input"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handlePhotoUpload}
              />

              <div className="about-you-photo-actions">
                <button
                  type="button"
                  className="about-you-add-photo-btn"
                  onClick={() => {
                    const fileIn = document.getElementById("onboarding-avatar-file-input");
                    if (fileIn) fileIn.click();
                  }}
                >
                  {onboardingAvatar ? "Change photo" : "Add a photo"}
                </button>
                {onboardingAvatar ? (
                  <button
                    type="button"
                    className="about-you-skip-link"
                    onClick={() => setOnboardingAvatar(null)}
                  >
                    Remove photo
                  </button>
                ) : (
                  <button
                    type="button"
                    className="about-you-skip-link"
                    onClick={() => setOnboardingNotice("")}
                  >
                    Skip for now
                  </button>
                )}
              </div>

              <div className="about-you-privacy-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <polyline points="9 12 11 14 15 10"/>
                </svg>
                <span>Only visible within your teen community</span>
              </div>

              {onboardingNotice && (
                <p className="about-you-notice" role="alert">{onboardingNotice}</p>
              )}
            </div>

            {/* Right Column: Form Fields Container */}
            <div className="about-you-details-card">
              {/* Field 1: Your Name */}
              <div className="about-you-field">
                <label className="about-you-label" htmlFor="onboarding-name-input">
                  Username
                </label>
                <input
                  id="onboarding-name-input"
                  type="text"
                  className="about-you-text-input"
                  value={onboardingName}
                  onChange={(e) => setOnboardingName(e.target.value)}
                  placeholder="David"
                />
              </div>

              {/* Field 2: How old are you? */}
              <div className="about-you-field">
                <div className="about-you-field-header-row">
                  <label className="about-you-label">
                    How old are you?
                  </label>
                  <span className="about-you-field-hint">Tailors course difficulty</span>
                </div>
                <div className="about-you-age-grid">
                  {[13, 14, 15, 16, 17, 18].map((age) => (
                    <button
                      key={age}
                      type="button"
                      className={`about-you-age-btn ${onboardingAge === age ? "active" : ""}`}
                      onClick={() => setOnboardingAge(age)}
                    >
                      {age}
                    </button>
                  ))}
                </div>
              </div>

              {/* Field 3: Where do you live? (Comprehensive Alphabetical Countries with Flags & Modern Typography) */}
              <div className="about-you-field">
                <label className="about-you-label" htmlFor="onboarding-country-select">
                  Where do you live?
                </label>
                <div className="about-you-country-custom-select">
                  {/* Hidden native select keeps state synced for accessibility and direct interactions */}
                  <select
                    id="onboarding-country-select"
                    className="about-you-native-select-hidden"
                    value={onboardingCountry}
                    onChange={(e) => setOnboardingCountry(e.target.value)}
                    tabIndex={-1}
                    aria-hidden="true"
                  >
                    <option value="" disabled>Select a country</option>
                    {ALL_COUNTRIES.map((c) => (
                      <option key={c.code} value={c.name}>{c.name}</option>
                    ))}
                  </select>

                  {/* Custom Trigger Button */}
                  {(() => {
                    const currentCountryObj = ALL_COUNTRIES.find((c) => c.name === onboardingCountry);
                    return (
                      <div
                        className={`about-you-country-trigger ${isCountryDropdownOpen ? "open" : ""}`}
                        onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                        role="combobox"
                        aria-expanded={isCountryDropdownOpen}
                        aria-haspopup="listbox"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
                            e.preventDefault();
                            setIsCountryDropdownOpen(true);
                          }
                        }}
                      >
                        <div className="country-trigger-content">
                          {currentCountryObj ? (
                            <>
                              <img
                                src={`https://flagcdn.com/w40/${currentCountryObj.code.toLowerCase()}.png`}
                                alt=""
                                className="country-flag-icon"
                                loading="lazy"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                  const next = e.currentTarget.nextElementSibling;
                                  if (next) next.style.display = "inline-block";
                                }}
                              />
                              <span className="country-flag-emoji-fallback" style={{ display: "none" }}>
                                {currentCountryObj.flag}
                              </span>
                              <span className="country-trigger-name">{currentCountryObj.name}</span>
                            </>
                          ) : (
                            <span className="country-trigger-placeholder">Select a country</span>
                          )}
                        </div>
                        <span className={`about-you-select-chevron ${isCountryDropdownOpen ? "rotated" : ""}`} aria-hidden="true">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 12 15 18 9"></polyline>
                          </svg>
                        </span>
                      </div>
                    );
                  })()}

                  {/* Dropdown Menu */}
                  {isCountryDropdownOpen && (
                    <div className="about-you-country-menu" role="listbox">
                      <div className="country-search-wrap">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="country-search-icon">
                          <circle cx="11" cy="11" r="8"></circle>
                          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <input
                          type="text"
                          className="country-search-input"
                          placeholder="Search country..."
                          value={countrySearch}
                          onChange={(e) => setCountrySearch(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          autoFocus
                        />
                        {countrySearch && (
                          <button
                            type="button"
                            className="country-search-clear"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCountrySearch("");
                            }}
                            aria-label="Clear search"
                          >
                            &times;
                          </button>
                        )}
                      </div>

                      <div className="country-options-list">
                        {(() => {
                          const filtered = ALL_COUNTRIES.filter((c) =>
                            c.name.toLowerCase().includes(countrySearch.toLowerCase().trim())
                          );
                          if (filtered.length === 0) {
                            return (
                              <div className="country-no-results">
                                No countries matching "{countrySearch}"
                              </div>
                            );
                          }
                          return filtered.map((c) => {
                            const isSelected = onboardingCountry === c.name;
                            return (
                              <div
                                key={c.code}
                                className={`country-option-item ${isSelected ? "selected" : ""}`}
                                role="option"
                                aria-selected={isSelected}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOnboardingCountry(c.name);
                                  setIsCountryDropdownOpen(false);
                                  setCountrySearch("");
                                }}
                              >
                                <div className="country-option-info">
                                  <img
                                    src={`https://flagcdn.com/w40/${c.code.toLowerCase()}.png`}
                                    alt=""
                                    className="country-flag-icon"
                                    loading="lazy"
                                    onError={(e) => {
                                      e.currentTarget.style.display = "none";
                                      const next = e.currentTarget.nextElementSibling;
                                      if (next) next.style.display = "inline-block";
                                    }}
                                  />
                                  <span className="country-flag-emoji-fallback" style={{ display: "none" }}>
                                    {c.flag}
                                  </span>
                                  <span className="country-option-name">{c.name}</span>
                                </div>
                                {isSelected && (
                                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5b21b6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="country-check-icon">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                  </svg>
                                )}
                              </div>
                            );
                          });
                        })()}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Floating Bottom Dock matching tell-us-about-you.png */}
          <div className="about-you-bottom-dock">
            <button
              type="button"
              className="about-you-dock-back"
              onClick={() => transitionToView("otp", "backward")}
            >
              ← Back
            </button>
            <button
              type="button"
              className="about-you-dock-continue"
              onClick={() => transitionToView("interests", "forward")}
            >
              Continue →
            </button>
          </div>
        </main>
      ) : view === "interests" ? (
        /* "What are you interested in learning?" - Unified 4-Column Layout matching 05 - Choose Your Goals.png */
        <main className={`interests-stage ${isViewTransitioning ? (transitionDirection === "forward" ? "view-exit-forward" : "view-exit-backward") : (transitionDirection === "forward" ? "view-enter-forward" : "view-enter-backward")}`}>
          {/* Title & Subtitle */}
          <div className="interests-heading">
            <h1 className="interests-title">
              What are you<br />
              interested in learning?
            </h1>
            <p className="interests-subtitle">
              Pick the skills that excite you. You can always change these later.
            </p>
          </div>

          {/* Skills 4-Column Grid */}
          <div className="interests-grid">
            {INTEREST_SKILLS.map((skill) => {
              const isSelected = selectedInterests.includes(skill.id);
              return (
                <div
                  key={skill.id}
                  className={`interest-card ${isSelected ? "selected" : ""}`}
                  onClick={() => toggleInterest(skill.id)}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleInterest(skill.id);
                    }
                  }}
                >
                  <div className="interest-icon-circle">
                    {renderInterestIcon(skill.id)}
                  </div>
                  <h3 className="interest-card-title">{skill.title}</h3>
                  <p className="interest-card-desc">{skill.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Helper Hint Pill matching layout */}
          <div className="interests-hint-pill">
            <span>💡</span>
            <span>Your skills help us recommend the best courses and projects.</span>
          </div>

          {/* Floating Bottom Dock matching 05 - Choose Your Goals.png */}
          <div className="interests-bottom-dock">
            <button
              type="button"
              className="interests-dock-back"
              onClick={() => transitionToView("about-you", "backward")}
            >
              ← Back
            </button>
            <button
              type="button"
              className="interests-dock-continue"
              onClick={() => transitionToView("goals", "forward")}
            >
              Continue →
            </button>
          </div>
        </main>
      ) : view === "goals" ? (
        /* "What do you want to achieve?" - EXACT match to Images/05 - Choose Your Goals.png */
        <main className={`goals-stage ${isViewTransitioning ? (transitionDirection === "forward" ? "view-exit-forward" : "view-exit-backward") : (transitionDirection === "forward" ? "view-enter-forward" : "view-enter-backward")}`}>
          {/* Title & Subtitle matching 05 - Choose Your Goals.png */}
          <div className="goals-heading">
            <h1 className="goals-title">
              What do you want to achieve?
            </h1>
            <p className="goals-subtitle">
              There is no wrong answer. Choose what matters most to you.
            </p>
          </div>

          {/* 4-Column Goals Grid matching 05 - Choose Your Goals.png */}
          <div className="goals-grid">
            {GOAL_OPTIONS.map((goal) => {
              const isSelected = selectedGoals.includes(goal.id);
              return (
                <div
                  key={goal.id}
                  className={`goal-card ${isSelected ? "selected" : ""}`}
                  onClick={() => toggleGoal(goal.id)}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleGoal(goal.id);
                    }
                  }}
                >
                  <div className="goal-icon-circle">
                    {renderGoalIcon(goal.id)}
                  </div>
                  <h3 className="goal-card-title">{goal.title}</h3>
                </div>
              );
            })}
          </div>

          {/* Helper Hint Pill matching 05 - Choose Your Goals.png */}
          <div className="goals-hint-pill">
            <span>💡</span>
            <span>Your goals help us shape your learning journey.</span>
          </div>

          {/* Floating Bottom Dock matching 05 - Choose Your Goals.png */}
          <div className="goals-bottom-dock">
            <button
              type="button"
              className="goals-dock-back"
              onClick={() => transitionToView("interests", "backward")}
            >
              ← Back
            </button>
            <button
              type="button"
              className="goals-dock-continue"
              onClick={() => transitionToView("personalise", "forward")}
            >
              Continue →
            </button>
          </div>
        </main>
      ) : view === "personalise" ? (
        /* "Let's build your learning path" - EXACT match to Images/06 - Personalise My Learning.png */
        <main className={`personalise-stage ${isViewTransitioning ? (transitionDirection === "forward" ? "view-exit-forward" : "view-exit-backward") : (transitionDirection === "forward" ? "view-enter-forward" : "view-enter-backward")}`}>
          {/* Heading */}
          <div className="personalise-heading">
            <h1 className="personalise-title">
              Let's build your<br />
              learning path
            </h1>
            <p className="personalise-subtitle">
              Based on what you've told us, here are some great places to start.
            </p>
          </div>

          {/* 3-Column Learning Path Grid */}
          <div className="personalise-grid">
            {recommendedPaths.map((course) => {
              return (
                <article
                  key={course.id}
                  className="learning-path-card"
                >
                  <div className="path-card-image-wrap">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="path-card-image"
                      loading="lazy"
                    />
                    <div className="path-card-xp-badge">
                      <span>★</span>
                      <span>+{course.xp || 500} XP</span>
                    </div>
                  </div>

                  <div className="path-card-content">
                    <div className="path-meta-row">
                      <span className="path-category-pill">{course.category}</span>
                      <span className="path-level-pill">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="20" x2="18" y2="10"/>
                          <line x1="12" y1="20" x2="12" y2="4"/>
                          <line x1="6" y1="20" x2="6" y2="14"/>
                        </svg>
                        <span>{course.level}</span>
                      </span>
                    </div>

                    <h2 className="path-card-title">{course.title}</h2>
                    <p className="path-card-desc">{course.desc}</p>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Secondary Explore Link */}
          <a
            href="#explore-skills"
            className="personalise-explore-link"
            onClick={(e) => {
              e.preventDefault();
              transitionToView("interests", "backward");
            }}
          >
            <span>Not sure yet? Explore all skills</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor"/>
            </svg>
          </a>

          {/* Floating Bottom Dock */}
          <div className="personalise-bottom-dock">
            <button
              type="button"
              className="personalise-dock-back"
              onClick={() => transitionToView("goals", "backward")}
            >
              ← Back
            </button>
            <button
              type="button"
              className="personalise-dock-continue"
              onClick={() => transitionToView("ready", "forward")}
            >
              Build My Learning Journey →
            </button>
          </div>
        </main>
      ) : view === "ready" ? (
        /* "You're ready, [Username]!" - Step 07 of 07 matching Images/07 - You're Ready.png with Desktop Layout */
        <main className={`ready-stage ${isViewTransitioning ? (transitionDirection === "forward" ? "view-exit-forward" : "view-exit-backward") : (transitionDirection === "forward" ? "view-enter-forward" : "view-enter-backward")}`}>
          {/* Top Progress Bar matching 07 - You're Ready.png */}
          <div className="ready-top-status-bar">
            <div className="ready-top-status-labels">
              <span className="ready-setup-complete-text">Setup Complete</span>
              <span className="ready-setup-step-count">07 / 07</span>
            </div>
            <div className="ready-progress-track">
              <div className="ready-progress-fill"></div>
            </div>
          </div>

          {/* Celebration Header */}
          <div className="ready-heading">
            <h1 className="ready-title">You're ready, {preferredUsername}!</h1>
            <div className="ready-party-popper" aria-hidden="true">🎉</div>
            <p className="ready-subtitle">
              Your <span className="ready-purple-text">MyDear</span> Teenager journey starts now.<br className="ready-hide-mobile" />
              We've tailored your experience based on your goals.
            </p>
          </div>

          {/* 3 Quick Stat Cards Row */}
          <div className="ready-stats-row">
            <div className="ready-stat-card">
              <div className="ready-stat-icon-circle stat-purple">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="6"/>
                  <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
                </svg>
              </div>
              <strong className="ready-stat-number">0</strong>
              <span className="ready-stat-label">XP</span>
            </div>

            <div className="ready-stat-card">
              <div className="ready-stat-icon-circle stat-orange">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
                </svg>
              </div>
              <strong className="ready-stat-number">0</strong>
              <span className="ready-stat-label">Days Streak</span>
            </div>

            <div className="ready-stat-card">
              <div className="ready-stat-icon-circle stat-green">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
                  <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
                  <path d="M4 22h16"/>
                  <path d="M10 14.66V17c0 .55-.45 1-1 1H8c-.55 0-1 .45-1 1v1c0 .55.45 1 1 1h8c.55 0 1-.45 1-1v-1c0-.55-.45-1-1-1h-1c-.55 0-1-.45-1-1v-2.34"/>
                  <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
                </svg>
              </div>
              <strong className="ready-stat-number level-text">Beginner</strong>
              <span className="ready-stat-label">Level</span>
            </div>
          </div>

          {/* Desktop 2-Column Grid */}
          <div className="ready-desktop-grid">
            {/* Left Column: Selected Interests & Learning Goals */}
            <div className="ready-summary-col">
              {/* Selected Interests Box */}
              <div className="ready-summary-box">
                <div className="ready-box-header">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ready-box-icon">
                    <line x1="4" x2="20" y1="12" y2="12"/>
                    <line x1="4" x2="20" y1="6" y2="6"/>
                    <line x1="4" x2="20" y1="18" y2="18"/>
                  </svg>
                  <h3 className="ready-box-title">Selected Interests</h3>
                </div>
                <div className="ready-pills-wrap">
                  {userInterestTitles.map((title, i) => (
                    <span key={i} className="ready-interest-pill">{title}</span>
                  ))}
                </div>
              </div>

              {/* Learning Goals Box */}
              <div className="ready-summary-box">
                <div className="ready-box-header">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ready-box-icon">
                    <circle cx="12" cy="12" r="10"/>
                    <circle cx="12" cy="12" r="6"/>
                    <circle cx="12" cy="12" r="2"/>
                  </svg>
                  <h3 className="ready-box-title">Learning Goals</h3>
                </div>
                <div className="ready-goals-list">
                  {userGoalTitles.map((title, i) => (
                    <div key={i} className="ready-goal-item">
                      <span className="ready-goal-check-circle">✓</span>
                      <span className="ready-goal-text">{title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Up Next Featured Course Card */}
            <div className="ready-upnext-col">
              <div className="ready-upnext-card">
                <div className="ready-upnext-image-wrap">
                  <img
                    src={topRecommendedCourse.image}
                    alt={topRecommendedCourse.title}
                    className="ready-upnext-image"
                    loading="lazy"
                  />
                  <div className="ready-upnext-badge">
                    <span>UP NEXT</span>
                  </div>
                </div>

                <div className="ready-upnext-body">
                  <div className="ready-upnext-meta">
                    <span className="path-category-pill">{topRecommendedCourse.category}</span>
                    <span className="path-level-pill">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="20" x2="18" y2="10"/>
                        <line x1="12" y1="20" x2="12" y2="4"/>
                        <line x1="6" y1="20" x2="6" y2="14"/>
                      </svg>
                      <span>{topRecommendedCourse.level}</span>
                    </span>
                  </div>

                  <h2 className="ready-upnext-title">{topRecommendedCourse.title}</h2>
                  <p className="ready-upnext-desc">{topRecommendedCourse.desc}</p>

                  <button
                    type="button"
                    className="ready-begin-course-btn"
                    onClick={() => handleOnboardingComplete({ targetView: "course", openCourse: topRecommendedCourse })}
                  >
                    <span>Begin Course</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Motivational Quote & Action Buttons */}
          <div className="ready-bottom-section">
            <p className="ready-quote">
              "Small steps today can become big skills tomorrow."
            </p>

            <div className="ready-action-buttons">
              <button
                type="button"
                className="ready-dashboard-btn"
                onClick={() => handleOnboardingComplete({ targetView: "home" })}
              >
                <span>Take Me to My Dashboard</span>
                <span>→</span>
              </button>

              <button
                type="button"
                className="ready-explore-btn"
                onClick={() => handleOnboardingComplete({ targetView: "academy" })}
              >
                Explore Skills
              </button>
            </div>
          </div>

          {/* Floating Back Dock */}
          <div className="ready-bottom-dock">
            <button
              type="button"
              className="ready-dock-back"
              onClick={() => transitionToView("personalise", "backward")}
            >
              ← Back
            </button>
          </div>
        </main>
      ) : (
        /* Login Form View - EXACT match to Images/login-page.png */
        <main className={`login-page-stage ${isViewTransitioning ? (transitionDirection === "forward" ? "view-exit-forward" : "view-exit-backward") : (transitionDirection === "forward" ? "view-enter-forward" : "view-enter-backward")}`}>
          <div className="login-card-container">
            <h1 className="login-title">Welcome back!</h1>
            <p className="login-subtitle">
              Log in to your account and continue your learning journey.
            </p>

            <form onSubmit={submitAuth}>
              {/* Field 1: Email Address */}
              <div className="login-field-group">
                <label className="login-field-label">Email Address</label>
                <div className="login-input-wrapper">
                  <span className="input-prefix-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </span>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={updateForm}
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              {/* Field 2: Password */}
              <div className="login-field-group">
                <label className="login-field-label">Password</label>
                <div className="login-input-wrapper">
                  <span className="input-prefix-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </span>
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={updateForm}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="input-suffix-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Remember me & Forgot password? Row */}
              <div className="login-options-row">
                <label className="remember-me-toggle">
                  <input
                    type="checkbox"
                    className="remember-me-checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span className="remember-me-label">Remember me</span>
                </label>
                <a
                  href="#"
                  className="forgot-password-link"
                  onClick={(e) => {
                    e.preventDefault();
                    setNotice("Password reset instruction has been sent to your email.");
                  }}
                >
                  Forgot password?
                </a>
              </div>

              {notice && <p className="signup-notice-box" role="alert">{notice}</p>}

              {/* Primary Submit Button */}
              <button type="submit" className="login-submit-btn">
                Log In →
              </button>
            </form>

            {/* Divider */}
            <div className="login-divider-row">
              <span className="login-divider-text">Or log in with</span>
            </div>

            {/* Social Logins designed as links for easy backend integration */}
            <a
              href="/auth/google"
              className="social-login-btn social-google-btn"
              onClick={(e) => {
                // If backend route is not hooked up yet, fall back to preview login
                if (e.currentTarget.getAttribute("href") === "/auth/google" || e.currentTarget.getAttribute("href") === "#") {
                  e.preventDefault();
                  const demoUser = usersDb[0] || defaultAccount;
                  localStorage.setItem(ACCOUNT_KEY, JSON.stringify(demoUser));
                  setAccount(demoUser);
                  setView("dashboard");
                  setDashboardView("home");
                }
              }}
              title="Continue with Google"
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <span>Google</span>
            </a>

            <a
              href="/auth/apple"
              className="social-login-btn social-apple-btn"
              onClick={(e) => {
                // If backend route is not hooked up yet, fall back to preview login
                if (e.currentTarget.getAttribute("href") === "/auth/apple" || e.currentTarget.getAttribute("href") === "#") {
                  e.preventDefault();
                  const demoUser = usersDb[0] || defaultAccount;
                  localStorage.setItem(ACCOUNT_KEY, JSON.stringify(demoUser));
                  setAccount(demoUser);
                  setView("dashboard");
                  setDashboardView("home");
                }
              }}
              title="Continue with Apple"
            >
              {/* Official Apple Logo SVG */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.98.6-2.62 1.35-.57.65-.99 1.7-.85 2.72.99.08 2-.51 2.55-1.22z"/>
              </svg>
              <span>Apple</span>
            </a>

            {/* Bottom Switch Text */}
            <p className="login-footer-copy">
              Don't have an account?{" "}
              <button
                type="button"
                className="login-switch-link"
                onClick={() => transitionToView("signup", "backward")}
              >
                Sign up
              </button>
            </p>
          </div>
        </main>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<AuthPage />);
