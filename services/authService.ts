import { Usuario } from '../types';

const USERS_KEY = 'app_users_v1';
const SESSION_KEY = 'app_session_v1';

export const seedUsers = () => {
  if (!localStorage.getItem(USERS_KEY)) {
    const defaultUser: Usuario = {
      id: '1',
      nome: 'Administrador',
      email: 'adrianoft.2013@gmail.com',
      senha: 'Isa2011*'
    };
    localStorage.setItem(USERS_KEY, JSON.stringify([defaultUser]));
  }
};

export const getUsers = (): Usuario[] => {
  seedUsers();
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveUser = (user: Usuario) => {
  const users = getUsers();
  const index = users.findIndex(u => u.id === user.id);
  
  if (index >= 0) {
    users[index] = user;
  } else {
    users.push(user);
  }
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const deleteUser = (id: string) => {
  const users = getUsers().filter(u => u.id !== id);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const login = (email: string, senha: string): boolean => {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.senha === senha);
  if (user) {
    // Store session without password for security
    const { senha, ...userSafe } = user;
    localStorage.setItem(SESSION_KEY, JSON.stringify(userSafe));
    return true;
  }
  return false;
};

export const logout = () => {
  localStorage.removeItem(SESSION_KEY);
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem(SESSION_KEY);
};

export const getCurrentUser = (): Usuario | null => {
  const data = localStorage.getItem(SESSION_KEY);
  return data ? JSON.parse(data) : null;
};
