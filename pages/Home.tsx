
import React, { useEffect, useState } from 'react';
import { Plus, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getTurmas, getVendedores, seedData } from '../services/storageService';
import { Turma } from '../types';

const Home: React.FC = () => {
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [participantCounts, setParticipantCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    seedData(); // Ensure we have data
    const loadedTurmas = getTurmas();
    setTurmas(loadedTurmas);

    // Calculate participant counts per class
    const allVendedores = getVendedores();
    const counts: Record<string, number> = {};
    loadedTurmas.forEach(t => {
      counts[t.id] = allVendedores.filter(v => v.turmaId === t.id).length;
    });
    setParticipantCounts(counts);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Controle de Turmas</h2>
        </div>
        <Link 
          to="/turmas/nova" 
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm shadow-blue-200"
        >
          <Plus size={20} />
          Nova Turma
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {turmas.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
            <p className="text-slate-500">Nenhuma turma cadastrada.</p>
            <Link to="/turmas/nova" className="text-blue-600 hover:underline mt-2 inline-block">Criar primeira turma</Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
                  <tr>
                    <th className="px-6 py-4 text-center">COD SIN</th>
                    <th className="px-6 py-4 text-center">COD JUMP</th>
                    <th className="px-6 py-4">Datas</th>
                    <th className="px-6 py-4 text-center">Participantes</th>
                    <th className="px-6 py-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {turmas.map((turma) => (
                    <tr key={turma.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                          {turma.sin}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="font-semibold text-slate-700">{turma.jump}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-xs">
                            <span className="w-16 text-slate-400">Início:</span>
                            <span className="font-medium">{new Date(turma.dataInicial).toLocaleDateString('pt-BR')}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="w-16 text-slate-400">Entrega:</span>
                            <span className="text-blue-600 font-medium">{new Date(turma.dataEntrega).toLocaleDateString('pt-BR')}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
                          {participantCounts[turma.id] || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link 
                          to={`/turmas/${turma.id}`} 
                          className="inline-flex items-center justify-center p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Entrar na Turma"
                        >
                          <LogIn size={20} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
