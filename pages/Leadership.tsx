
import React, { useEffect, useState } from 'react';
import { getTurmas, getVendedores, saveVendedor, deleteVendedor } from '../services/storageService';
import { Turma, Vendedor } from '../types';
import { Users, Search, Plus, X, Save, MessageCircle, Edit2, Trash2 } from 'lucide-react';

// Modal for adding a new contact
interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Partial<Vendedor>) => void;
    turmas: Turma[];
    initialData?: Vendedor;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, onSave, turmas, initialData }) => {
    const [formData, setFormData] = useState({
        nome: '',
        turmaId: '',
        cargo: 'Supervisor(a)',
        telefone: '',
        email: '',
        regional: '',
        canal: 'VAREJO',
        cidade: ''
    });

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData({
                    nome: initialData.nome || '',
                    turmaId: initialData.turmaId || '',
                    cargo: initialData.cargo || 'Supervisor(a)',
                    telefone: initialData.telefone || '',
                    email: initialData.email || '',
                    regional: initialData.regional || '',
                    canal: initialData.canal || 'VAREJO',
                    cidade: initialData.cidade || ''
                });
            } else {
                setFormData({
                    nome: '',
                    turmaId: turmas.length > 0 ? turmas[0].id : '',
                    cargo: 'Supervisor(a)',
                    telefone: '',
                    email: '',
                    regional: '',
                    canal: 'VAREJO',
                    cidade: ''
                });
            }
        }
    }, [isOpen, turmas, initialData]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b border-slate-100 sticky top-0 bg-white">
                    <h3 className="text-xl font-bold text-slate-800">
                        {initialData ? 'Editar Contato' : 'Novo Contato'}
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X size={24} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Nome Completo</label>
                        <input 
                            required 
                            type="text" 
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.nome}
                            onChange={e => setFormData({...formData, nome: e.target.value})}
                        />
                    </div>
                    
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Cargo</label>
                        <select 
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                            value={formData.cargo}
                            onChange={e => setFormData({...formData, cargo: e.target.value})}
                        >
                            <option value="Supervisor(a)">Supervisor(a)</option>
                            <option value="Coordenador(a)">Coordenador(a)</option>
                            <option value="Gerente">Gerente</option>
                        </select>
                    </div>
                   
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Regional</label>
                            <input 
                                type="text" 
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.regional}
                                onChange={e => setFormData({...formData, regional: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Canal</label>
                            <select 
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                value={formData.canal}
                                onChange={e => setFormData({...formData, canal: e.target.value})}
                            >
                                <option value="VAREJO">VAREJO</option>
                                <option value="MDU">MDU</option>
                                <option value="SDU">SDU</option>
                                <option value="PME">PME</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Cidade</label>
                        <input 
                            type="text" 
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.cidade}
                            onChange={e => setFormData({...formData, cidade: e.target.value})}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Telefone</label>
                            <input 
                                type="tel" 
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.telefone}
                                onChange={e => setFormData({...formData, telefone: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Email</label>
                            <input 
                                type="email" 
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.email}
                                onChange={e => setFormData({...formData, email: e.target.value})}
                            />
                        </div>
                    </div>
                    
                    <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                            Cancelar
                        </button>
                        <button type="submit" className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                            <Save size={18} />
                            Salvar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Leadership: React.FC = () => {
  const [vendedores, setVendedores] = useState<(Vendedor & { turmaNome: string })[]>([]);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Vendedor | undefined>(undefined);

  const loadData = () => {
    const allTurmas = getTurmas();
    const allVendedores = getVendedores();
    setTurmas(allTurmas);
    
    // Join data
    const enriched = allVendedores.map(v => {
      const turma = allTurmas.find(t => t.id === v.turmaId);
      return {
        ...v,
        turmaNome: turma ? (turma.nome || `Turma ${turma.id}`) : 'Turma Removida'
      };
    });

    setVendedores(enriched);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenModal = (contact?: Vendedor) => {
    setEditingContact(contact);
    setIsModalOpen(true);
  };

  const handleSaveContact = (data: Partial<Vendedor>) => {
    let contactToSave: Vendedor;

    if (editingContact) {
        // Update existing
        contactToSave = {
            ...editingContact,
            ...data,
        } as Vendedor;
    } else {
        // Create new
        contactToSave = {
            id: Math.random().toString(36).substr(2, 9),
            turmaId: data.turmaId || '',
            nome: data.nome || '',
            cargo: data.cargo,
            telefone: data.telefone || '',
            email: data.email || '',
            regional: data.regional || '',
            canal: data.canal || 'VAREJO',
            cidade: data.cidade || '',
            // Fill required fields with defaults since this is a quick add
            matricula: '', usuario: '', idClaro: '', uf: '', supervisor: '', coordenador: '', gerente: '', dn: ''
        };
    }

    saveVendedor(contactToSave);
    loadData(); // Refresh list
  };

  const handleDeleteContact = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este contato?')) {
        deleteVendedor(id);
        loadData();
    }
  };

  const getWhatsAppLink = (phone: string) => {
    if (!phone) return '#';
    // Remove all non-numeric characters
    const cleanNumber = phone.replace(/\D/g, '');
    return `https://wa.me/55${cleanNumber}`;
  };

  const filtered = vendedores.filter(v => 
    v.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
            <h2 className="text-2xl font-bold text-slate-800">Contato das Lideranças</h2>
        </div>
        <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm shadow-blue-200"
        >
            <Plus size={20} />
            Novo Contato
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Search Input */}
        <div className="p-4 border-b border-slate-100">
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                    type="text"
                    placeholder="Buscar por nome..."
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
              <tr>
                <th className="px-6 py-4">Nome</th>
                <th className="px-6 py-4">Regional</th>
                <th className="px-6 py-4">Canal</th>
                <th className="px-6 py-4">Cargo</th>
                <th className="px-6 py-4">Cidade</th>
                <th className="px-6 py-4 text-center">Celular</th>
                <th className="px-6 py-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                 <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-slate-400">
                        {searchTerm ? 'Nenhum contato encontrado com este nome.' : 'Nenhum contato cadastrado.'}
                    </td>
                 </tr>
              ) : (
                filtered.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-xs shrink-0">
                             <Users size={14} />
                        </div>
                        {v.nome}
                    </td>
                    <td className="px-6 py-4">{v.regional || '-'}</td>
                    <td className="px-6 py-4">
                        <span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-blue-50 text-blue-700">
                            {v.canal || '-'}
                        </span>
                    </td>
                    <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium border bg-slate-50 text-slate-600 border-slate-200">
                            {v.cargo || '-'}
                        </span>
                    </td>
                    <td className="px-6 py-4">{v.cidade || '-'}</td>
                    <td className="px-6 py-4 text-center">
                        {v.telefone ? (
                            <a 
                                href={getWhatsAppLink(v.telefone)} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium hover:underline bg-green-50 px-3 py-1 rounded-full border border-green-100 transition-colors"
                            >
                                <MessageCircle size={16} />
                                {v.telefone}
                            </a>
                        ) : (
                            <span className="text-slate-300">-</span>
                        )}
                    </td>
                    <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                            <button 
                                onClick={() => handleOpenModal(v)}
                                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Editar"
                            >
                                <Edit2 size={18} />
                            </button>
                            <button 
                                onClick={() => handleDeleteContact(v.id)}
                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Excluir"
                            >
                                <Trash2 size={18} />
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

      <ContactModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveContact}
        turmas={turmas}
        initialData={editingContact}
      />
    </div>
  );
};

export default Leadership;
