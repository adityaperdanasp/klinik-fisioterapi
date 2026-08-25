"use client";

import { useTransition } from "react";
import { updateBookingStatus } from "./actions";

const ACTIONS: { status: "completed" | "cancelled" | "no_show"; label: string }[] = [
  { status: "completed", label: "Selesai" },
  { status: "no_show", label: "Tidak Hadir" },
  { status: "cancelled", label: "Batalkan" },
];

export function BookingStatusActions({ bookingId }: { bookingId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="mt-1 flex gap-2">
      {ACTIONS.map((a) => (
        <button
          key={a.status}
          type="button"
          disabled={isPending}
          onClick={() =>
            startTransition(() => {
              updateBookingStatus(bookingId, a.status);
            })
          }
          className="text-xs text-slate-500 underline hover:text-slate-900 disabled:opacity-50"
        >
          {a.label}
        </button>
      ))}
    </div>
  );
}
