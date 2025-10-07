import axiosInstance from '@/utility/axiosInterceptor';

export interface AIExtractedData {
  serviceName: string;
  price: number;
  billingCycle: 'monthly' | 'yearly' | 'weekly' | 'quarterly';
  renewalDate: string;
  paymentMethod?: string;
  category?: string;
  notes?: string;
}

export const aiService = {
  async extractSubscription(input: string): Promise<AIExtractedData> {
    const response = await axiosInstance.post('/ai/extract', { input });
    return response.data;
  }
};
