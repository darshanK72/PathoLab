import React, { useState, useEffect } from 'react';
import { ShieldAlert, Fingerprint, Key, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../../lib/api';

const Activation = ({ onActivated }) => {
    const [machineId, setMachineId] = useState('');
    const [licenseKey, setLicenseKey] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const loadMachineId = async () => {
            const id = await api.getMachineId();
            setMachineId(id);
        };
        loadMachineId();
    }, []);

    const handleActivate = async (e) => {
        e.preventDefault();
        if (!licenseKey.trim()) return;

        setLoading(true);
        setError('');

        try {
            const result = await api.verifyAndActivate(licenseKey);
            if (result.success) {
                setSuccess(true);
                setTimeout(() => {
                    onActivated();
                }, 2000);
            } else {
                setError(result.message || 'Invalid License Key');
            }
        } catch (err) {
            console.error(err);
            setError('System error during activation');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900 flex flex-col items-center justify-center p-4 selection:bg-blue-500/30 overflow-y-auto">
            <div className="max-w-xl w-full">
                {/* Header Section */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-3xl shadow-2xl shadow-blue-500/40 mb-6 animate-pulse">
                        <ShieldAlert className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tight mb-3">Product Activation</h1>
                    <p className="text-slate-400 max-w-sm mx-auto">
                        Please enter your unique license key to authorize this workstation for PathoLab Manager.
                    </p>
                </div>

                {/* Main Content */}
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-[2.5rem] border border-slate-700/50 overflow-hidden shadow-2xl">
                    <div className="p-10">
                        {success ? (
                            <div className="text-center py-10 space-y-4 animate-in fade-in zoom-in duration-500">
                                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-4">
                                    <CheckCircle2 className="w-12 h-12 text-green-500" />
                                </div>
                                <h2 className="text-2xl font-bold text-white">Activation Successful!</h2>
                                <p className="text-slate-400">Restarting system in few seconds...</p>
                            </div>
                        ) : (
                            <form onSubmit={handleActivate} className="space-y-8">
                                {/* Error Message */}
                                {error && (
                                    <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-sm animate-shake">
                                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                        <p className="font-medium">{error}</p>
                                    </div>
                                )}

                                {/* Machine ID Display */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between px-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                            <Fingerprint className="w-4 h-4 text-blue-500" /> Professional Hardware ID
                                        </label>
                                    </div>
                                    <div className="bg-slate-900/50 border border-slate-700 rounded-2xl p-4 flex items-center">
                                        <span className="font-mono text-sm text-blue-400 tracking-wider break-all leading-relaxed">
                                            {machineId || 'FINGERPRINTING_SYSTEM...'}
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-slate-500 italic px-1">
                                        * Give this ID to your administrator to generate a license key for this specific machine.
                                    </p>
                                </div>

                                {/* License Key Input */}
                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 px-1">
                                        <Key className="w-4 h-4 text-blue-500" /> Enter License Key
                                    </label>
                                    <div className="relative group">
                                        <input
                                            type="text"
                                            value={licenseKey}
                                            onChange={(e) => setLicenseKey(e.target.value.toUpperCase())}
                                            placeholder="XXXX-XXXX-XXXX-XXXX"
                                            className="w-full bg-slate-900/80 border border-slate-700 rounded-2xl px-6 py-5 text-xl font-mono text-white tracking-[0.2em] focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none placeholder:text-slate-700"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full group bg-blue-600 hover:bg-blue-700 text-white font-black text-lg py-5 rounded-2xl shadow-xl shadow-blue-600/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
                                >
                                    {loading ? (
                                        <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            Authorize System
                                            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {/* Footer Credits */}
                <div className="mt-8 text-center space-y-2">
                    <p className="text-slate-500 text-xs font-medium">PathoLab Enterprise Security v1.0.0</p>
                    <p className="text-slate-600 text-[10px]">Unauthorized use or duplication prohibited by international law.</p>
                </div>
            </div>
        </div>
    );
};

export default Activation;
