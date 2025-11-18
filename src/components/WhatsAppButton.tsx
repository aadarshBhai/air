import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const WhatsAppButton = () => {
  const handleWhatsAppClick = () => {
    window.open("https://wa.me/918544635259", "_blank");
  };

  return (
    <Button
      onClick={handleWhatsAppClick}
      size="icon"
      className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-[#25D366] hover:bg-[#20BA59] shadow-lg z-50 animate-fade-in"
    >
      <MessageCircle className="h-6 w-6 text-white" />
    </Button>
  );
};

export default WhatsAppButton;
