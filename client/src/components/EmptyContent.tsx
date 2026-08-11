interface EmptyContentProps {
  title: string;
  description: string;
}

function HikerSunsetIllustration() {
  return (
    <svg
      className="empty-content__illustration"
      viewBox="0 0 300 300"
      role="img"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <clipPath id="empty-content-clip">
          <circle cx="150" cy="150" r="145" />
        </clipPath>
        <linearGradient id="empty-content-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b0dfd8" />
          <stop offset="0.5" stopColor="#e4cba1" />
          <stop offset="1" stopColor="#f1e8d9" />
        </linearGradient>
        <radialGradient id="empty-content-sun" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fffbf4" />
          <stop offset="0.55" stopColor="#e4cba1" />
          <stop offset="1" stopColor="#e4cba1" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g clipPath="url(#empty-content-clip)">
        <rect x="0" y="0" width="300" height="300" fill="url(#empty-content-sky)" />

        {/* Setting sun */}
        <circle cx="150" cy="150" r="78" fill="url(#empty-content-sun)" />
        <circle cx="150" cy="150" r="34" fill="#fffbf4" />

        {/* Far mountains */}
        <path
          d="M-10,205 L45,148 L95,190 L150,138 L205,188 L255,150 L310,200 L310,240 L-10,240 Z"
          fill="#4fb6a9"
        />
        {/* Mid mountains */}
        <path
          d="M-10,220 L55,178 L120,212 L175,175 L235,210 L295,180 L310,214 L310,250 L-10,250 Z"
          fill="#377f76"
        />
        {/* Brown foreground hill the hiker walks along */}
        <path
          d="M-10,244 C55,228 110,254 165,240 C220,228 268,250 310,238 L310,300 L-10,300 Z"
          fill="#70634c"
        />

        {/* Hiker silhouette, cresting the hill toward the sun */}
        <g fill="#4a3c28">
          {/* trekking pole */}
          <path
            d="M160,198 L173,243"
            stroke="#4a3c28"
            strokeWidth="2.6"
            strokeLinecap="round"
            fill="none"
          />
          {/* backpack */}
          <rect x="130" y="191" width="12" height="23" rx="5.5" />
          {/* legs, striding and planted on the crest */}
          <path d="M141,210 L134,241 L140,242 L148,212 Z" />
          <path d="M148,210 L157,239 L163,240 L153,211 Z" />
          {/* solid torso, leaning into the climb */}
          <path d="M139,192 Q147,187 155,193 L157,216 L138,215 Z" />
          {/* forward arm reaching for the pole */}
          <path
            d="M152,197 L161,208"
            stroke="#4a3c28"
            strokeWidth="3.6"
            strokeLinecap="round"
            fill="none"
          />
          {/* head */}
          <circle cx="147" cy="181" r="8" />
          {/* sun hat */}
          <ellipse cx="147" cy="176" rx="12" ry="3.4" />
          <path d="M140.5,176 Q147,165 153.5,176 Z" />
        </g>
      </g>

      {/* Framing ring */}
      <circle
        cx="150"
        cy="150"
        r="145"
        fill="none"
        stroke="#70634c"
        strokeWidth="3"
        opacity="0.4"
      />
    </svg>
  );
}

export function EmptyContent({ title, description }: Readonly<EmptyContentProps>) {
  return (
    <div className="empty-content">
      <HikerSunsetIllustration />
      <h3 className="empty-content__title">{title}</h3>
      <p className="empty-content__description">{description}</p>
    </div>
  );
}
