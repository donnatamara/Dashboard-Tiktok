interface Props {
  size?: number;
}

export default function Logo({ size = 36 }: Props) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
      {/* Pin body */}
      <path
        d="M50 8C33.4 8 20 21.4 20 38c0 11.2 7.4 20.6 13.6 28.2C38.2 72 42.8 78 46.7 86.2l3.3 8.8 3.3-8.8c3.9-8.2 8.5-14.2 13.1-20C72.6 58.6 80 49.2 80 38 80 21.4 66.6 8 50 8z"
        fill="#E17055"
      />
      {/* Pin highlight/shine */}
      <path
        d="M50 14C35.6 14 24 25.6 24 40c0 9.2 6 17 11.6 23.6 3.8 4.5 7.6 9.5 10.8 15.8 1 2.1 2.2 4.4 3.6 6.6 1.4-2.2 2.6-4.5 3.6-6.6 3.2-6.3 7-11.3 10.8-15.8C70 57 76 49.2 76 40 76 25.6 64.4 14 50 14z"
        fill="#C05A40"
        opacity="0.6"
      />
      {/* Inner circle (map target) */}
      <circle cx="50" cy="40" r="12" fill="white" />
      {/* Sparkle star */}
      <g transform="translate(50, 34)">
        <path
          d="M0-12 L2.5-4 L10-4 L4 1.5 L6 10 L0 5.5 L-6 10 L-4 1.5 L-10-4 L-2.5-4Z"
          fill="#EBB773"
        />
      </g>
    </svg>
  );
}
