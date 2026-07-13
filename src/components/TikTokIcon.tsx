interface Props {
  size?: number;
  color?: string;
}

export default function TikTokIcon({ size = 36, color = 'white' }: Props) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
      <path d="M72.8 19.2c-3.5-4.1-5.6-9.3-5.8-14.8h-3.2l-.1.1V43c0 6.6-5.4 12-12 12s-12-5.4-12-12 5.4-12 12-12c1.2 0 2.3.2 3.4.5v-3.3c-1.1-.2-2.3-.3-3.4-.3-8.6 0-15.5 6.9-15.5 15.5s6.9 15.5 15.5 15.5c7.7 0 14.1-5.6 15.3-12.9l.2-38.2c.1 0 .1 0 .2.1 2.3.6 4.5 1.6 6.4 3.1 0 0 0 0 .1.1 2.3 1.7 4.3 3.9 5.7 6.5h.1z" fill={color} fill-rule="evenodd"/>
    </svg>
  );
}
