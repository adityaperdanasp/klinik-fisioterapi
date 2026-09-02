"use client";

export type TimelineBooking = {
  id: string;
  startsAt: string; // ISO
  endsAt: string; // ISO
  status: string;
  patientName: string | null;
  physioName: string | null;
  roomName: string | null;
};

// Rentang visual grid (BUKAN batasan booking beneran — booking di luar
// rentang ini tetap kepasang, cuma di-clamp ke tepi grid biar nggak ilang
// dari tampilan). Klinik belum punya jam operasional resmi di `settings`,
// jadi ini murni default tampilan yang aman/luas.
const DAY_START_MIN = 7 * 60; // 07:00
const DAY_END_MIN = 19 * 60; // 19:00
const TOTAL_MIN = DAY_END_MIN - DAY_START_MIN;
const HOUR_LABELS = Array.from({ length: 13 }, (_, i) => 7 + i); // 07..19

const STATUS_STYLE: Record<string, { bg: string; text: string; border: string }> = {
  scheduled: { bg: "var(--brand-cream-alt)", text: "var(--brand-ink)", border: "var(--brand-earth)" },
  completed: { bg: "#dcfce7", text: "#15803d", border: "#15803d" },
  no_show: { bg: "#fef3c7", text: "#b45309", border: "#b45309" },
  cancelled: { bg: "#f4f4f4", text: "#9ca3af", border: "#d4d4d4" },
};

function minutesOfDay(iso: string): number {
  const d = new Date(iso);
  return d.getHours() * 60 + d.getMinutes();
}

function clampPercent(min: number): number {
  return Math.min(100, Math.max(0, ((min - DAY_START_MIN) / TOTAL_MIN) * 100));
}

// Lane packing sederhana (kayak Google Calendar) — booking yang waktunya
// tumpang tindih (beda fisio/ruang, jadi sah-sah aja bentrok waktu) dikasih
// "lane" (kolom) sendiri-sendiri biar nggak numpuk jadi satu blok, tetep
// kebaca semua.
function assignLanes(bookings: TimelineBooking[]) {
  const sorted = [...bookings].sort((a, b) => minutesOfDay(a.startsAt) - minutesOfDay(b.startsAt));
  const laneEndTimes: number[] = []; // menit selesai booking terakhir di tiap lane
  const withLane = sorted.map((b) => {
    const start = minutesOfDay(b.startsAt);
    const end = minutesOfDay(b.endsAt);
    let lane = laneEndTimes.findIndex((endTime) => endTime <= start);
    if (lane === -1) {
      lane = laneEndTimes.length;
      laneEndTimes.push(end);
    } else {
      laneEndTimes[lane] = end;
    }
    return { booking: b, lane, start, end };
  });
  const maxLanes = Math.max(1, laneEndTimes.length);
  return { items: withLane, maxLanes };
}

export function DayTimeline({
  bookings,
  onSelect,
  height = 480,
  hourStep = 1,
}: {
  bookings: TimelineBooking[];
  onSelect?: (bookingId: string) => void;
  /** Tinggi grid dalam px — dikecilin buat versi "sekilas mingguan". */
  height?: number;
  /** Interval label jam (1 = tiap jam, 2 = tiap 2 jam) — dikecilin biar nggak numpuk pas grid pendek. */
  hourStep?: number;
}) {
  const { items, maxLanes } = assignLanes(bookings);
  const hourLabels = HOUR_LABELS.filter((h) => (h - HOUR_LABELS[0]) % hourStep === 0);

  return (
    <div className="relative flex text-[10px]" style={{ height }}>
      {/* Kolom jam di kiri */}
      <div className="relative w-8 shrink-0">
        {hourLabels.map((h) => (
          <div
            key={h}
            className="absolute right-1 -translate-y-1/2"
            style={{ top: `${clampPercent(h * 60)}%`, color: "var(--brand-muted)" }}
          >
            {h}
          </div>
        ))}
      </div>

      {/* Grid utama */}
      <div className="relative flex-1 border-l" style={{ borderColor: "var(--brand-cream-alt)" }}>
        {hourLabels.map((h) => (
          <div
            key={h}
            className="absolute left-0 right-0 border-t"
            style={{ top: `${clampPercent(h * 60)}%`, borderColor: "var(--brand-cream-alt)" }}
          />
        ))}

        {items.map(({ booking: b, lane, start, end }) => {
          const style = STATUS_STYLE[b.status] ?? STATUS_STYLE.scheduled;
          const top = clampPercent(start);
          const bottom = clampPercent(end);
          const laneWidth = 100 / maxLanes;
          return (
            <button
              key={b.id}
              type="button"
              onClick={() => onSelect?.(b.id)}
              className="absolute overflow-hidden rounded border px-1 py-0.5 text-left leading-tight"
              style={{
                top: `${top}%`,
                height: `${Math.max(bottom - top, 4)}%`,
                left: `${lane * laneWidth}%`,
                width: `calc(${laneWidth}% - 2px)`,
                background: style.bg,
                borderColor: style.border,
                color: style.text,
                cursor: onSelect ? "pointer" : "default",
              }}
              title={`${b.patientName ?? ""} — ${b.physioName ?? ""} · ${b.roomName ?? ""}`}
            >
              <div className="truncate font-medium">{b.patientName}</div>
              <div className="truncate opacity-80">{b.physioName}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
