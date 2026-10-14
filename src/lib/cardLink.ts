import type { getServiceClient } from "@/lib/serverAuth";
import { newPublicId } from "@/lib/cardClaim";

type Service = ReturnType<typeof getServiceClient>;
type Card = { id: string; serial_number: string; public_id: string | null };

/**
 * Links a Smart Card to a car: makes sure the card has a public id, points the car at it,
 * marks the card assigned and frees the car's previous card. Callers check permission first.
 */
export async function linkCardToVehicle(service: Service, card: Card, vehicleId: string) {
    const publicId = card.public_id || newPublicId();
    if (!card.public_id) {
        const { error } = await service.from("nfc_cards").update({ public_id: publicId }).eq("id", card.id);
        if (error) throw new Error("Could not prepare this card");
    }
    const { data: current } = await service.from("vehicles").select("nfc_serial_number").eq("id", vehicleId).maybeSingle();
    const { error } = await service.from("vehicles").update({ nfc_card_id: publicId, nfc_serial_number: card.serial_number }).eq("id", vehicleId);
    if (error) throw new Error("Could not link the card");
    await service.from("nfc_cards").update({ status: "ASSIGNED" }).eq("id", card.id);
    if (current?.nfc_serial_number && current.nfc_serial_number !== card.serial_number) {
        await service.from("nfc_cards").update({ status: "MANUFACTURED" }).eq("serial_number", current.nfc_serial_number);
    }
    return publicId;
}
