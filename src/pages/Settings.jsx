import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Settings as SettingsIcon, Layout, ShieldCheck } from 'lucide-react';
import { api } from '../lib/api';
import ReportFormatSettings from '../components/ReportFormatSettings';

const Settings = () => {
    const { tab } = useParams();
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const data = await api.getSettings();
            setSettings(data);
        } catch (err) {
            console.error(err);
            setError('Failed to load settings');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (updatedSettings) => {
        try {
            // Optimistic update
            setSettings(updatedSettings);
            await api.updateSettings(updatedSettings);
            // Could add a toast notification here
        } catch (err) {
            console.error('Failed to save settings', err);
            // Revert on failure would be ideal
        }
    };

    if (loading) return <div className="p-10 text-center">Loading settings...</div>;
    if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

    const activeTabTitle = {
        'report': 'Report Format',
        'general': 'General Settings',
        'security': 'Security Settings'
    }[tab] || 'Settings';

    return (
        <div className="max-w-7xl mx-auto pb-10 h-full flex flex-col space-y-6">
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <SettingsIcon className="w-8 h-8 text-gray-700" />
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{activeTabTitle}</h1>
                        <p className="text-gray-500 text-sm">Manage application preferences and report layouts</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex-1 overflow-hidden p-6">
                {tab === 'report' ? (
                    <ReportFormatSettings
                        settings={settings}
                        onUpdate={handleSave}
                    />
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                        <SettingsIcon className="w-12 h-12 mb-4 opacity-20" />
                        <p className="text-lg font-medium">Coming Soon</p>
                        <p className="text-sm">This module is under development.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Settings;
