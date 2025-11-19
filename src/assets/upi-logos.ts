// UPI App Logos - Using SVG logos for better quality
const base = import.meta.env.BASE_URL;

export const upiApps = [
  { 
    name: "Google Pay", 
    icon: "💰", 
    color: "bg-blue-500",
    logo: base + "google.png"
  },
  { 
    name: "PhonePe", 
    icon: "🔵", 
    color: "bg-purple-500",
    logo: base + "phone.png"
  },
  { 
    name: "Navi", 
    icon: "🚢", 
    color: "bg-teal-500",
    logo: base + "navi.png"
  },
  { 
    name: "Paytm", 
    icon: "💸", 
    color: "bg-cyan-500",
    logo: base + "paytm.png"
  },
  { 
    name: "Amazon Pay", 
    icon: "🟠", 
    color: "bg-orange-500",
    logo: base + "amazon.png"
  },
  { 
    name: "BHIM UPI", 
    icon: "🇮🇳", 
    color: "bg-green-500",
    logo: base + "bhem.jpg"
  }
];
