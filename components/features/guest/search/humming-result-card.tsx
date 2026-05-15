"use client";

import { HummingMatch } from "@/types";

import { Music2, Search, AlertCircle } from "lucide-react";

interface HummingResultCardProps {
  match: HummingMatch | null;
  onSearch: (query: string) => void;
  onClose: () => void;
}

export function HummingResultCard({
  match,
  onSearch,
  onClose,
}: HummingResultCardProps) {
  return (
    <>
      <Style />
      <div
        className={`hum-card ${match ? "hum-card--found" : "hum-card--empty"}`}
      >
        {match ? (
          <FoundContent match={match} onSearch={onSearch} onClose={onClose} />
        ) : (
          <EmptyContent onClose={onClose} />
        )}
      </div>
    </>
  );
}

function FoundContent({
  match,
  onSearch,
  onClose,
}: {
  match: HummingMatch;
  onSearch: (q: string) => void;
  onClose: () => void;
}) {
  const confidencePct = Math.round(match.confidence * 100);
  // Màu confidence: xanh ≥ 70%, vàng 40–69%, đỏ < 40%
  const confidenceColor =
    match.confidence >= 0.7
      ? "#22c55e"
      : match.confidence >= 0.4
        ? "#eab308"
        : "#f87171";

  const searchQuery = [match.title, match.artist].filter(Boolean).join(" ");

  return (
    <>
      {/* header */}
      <div className="hum-header">
        <Music2 size={15} color="#22c55e" aria-hidden="true" />
        <span className="hum-label">Echo nhận ra giai điệu</span>
        <span className="hum-confidence" style={{ color: confidenceColor }}>
          {confidencePct}%
        </span>
        <button className="hum-close-x" aria-label="Đóng" onClick={onClose}>
          ✕
        </button>
      </div>

      {/* track */}
      <div className="hum-track">
        <p className="hum-title">{match.title}</p>
        {match.artist && <p className="hum-artist">{match.artist}</p>}
      </div>

      {/* low-confidence warning */}
      {match.confidence < 0.5 && (
        <div className="hum-warning">
          <AlertCircle size={12} />
          <span>Echo không chắc lắm — thử ngân nga lại rõ hơn nếu sai</span>
        </div>
      )}

      {/* action */}
      <button
        className="hum-search-btn"
        onClick={() => {
          onSearch(searchQuery);
          onClose();
        }}
      >
        <Search size={13} />
        Tìm "{match.title}" trong ứng dụng
      </button>
    </>
  );
}

function EmptyContent({ onClose }: { onClose: () => void }) {
  return (
    <div className="hum-empty">
      <span className="hum-empty-icon" aria-hidden="true">
        🎵
      </span>
      <p className="hum-empty-text">
        Echo chưa nhận ra giai điệu này.
        <br />
        Thử ngân nga rõ hơn hoặc lâu hơn nhé!
      </p>
      <button className="hum-close-btn" onClick={onClose}>
        Đóng
      </button>
    </div>
  );
}

function Style() {
  return (
    <style>{`
      .hum-card {
        position: absolute;
        top: calc(100% + 8px);
        left: 0;
        right: 0;
        z-index: 50;
        border-radius: 12px;
        background: #1a1a1a;
        border: 1px solid rgba(255,255,255,0.1);
        padding: 14px 16px;
        animation: hum-in 0.18s ease;
      }
      @keyframes hum-in {
        from { opacity:0; transform:translateY(-6px); }
        to   { opacity:1; transform:translateY(0); }
      }

      /* header */
      .hum-header {
        display: flex;
        align-items: center;
        gap: 7px;
        margin-bottom: 10px;
      }
      .hum-label {
        flex: 1;
        font-size: 11px;
        font-weight: 500;
        color: #22c55e;
        letter-spacing: 0.04em;
        text-transform: uppercase;
      }
      .hum-confidence {
        font-size: 11px;
        background: rgba(255,255,255,0.05);
        padding: 2px 7px;
        border-radius: 999px;
      }
      .hum-close-x {
        font-size: 12px;
        color: #6b7280;
        background: none;
        border: none;
        cursor: pointer;
        padding: 2px 4px;
        line-height: 1;
      }
      .hum-close-x:hover { color: #fff; }

      /* track */
      .hum-track { margin-bottom: 10px; }
      .hum-title  { font-size: 15px; font-weight: 600; color: #fff; margin: 0 0 3px; }
      .hum-artist { font-size: 13px; color: #9ca3af; margin: 0; }

      /* warning */
      .hum-warning {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 11px;
        color: #eab308;
        margin-bottom: 10px;
      }

      /* search btn */
      .hum-search-btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 12px;
        font-weight: 500;
        color: #fff;
        background: rgba(255,255,255,0.08);
        border: 1px solid rgba(255,255,255,0.12);
        padding: 6px 14px;
        border-radius: 999px;
        cursor: pointer;
        transition: background 0.15s;
      }
      .hum-search-btn:hover { background: rgba(255,255,255,0.14); }

      /* empty */
      .hum-empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        padding: 8px 0 4px;
        text-align: center;
      }
      .hum-empty-icon { font-size: 22px; }
      .hum-empty-text {
        font-size: 13px;
        color: #9ca3af;
        line-height: 1.55;
        margin: 0;
      }
      .hum-close-btn {
        font-size: 12px;
        color: #6b7280;
        background: none;
        border: none;
        cursor: pointer;
        padding: 4px 10px;
        border-radius: 4px;
        margin-top: 2px;
      }
      .hum-close-btn:hover { color: #9ca3af; }
    `}</style>
  );
}
