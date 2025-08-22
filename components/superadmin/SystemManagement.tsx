
import React, { useState } from 'react';
import { AuditLogEntry } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { History, DatabaseZap, HeartPulse, FileDown, FileUp, CheckCircle, AlertTriangle, LoaderCircle } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

// Audit Log Component
const AuditLog: React.FC<{ logEntries: AuditLogEntry[] }> = ({ logEntries }) => {
    return (
        <Card className="p-5">
            <h3 className="font-bold text-lg text-slate-200 mb-4">Harakatlar Jurnali</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {logEntries.length > 0 ? logEntries.map(entry => (
                    <div key={entry.id} className="text-sm p-3 bg-slate-800/50 rounded-lg">
                        <p className="text-slate-300">{entry.action}</p>
                        <p className="text-xs text-slate-500 mt-1">{new Date(entry.timestamp).toLocaleString('uz-UZ')}</p>
                    </div>
                )) : <p className="text-slate-500 text-center py-4">Jurnal bo'sh.</p>}
            </div>
        </Card>
    );
};

// Backup & Restore Component
const BackupRestore: React.FC<{ onLogAction: (action: string) => void }> = ({ onLogAction }) => {
    const handleBackup = () => {
        try {
            const backupData: { [key: string]: any } = {};
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('ai-print-')) {
                    backupData[key] = localStorage.getItem(key);
                }
            }
            const dataStr = JSON.stringify(backupData, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
            const exportFileDefaultName = `ai-print-backup-${new Date().toISOString().slice(0, 10)}.json`;
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
            onLogAction('System data backup created.');
        } catch (e) {
            alert("Zaxira nusxasi yaratishda xatolik: " + (e instanceof Error ? e.message : 'Noma\'lum xato'));
        }
    };

    const handleRestore = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!window.confirm("DIQQAT! Bu amal tizimdagi BARCHA joriy ma'lumotlarni fayldagi ma'lumotlar bilan almashtiradi. Bu o'zgarishni orqaga qaytarib bo'lmaydi. Davom etishga ishonchingiz komilmi?")) {
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result;
                if (typeof text !== 'string') throw new Error("Faylni o'qib bo'lmadi.");
                const restoredData = JSON.parse(text);

                // Clear existing data before restoring
                Object.keys(localStorage).forEach(key => {
                    if (key.startsWith('ai-print-')) {
                        localStorage.removeItem(key);
                    }
                });

                // Set new data
                Object.keys(restoredData).forEach(key => {
                    localStorage.setItem(key, restoredData[key]);
                });

                alert("Ma'lumotlar muvaffaqiyatli tiklandi. O'zgarishlar kuchga kirishi uchun sahifani qayta yuklang.");
                onLogAction('System data restored from backup.');
                // window.location.reload(); // Force reload
            } catch (error) {
                alert(`Tiklashda xatolik: ${error instanceof Error ? error.message : 'Noma\'lum xato'}`);
            }
        };
        reader.readAsText(file);
    };

    return (
        <Card className="p-5">
            <h3 className="font-bold text-lg text-slate-200 mb-4">Zaxira Nusxalash va Tiklash</h3>
            <p className="text-sm text-slate-400 mb-4">Tizimdagi barcha ma'lumotlarni (foydalanuvchilar, buyurtmalar, narxlar va h.k.) JSON fayl sifatida saqlang yoki avval saqlangan nusxadan tiklang.</p>
            <div className="flex gap-4">
                <Button onClick={handleBackup} variant="secondary" className="w-full">
                    <FileDown className="h-4 w-4 mr-2"/> Zaxira nusxasini yuklab olish
                </Button>
                <Button onClick={() => document.getElementById('restore-input')?.click()} variant="secondary" className="w-full border-dashed border-cyan-400/50 text-cyan-400 hover:bg-cyan-500/10">
                     <FileUp className="h-4 w-4 mr-2"/> Zaxira nusxasini tiklash
                </Button>
                <input type="file" id="restore-input" className="hidden" accept=".json" onChange={handleRestore} />
            </div>
        </Card>
    );
};

// Health Check Component
const HealthCheck: React.FC<{ onLogAction: (action: string) => void }> = ({ onLogAction }) => {
    const [status, setStatus] = useState<'idle' | 'checking' | 'ok' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const runCheck = async () => {
        setStatus('checking');
        onLogAction('Health check initiated.');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            // A simple, low-cost request to check API connectivity
            await ai.models.generateContent({ model: "gemini-2.5-flash", contents: "test" });
            setStatus('ok');
            setMessage('Gemini API bilan ulanish muvaffaqiyatli.');
             onLogAction('Health check result: OK.');
        } catch (e) {
            setStatus('error');
            setMessage(`Gemini API bilan bog'lanishda xatolik: ${e instanceof Error ? e.message : 'Noma\'lum xato'}`);
            onLogAction(`Health check result: ERROR - ${e instanceof Error ? e.message : 'Unknown'}`);
        }
    };

    const StatusIcon = () => {
        switch (status) {
            case 'checking': return <LoaderCircle className="h-5 w-5 animate-spin text-yellow-400" />;
            case 'ok': return <CheckCircle className="h-5 w-5 text-green-400" />;
            case 'error': return <AlertTriangle className="h-5 w-5 text-red-400" />;
            default: return <HeartPulse className="h-5 w-5 text-slate-400" />;
        }
    };

    return (
        <Card className="p-5">
            <h3 className="font-bold text-lg text-slate-200 mb-4">Tizim Holatini Tekshirish</h3>
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                    <StatusIcon />
                    <div>
                        <p className="font-semibold text-slate-200">Gemini API Ulanishi</p>
                        {message && <p className="text-xs text-slate-400">{message}</p>}
                    </div>
                </div>
                <Button onClick={runCheck} disabled={status === 'checking'} variant="secondary" size="small">
                    Tekshirish
                </Button>
            </div>
        </Card>
    );
};


// Main System Management Component
const SystemManagement: React.FC<{
    auditLog: AuditLogEntry[];
    onLogAction: (action: string) => void;
}> = ({ auditLog, onLogAction }) => {
     const [activeTab, setActiveTab] = useState<'log' | 'backup' | 'health'>('log');

    return (
        <div className="animate-fade-in space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-100">Tizim Boshqaruvi</h1>
                <p className="text-slate-400 mt-1">Platforma jurnali, zaxira nusxalari va holatini boshqarish.</p>
            </div>
             <div className="bg-slate-800/50 rounded-lg p-1 flex gap-1">
                <button onClick={() => setActiveTab('log')} className={`w-full p-2 text-sm font-bold rounded-md transition-colors ${activeTab === 'log' ? 'bg-cyan-500/10 text-cyan-300' : 'text-slate-400 hover:bg-slate-700/50'}`}>
                    <History className="inline h-4 w-4 mr-2"/>Harakatlar Jurnali
                </button>
                <button onClick={() => setActiveTab('backup')} className={`w-full p-2 text-sm font-bold rounded-md transition-colors ${activeTab === 'backup' ? 'bg-cyan-500/10 text-cyan-300' : 'text-slate-400 hover:bg-slate-700/50'}`}>
                    <DatabaseZap className="inline h-4 w-4 mr-2"/>Zaxira Nusxalash
                </button>
                 <button onClick={() => setActiveTab('health')} className={`w-full p-2 text-sm font-bold rounded-md transition-colors ${activeTab === 'health' ? 'bg-cyan-500/10 text-cyan-300' : 'text-slate-400 hover:bg-slate-700/50'}`}>
                    <HeartPulse className="inline h-4 w-4 mr-2"/>Tizim Holati
                </button>
            </div>
            
            {activeTab === 'log' && <AuditLog logEntries={auditLog} />}
            {activeTab === 'backup' && <BackupRestore onLogAction={onLogAction} />}
            {activeTab === 'health' && <HealthCheck onLogAction={onLogAction} />}
        </div>
    );
};

export default SystemManagement;
