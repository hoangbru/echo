interface Props {
  active: boolean;
}

const HEIGHTS = [3, 7, 5, 9, 4, 8, 6, 10, 4, 7, 5, 8, 3, 6, 9, 4, 7, 5];

export function WaveformBars({ active }: Props) {
  return (
    <div className="flex items-center gap-[3px] h-10" aria-hidden="true">
      {HEIGHTS.map((h, i) => (
        <span
          key={i}
          className="block w-[3px] rounded-sm bg-primary"
          style={{
            height: active ? `${h * 3}px` : "4px",
            opacity: active ? 1 : 0.3,
            transition: `height 0.15s ease ${(i * 0.04).toFixed(2)}s, opacity 0.3s ease`,
            animation: active
              ? `waveBar 0.7s ease-in-out ${(i * 0.07).toFixed(2)}s infinite alternate`
              : "none",
          }}
        />
      ))}
      <style>{`
        @keyframes waveBar {
          from { transform: scaleY(0.3); }
          to   { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
}
