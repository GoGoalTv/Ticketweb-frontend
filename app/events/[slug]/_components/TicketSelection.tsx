"use client";

import { useState } from "react";
import {
  TicketTier,
  TicketType,
  TableTicketConfig,
  AssignedSeatingConfig,
  Event,
} from "@/lib/schema/eventTied";
import { ReservationItem } from "@/lib/api";
import { Ticket as TicketIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TYPE_META: Record<string, { label: string; color: string }> = {
  [TicketType.GENERAL_ADMISSION]: {
    label: "General Admission",
    color: "#f97316",
  },
  [TicketType.ASSIGNED_SEATING]: {
    label: "Assigned Seating",
    color: "#a855f7",
  },
  [TicketType.TABLE]: { label: "Table Booking", color: "#ec4899" },
};

export default function TicketSelection({
  event,
  onCheckout,
}: {
  event: Event;
  onCheckout: (items: ReservationItem[]) => void;
}) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [selectedTierIds, setSelectedTierIds] = useState<string[]>([]);

  const total = selectedTierIds.reduce((sum, tierId) => {
    const tier = event.ticket_tiers.find((t) => t.id === tierId);
    const qty = quantities[tierId] || 0;
    if (!tier || qty === 0) return sum;
    return sum + tier.base_price * qty;
  }, 0);

  const handleSelectTier = (tierId: string) => {
    setSelectedTierIds(
      (prev) =>
        prev.includes(tierId)
          ? prev.filter((id) => id !== tierId) // unselect if already selected
          : [...prev, tierId], // add if not selected
    );

    // Optional: auto set quantity to 1 when first selected
    if (!quantities[tierId]) {
      setQuantities((prev) => ({ ...prev, [tierId]: 1 }));
    }
  };

  const handleCheckout = () => {
    const items = Object.entries(quantities)
      .filter(([_, qty]) => qty > 0)
      .map(([tier_id, quantity]) => ({ tier_id, quantity }));
    if (items.length > 0) onCheckout(items);
  };

  return (
    <div className="grid gap-4 mb-6">
      {event.ticket_tiers.map((tier) => {
        const meta = TYPE_META[tier.type] || {
          label: tier.type,
          color: "#f97316",
        };
        const tableConfig = tier.config as TableTicketConfig;
        const seatingConfig = tier.config as AssignedSeatingConfig;
        const selected = selectedTierIds.includes(tier.id);

        return (
          <div key={tier.id}>
            {/* Ticket Card */}
            <div
              onClick={() => handleSelectTier(tier.id)}
              className={`flex justify-between items-center rounded-xl p-4 cursor-pointer transition-all ${
                selected
                  ? "border border-primary bg-white/[0.06]"
                  : "border border-white/10 bg-white/[0.04] hover:border-white/20"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: `${meta.color}18` }}
                >
                  <TicketIcon
                    className="w-5 h-5"
                    style={{ color: meta.color }}
                  />
                </div>
                <div>
                  <p className="font-bold text-sm">{tier.name}</p>
                  <p className="text-xs text-white/70 mt-1">
                    ₦{tier.base_price.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{
                        background: `${meta.color}20`,
                        color: meta.color,
                      }}
                    >
                      {meta.label}
                    </span>
                    {tier.type === TicketType.TABLE &&
                      tableConfig?.seats_per_table && (
                        <span className="text-xs text-white/30">
                          {tableConfig.seats_per_table} seats per table
                        </span>
                      )}
                    {tier.type === TicketType.ASSIGNED_SEATING &&
                      seatingConfig?.row_count && (
                        <span className="text-xs text-white/30">
                          {seatingConfig.row_count} rows ×{" "}
                          {seatingConfig.seats_per_row} seats
                        </span>
                      )}
                  </div>
                </div>
              </div>

              {/* Quantity Selector for General & Table */}
              {selected && tier.type !== TicketType.ASSIGNED_SEATING && (
                <div
                  className="flex items-center gap-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="w-8 h-8 rounded bg-white/10"
                    onClick={() =>
                      setQuantities((prev) => ({
                        ...prev,
                        [tier.id]: Math.max((prev[tier.id] || 0) - 1, 0),
                      }))
                    }
                  >
                    -
                  </button>
                  <span className="w-6 text-center">
                    {quantities[tier.id] || 0}
                  </span>
                  <button
                    className="w-8 h-8 rounded bg-white/10"
                    onClick={() =>
                      setQuantities((prev) => ({
                        ...prev,
                        [tier.id]: (prev[tier.id] || 0) + 1,
                      }))
                    }
                  >
                    +
                  </button>
                </div>
              )}
            </div>

            {/* Assigned Seating Map */}
            {selected &&
              tier.type === TicketType.ASSIGNED_SEATING &&
              seatingConfig && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-semibold">Select Your Seats</p>
                  <div className="text-center text-xs text-white/50">
                    STAGE
                    <div className="h-[2px] bg-white/20 mt-1 mb-2" />
                  </div>
                  {Array.from({ length: seatingConfig.row_count }).map(
                    (_, rowIndex) => {
                      const rowLetter = String.fromCharCode(65 + rowIndex);
                      return (
                        <div key={rowIndex} className="flex items-center gap-2">
                          <span className="w-4 text-xs text-white/50">
                            {rowLetter}
                          </span>
                          <div className="flex gap-2">
                            {Array.from({
                              length: seatingConfig.seats_per_row,
                            }).map((_, seatIndex) => (
                              <button
                                key={seatIndex}
                                className="w-6 h-6 rounded-full bg-white/20 hover:bg-primary transition"
                              />
                            ))}
                          </div>
                        </div>
                      );
                    },
                  )}
                  <div className="flex gap-6 text-xs text-white/50 pt-2">
                    <span>○ available</span>
                    <span className="text-primary">● selected</span>
                    <span className="text-red-500">✖ sold</span>
                  </div>
                </div>
              )}

            {/* Table Ticket Info + Quantity Selector */}
            {/* {selected && tier.type === TicketType.TABLE && tableConfig && (
              <div className="mt-4 space-y-2">
                <p className="text-xs text-white/50">
                  Seats per table: {tableConfig.seats_per_table}
                </p>
                <p className="text-xs text-white/50">
                  Tables Available: {tier.quantity_available}
                </p>
                <div
                  className="flex items-center gap-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="w-8 h-8 rounded bg-white/10"
                    onClick={() =>
                      setQuantities((prev) => ({
                        ...prev,
                        [tier.id]: Math.max((prev[tier.id] || 0) - 1, 0),
                      }))
                    }
                  >
                    -
                  </button>
                  <span className="w-6 text-center">
                    {quantities[tier.id] || 0}
                  </span>
                  <button
                    className="w-8 h-8 rounded bg-white/10"
                    onClick={() =>
                      setQuantities((prev) => ({
                        ...prev,
                        [tier.id]: (prev[tier.id] || 0) + 1,
                      }))
                    }
                  >
                    +
                  </button>
                </div>
              </div>
            )} */}
          </div>
        );
      })}

      {/* Checkout Button */}
      {selectedTierIds.length >= 1 && (
        <AnimatePresence>
          {total > 0 && (
            <motion.div
              className="pt-4 border-t flex justify-between items-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div>
                <p className="text-gray-500 text-sm">Total</p>
                <p className="text-2xl font-bold">₦{total.toLocaleString()}</p>
              </div>
              <button
                onClick={handleCheckout}
                disabled={total === 0}
                className="bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50"
              >
                Checkout
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
