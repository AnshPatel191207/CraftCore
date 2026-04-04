import api from '../lib/axios';

/**
 * AI Service for KrishiSetu.
 * Communicates with the RAG (Retrieval-Augmented Generation) pipeline in the backend.
 */

export interface AiResponse {
  success: boolean;
  data: {
    answer: string;
    sources: string[];
  };
}

export const aiService = {
  /**
   * Ask a question to the RAG AI.
   * @param question - The user's question.
   * @returns The AI's answer and sources.
   */
  async ask(question: string): Promise<AiResponse['data']> {
    try {
      const response = await api.post<AiResponse>('/rag/ask', { question });
      return response.data.data;
    } catch (error: any) {
      console.error('[aiService.ask] Failed:', error);
      throw new Error(error?.response?.data?.message || 'Failed to get an answer from the AI.');
    }
  },

  /**
   * Mock fallback for Demo Mode.
   */
  async getMockResponse(question: string): Promise<AiResponse['data']> {
    // Artificial delay
    await new Promise((res) => setTimeout(res, 1200));

    const q = question.toLowerCase();
    let answer = "I'm analyzing your current field data. Based on your soil reports and recent weather patterns, it looks like your fields are in good health, but caution is advised for the upcoming week.";
    let sources = ['KrishiSetu Knowledge Base'];

    if (q.includes('wheat')) {
      answer = "Wheat prices are currently stable at ₹2,150/quintal. However, increasing demand in European markets suggests a potential 5-8% price rally in late April. Consider holding 40% of your stock.";
      sources = ['Global Market Daily', 'Rabi 2026 Price Report'];
    } else if (q.includes('soil') || q.includes('ph')) {
      answer = "Your recent soil test for Field B showed a pH of 5.2. I recommend applying 2 tons/acre of agricultural lime before the next sowing cycle to neutralize acidity and improve nutrient uptake.";
      sources = ['Soil Health Analysis - Field B', 'Sustainable Farming Guidelines'];
    } else if (q.includes('rain') || q.includes('weather')) {
      answer = "Weather forecasts show a high probability (85%) of heavy rainfall (80-120mm) over the next 72 hours. Please ensure your drainage channels are clear to prevent waterlogging.";
      sources = ['IMD Regional Forecast', 'AgriSense Weather Station'];
    }

    return { answer, sources };
  }
};
