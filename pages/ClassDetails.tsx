
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Trash2, UserPlus, Sparkles, X, Edit2, MessageCircle } from 'lucide-react';
import { getTurmas, getVendedores, saveTurma, deleteTurma, saveVendedor, deleteVendedor } from '../services/storageService';
import { Turma, Vendedor } from '../types';

const generateId = () => Math.random().toString(36).substr(2, 9);

// Modal Component for adding/editing participants
interface ParticipantModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (vendedor: Vendedor) => void;
    initialData?: Vendedor;
    turmaId: string;
}

const ParticipantModal: React.FC<ParticipantModalProps> = ({ isOpen, onClose, onSave, initialData, turmaId }) => {
    const [formData, setFormData] = useState<Partial<Vendedor>>({});
    const [supervisores, setSupervisores] = useState<Vendedor[]>([]);
    const [coordenadores, setCoordenadores] = useState<Vendedor[]>([]);
    const [gerentes, setGerentes] = useState<Vendedor[]>([]);

    useEffect(() => {
        if (isOpen) {
            // Load all vendors to find supervisors, coordinators and managers
            const allVendedores = getVendedores();
            
            const filteredSupervisores = allVendedores.filter(v => 
                v.cargo && v.cargo.toLowerCase().includes('supervisor')
            );
            setSupervisores(filteredSupervisores);

            const filteredCoordenadores = allVendedores.filter(v => 
                v.cargo && v.cargo.toLowerCase().includes('coordenador')
            );
            setCoordenadores(filteredCoordenadores);

            const filteredGerentes = allVendedores.filter(v => 
                v.cargo && v.cargo.toLowerCase().includes('gerente')
            );
            setGerentes(filteredGerentes);

            setFormData(initialData || {
                nome: '', matricula: '', usuario: '', idClaro: '', regional: '', 
                canal: 'VAREJO', cidade: '', uf: '', supervisor: '', 
                coordenador: '', gerente: '', telefone: '', email: '', dn: ''
            });
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: initialData?.id || generateId(),
            turmaId: turmaId,
            ...formData as Vendedor
        });
        onClose();
    };

    const handleChange = (field: keyof Vendedor, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
                    <h3 className="text-xl font-bold text-slate-800">
                        {initialData ? 'Editar Participante' : 'Novo Participante'}
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X size={24} />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="md:col-span-2 lg:col-span-1">
                        <label className="block text-xs font-medium text-slate-500 mb-1">Colaborador</label>
                        <input required type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                            value={formData.nome || ''} onChange={e => handleChange('nome', e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Matrícula</label>
                        <input type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                            value={formData.matricula || ''} onChange={e => handleChange('matricula', e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Usuário</label>
                        <input type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                            value={formData.usuario || ''} onChange={e => handleChange('usuario', e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">ID Claro</label>
                        <input type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                            value={formData.idClaro || ''} onChange={e => handleChange('idClaro', e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Regional</label>
                        <input type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                            value={formData.regional || ''} onChange={e => handleChange('regional', e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Canal</label>
                        <select className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                            value={formData.canal || 'VAREJO'} onChange={e => handleChange('canal', e.target.value)}>
                            <option value="MDU">MDU</option>
                            <option value="SDU">SDU</option>
                            <option value="PME">PME</option>
                            <option value="VAREJO">VAREJO</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Cidade</label>
                        <input type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                            value={formData.cidade || ''} onChange={e => handleChange('cidade', e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">UF</label>
                        <input type="text" maxLength={2} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                            value={formData.uf || ''} onChange={e => handleChange('uf', e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Supervisor</label>
                        <select 
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                            value={formData.supervisor || ''} 
                            onChange={e => handleChange('supervisor', e.target.value)}
                        >
                            <option value="">Selecione...</option>
                            {supervisores.map(sup => (
                                <option key={sup.id} value={sup.nome}>
                                    {sup.nome}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Coordenador</label>
                        <select 
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                            value={formData.coordenador || ''} 
                            onChange={e => handleChange('coordenador', e.target.value)}
                        >
                            <option value="">Selecione...</option>
                            {coordenadores.map(coord => (
                                <option key={coord.id} value={coord.nome}>
                                    {coord.nome}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Gerente</label>
                        <select 
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                            value={formData.gerente || ''} 
                            onChange={e => handleChange('gerente', e.target.value)}
                        >
                            <option value="">Selecione...</option>
                            {gerentes.map(manager => (
                                <option key={manager.id} value={manager.nome}>
                                    {manager.nome}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Telefone</label>
                        <input type="tel" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                            value={formData.telefone || ''} onChange={e => handleChange('telefone', e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Email</label>
                        <input type="email" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                            value={formData.email || ''} onChange={e => handleChange('email', e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">DN</label>
                        <input type="text" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                            value={formData.dn || ''} onChange={e => handleChange('dn', e.target.value)} />
                    </div>

                    <div className="md:col-span-2 lg:col-span-3 pt-4 flex justify-end gap-3 border-t border-slate-100 mt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                            Cancelar
                        </button>
                        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                            Salvar Participante
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ClassDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = id === 'nova';

  const [turma, setTurma] = useState<Turma>({
    id: '',
    nome: '',
    dataInicial: '',
    dataEntrega: '',
    sin: '',
    jump: ''
  });

  const [vendedores, setVendedores] = useState<Vendedor[]>([]);
  const [allContacts, setAllContacts] = useState<Vendedor[]>([]); // For lookup
  const [loading, setLoading] = useState(true);
  
  // Tabs State
  const [activeTab, setActiveTab] = useState('cadastro');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVendedor, setEditingVendedor] = useState<Vendedor | undefined>(undefined);

  useEffect(() => {
    // Fetch all contacts/vendedores regardless of class for lookup purposes
    setAllContacts(getVendedores());

    if (!isNew && id) {
      const allTurmas = getTurmas();
      const found = allTurmas.find(t => t.id === id);
      if (found) {
        setTurma(found);
        setVendedores(getVendedores(id));
      } else {
        navigate('/');
      }
    } else {
      setTurma(prev => ({ ...prev, id: generateId() }));
    }
    setLoading(false);
  }, [id, isNew, navigate]);

  const handleSaveTurma = (e?: React.FormEvent) => {
    if(e) e.preventDefault();
    if (!turma.dataInicial || !turma.dataEntrega) {
        alert("Preencha as datas.");
        return;
    }
    
    // Auto-generate a name since user removed name input
    const turmaToSave = {
        ...turma,
        nome: turma.nome || `Turma ${turma.id.substring(0,4).toUpperCase()}`
    };

    saveTurma(turmaToSave);
    if (isNew) {
        navigate(`/turmas/${turma.id}`, { replace: true });
    } else {
        alert('Dados da turma salvos com sucesso!');
    }
  };

  const handleDeleteTurma = () => {
    if (confirm('Tem certeza que deseja excluir esta turma e todos os seus participantes?')) {
      if (turma.id) deleteTurma(turma.id);
      navigate('/');
    }
  };

  const openAddModal = () => {
      setEditingVendedor(undefined);
      setIsModalOpen(true);
  };

  const openEditModal = (v: Vendedor) => {
      setEditingVendedor(v);
      setIsModalOpen(true);
  };

  const handleSaveParticipant = (v: Vendedor) => {
      saveVendedor(v);
      if (editingVendedor) {
          setVendedores(prev => prev.map(item => item.id === v.id ? v : item).sort((a, b) => a.nome.localeCompare(b.nome)));
      } else {
          setVendedores(prev => [...prev, v].sort((a, b) => a.nome.localeCompare(b.nome)));
      }
  };

  const handleDeleteVendedor = (vid: string) => {
    if(confirm('Remover este participante?')) {
        deleteVendedor(vid);
        setVendedores(vendedores.filter(v => v.id !== vid));
    }
  };

  // Toggle Access Handler
  const handleToggleAccess = (vendedorId: string, accessKey: string) => {
      const updatedVendedores = vendedores.map(v => {
          if (v.id === vendedorId) {
              const currentAccess = v.acessos || {};
              const newValue = !currentAccess[accessKey];
              const updatedVendedor = {
                  ...v,
                  acessos: {
                      ...currentAccess,
                      [accessKey]: newValue
                  }
              };
              saveVendedor(updatedVendedor);
              return updatedVendedor;
          }
          return v;
      });
      setVendedores(updatedVendedores);
  };

  // Toggle Fotos Handler
  const handleToggleFotos = (vendedorId: string, fotosKey: string) => {
      const updatedVendedores = vendedores.map(v => {
          if (v.id === vendedorId) {
              const currentFotos = v.fotos || {};
              const newValue = !currentFotos[fotosKey];
              const updatedVendedor = {
                  ...v,
                  fotos: {
                      ...currentFotos,
                      [fotosKey]: newValue
                  }
              };
              saveVendedor(updatedVendedor);
              return updatedVendedor;
          }
          return v;
      });
      setVendedores(updatedVendedores);
  };

  // Toggle Presenca Handler
  const handleTogglePresenca = (vendedorId: string, presencaKey: string) => {
      const updatedVendedores = vendedores.map(v => {
          if (v.id === vendedorId) {
              const currentPresenca = v.presenca || {};
              const newValue = !currentPresenca[presencaKey];
              const updatedVendedor = {
                  ...v,
                  presenca: {
                      ...currentPresenca,
                      [presencaKey]: newValue
                  }
              };
              saveVendedor(updatedVendedor);
              return updatedVendedor;
          }
          return v;
      });
      setVendedores(updatedVendedores);
  };

  // Presentation Text Handler
  const handleApresentacaoChange = (vendedorId: string, text: string) => {
    setVendedores(prev => prev.map(v => v.id === vendedorId ? { ...v, apresentacao: text } : v));
  };

  const handleSaveApresentacao = (vendedor: Vendedor) => {
    saveVendedor(vendedor);
  };

  // Prova Score Handler
  const handleProvaChange = (vendedorId: string, value: string) => {
      // Validate: only numbers, max 3 digits
      if (!/^\d*$/.test(value)) return;
      if (value.length > 3) return;

      setVendedores(prev => prev.map(v => v.id === vendedorId ? { ...v, prova: value } : v));
  };

  const handleSaveProva = (vendedor: Vendedor) => {
      saveVendedor(vendedor);
  };

  // Helper to find supervisor phone
  const getSupervisorPhone = (supervisorName: string) => {
      if (!supervisorName) return null;
      // Case insensitive match
      const supervisor = allContacts.find(c => c.nome.toLowerCase() === supervisorName.toLowerCase());
      return supervisor ? supervisor.telefone : null;
  };

  const getWhatsAppLink = (phone: string) => {
    if (!phone) return '#';
    const cleanNumber = phone.replace(/\D/g, '');
    return `https://wa.me/55${cleanNumber}`;
  };

  const tabs = [
    { id: 'cadastro', label: 'Cadastro' },
    { id: 'acessos', label: 'Acessos' },
    { id: 'apresentacao', label: 'Apresentação' },
    { id: 'fotos', label: 'Fotos' },
    { id: 'lado_a_lado', label: 'Lado a Lado' },
    { id: 'presenca', label: 'Presença' },
    { id: 'prova', label: 'Prova' },
  ];

  // Defined Access Columns
  const accessColumns = [
      { key: 'rede', label: 'REDE' },
      { key: 'idm', label: 'IDM' },
      { key: 'reset', label: 'RESET' },
      { key: 'duo_claro', label: 'DUO CLARO' },
      { key: 'oma', label: 'OMA' },
      { key: 'authenticator', label: 'AUTHENTICATOR' },
      { key: 'email', label: 'E-MAIL' },
      { key: 'autentica', label: 'AUTENTICA' },
      { key: 'conexao_simplificada', label: 'CONEXÃO SIMPLIFICADA' },
      { key: 'bcc_one', label: 'BCC ONE' },
      { key: 'solar', label: 'SOLAR' },
      { key: 'rvi', label: 'RVI' },
      { key: 'vpn', label: 'VPN' },
      { key: 'duo_bcc', label: 'DUO BCC' },
      { key: 'orhganiza', label: 'ORHGANIZA' },
  ];

  // Defined Fotos Columns
  const fotosColumns = [
      { key: 'lado_a_lado', label: 'Lado a lado' },
      { key: 'entrega', label: 'Entrega' },
  ];

  // Defined Presenca Columns
  const presencaColumns = [
      { key: 'dia_01', label: 'Dia 01' },
      { key: 'dia_02', label: 'Dia 02' },
      { key: 'dia_03', label: 'Dia 03' },
      { key: 'dia_04', label: 'Dia 04' },
      { key: 'dia_05', label: 'Dia 05' },
      { key: 'dia_06', label: 'Dia 06' },
      { key: 'dia_07', label: 'Dia 07' },
  ];

  if (loading) return <div className="p-8 text-center">Carregando...</div>;

  return (
    <div className="max-w-[1600px] mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/')} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-800">{isNew ? 'Nova Turma' : (turma.sin ? `Turma ${turma.sin}` : 'Detalhes da Turma')}</h1>
        </div>
        {!isNew && (
            <>
                <button onClick={() => handleSaveTurma()} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                    <Save size={18} />
                    Salvar
                </button>
                <button onClick={handleDeleteTurma} className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg font-medium transition-colors">
                    <Trash2 size={18} />
                    Excluir
                </button>
            </>
        )}
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                  if (isNew && tab.id !== 'cadastro') {
                      alert('Salve a turma primeiro para acessar outras abas.');
                      return;
                  }
                  setActiveTab(tab.id);
              }}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}
                ${isNew && tab.id !== 'cadastro' ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      {activeTab === 'cadastro' && (
          <div className="space-y-8">
            {/* Inputs da Turma */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-500 mb-1">COD SIN</label>
                        <input 
                            type="text" 
                            value={turma.sin}
                            onChange={(e) => setTurma({...turma, sin: e.target.value})}
                            placeholder="Ex: A123"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-800"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-500 mb-1">COD JUMP</label>
                        <input 
                            type="text" 
                            value={turma.jump}
                            onChange={(e) => setTurma({...turma, jump: e.target.value})}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-800"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-500 mb-1">Data Inicial</label>
                        <input 
                            type="date" 
                            value={turma.dataInicial}
                            onChange={(e) => setTurma({...turma, dataInicial: e.target.value})}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-800"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-500 mb-1">Data de Entrega</label>
                        <input 
                            type="date" 
                            value={turma.dataEntrega}
                            onChange={(e) => setTurma({...turma, dataEntrega: e.target.value})}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-800"
                        />
                    </div>
                </div>
                
                {isNew && (
                    <div className="mt-6 flex justify-end">
                        <button onClick={handleSaveTurma} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium">
                            Criar Turma
                        </button>
                    </div>
                )}
            </div>

            {!isNew && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-slate-800">Participantes</h2>
                        <div className="flex gap-2">
                            <button onClick={openAddModal} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                                <UserPlus size={18} />
                                Adicionar
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-600 whitespace-nowrap">
                            <thead className="bg-slate-50 font-semibold text-slate-500">
                                <tr>
                                    <th className="px-4 py-3">Colaborador</th>
                                    <th className="px-4 py-3">Matrícula</th>
                                    <th className="px-4 py-3">Usuário</th>
                                    <th className="px-4 py-3">ID Claro</th>
                                    <th className="px-4 py-3">Regional</th>
                                    <th className="px-4 py-3">Canal</th>
                                    <th className="px-4 py-3">Cidade</th>
                                    <th className="px-4 py-3">UF</th>
                                    <th className="px-4 py-3">Supervisor</th>
                                    <th className="px-4 py-3">Coordenador</th>
                                    <th className="px-4 py-3">Gerente</th>
                                    <th className="px-4 py-3">Telefone</th>
                                    <th className="px-4 py-3">Email</th>
                                    <th className="px-4 py-3">DN</th>
                                    <th className="px-4 py-3 text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {vendedores.length === 0 ? (
                                    <tr>
                                        <td colSpan={15} className="px-4 py-8 text-center text-slate-400">Nenhum participante cadastrado.</td>
                                    </tr>
                                ) : (
                                    vendedores.map(v => (
                                        <tr key={v.id} className="hover:bg-slate-50">
                                            <td className="px-4 py-3 font-medium text-slate-900">{v.nome}</td>
                                            <td className="px-4 py-3">{v.matricula}</td>
                                            <td className="px-4 py-3">{v.usuario}</td>
                                            <td className="px-4 py-3">{v.idClaro}</td>
                                            <td className="px-4 py-3">{v.regional}</td>
                                            <td className="px-4 py-3">{v.canal}</td>
                                            <td className="px-4 py-3">{v.cidade}</td>
                                            <td className="px-4 py-3">{v.uf}</td>
                                            <td className="px-4 py-3">{v.supervisor}</td>
                                            <td className="px-4 py-3">{v.coordenador}</td>
                                            <td className="px-4 py-3">{v.gerente}</td>
                                            <td className="px-4 py-3">{v.telefone}</td>
                                            <td className="px-4 py-3">{v.email}</td>
                                            <td className="px-4 py-3">{v.dn}</td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button onClick={() => openEditModal(v)} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                                                        <Edit2 size={14} />
                                                    </button>
                                                    <button onClick={() => handleDeleteVendedor(v.id)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                        </div>
                    </div>
                </div>
            )}
          </div>
      )}

      {activeTab === 'acessos' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
             <div className="p-6 border-b border-slate-100">
                 <h2 className="text-lg font-bold text-slate-800">Controle de Acessos aos Sistemas</h2>
                 <p className="text-sm text-slate-500 mt-1">Gerencie os acessos liberados para cada colaborador.</p>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 font-semibold text-slate-500 uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4">COLABORADOR</th>
                            {accessColumns.map(col => (
                                <th key={col.key} className="px-6 py-4 text-center">{col.label}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {vendedores.length === 0 ? (
                            <tr>
                                <td colSpan={accessColumns.length + 1} className="px-6 py-8 text-center text-slate-400">
                                    Nenhum participante cadastrado nesta turma.
                                </td>
                            </tr>
                        ) : (
                            vendedores.map(v => (
                                <tr key={v.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 font-medium text-slate-900">{v.nome}</td>
                                    {accessColumns.map(col => {
                                        const isChecked = v.acessos?.[col.key] || false;
                                        return (
                                            <td key={col.key} className="px-6 py-4 text-center">
                                                <button 
                                                    onClick={() => handleToggleAccess(v.id, col.key)}
                                                    className={`
                                                        relative inline-flex h-4 w-7 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                                                        ${isChecked ? 'bg-green-500' : 'bg-slate-200'}
                                                    `}
                                                >
                                                    <span 
                                                        className={`
                                                            inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-200 shadow-sm
                                                            ${isChecked ? 'translate-x-3.5' : 'translate-x-0.5'}
                                                        `} 
                                                    />
                                                </button>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
             </div>
          </div>
      )}

      {activeTab === 'apresentacao' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
             <div className="p-6 border-b border-slate-100">
                 <h2 className="text-lg font-bold text-slate-800">Apresentação Pessoal</h2>
                 <p className="text-sm text-slate-500 mt-1">Registre as apresentações ou observações sobre cada participante.</p>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 font-semibold text-slate-500 uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4 w-1/4">COLABORADOR</th>
                            <th className="px-6 py-4 w-3/4">TEXTO DA APRESENTAÇÃO</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {vendedores.length === 0 ? (
                            <tr>
                                <td colSpan={2} className="px-6 py-8 text-center text-slate-400">
                                    Nenhum participante cadastrado nesta turma.
                                </td>
                            </tr>
                        ) : (
                            vendedores.map(v => (
                                <tr key={v.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 font-medium text-slate-900 align-top pt-5">{v.nome}</td>
                                    <td className="px-6 py-4">
                                        <textarea
                                            className="w-full h-24 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none text-slate-700 placeholder:text-slate-300"
                                            placeholder="Escreva aqui..."
                                            value={v.apresentacao || ''}
                                            onChange={(e) => handleApresentacaoChange(v.id, e.target.value)}
                                            onBlur={() => handleSaveApresentacao(v)}
                                        />
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
             </div>
          </div>
      )}

      {activeTab === 'fotos' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
             <div className="p-6 border-b border-slate-100">
                 <h2 className="text-lg font-bold text-slate-800">Controle de Fotos</h2>
                 <p className="text-sm text-slate-500 mt-1">Gerencie as fotos de lado a lado e entrega.</p>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 font-semibold text-slate-500 uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4">Colaborador</th>
                            {fotosColumns.map(col => (
                                <th key={col.key} className="px-6 py-4 text-center">{col.label}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {vendedores.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="px-6 py-8 text-center text-slate-400">
                                    Nenhum participante cadastrado nesta turma.
                                </td>
                            </tr>
                        ) : (
                            vendedores.map(v => (
                                <tr key={v.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 font-medium text-slate-900">{v.nome}</td>
                                    {fotosColumns.map(col => {
                                        const isChecked = v.fotos?.[col.key] || false;
                                        return (
                                            <td key={col.key} className="px-6 py-4 text-center">
                                                <button 
                                                    onClick={() => handleToggleFotos(v.id, col.key)}
                                                    className={`
                                                        relative inline-flex h-4 w-7 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                                                        ${isChecked ? 'bg-green-500' : 'bg-slate-200'}
                                                    `}
                                                >
                                                    <span 
                                                        className={`
                                                            inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-200 shadow-sm
                                                            ${isChecked ? 'translate-x-3.5' : 'translate-x-0.5'}
                                                        `} 
                                                    />
                                                </button>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
             </div>
          </div>
      )}

    {activeTab === 'lado_a_lado' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
             <div className="p-6 border-b border-slate-100">
                 <h2 className="text-lg font-bold text-slate-800">Lado a Lado - Supervisão</h2>
                 <p className="text-sm text-slate-500 mt-1">Acompanhamento dos colaboradores e seus respectivos supervisores.</p>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 font-semibold text-slate-500 uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4">COLABORADOR</th>
                            <th className="px-6 py-4">SUPERVISOR</th>
                            <th className="px-6 py-4">CONTATO SUPERVISOR</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {vendedores.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="px-6 py-8 text-center text-slate-400">
                                    Nenhum participante cadastrado nesta turma.
                                </td>
                            </tr>
                        ) : (
                            vendedores.map(v => {
                                const phone = getSupervisorPhone(v.supervisor);
                                return (
                                <tr key={v.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 font-medium text-slate-900">{v.nome}</td>
                                    <td className="px-6 py-4 text-slate-700">{v.supervisor || '-'}</td>
                                    <td className="px-6 py-4">
                                        {phone ? (
                                            <a 
                                                href={getWhatsAppLink(phone)} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium hover:underline bg-green-50 px-3 py-1 rounded-full border border-green-100 transition-colors"
                                            >
                                                <MessageCircle size={16} />
                                                {phone}
                                            </a>
                                        ) : (
                                            <span className="text-slate-300">-</span>
                                        )}
                                    </td>
                                </tr>
                                )
                            })
                        )}
                    </tbody>
                </table>
             </div>
          </div>
      )}

      {activeTab === 'presenca' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
             <div className="p-6 border-b border-slate-100">
                 <h2 className="text-lg font-bold text-slate-800">Controle de Presença</h2>
                 <p className="text-sm text-slate-500 mt-1">Gerencie a frequência dos colaboradores.</p>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 font-semibold text-slate-500 uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4">Colaborador</th>
                            {presencaColumns.map(col => (
                                <th key={col.key} className="px-6 py-4 text-center whitespace-nowrap">{col.label}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {vendedores.length === 0 ? (
                            <tr>
                                <td colSpan={presencaColumns.length + 1} className="px-6 py-8 text-center text-slate-400">
                                    Nenhum participante cadastrado nesta turma.
                                </td>
                            </tr>
                        ) : (
                            vendedores.map(v => (
                                <tr key={v.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">{v.nome}</td>
                                    {presencaColumns.map(col => {
                                        const isChecked = v.presenca?.[col.key] || false;
                                        return (
                                            <td key={col.key} className="px-6 py-4 text-center">
                                                <button 
                                                    onClick={() => handleTogglePresenca(v.id, col.key)}
                                                    className={`
                                                        relative inline-flex h-4 w-7 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                                                        ${isChecked ? 'bg-green-500' : 'bg-slate-200'}
                                                    `}
                                                >
                                                    <span 
                                                        className={`
                                                            inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-200 shadow-sm
                                                            ${isChecked ? 'translate-x-3.5' : 'translate-x-0.5'}
                                                        `} 
                                                    />
                                                </button>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
             </div>
          </div>
      )}

      {activeTab === 'prova' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
             <div className="p-6 border-b border-slate-100">
                 <h2 className="text-lg font-bold text-slate-800">Notas de Prova</h2>
                 <p className="text-sm text-slate-500 mt-1">Registre a nota da prova final (max. 3 dígitos).</p>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 font-semibold text-slate-500 uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4 w-1/3">COLABORADOR</th>
                            <th className="px-6 py-4">NOTA</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {vendedores.length === 0 ? (
                            <tr>
                                <td colSpan={2} className="px-6 py-8 text-center text-slate-400">
                                    Nenhum participante cadastrado nesta turma.
                                </td>
                            </tr>
                        ) : (
                            vendedores.map(v => (
                                <tr key={v.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 font-medium text-slate-900 pt-3.5">{v.nome}</td>
                                    <td className="px-6 py-4">
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={3}
                                            placeholder="000"
                                            className="w-24 px-3 py-1.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-center font-medium text-slate-700 placeholder:text-slate-300"
                                            value={v.prova || ''}
                                            onChange={(e) => handleProvaChange(v.id, e.target.value)}
                                            onBlur={() => handleSaveProva(v)}
                                        />
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
             </div>
          </div>
      )}

      {activeTab !== 'cadastro' && activeTab !== 'acessos' && activeTab !== 'apresentacao' && activeTab !== 'fotos' && activeTab !== 'lado_a_lado' && activeTab !== 'presenca' && activeTab !== 'prova' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 text-center min-h-[400px] flex flex-col items-center justify-center animate-in fade-in zoom-in duration-200">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
                    <Sparkles size={32} />
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-1">{tabs.find(t => t.id === activeTab)?.label}</h3>
                <p className="text-slate-500">Funcionalidade em desenvolvimento.</p>
          </div>
      )}
      </div>

      <ParticipantModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveParticipant}
        initialData={editingVendedor}
        turmaId={turma.id}
      />
    </div>
  );
};

export default ClassDetails;
