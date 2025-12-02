import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Edit2, X, Save, User } from 'lucide-react';
import { Usuario } from '../types';
import { getUsers, saveUser, deleteUser, getCurrentUser } from '../services/authService';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Usuario) => void;
  initialData?: Usuario;
}

const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<Partial<Usuario>>({});

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({ ...initialData });
      } else {
        setFormData({ nome: '', email: '', senha: '' });
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.nome && formData.email && formData.senha) {
      onSave({
        id: initialData?.id || Math.random().toString(36).substr(2, 9),
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h3 className="text-xl font-bold text-slate-800">
            {initialData ? 'Editar Usuário' : 'Novo Usuário'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Nome</label>
            <input
              required
              type="text"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.nome || ''}
              onChange={e => setFormData({ ...formData, nome: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Email (Usuário)</label>
            <input
              required
              type="email"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.email || ''}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Senha</label>
            <input
              required={!initialData}
              type="text" // Visible for easy management as requested context implies simple admin
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.senha || ''}
              onChange={e => setFormData({ ...formData, senha: e.target.value })}
            />
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

const Settings: React.FC = () => {
  const [users, setUsers] = useState<Usuario[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Usuario | undefined>(undefined);
  const currentUser = getCurrentUser();

  const loadUsers = () => {
    setUsers(getUsers());
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSaveUser = (user: Usuario) => {
    saveUser(user);
    loadUsers();
  };

  const handleDeleteUser = (id: string) => {
    if (id === currentUser?.id) {
      alert("Você não pode excluir seu próprio usuário.");
      return;
    }
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      deleteUser(id);
      loadUsers();
    }
  };

  const openAddModal = () => {
    setEditingUser(undefined);
    setIsModalOpen(true);
  };

  const openEditModal = (user: Usuario) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Gerenciamento de Usuários</h2>
          <p className="text-slate-500 text-sm mt-1">Controle de acesso ao sistema</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm shadow-blue-200"
        >
          <Plus size={20} />
          Novo Usuário
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
              <tr>
                <th className="px-6 py-4">Usuário</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Senha</th>
                <th className="px-6 py-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs shrink-0">
                      <User size={14} />
                    </div>
                    {user.nome} {currentUser?.id === user.id && <span className="text-xs text-slate-400">(Você)</span>}
                  </td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4 font-mono text-slate-400">
                    {/* For security/UX in this demo, showing bullets, but modal shows real password */}
                    ••••••••
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => openEditModal(user)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={currentUser?.id === user.id}
                        className={`p-1.5 rounded-lg transition-colors ${
                          currentUser?.id === user.id 
                            ? 'text-slate-200 cursor-not-allowed' 
                            : 'text-slate-400 hover:text-red-600 hover:bg-red-50'
                        }`}
                        title="Excluir"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveUser}
        initialData={editingUser}
      />
    </div>
  );
};

export default Settings;
