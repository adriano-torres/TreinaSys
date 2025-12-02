
export interface Vendedor {
  id: string;
  turmaId: string;
  nome: string; // Colaborador
  matricula: string;
  usuario: string;
  idClaro: string;
  regional: string;
  canal: 'MDU' | 'SDU' | 'PME' | 'VAREJO' | string;
  cidade: string;
  uf: string;
  supervisor: string;
  coordenador: string;
  gerente: string;
  telefone: string;
  email: string;
  dn: string;
  cargo?: string;
  acessos?: Record<string, boolean>; // Stores access flags (e.g., { "email": true, "vpn": false })
  apresentacao?: string; // Stores the presentation text
  fotos?: Record<string, boolean>; // Stores photo status flags
  presenca?: Record<string, boolean>; // Stores attendance status flags
  prova?: string; // Stores the exam score (3 digits)
}

export interface Turma {
  id: string;
  nome?: string; // Made optional as classes don't have explicit names anymore
  dataInicial: string;
  dataEntrega: string; // Used as Data Final
  sin: string;
  jump: string;
}

export interface AiAnalysisResult {
  analysis: string;
  timestamp: string;
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  senha?: string; // Optional when listing, required for auth/creation
}
