
import { Turma, Vendedor } from '../types';

const TURMAS_KEY = 'app_turmas_v1';
const VENDEDORES_KEY = 'app_vendedores_v1';

export const getTurmas = (): Turma[] => {
  const data = localStorage.getItem(TURMAS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveTurma = (turma: Turma): void => {
  const turmas = getTurmas();
  const existingIndex = turmas.findIndex(t => t.id === turma.id);
  
  if (existingIndex >= 0) {
    turmas[existingIndex] = turma;
  } else {
    turmas.push(turma);
  }
  
  localStorage.setItem(TURMAS_KEY, JSON.stringify(turmas));
};

export const deleteTurma = (id: string): void => {
  const turmas = getTurmas().filter(t => t.id !== id);
  localStorage.setItem(TURMAS_KEY, JSON.stringify(turmas));
  
  // Cascade delete salespeople
  const vendedores = getVendedores().filter(v => v.turmaId !== id);
  localStorage.setItem(VENDEDORES_KEY, JSON.stringify(vendedores));
};

export const getVendedores = (turmaId?: string): Vendedor[] => {
  const data = localStorage.getItem(VENDEDORES_KEY);
  const allVendedores: Vendedor[] = data ? JSON.parse(data) : [];
  
  // Sort alphabetically by name
  allVendedores.sort((a, b) => a.nome.localeCompare(b.nome));
  
  if (turmaId) {
    return allVendedores.filter(v => v.turmaId === turmaId);
  }
  return allVendedores;
};

export const saveVendedor = (vendedor: Vendedor): void => {
  const vendedores = getVendedores();
  const existingIndex = vendedores.findIndex(v => v.id === vendedor.id);
  
  if (existingIndex >= 0) {
    vendedores[existingIndex] = vendedor;
  } else {
    vendedores.push(vendedor);
  }
  
  localStorage.setItem(VENDEDORES_KEY, JSON.stringify(vendedores));
};

export const deleteVendedor = (id: string): void => {
  const vendedores = getVendedores().filter(v => v.id !== id);
  localStorage.setItem(VENDEDORES_KEY, JSON.stringify(vendedores));
};

// Seed initial data if empty
export const seedData = () => {
  if (!localStorage.getItem(TURMAS_KEY)) {
    const initialTurmas: Turma[] = [
      { id: '1', nome: 'Turma A', dataInicial: '2023-10-01', dataEntrega: '2023-12-15', sin: '120', jump: '45' },
      { id: '2', nome: 'Turma B', dataInicial: '2023-11-05', dataEntrega: '2024-01-20', sin: '95', jump: '30' },
    ];
    localStorage.setItem(TURMAS_KEY, JSON.stringify(initialTurmas));
    
    const initialVendedores: Vendedor[] = [
      { 
        id: '101', turmaId: '1', nome: 'Carlos Silva', 
        matricula: '12345', usuario: 'csilva', idClaro: 'C001', regional: 'SP', canal: 'VAREJO',
        cidade: 'São Paulo', uf: 'SP', supervisor: 'João', coordenador: 'Maria', gerente: 'Pedro',
        telefone: '11999999999', email: 'carlos@example.com', dn: '01/01/1990'
      },
      { 
        id: '102', turmaId: '1', nome: 'Ana Souza', 
        matricula: '67890', usuario: 'asouza', idClaro: 'C002', regional: 'RJ', canal: 'PME',
        cidade: 'Rio de Janeiro', uf: 'RJ', supervisor: 'Carlos', coordenador: 'Ana', gerente: 'Beto',
        telefone: '21988888888', email: 'ana@example.com', dn: '15/05/1992'
      },
    ];
    localStorage.setItem(VENDEDORES_KEY, JSON.stringify(initialVendedores));
  }
};
