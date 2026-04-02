import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  const whatsappNumber = "263772872970";
  const url = `https://wa.me/${whatsappNumber}?text=Hi%20Supacrown%2C%20I%27d%20like%20to%20enquire%20about%20your%20signage%20services.`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[oklch(0.6_0.2_145)] shadow-lg transition-transform hover:scale-110"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="h-6 w-6 text-white" />
    </a>
  );
}
