
import React, { useState } from 'react';
import { User } from '../../types';
import Card from '../ui/Card';
import Input from '../ui/Input';
import { Search, UserCheck, UserX } from 'lucide-react';
import Button from '../ui/Button';

interface UserManagementProps {
    users: User[];
    onUpdateUser: (user: User) => void;
    onLogAction: (action: string) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ users, onUpdateUser, onLogAction }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phone.includes(searchQuery)
    );
    
    const toggleUserStatus = (user: User) => {
        const newStatus: 'active' | 'blocked' = user.status === 'active' ? 'blocked' : 'active';
        if(window.confirm(`Haqiqatan ham "${user.name}" foydalanuvchisini "${newStatus === 'active' ? 'faollashtirmoqchimisiz' : 'bloklamoqchimisiz'}"?`)) {
            const updatedUser = { ...user, status: newStatus };
            onUpdateUser(updatedUser);
            onLogAction(`User "${user.name}" (${user.phone}) status updated to ${newStatus}.`);
        }
    }

    return (
        <div className="animate-fade-in space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-100">Foydalanuvchilarni Boshqarish</h1>
                <p className="text-slate-400 mt-1">{users.length} ta foydalanuvchi mavjud.</p>
            </div>

            <Card className="p-4">
                <div className="relative">
                    <Input
                        label="Foydalanuvchi ismi yoki raqami bo'yicha qidirish"
                        id="user-search"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Qidiruv..."
                    />
                    <Search className="absolute top-10 right-3 h-5 w-5 text-slate-500" />
                </div>
            </Card>

            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-400">
                        <thead className="text-xs text-slate-300 uppercase bg-slate-800/70">
                            <tr>
                                <th scope="col" className="px-6 py-3">Ism-sharifi</th>
                                <th scope="col" className="px-6 py-3">Telefon Raqami</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3 text-right">Amallar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(user => (
                                <tr key={user.id} className="border-b border-slate-700/50 hover:bg-slate-800/40">
                                    <td className="px-6 py-4 font-medium text-slate-200 whitespace-nowrap">{user.name}</td>
                                    <td className="px-6 py-4">{user.phone}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${user.status === 'active' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                                            {user.status === 'active' ? 'Faol' : 'Bloklangan'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Button
                                            variant="secondary"
                                            size="small"
                                            onClick={() => toggleUserStatus(user)}
                                            className={user.status === 'active' ? 'border-red-500/50 text-red-400 hover:bg-red-500/10' : 'border-green-500/50 text-green-400 hover:bg-green-500/10'}
                                        >
                                            {user.status === 'active' ? 
                                            <><UserX className="h-4 w-4 mr-1.5" /> Bloklash</> : 
                                            <><UserCheck className="h-4 w-4 mr-1.5" /> Faollashtirish</>}
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredUsers.length === 0 && (
                     <p className="text-center py-8 text-slate-500">Foydalanuvchilar topilmadi.</p>
                )}
            </Card>
        </div>
    );
};

export default UserManagement;
