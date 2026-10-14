/** Shared by the shop, the order list and the back office. Safe to use in the browser. */
export type CardDesign = "white-waves" | "white-marble" | "black";
export type CardOrderStatus = "pending_payment" | "paid" | "processing" | "out_for_delivery" | "ready_for_pickup" | "delivered" | "cancelled";

export const cedis = (pesewas: number | null | undefined) => pesewas == null ? "" : new Intl.NumberFormat("en-GH", { style: "currency", currency: "GHS", minimumFractionDigits: pesewas % 100 ? 2 : 0 }).format(pesewas / 100);

export const orderStatusLabel: Record<CardOrderStatus, string> = {
    pending_payment: "Waiting for payment",
    paid: "Paid",
    processing: "Preparing your card",
    out_for_delivery: "Out for delivery",
    ready_for_pickup: "Ready for pickup",
    delivered: "Delivered",
    cancelled: "Cancelled",
};

export const orderStatusTone: Record<CardOrderStatus, string> = {
    pending_payment: "bg-[#F2F2F2] text-[#666]",
    paid: "bg-[#EEEEFF] text-[#1111F6]",
    processing: "bg-[#EEEEFF] text-[#1111F6]",
    out_for_delivery: "bg-[#FFF4DF] text-[#915C12]",
    ready_for_pickup: "bg-[#FFF4DF] text-[#915C12]",
    delivered: "bg-[#EAF7F0] text-[#197252]",
    cancelled: "bg-[#FFF0EF] text-[#AA3333]",
};

/** The steps a paid order moves through, depending on how it reaches the driver. */
export const orderSteps = (method: "delivery" | "pickup"): CardOrderStatus[] =>
    method === "delivery" ? ["paid", "processing", "out_for_delivery", "delivered"] : ["paid", "processing", "ready_for_pickup", "delivered"];
