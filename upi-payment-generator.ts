// UPI Payment Link Generator - TypeScript Implementation

/**
 * Configuration for UPI payment
 */
interface UPIConfig {
    UPI_ID: string;
    PAYEE_NAME: string;
    CURRENCY: string;
    TRANSACTION_NOTE: string;
}

/**
 * Product interface
 */
interface Product {
    id: string;
    name: string;
    price: number;
    description?: string;
}

/**
 * UPI Payment Details interface
 */
interface UPIDetails {
    pa: string; // Payee Address (UPI ID)
    pn: string; // Payee Name
    am: string; // Amount
    cu: string; // Currency
    tn: string; // Transaction Note
}

/**
 * UPI Payment Generator Class
 */
class UPIPaymentGenerator {
    private config: UPIConfig;

    constructor(config: UPIConfig) {
        this.config = config;
    }

    /**
     * Generates a UPI payment link with proper URL encoding
     * @param product - The selected product
     * @returns The generated UPI deep link
     */
    generateUPILink(product: Product): string {
        const upiDetails: UPIDetails = {
            pa: this.config.UPI_ID,
            pn: this.config.PAYEE_NAME,
            am: product.price.toString(),
            cu: this.config.CURRENCY,
            tn: `${this.config.TRANSACTION_NOTE} - ${product.name}`
        };

        // Create UPI URL with proper encoding
        const upiUrl = `upi://pay?pa=${encodeURIComponent(upiDetails.pa)}&pn=${encodeURIComponent(upiDetails.pn)}&am=${encodeURIComponent(upiDetails.am)}&cu=${encodeURIComponent(upiDetails.cu)}&tn=${encodeURIComponent(upiDetails.tn)}`;
        
        console.log('Generated UPI URL:', upiUrl);
        console.log('UPI Details:', upiDetails);
        
        return upiUrl;
    }

    /**
     * Generates app-specific UPI URLs for different payment apps
     * @param product - The selected product
     * @param appName - The UPI app name
     * @returns The app-specific UPI URL
     */
    generateAppSpecificUPILink(product: Product, appName: string): string {
        const baseParams = `pa=${encodeURIComponent(this.config.UPI_ID)}&pn=${encodeURIComponent(this.config.PAYEE_NAME)}&am=${encodeURIComponent(product.price.toString())}&cu=${encodeURIComponent(this.config.CURRENCY)}&tn=${encodeURIComponent(`${this.config.TRANSACTION_NOTE} - ${product.name}`)}`;
        
        switch(appName.toLowerCase()) {
            case 'gpay':
            case 'google pay':
                return `tez://upi/pay?${baseParams}`;
            case 'phonepe':
                return `phonepe://pay?${baseParams}`;
            case 'paytm':
                return `paytmmp://pay?${baseParams}`;
            case 'paytmall':
                return `paytmmp://pay?${baseParams}`;
            case 'bhim':
                return `bhim://upi/pay?${baseParams}`;
            case 'amazonpay':
                return `amazonpay://upi/pay?${baseParams}`;
            case 'navi':
                return `navi://upi/pay?${baseParams}`;
            default:
                return `upi://pay?${baseParams}`;
        }
    }

    /**
     * Validates the UPI ID format
     * @param upiId - The UPI ID to validate
     * @returns True if valid, false otherwise
     */
    validateUPIId(upiId: string): boolean {
        const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;
        return upiRegex.test(upiId);
    }

    /**
     * Formats the amount for display
     * @param amount - The amount to format
     * @returns Formatted amount string
     */
    formatAmount(amount: number): string {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0
        }).format(amount);
    }

    /**
     * Gets the configuration
     * @returns Current UPI configuration
     */
    getConfig(): UPIConfig {
        return { ...this.config };
    }

    /**
     * Updates the configuration
     * @param newConfig - New configuration values
     */
    updateConfig(newConfig: Partial<UPIConfig>): void {
        this.config = { ...this.config, ...newConfig };
    }
}

// Usage Example and Demo Functions

/**
 * Creates a UPI payment generator with default configuration
 */
function createUPIPaymentGenerator(): UPIPaymentGenerator {
    const config: UPIConfig = {
        UPI_ID: "9065588337ayush@ybl",
        PAYEE_NAME: "Ayush",
        CURRENCY: "INR",
        TRANSACTION_NOTE: "Product Payment"
    };

    const generator = new UPIPaymentGenerator(config);
    
    // Validate UPI ID
    if (!generator.validateUPIId(config.UPI_ID)) {
        throw new Error('Invalid UPI ID format');
    }

    return generator;
}

/**
 * Demo function to show UPI link generation
 */
function demoUPILinkGeneration(): void {
    const upiGenerator = createUPIPaymentGenerator();
    
    // Sample products
    const products: Product[] = [
        { id: "1", name: "Wireless Earbuds", price: 2999, description: "Premium wireless earbuds" },
        { id: "2", name: "Smart Watch", price: 4999, description: "Fitness tracker" },
        { id: "3", name: "Laptop Stand", price: 1299, description: "Adjustable aluminum stand" }
    ];

    console.log('=== UPI Payment Link Generation Demo ===');
    
    products.forEach(product => {
        console.log(`\nProduct: ${product.name}`);
        console.log(`Price: ${upiGenerator.formatAmount(product.price)}`);
        
        // Generate generic UPI link
        const upiLink = upiGenerator.generateUPILink(product);
        console.log(`UPI Link: ${upiLink}`);
        
        // Generate app-specific links
        const apps = ['Google Pay', 'PhonePe', 'Paytm', 'BHIM'];
        apps.forEach(app => {
            const appLink = upiGenerator.generateAppSpecificUPILink(product, app);
            console.log(`${app}: ${appLink}`);
        });
    });
}

/**
 * Handles payment redirection for mobile/desktop
 * @param product - The selected product
 * @param appName - Optional specific UPI app
 */
function handlePayment(product: Product, appName?: string): void {
    const upiGenerator = createUPIPaymentGenerator();
    
    // Detect mobile device
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase());
    
    let upiUrl: string;
    
    if (appName) {
        upiUrl = upiGenerator.generateAppSpecificUPILink(product, appName);
    } else {
        upiUrl = upiGenerator.generateUPILink(product);
    }
    
    console.log(`Device type: ${isMobile ? 'Mobile' : 'Desktop'}`);
    console.log(`Redirecting to: ${upiUrl}`);
    
    if (isMobile) {
        // Mobile - redirect to UPI app
        window.location.href = upiUrl;
    } else {
        // Desktop - copy UPI ID and show instructions
        copyUPIIdToClipboard(upiGenerator.getConfig().UPI_ID);
        alert(`Desktop detected! UPI ID copied: ${upiGenerator.getConfig().UPI_ID}\n\nPlease open your UPI app manually and pay ${upiGenerator.formatAmount(product.price)}`);
    }
}

/**
 * Copies UPI ID to clipboard
 * @param upiId - The UPI ID to copy
 */
async function copyUPIIdToClipboard(upiId: string): Promise<void> {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(upiId);
            console.log('UPI ID copied to clipboard successfully');
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = upiId;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            console.log('UPI ID copied to clipboard (fallback method)');
        }
    } catch (error) {
        console.error('Failed to copy UPI ID:', error);
    }
}

// Export for use in other modules
export {
    UPIPaymentGenerator,
    createUPIPaymentGenerator,
    handlePayment,
    copyUPIIdToClipboard,
    demoUPILinkGeneration
};

// Export types
export type {
    UPIConfig,
    Product,
    UPIDetails
};

// Auto-run demo if this file is executed directly
if (typeof window !== 'undefined') {
    // Browser environment
    console.log('UPI Payment Generator loaded in browser');
    // Uncomment to run demo automatically
    // demoUPILinkGeneration();
} else if (typeof module !== 'undefined' && module.exports) {
    // Node.js environment
    console.log('UPI Payment Generator loaded in Node.js');
    // Uncomment to run demo automatically
    // demoUPILinkGeneration();
}
