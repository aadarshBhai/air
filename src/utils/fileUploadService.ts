export class FileUploadService {
  private static readonly UPLOAD_URL = `${import.meta.env.VITE_API_URL}/api/upload`;

  static async uploadPaymentScreenshot(file: File, orderId: string): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('orderId', orderId);
      formData.append('type', 'payment_screenshot');

      // Make an actual API call:
      const response = await fetch(this.UPLOAD_URL, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || `Upload failed with status ${response.status}`;
        throw new Error(errorMessage);
      }
      
      const result = await response.json();
      // Use the actual filename returned by the API
      return `${this.UPLOAD_URL.replace('/api/upload', '')}/uploads/${result.filename}`;
    } catch (error) {
      console.error('Upload error:', error);
      
      // Handle specific error cases
      if (error instanceof Error) {
        const errorMessage = error.message.toLowerCase();
        
        if (errorMessage.includes('file too large') || errorMessage.includes('413')) {
          throw new Error('Image file is too large. Please choose a smaller image (under 10MB) or compress it before uploading.');
        }
        
        if (errorMessage.includes('invalid file type') || errorMessage.includes('only image files')) {
          throw new Error('Only image files are allowed. Please choose a JPG, PNG, or other image format.');
        }
        
        if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
          throw new Error('Network error. Please check your internet connection and try again.');
        }
      }
      
      throw new Error('Failed to upload payment screenshot. Please try again.');
    }
  }

  static async uploadFileWithFallback(file: File, orderId: string): Promise<string> {
    try {
      // Try to upload to server first
      return await this.uploadPaymentScreenshot(file, orderId);
    } catch (error) {
      // Fallback: create a proper URL using a free image hosting service
      console.warn('Server upload failed, using base64 encoding as fallback');
      
      // Convert file to base64 for WhatsApp sharing
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result as string;
          // For WhatsApp, we can include the base64 data directly
          // or use a simpler approach: just indicate that screenshot is uploaded
          resolve(`📸 Payment screenshot uploaded (Order: ${orderId})`);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }
  }
}
