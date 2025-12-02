import { GoogleGenAI } from "@google/genai";
import { Turma, Vendedor } from '../types';

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key not found in environment variables");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeTurmaPerformance = async (turma: Turma, vendedores: Vendedor[]): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "Erro: Chave de API não configurada.";

  const prompt = `
    Atue como um analista de dados e gerente de vendas sênior. Analise os seguintes dados de uma turma de vendas:
    
    Nome da Turma: ${turma.nome}
    Data Inicial: ${turma.dataInicial}
    Data de Entrega: ${turma.dataEntrega}
    Indicador SIN: ${turma.sin}
    Indicador JUMP: ${turma.jump}
    Quantidade de Vendedores: ${vendedores.length}
    Lista de Vendedores: ${vendedores.map(v => `${v.nome} (${v.cargo})`).join(', ')}

    Por favor, forneça:
    1. Uma breve análise sobre a relação entre os indicadores SIN e JUMP.
    2. Uma sugestão estratégica para melhorar a performance desta equipe antes da data de entrega.
    3. Identifique se a proporção de líderes/consultores parece adequada (baseado nos cargos).
    
    Responda em formato Markdown, de forma concisa e profissional, em Português.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text || "Não foi possível gerar a análise.";
  } catch (error) {
    console.error("Erro ao chamar Gemini:", error);
    return "Ocorreu um erro ao tentar analisar os dados com a IA.";
  }
};