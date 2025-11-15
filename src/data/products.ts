import productMask from "@/assets/product-mask.jpg";
import productPurifier from "@/assets/product-purifier.jpg";
import productRespirator from "@/assets/product-respirator.jpg";

export interface Product {
  id: string;
  name: string;
  description: string;
  fullDescription: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  image: string;
  category: string;
  rating: number;
  features: string[];
  inStock: boolean;
  createdAt: string;
  updatedAt: string;
}

export const products: Product[] = [
  {
    id: "1",
    name: "N95 Anti-Pollution Mask Pro",
    description: "Premium N95 mask with advanced filtration for maximum protection",
    fullDescription: "Our flagship N95 mask provides superior protection against PM2.5, PM10, and harmful pollutants. Features a comfortable fit with adjustable straps and a replaceable filter system.",
    price: 499,
    originalPrice: 799,
    image: productMask,
    category: "Masks",
    rating: 5,
    features: [
      "99% filtration efficiency",
      "Comfortable adjustable straps",
      "Replaceable filter cartridges",
      "Breathable material",
      "CE certified"
    ],
    inStock: true,
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z"
  },
  {
    id: "2",
    name: "Smart Air Purifier",
    description: "Compact air purifier with HEPA filter and smart controls",
    fullDescription: "Experience clean air with our smart air purifier featuring HEPA H13 filtration, air quality monitoring, and app control. Perfect for bedrooms and small offices.",
    price: 3999,
    originalPrice: 5999,
    image: productPurifier,
    category: "Air Purifiers",
    rating: 5,
    features: [
      "HEPA H13 filtration",
      "Real-time air quality display",
      "Smart app control",
      "Ultra-quiet operation",
      "Energy efficient"
    ],
    inStock: true,
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z"
  },
  {
    id: "3",
    name: "Professional Respirator Mask",
    description: "Industrial-grade respirator with dual filter protection",
    fullDescription: "Designed for maximum protection in high-pollution environments. Features dual filtration cartridges and a comfortable silicone face seal.",
    price: 1299,
    originalPrice: 1899,
    image: productRespirator,
    category: "Masks",
    rating: 5,
    features: [
      "Dual filter cartridges",
      "Silicone face seal",
      "Adjustable head straps",
      "Long-lasting filters",
      "Professional grade"
    ],
    inStock: true,
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z"
  },
  {
    id: "4",
    name: "Kids Anti-Pollution Mask",
    description: "Specially designed comfortable mask for children",
    fullDescription: "Keep your children safe with our specially designed kids' mask. Features fun colors, comfortable fit, and high-efficiency filtration.",
    price: 349,
    originalPrice: 549,
    image: productMask,
    category: "Masks",
    rating: 5,
    features: [
      "Child-friendly design",
      "Soft breathable material",
      "Adjustable ear loops",
      "Fun colors available",
      "Safe materials"
    ],
    inStock: true,
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z"
  },
  {
    id: "5",
    name: "Car Air Purifier",
    description: "Portable air purifier for your vehicle",
    fullDescription: "Compact car air purifier that fits in your cup holder. Features USB charging and effective air cleaning for your daily commute.",
    price: 1499,
    originalPrice: 2299,
    image: productPurifier,
    category: "Air Purifiers",
    rating: 4,
    features: [
      "Compact cup holder design",
      "USB powered",
      "Negative ion technology",
      "Low noise operation",
      "Easy to use"
    ],
    inStock: true,
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z"
  },
  {
    id: "6",
    name: "Replacement Filter Pack",
    description: "Pack of 10 replacement filters for masks",
    fullDescription: "High-quality replacement filters compatible with all AirNex masks. Pack includes 10 filters for extended protection.",
    price: 299,
    originalPrice: 499,
    image: productMask,
    category: "Accessories",
    rating: 5,
    features: [
      "Pack of 10 filters",
      "Universal fit",
      "High filtration efficiency",
      "Easy to replace",
      "Long shelf life"
    ],
    inStock: true,
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z"
  },
  {
    id: "7",
    name: "Premium N99 Mask",
    description: "Advanced N99 filtration with superior protection",
    fullDescription: "Our premium N99 mask offers the highest level of protection with 99.9% filtration efficiency. Perfect for extreme pollution conditions.",
    price: 699,
    originalPrice: 999,
    image: productMask,
    category: "Masks",
    rating: 5,
    features: [
      "99.9% filtration efficiency",
      "Medical-grade materials",
      "Ergonomic design",
      "Adjustable nose clip",
      "FDA approved"
    ],
    inStock: true,
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z"
  },
  {
    id: "8",
    name: "Home Air Purifier Pro",
    description: "Large room air purifier with advanced features",
    fullDescription: "Powerful air purifier designed for large rooms up to 500 sq ft. Features multiple filtration stages and smart sensors.",
    price: 7999,
    originalPrice: 11999,
    image: productPurifier,
    category: "Air Purifiers",
    rating: 5,
    features: [
      "Covers up to 500 sq ft",
      "4-stage filtration",
      "Smart air quality sensor",
      "Sleep mode",
      "Timer function"
    ],
    inStock: true,
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z"
  },
  {
    id: "9",
    name: "Sports Mask Pro",
    description: "Breathable mask designed for active lifestyle",
    fullDescription: "Stay protected during workouts with our sports mask. Features enhanced breathability and moisture-wicking material.",
    price: 599,
    originalPrice: 899,
    image: productMask,
    category: "Masks",
    rating: 4,
    features: [
      "Enhanced breathability",
      "Moisture-wicking fabric",
      "Secure fit during exercise",
      "Lightweight design",
      "Washable and reusable"
    ],
    inStock: true,
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z"
  },
  {
    id: "10",
    name: "Desktop Air Purifier",
    description: "Compact purifier perfect for desk and small spaces",
    fullDescription: "Personal air purifier ideal for your desk or bedside table. Quiet operation with effective filtration.",
    price: 1999,
    originalPrice: 2999,
    image: productPurifier,
    category: "Air Purifiers",
    rating: 4,
    features: [
      "Compact desktop size",
      "Whisper-quiet operation",
      "USB and adapter powered",
      "LED air quality indicator",
      "Low maintenance"
    ],
    inStock: true,
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z"
  },
  {
    id: "11",
    name: "Premium Filter Set (20 Pack)",
    description: "Large pack of premium replacement filters",
    fullDescription: "Stock up with our 20-pack premium filter set. Compatible with all AirNex mask models.",
    price: 549,
    originalPrice: 899,
    image: productMask,
    category: "Accessories",
    rating: 5,
    features: [
      "Pack of 20 filters",
      "Premium quality",
      "Universal compatibility",
      "Extended shelf life",
      "Best value pack"
    ],
    inStock: true,
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z"
  },
  {
    id: "12",
    name: "Fashion Mask Collection",
    description: "Stylish masks with premium protection",
    fullDescription: "Combine style with safety. Available in multiple trendy designs while maintaining high filtration standards.",
    price: 449,
    originalPrice: 699,
    image: productMask,
    category: "Masks",
    rating: 5,
    features: [
      "Multiple design options",
      "High filtration efficiency",
      "Comfortable all-day wear",
      "Washable fabric outer",
      "Replaceable filters"
    ],
    inStock: true,
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z"
  },
  {
    id: "13",
    name: "Portable Air Purifier",
    description: "Wearable personal air purifier necklace",
    fullDescription: "Innovative wearable air purifier that creates a clean air zone around you. Perfect for travel and outdoor activities.",
    price: 2499,
    originalPrice: 3999,
    image: productPurifier,
    category: "Air Purifiers",
    rating: 4,
    features: [
      "Wearable design",
      "Negative ion technology",
      "Rechargeable battery",
      "8-hour runtime",
      "Lightweight and portable"
    ],
    inStock: true,
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z"
  },
  {
    id: "14",
    name: "Medical Grade N95 (Box of 50)",
    description: "Medical-grade masks for healthcare professionals",
    fullDescription: "Certified medical-grade N95 masks. Bulk pack of 50 masks ideal for healthcare settings and extended protection needs.",
    price: 2999,
    originalPrice: 4999,
    image: productMask,
    category: "Masks",
    rating: 5,
    features: [
      "Box of 50 masks",
      "Medical-grade certified",
      "Individually wrapped",
      "Fluid resistant",
      "Hospital-grade protection"
    ],
    inStock: true,
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z"
  },
  {
    id: "15",
    name: "Smart Air Quality Monitor",
    description: "Real-time air quality monitoring device",
    fullDescription: "Monitor your indoor air quality with precision. Tracks PM2.5, PM10, CO2, temperature, and humidity levels.",
    price: 3499,
    originalPrice: 5499,
    image: productPurifier,
    category: "Accessories",
    rating: 5,
    features: [
      "Multi-sensor technology",
      "Real-time monitoring",
      "Mobile app connectivity",
      "Historical data tracking",
      "Alerts and notifications"
    ],
    inStock: true,
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z"
  }
];

export const getProductById = (id: string) => {
  return products.find(product => product.id === id);
};
