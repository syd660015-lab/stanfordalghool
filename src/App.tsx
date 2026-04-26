/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AssessmentProvider, useAssessment } from './contexts/AssessmentContext';
import { signIn, signOut } from './lib/firebase';
import React, { useState, useRef } from 'react';
import { 
  ClipboardCheck, 
  Plus, 
  LogOut, 
  FileText, 
  LayoutDashboard, 
  User as UserIcon,
  ChevronRight,
  Save,
  BarChart3,
  Calendar,
  Scale,
  X,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';
import { SUBTESTS, SCORING_TABLES } from './constants';
import { AssessmentRecord, Patient } from './types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar } from 'recharts';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

function Login() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleSignIn = async () => {
    setIsLoggingIn(true);
    try {
      await signIn();
    } catch (error) {
      console.error('Login error:', error);
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-background flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white border border-zinc-200 p-12 max-w-md w-full rounded-3xl shadow-xl space-y-8"
      >
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-8 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-[0_20px_50px_rgba(79,70,229,0.3)] rotate-3">
            <ClipboardCheck className="w-10 h-10 text-white -rotate-3" />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-zinc-900 mb-2">
            ستانفورد بينيه 5
          </h1>
          <p className="text-zinc-500 font-bold">
            النظام الرقمي للتقييم والتشخيص
          </p>
        </div>
        
        <div className="space-y-4">
          <button 
            onClick={handleSignIn}
            disabled={isLoggingIn}
            className="w-full bg-zinc-900 text-white py-5 rounded-2xl font-black tracking-tight hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200 active:scale-[0.98] flex items-center justify-center gap-4 disabled:opacity-50"
          >
            {isLoggingIn ? (
              <div className="w-6 h-6 border-4 border-white/20 border-t-white animate-spin rounded-full" />
            ) : (
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
            )}
            {isLoggingIn ? 'جاري التحقق...' : 'دخول سريع وآمن عبر جوجل'}
          </button>
          <p className="text-[10px] text-center text-zinc-400 font-bold uppercase tracking-widest">
            يتم تسجيل الدخول تلقائياً في المرات القادمة
          </p>
        </div>
        
        <div className="pt-8 border-t border-zinc-100 flex items-center justify-center gap-2">
          <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">متصل بالنظام السحابي</span>
        </div>
      </motion.div>
    </div>
  );
}

function Sidebar({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) {
  const { user } = useAssessment();
  
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'لوحة التحكم' },
    { id: 'new', icon: Plus, label: 'سجل جديد' },
  ];

  return (
    <aside className="w-64 bg-white text-zinc-900 flex flex-col border-r border-zinc-200">
      <div className="p-8">
        <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-zinc-900 to-zinc-500 bg-clip-text text-transparent">
          ستانفورد بينيه الرقمي
        </h2>
      </div>
      
      <nav className="flex-1 px-4 flex flex-col gap-2">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all ${
              activeTab === item.id 
                ? 'bg-cream-surface text-indigo-600 shadow-sm' 
                : 'text-zinc-500 hover:text-zinc-900 hover:bg-cream-background'
            }`}
          >
            <item.icon size={18} className={activeTab === item.id ? 'text-indigo-600' : ''} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-zinc-100">
        <div className="flex items-center gap-3 px-2 py-4 mb-2 bg-cream-background rounded-2xl border border-zinc-200">
          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center overflow-hidden font-bold">
            {user?.photoURL ? <img src={user.photoURL} alt="" /> : (user?.displayName?.[0] || 'A')}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-zinc-900 truncate">{user?.displayName || 'الفاحص'}</p>
            <p className="text-[10px] text-zinc-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button 
          onClick={signOut}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-zinc-500 hover:text-red-600 transition-colors"
        >
          <LogOut size={18} />
          تسجيل الخروج
        </button>
      </div>
    </aside>
  );
}

function SubtestItemEntry({ subtestId, onUpdate }: { subtestId: string, onUpdate: (raw: number, items: Record<number, number>) => void }) {
  const { activeAssessment } = useAssessment();
  const subtest = SUBTESTS.find(s => s.id === subtestId);
  const responses = activeAssessment?.itemResponses[subtestId] || {};

  if (!subtest) return null;

  const handleScoreChange = (itemId: number, score: number) => {
    const newResponses = { ...responses, [itemId]: score };
    const rawScore = Object.values(newResponses).reduce((a, b) => (a as number) + (b as number), 0) as number;
    onUpdate(rawScore, newResponses);
  };

  const currentRaw = Object.values(responses).reduce((a, b) => (a as number) + (b as number), 0) as number;
  const currentStandard = SCORING_TABLES.subtestToStandard(currentRaw);

  const chartData = [
    { name: 'الدرجة الخام', value: currentRaw, max: subtest.items.length, color: '#4f46e5' },
    { name: 'الدرجة المعيارية', value: currentStandard, max: 20, color: '#18181b' }
  ];

  return (
    <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-lg">
      <div className="p-8 bg-cream-surface border-b border-zinc-200">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h4 className="text-lg font-bold text-zinc-900 tracking-tight">{subtest.name}</h4>
            <p className="text-xs font-medium text-zinc-500 mt-1">{subtest.arabicName}</p>
          </div>
          <div className="flex gap-4">
            <div className="text-center">
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">الخام</p>
              <div className="bg-indigo-600 px-6 py-2 rounded-2xl text-2xl font-black text-white shadow-lg shadow-indigo-200">
                {currentRaw}
              </div>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">المعياري</p>
              <div className="bg-zinc-900 px-6 py-2 rounded-2xl text-2xl font-black text-white shadow-lg shadow-zinc-200">
                {currentStandard}
              </div>
            </div>
          </div>
        </div>

        <div className="h-32 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ left: 100, right: 30, top: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f1ee" />
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                tick={{ fontSize: 12, fontWeight: 700, fill: '#71717a' }}
                width={100}
              />
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                {chartData.map((entry, index) => (
                  <Bar key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-px bg-zinc-200">
        {subtest.items.map(item => (
          <div key={item.id} className="bg-white p-4 flex flex-col items-center gap-3 group hover:bg-cream-background transition-colors">
            <span className="text-[10px] font-bold text-zinc-400 tracking-widest">{item.id}</span>
            <div className="flex gap-2">
              {[0, 1].map(score => (
                <button
                  key={score}
                  onClick={() => handleScoreChange(item.id, score)}
                  className={`w-9 h-9 rounded-xl font-bold text-sm transition-all active:scale-90 ${
                    responses[item.id] === score 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'bg-cream-surface text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200'
                  }`}
                >
                  {score}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ComparisonView({ selectedIds, onBack }: { selectedIds: string[], onBack: () => void }) {
  const { assessments } = useAssessment();
  const selectedAssessments = assessments.filter(a => selectedIds.includes(a.id));

  const factors = [
    { key: 'fluidReasoning', label: 'الاستدلال التحليلي' },
    { key: 'knowledge', label: 'المعلومات' },
    { key: 'quantitative', label: 'الاستدلال الكمي' },
    { key: 'visualSpatial', label: 'بصري مكاني' },
    { key: 'workingMemory', label: 'ذاكرة عاملة' },
  ];

  return (
    <div className="p-10 max-w-7xl mx-auto">
      <header className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-6">
          <button 
            onClick={onBack}
            className="w-12 h-12 bg-white border border-zinc-200 rounded-2xl flex items-center justify-center hover:bg-cream-surface transition-colors text-zinc-400 hover:text-zinc-900 shadow-sm"
          >
            <ChevronRight className="rotate-180" size={24} />
          </button>
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900">مقارنة السجلات</h1>
            <p className="text-zinc-500 font-medium mt-1">مقارنة جنبًا إلى جنب لـ {selectedAssessments.length} سجلات</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {selectedAssessments.map(a => (
          <motion.div 
            key={a.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-xl"
          >
            <div className="mb-8 pb-8 border-b border-zinc-100">
              <h3 className="text-2xl font-bold text-zinc-900 mb-2">{a.patient.name}</h3>
              <p className="text-zinc-500 text-sm">{a.patient.testDate} • {a.patient.gender === 'male' ? 'ذكر' : 'أنثى'}</p>
            </div>

            <div className="space-y-10">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-indigo-600 p-6 rounded-2xl text-white">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">الذكاء الكلي</p>
                  <p className="text-3xl font-black">{a.scores.fullScale.iq}</p>
                </div>
                <div className="bg-zinc-900 p-6 rounded-2xl text-white">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">اللفظي / غير اللفظي</p>
                  <p className="text-2xl font-black">{a.scores.verbal.iq} / {a.scores.nonverbal.iq}</p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-6">تحليل العوامل (معياري)</h4>
                <div className="space-y-6">
                  {factors.map(f => (
                    <div key={f.key}>
                      <div className="flex justify-between text-sm font-bold mb-2">
                        <span className="text-zinc-500">{f.label}</span>
                        <span className="text-zinc-900">
                          {a.scores.verbal[f.key as keyof typeof a.scores.verbal]} (L) • {a.scores.nonverbal[f.key as keyof typeof a.scores.nonverbal]} (NL)
                        </span>
                      </div>
                      <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-indigo-600 rounded-full" 
                          style={{ width: `${(((a.scores.verbal[f.key as keyof typeof a.scores.verbal] as number) + (a.scores.nonverbal[f.key as keyof typeof a.scores.nonverbal] as number)) / 40) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Dashboard() {
  const { assessments, setActiveAssessmentById } = useAssessment();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [viewState, setViewState] = useState<'list' | 'compare'>('list');

  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  if (viewState === 'compare') {
    return <ComparisonView selectedIds={selectedIds} onBack={() => setViewState('list')} />;
  }

  return (
    <div className="p-10 max-w-7xl mx-auto">
      <header className="flex justify-between items-center mb-10">
        <div className="flex flex-col gap-1">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900">السجلات الأخيرة</h1>
          <p className="text-zinc-500 font-medium">إدارة ومراجعة تقييمات المقياس الخاصة بك.</p>
        </div>
        <div className="flex gap-4">
          {selectedIds.length > 0 && (
            <motion.button 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => setViewState('compare')}
              disabled={selectedIds.length < 2}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all ${
                selectedIds.length >= 2 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700' 
                  : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
              }`}
            >
              <Scale size={18} />
              مقارنة ({selectedIds.length})
            </motion.button>
          )}
          <button 
            onClick={() => {
              setIsCompareMode(!isCompareMode);
              if (isCompareMode) setSelectedIds([]);
            }}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all ${
              isCompareMode 
                ? 'bg-zinc-900 text-white' 
                : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-cream-surface'
            }`}
          >
            {isCompareMode ? <X size={18} /> : <Scale size={18} />}
            {isCompareMode ? 'إلغاء التحديد' : 'تحديد للمقارنة'}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assessments.length === 0 ? (
          <div className="col-span-full bg-white border border-zinc-200 rounded-3xl p-12 text-center shadow-sm">
            <p className="text-zinc-500 font-medium italic">لم يتم العثور على سجلات تقييم.</p>
          </div>
        ) : (
          assessments.map(a => (
            <motion.div 
              key={a.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => isCompareMode ? null : setActiveAssessmentById(a.id)}
              className={`relative bg-white border rounded-3xl p-6 transition-all shadow-sm ${
                isCompareMode ? 'cursor-default' : 'cursor-pointer hover:shadow-md'
              } ${
                selectedIds.includes(a.id) ? 'border-indigo-600 ring-2 ring-indigo-600/10' : 'border-zinc-200'
              }`}
            >
              {isCompareMode && (
                <button 
                  onClick={(e) => toggleSelect(a.id, e)}
                  className={`absolute top-6 left-6 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                    selectedIds.includes(a.id) 
                      ? 'bg-indigo-600 border-indigo-600 text-white' 
                      : 'border-zinc-200 text-transparent hover:border-zinc-300'
                  }`}
                >
                  <Plus size={16} className={selectedIds.includes(a.id) ? 'rotate-45' : ''} />
                </button>
              )}

              <div className="flex justify-between items-start mb-6">
                <span className="bg-indigo-50 text-indigo-600 text-xs font-bold px-3 py-1 rounded-full border border-indigo-100 uppercase tracking-widest">
                  سجل
                </span>
                {!isCompareMode && <ChevronRight className="text-zinc-300 group-hover:text-zinc-900 transition-colors" />}
              </div>
              
              <h3 className="text-2xl font-bold text-zinc-900 mb-2">{a.patient.name}</h3>
              
              <div className="flex flex-col gap-1 mb-6">
                <div className="flex items-center gap-2 text-zinc-500 text-sm">
                  <UserIcon size={14} />
                  <span>{a.patient.gender === 'male' ? 'ذكر' : 'أنثى'} • الصف {a.patient.grade}</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-500 text-sm">
                  <Calendar size={14} />
                  <span>{a.patient.testDate}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-zinc-100">
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">ذكاء كلي</p>
                  <p className="text-2xl font-black text-zinc-900">{a.scores.fullScale.iq || '--'}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">مجموع العوامل</p>
                  <p className="text-xl font-bold text-zinc-500">{a.scores.fullScale.sum || '--'}</p>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

function AssessmentEditor() {
  const { activeAssessment, updateAssessment, setActiveAssessmentById } = useAssessment();
  const [activeSubTab, setActiveSubTab] = useState('summary');
  const [showConfirm, setShowConfirm] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  if (!activeAssessment) return <Dashboard />;

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`تفريغ_ستانفورد_بينيه_${activeAssessment.patient.name}.pdf`);
    } catch (err) {
      console.error('PDF Error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    setShowConfirm(true);
  };

  const confirmSave = async () => {
    // In a real app, we might mark as 'finalized'
    setShowConfirm(false);
    setActiveAssessmentById('');
  };

  const chartData = [
    { factor: 'استدلال تحليلي', verbal: activeAssessment.scores.verbal.fluidReasoning, nonverbal: activeAssessment.scores.nonverbal.fluidReasoning, full: 10 },
    { factor: 'معلومات', verbal: activeAssessment.scores.verbal.knowledge, nonverbal: activeAssessment.scores.nonverbal.knowledge, full: 10 },
    { factor: 'استدلال كمي', verbal: activeAssessment.scores.verbal.quantitative, nonverbal: activeAssessment.scores.nonverbal.quantitative, full: 10 },
    { factor: 'بصري مكاني', verbal: activeAssessment.scores.verbal.visualSpatial, nonverbal: activeAssessment.scores.nonverbal.visualSpatial, full: 10 },
    { factor: 'ذاكرة عاملة', verbal: activeAssessment.scores.verbal.workingMemory, nonverbal: activeAssessment.scores.nonverbal.workingMemory, full: 10 },
  ];

  return (
    <div className="p-10 max-w-7xl mx-auto">
      <header className="flex justify-between items-end mb-10">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setActiveAssessmentById('')}
            className="w-12 h-12 bg-white border border-zinc-200 rounded-2xl flex items-center justify-center hover:bg-cream-surface transition-colors text-zinc-400 hover:text-zinc-900 shadow-sm"
          >
            <ChevronRight className="rotate-180" size={24} />
          </button>
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900">{activeAssessment.patient.name}</h1>
            <p className="text-zinc-500 font-medium tracking-tight mt-1">
              بروتوكول التقييم • معرف السجل: {activeAssessment.id.slice(0, 8)}
            </p>
          </div>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={handleDownloadPDF}
            disabled={isGenerating}
            className="bg-white border border-zinc-200 text-zinc-600 px-6 py-3 rounded-2xl font-bold tracking-tight flex items-center gap-3 hover:bg-cream-surface transition-all shadow-sm active:scale-95 disabled:opacity-50"
          >
            {isGenerating ? <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent animate-spin rounded-full" /> : <Download size={20} />}
            {isGenerating ? 'جاري التحميل...' : 'تحميل تقرير PDF'}
          </button>
          
          <button 
            onClick={handleSave}
            className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold tracking-tight flex items-center gap-3 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95"
          >
            <Save size={20} />
            اعتماد البروتوكول
          </button>
        </div>
      </header>

      <AssessmentReportTemplate assessment={activeAssessment} reportRef={reportRef} />

      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl p-10 max-w-sm w-full shadow-2xl border border-zinc-200"
            >
              <h3 className="text-2xl font-bold text-zinc-900 mb-4">هل أنت متأكد؟</h3>
              <p className="text-zinc-500 font-medium mb-8">سيتم اعتماد هذا البروتوكول وحفظ جميع التغييرات بشكل نهائي. تأكد من مراجعة جميع الدرجات.</p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={confirmSave}
                  className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all"
                >
                  نعم، اعتماد وحفظ
                </button>
                <button 
                  onClick={() => setShowConfirm(false)}
                  className="w-full py-4 text-zinc-500 font-bold hover:text-zinc-900 transition-all"
                >
                  إلغاء المراجعة
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex gap-2 mb-10 bg-zinc-100 p-1.5 rounded-2xl border border-zinc-200 w-fit shadow-inner">
        {[
          { id: 'summary', label: 'الملخص' },
          { id: 'verbal', label: 'اللفظي' },
          { id: 'nonverbal', label: 'غير اللفظي' },
          { id: 'observations', label: 'الملاحظات السلوكية' },
          { id: 'qualitative', label: 'الملاحظات الكيفية' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`px-8 py-3 rounded-xl font-bold text-sm transition-all ${
              activeSubTab === tab.id 
                ? 'bg-white text-indigo-600 shadow-md border border-zinc-200' 
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeSubTab}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          className="grid grid-cols-1 lg:grid-cols-4 grid-rows-auto gap-6"
        >
          {activeSubTab === 'summary' && (
            <>
              <div className="lg:col-span-2 bg-white border border-zinc-200 p-8 rounded-3xl shadow-xl">
                <h3 className="text-xl font-bold text-zinc-900 mb-8 flex items-center gap-3">
                  <span className="w-2 h-6 bg-indigo-600 rounded-full"></span>
                  رادار الدرجات
                </h3>
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                      <PolarGrid stroke="#f1f1ee" />
                      <PolarAngleAxis dataKey="factor" tick={{ fontSize: 12, fill: '#71717a', fontWeight: '800' }} />
                      <PolarRadiusAxis angle={30} domain={[0, 20]} stroke="#f1f1ee" />
                      <Radar name="اللفظي" dataKey="verbal" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.4} />
                      <Radar name="غير اللفظي" dataKey="nonverbal" stroke="#18181b" strokeWidth={3} fill="transparent" />
                      <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e4e4e7', borderRadius: '12px' }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="lg:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-indigo-600 rounded-3xl p-8 shadow-lg shadow-indigo-100 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="bg-white/20 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">مركب</span>
                    <BarChart3 className="text-white/40" />
                  </div>
                  <div>
                    <h3 className="text-white text-lg font-bold">نسبة الذكاء الكلية</h3>
                    <p className="text-6xl font-black text-white mt-2 leading-none">{activeAssessment.scores.fullScale.iq || '--'}</p>
                  </div>
                </div>

                <div className="bg-white border border-zinc-200 rounded-3xl p-8 flex flex-col justify-between shadow-sm">
                  <div className="flex justify-between items-start">
                    <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-3 py-1 rounded-full border border-emerald-100 uppercase tracking-widest">نشط</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest">اللفظي</p>
                      <p className="text-3xl font-black text-zinc-900">{activeAssessment.scores.verbal.iq || '--'}</p>
                    </div>
                    <div>
                      <p className="text-zinc-400 text-[10px] font-black uppercase tracking-widest">غير اللفظي</p>
                      <p className="text-3xl font-black text-zinc-900">{activeAssessment.scores.nonverbal.iq || '--'}</p>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm">
                  <h3 className="text-xl font-bold text-zinc-900 mb-6">تحليل العوامل</h3>
                  <div className="space-y-6">
                    {[
                      { label: 'الاستدلال التحليلي', v: activeAssessment.scores.verbal.fluidReasoning, nv: activeAssessment.scores.nonverbal.fluidReasoning },
                      { label: 'المعلومات', v: activeAssessment.scores.verbal.knowledge, nv: activeAssessment.scores.nonverbal.knowledge },
                      { label: 'الاستدلال الكمي', v: activeAssessment.scores.verbal.quantitative, nv: activeAssessment.scores.nonverbal.quantitative },
                      { label: 'المعالجة البصرية المكانية', v: activeAssessment.scores.verbal.visualSpatial, nv: activeAssessment.scores.nonverbal.visualSpatial },
                      { label: 'الذاكرة العاملة', v: activeAssessment.scores.verbal.workingMemory, nv: activeAssessment.scores.nonverbal.workingMemory },
                    ].map((field) => (
                      <div key={field.label}>
                        <div className="flex justify-between items-end mb-3">
                          <span className="text-zinc-500 text-sm font-bold">{field.label}</span>
                          <span className="text-zinc-900 text-sm font-black">{field.v} / {field.nv}</span>
                        </div>
                        <div className="h-2 bg-zinc-100 rounded-full overflow-hidden relative">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(field.nv / 20) * 100}%` }}
                            className="absolute inset-y-0 left-0 bg-zinc-900"
                          />
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(field.v / 20) * 100}%` }}
                            className="absolute inset-y-0 left-0 bg-indigo-600/60"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeSubTab === 'nonverbal' && (
            <div className="lg:col-span-4 space-y-8">
              <SubtestItemEntry 
                subtestId="nv_fr" 
                onUpdate={(raw, items) => {
                  const standard = SCORING_TABLES.subtestToStandard(raw);
                  updateAssessment(activeAssessment.id, {
                    itemResponses: { ...activeAssessment.itemResponses, nv_fr: items },
                    scores: {
                      ...activeAssessment.scores,
                      nonverbal: {
                        ...activeAssessment.scores.nonverbal,
                        fluidReasoning: standard
                      }
                    }
                  });
                }}
              />
              <SubtestItemEntry 
                subtestId="nv_k" 
                onUpdate={(raw, items) => {
                  const standard = SCORING_TABLES.subtestToStandard(raw);
                  updateAssessment(activeAssessment.id, {
                    itemResponses: { ...activeAssessment.itemResponses, nv_k: items },
                    scores: {
                      ...activeAssessment.scores,
                      nonverbal: {
                        ...activeAssessment.scores.nonverbal,
                        knowledge: standard
                      }
                    }
                  });
                }}
              />
              <SubtestItemEntry 
                subtestId="nv_qr" 
                onUpdate={(raw, items) => {
                  const standard = SCORING_TABLES.subtestToStandard(raw);
                  updateAssessment(activeAssessment.id, {
                    itemResponses: { ...activeAssessment.itemResponses, nv_qr: items },
                    scores: {
                      ...activeAssessment.scores,
                      nonverbal: {
                        ...activeAssessment.scores.nonverbal,
                        quantitative: standard
                      }
                    }
                  });
                }}
              />
              <SubtestItemEntry 
                subtestId="nv_vs" 
                onUpdate={(raw, items) => {
                  const standard = SCORING_TABLES.subtestToStandard(raw);
                  updateAssessment(activeAssessment.id, {
                    itemResponses: { ...activeAssessment.itemResponses, nv_vs: items },
                    scores: {
                      ...activeAssessment.scores,
                      nonverbal: {
                        ...activeAssessment.scores.nonverbal,
                        visualSpatial: standard
                      }
                    }
                  });
                }}
              />
              <SubtestItemEntry 
                subtestId="nv_wm" 
                onUpdate={(raw, items) => {
                  const standard = SCORING_TABLES.subtestToStandard(raw);
                  updateAssessment(activeAssessment.id, {
                    itemResponses: { ...activeAssessment.itemResponses, nv_wm: items },
                    scores: {
                      ...activeAssessment.scores,
                      nonverbal: {
                        ...activeAssessment.scores.nonverbal,
                        workingMemory: standard
                      }
                    }
                  });
                }}
              />
            </div>
          )}

          {activeSubTab === 'verbal' && (
            <div className="lg:col-span-4 space-y-8">
              <SubtestItemEntry 
                subtestId="v_fr" 
                onUpdate={(raw, items) => {
                  const standard = SCORING_TABLES.subtestToStandard(raw);
                  updateAssessment(activeAssessment.id, {
                    itemResponses: { ...activeAssessment.itemResponses, v_fr: items },
                    scores: {
                      ...activeAssessment.scores,
                      verbal: {
                        ...activeAssessment.scores.verbal,
                        fluidReasoning: standard
                      }
                    }
                  });
                }}
              />
              <SubtestItemEntry 
                subtestId="v_k" 
                onUpdate={(raw, items) => {
                  const standard = SCORING_TABLES.subtestToStandard(raw);
                  updateAssessment(activeAssessment.id, {
                    itemResponses: { ...activeAssessment.itemResponses, v_k: items },
                    scores: {
                      ...activeAssessment.scores,
                      verbal: {
                        ...activeAssessment.scores.verbal,
                        knowledge: standard
                      }
                    }
                  });
                }}
              />
              <SubtestItemEntry 
                subtestId="v_qr" 
                onUpdate={(raw, items) => {
                  const standard = SCORING_TABLES.subtestToStandard(raw);
                  updateAssessment(activeAssessment.id, {
                    itemResponses: { ...activeAssessment.itemResponses, v_qr: items },
                    scores: {
                      ...activeAssessment.scores,
                      verbal: {
                        ...activeAssessment.scores.verbal,
                        quantitative: standard
                      }
                    }
                  });
                }}
              />
              <SubtestItemEntry 
                subtestId="v_vs" 
                onUpdate={(raw, items) => {
                  const standard = SCORING_TABLES.subtestToStandard(raw);
                  updateAssessment(activeAssessment.id, {
                    itemResponses: { ...activeAssessment.itemResponses, v_vs: items },
                    scores: {
                      ...activeAssessment.scores,
                      verbal: {
                        ...activeAssessment.scores.verbal,
                        visualSpatial: standard
                      }
                    }
                  });
                }}
              />
              <SubtestItemEntry 
                subtestId="v_wm" 
                onUpdate={(raw, items) => {
                  const standard = SCORING_TABLES.subtestToStandard(raw);
                  updateAssessment(activeAssessment.id, {
                    itemResponses: { ...activeAssessment.itemResponses, v_wm: items },
                    scores: {
                      ...activeAssessment.scores,
                      verbal: {
                        ...activeAssessment.scores.verbal,
                        workingMemory: standard
                      }
                    }
                  });
                }}
              />
            </div>
          )}

          {activeSubTab === 'qualitative' && (
             <div className="lg:col-span-4 bg-white border border-zinc-200 p-10 rounded-3xl shadow-xl">
                <h3 className="text-2xl font-bold text-zinc-900 mb-10">الملاحظات الكيفية والتحليل النوعي</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                  {[
                    { key: 'engagement', label: 'مستوى الاندماج والدافعية', placeholder: 'كيف كان تفاعل المفحوص مع المهام؟' },
                    { key: 'problemSolvingStyle', label: 'أسلوب حل المشكلات', placeholder: 'هل يتبع أسلوباً منظماً أم عشوائياً؟' },
                    { key: 'frustrationTolerance', label: 'تحمل الإحباط', placeholder: 'كيف يتعامل المفحوص مع المهام الصعبة؟' }
                  ].map(field => (
                    <div key={field.key} className="space-y-4">
                      <label className="block text-sm font-bold text-zinc-500">{field.label}</label>
                      <textarea 
                        className="w-full h-32 bg-cream-surface border border-zinc-200 rounded-2xl p-6 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all text-right"
                        defaultValue={activeAssessment.qualitativeObservations[field.key as keyof typeof activeAssessment.qualitativeObservations]}
                        placeholder={field.placeholder}
                        onChange={(e) => {
                          const newQual = { ...activeAssessment.qualitativeObservations, [field.key]: e.target.value };
                          updateAssessment(activeAssessment.id, { qualitativeObservations: newQual });
                        }}
                      />
                    </div>
                  ))}
                </div>
                
                <div className="mt-8">
                  <label className="block text-sm font-bold text-zinc-500 mb-4">ملاحظات إضافية حول عملية التقييم</label>
                  <textarea 
                    className="w-full h-48 bg-cream-surface border border-zinc-200 rounded-3xl p-8 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all placeholder:text-zinc-400 leading-relaxed text-right"
                    defaultValue={activeAssessment.qualitativeObservations.processNotes}
                    placeholder="توثيق أي عوامل تقنية أو بيئية أثرت على جودة النتائج..."
                    onChange={(e) => {
                      const newQual = { ...activeAssessment.qualitativeObservations, processNotes: e.target.value };
                      updateAssessment(activeAssessment.id, { qualitativeObservations: newQual });
                    }}
                  />
                </div>
             </div>
          )}

          {activeSubTab === 'observations' && (
             <div className="lg:col-span-4 bg-white border border-zinc-200 p-10 rounded-3xl shadow-xl">
                <h3 className="text-2xl font-bold text-zinc-900 mb-10">السجل السلوكي</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                  {[
                    { key: 'isLanguageFitting', label: 'ملاءمة اللغة' },
                    { key: 'understandsInstructions', label: 'فهم التعليمات' },
                    { key: 'visionFitting', label: 'حدة الإبصار' },
                    { key: 'motorFitting', label: 'المهارات الحركية' },
                    { key: 'healthFitting', label: 'الحالة الصحية' },
                    { key: 'cooperation', label: 'التعاون' },
                    { key: 'environmentFitting', label: 'البيئة' },
                    { key: 'isRepresentative', label: 'الأداء ممثل للقدرات' }
                  ].map(obs => (
                    <div key={obs.key} className="flex items-center justify-between p-6 bg-cream-surface rounded-2xl border border-zinc-100 hover:bg-zinc-100 transition-colors shadow-sm">
                        <span className="text-sm font-bold text-zinc-700 tracking-tight">{obs.label}</span>
                        <div className="flex gap-3">
                          <button 
                            onClick={() => {
                              const newObs = { ...activeAssessment.behavioralObservations, [obs.key]: true };
                              updateAssessment(activeAssessment.id, { behavioralObservations: newObs });
                            }}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all ${
                              activeAssessment.behavioralObservations[obs.key as keyof typeof activeAssessment.behavioralObservations] === true
                                ? 'bg-indigo-600 text-white shadow-md' 
                                : 'bg-white text-zinc-400 border border-zinc-200'
                            }`}
                          >
                            نعم
                          </button>
                          <button 
                            onClick={() => {
                              const newObs = { ...activeAssessment.behavioralObservations, [obs.key]: false };
                              updateAssessment(activeAssessment.id, { behavioralObservations: newObs });
                            }}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all ${
                              activeAssessment.behavioralObservations[obs.key as keyof typeof activeAssessment.behavioralObservations] === false
                                ? 'bg-red-600 text-white shadow-md' 
                                : 'bg-white text-zinc-400 border border-zinc-200'
                            }`}
                          >
                            لا
                          </button>
                        </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-12">
                  <label className="block text-sm font-bold text-zinc-500 mb-4">الملاحظات الكيفية والملحوظات العيادية</label>
                  <textarea 
                    className="w-full h-48 bg-cream-surface border border-zinc-200 rounded-3xl p-8 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all placeholder:text-zinc-400 leading-relaxed text-right"
                    defaultValue={activeAssessment.behavioralObservations.comments}
                    placeholder="قم بتوثيق السلوكيات الكيفية، أو أي خلل في بيئة الاختبار، أو مخاوف عيادية محددة..."
                    onChange={(e) => {
                      const newObs = { ...activeAssessment.behavioralObservations, comments: e.target.value };
                      updateAssessment(activeAssessment.id, { behavioralObservations: newObs });
                    }}
                  />
                </div>
             </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function CreateAssessmentForm({ onCancel }: { onCancel: () => void }) {
  const { createAssessment, setActiveAssessmentById } = useAssessment();
  const [formData, setFormData] = useState({
    name: '',
    gender: 'male' as 'male' | 'female',
    birthDate: '',
    testDate: format(new Date(), 'yyyy-MM-dd'),
    school: '',
    grade: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = await createAssessment(formData);
    if (id) setActiveAssessmentById(id);
  };

  const calculateAge = () => {
    if (!formData.birthDate || !formData.testDate) return null;
    const birth = new Date(formData.birthDate);
    const test = new Date(formData.testDate);
    if (isNaN(birth.getTime()) || isNaN(test.getTime())) return null;

    let years = test.getFullYear() - birth.getFullYear();
    let months = test.getMonth() - birth.getMonth();
    let days = test.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonthLastDay = new Date(test.getFullYear(), test.getMonth(), 0).getDate();
      days += prevMonthLastDay;
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    if (years < 0) return null;
    return { years, months, days };
  };

  const age = calculateAge();

  return (
    <div className="p-10 max-w-2xl mx-auto">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 mb-2">سجل جديد</h1>
        <p className="text-zinc-500 font-medium">بدء دورة تقييم جديدة.</p>
      </header>

      <form onSubmit={handleSubmit} className="bg-white border border-zinc-200 p-10 rounded-3xl shadow-xl space-y-8">
        <div className="space-y-2">
          <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest">اسم المفحوص</label>
          <input 
            required
            placeholder="أدخل الاسم الرباعي"
            className="w-full bg-cream-surface border border-zinc-100 rounded-2xl p-4 text-zinc-900 placeholder:text-zinc-400 focus:ring-2 focus:ring-indigo-600 outline-none transition-all text-right shadow-sm"
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest">الجنس</label>
            <select 
              className="w-full bg-cream-surface border border-zinc-100 rounded-2xl p-4 text-zinc-900 focus:ring-2 focus:ring-indigo-600 outline-none transition-all shadow-sm"
              value={formData.gender}
              onChange={e => setFormData({...formData, gender: e.target.value as 'male' | 'female'})}
            >
              <option value="male">ذكر</option>
              <option value="female">أنثى</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest">الصف / المستوى</label>
            <input 
              placeholder="مثال: الصف الرابع"
              className="w-full bg-cream-surface border border-zinc-100 rounded-2xl p-4 text-zinc-900 placeholder:text-zinc-400 focus:ring-2 focus:ring-indigo-600 outline-none transition-all text-right shadow-sm"
              value={formData.grade}
              onChange={e => setFormData({...formData, grade: e.target.value})}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
              <Calendar size={14} className="text-zinc-400" /> تاريخ الميلاد
            </label>
            <input 
              type="date"
              required
              className="w-full bg-cream-surface border border-zinc-100 rounded-2xl p-4 text-zinc-900 focus:ring-2 focus:ring-indigo-600 outline-none transition-all shadow-sm"
              value={formData.birthDate}
              onChange={e => setFormData({...formData, birthDate: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
              <Calendar size={14} className="text-zinc-400" /> تاريخ الاختبار
            </label>
            <input 
              type="date"
              required
              className="w-full bg-cream-surface border border-zinc-100 rounded-2xl p-4 text-zinc-900 focus:ring-2 focus:ring-indigo-600 outline-none transition-all shadow-sm"
              value={formData.testDate}
              onChange={e => setFormData({...formData, testDate: e.target.value})}
            />
          </div>
        </div>

        {age && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-indigo-50 border border-indigo-100 rounded-2xl flex justify-between items-center"
          >
            <span className="text-sm font-bold text-indigo-900">العمر عند الاختبار:</span>
            <div className="flex gap-4">
              <div className="text-center">
                <p className="text-[10px] font-black text-indigo-400 uppercase">سنة</p>
                <p className="text-xl font-black text-indigo-600">{age.years}</p>
              </div>
              <div className="text-center border-r border-indigo-100 pr-4">
                <p className="text-[10px] font-black text-indigo-400 uppercase">شهر</p>
                <p className="text-xl font-black text-indigo-600">{age.months}</p>
              </div>
              <div className="text-center border-r border-indigo-100 pr-4">
                <p className="text-[10px] font-black text-indigo-400 uppercase">يوم</p>
                <p className="text-xl font-black text-indigo-600">{age.days}</p>
              </div>
            </div>
          </motion.div>
        )}

        <div className="pt-6 flex flex-col gap-3">
          <button 
            type="submit"
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold tracking-tight hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-[0.98]"
          >
            إنشاء سجل
          </button>
          <button 
            type="button"
            onClick={onCancel}
            className="w-full py-4 text-zinc-500 font-bold hover:text-zinc-900 transition-colors"
          >
            إلغاء
          </button>
        </div>
      </form>
    </div>
  );
}

function MainApp() {
  const { user, loading, activeAssessment } = useAssessment();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (loading) return (
    <div className="min-h-screen bg-cream-background flex flex-col items-center justify-center">
      <div className="w-16 h-1 bg-indigo-600 animate-pulse mb-6 rounded-full" />
      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.4em]">جاري التشغيل</span>
    </div>
  );
  
  if (!user) return <Login />;

  return (
    <div className="min-h-screen bg-cream-background flex font-sans text-zinc-900">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeAssessment?.id || activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {activeAssessment ? (
              <AssessmentEditor />
            ) : activeTab === 'dashboard' ? (
              <Dashboard />
            ) : activeTab === 'new' ? (
              <CreateAssessmentForm onCancel={() => setActiveTab('dashboard')} />
            ) : null}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AssessmentProvider>
      <MainApp />
    </AssessmentProvider>
  );
}

function AssessmentReportTemplate({ assessment, reportRef }: { assessment: AssessmentRecord, reportRef: React.RefObject<HTMLDivElement | null> }) {
  if (!assessment) return null;

  return (
    <div className="fixed left-[-9999px] top-0">
      <div ref={reportRef} className="bg-white p-16 w-[1200px] text-zinc-900" dir="rtl">
        <div className="flex justify-between items-center pb-12 border-b-2 border-indigo-600 mb-12">
          <div>
            <h1 className="text-4xl font-black text-indigo-600 mb-2">تقرير مقياس ستانفورد بينيه (الصورة الخامسة)</h1>
            <p className="text-xl font-bold text-zinc-500">سجل التقييم والنتائج العيادية</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-black text-zinc-400 uppercase tracking-widest">تاريخ التقرير</p>
            <p className="text-2xl font-bold">{format(new Date(), 'yyyy/MM/dd')}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-12 mb-16">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold border-r-4 border-indigo-600 pr-4">بيانات المفحوص</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-black text-zinc-400 uppercase">الاسم</p>
                <p className="text-xl font-bold">{assessment.patient.name}</p>
              </div>
              <div>
                <p className="text-xs font-black text-zinc-400 uppercase">الجنس</p>
                <p className="text-xl font-bold">{assessment.patient.gender === 'male' ? 'ذكر' : 'أنثى'}</p>
              </div>
              <div>
                <p className="text-xs font-black text-zinc-400 uppercase">تاريخ الميلاد</p>
                <p className="text-xl font-bold">{assessment.patient.birthDate}</p>
              </div>
              <div>
                <p className="text-xs font-black text-zinc-400 uppercase">تاريخ الاختبار</p>
                <p className="text-xl font-bold">{assessment.patient.testDate}</p>
              </div>
            </div>
          </div>
          <div className="space-y-6 bg-cream-surface p-8 rounded-3xl">
            <h2 className="text-2xl font-bold">ملخص الذكاء الكلي</h2>
            <div className="flex items-end gap-4">
              <span className="text-6xl font-black text-indigo-600">{assessment.scores.fullScale.iq}</span>
              <span className="text-xl font-bold text-zinc-400 mb-2">درجة ذكاء كلية (IQ)</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-12 mb-16">
          <div className="space-y-8">
            <h2 className="text-2xl font-bold border-r-4 border-indigo-600 pr-4">درجات المركبات</h2>
            <div className="bg-zinc-50 p-8 rounded-3xl space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">المركب اللفظي</span>
                <span className="text-3xl font-black">{assessment.scores.verbal.iq}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">المركب غير اللفظي</span>
                <span className="text-3xl font-black">{assessment.scores.nonverbal.iq}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-8">
            <h2 className="text-2xl font-bold border-r-4 border-indigo-600 pr-4">تحليل العوامل</h2>
            <div className="space-y-4">
              {[
                { label: 'الاستدلال التحليلي', v: assessment.scores.verbal.fluidReasoning, nv: assessment.scores.nonverbal.fluidReasoning },
                { label: 'المعلومات', v: assessment.scores.verbal.knowledge, nv: assessment.scores.nonverbal.knowledge },
                { label: 'الاستدلال الكمي', v: assessment.scores.verbal.quantitative, nv: assessment.scores.nonverbal.quantitative },
                { label: 'المعالجة البصرية المكانية', v: assessment.scores.verbal.visualSpatial, nv: assessment.scores.nonverbal.visualSpatial },
                { label: 'الذاكرة العاملة', v: assessment.scores.verbal.workingMemory, nv: assessment.scores.nonverbal.workingMemory },
              ].map(f => (
                <div key={f.label} className="flex justify-between items-center p-4 bg-white border border-zinc-100 rounded-2xl">
                  <span className="font-bold">{f.label}</span>
                  <span className="font-black text-indigo-600">لفظي: {f.v} | غير لفظي: {f.nv}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-bold border-r-4 border-emerald-600 pr-4 mb-8">الملاحظات السلوكية والعيادية</h2>
          <div className="grid grid-cols-2 gap-8 mb-8">
             {[
               { label: 'ملاءمة اللغة', val: assessment.behavioralObservations.isLanguageFitting },
               { label: 'فهم التعليمات', val: assessment.behavioralObservations.understandsInstructions },
               { label: 'حدة الإبصار', val: assessment.behavioralObservations.visionFitting },
               { label: 'المهارات الحركية', val: assessment.behavioralObservations.motorFitting },
               { label: 'الحالة الصحية', val: assessment.behavioralObservations.healthFitting },
               { label: 'التعاون', val: assessment.behavioralObservations.cooperation },
               { label: 'البيئة', val: assessment.behavioralObservations.environmentFitting },
               { label: 'الأداء ممثل للقدرات', val: assessment.behavioralObservations.isRepresentative }
             ].map(obs => (
               <div key={obs.label} className="flex justify-between items-center p-4 bg-zinc-50 rounded-2xl">
                 <span className="font-bold">{obs.label}</span>
                 <span className={`px-4 py-1 rounded-full text-xs font-black ${obs.val ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                   {obs.val ? 'نعم' : 'لا'}
                 </span>
               </div>
             ))}
          </div>
          <div className="bg-cream-surface p-10 rounded-3xl mb-8">
             <p className="text-sm font-black text-zinc-400 uppercase mb-4">الملاحظات العيادية:</p>
             <p className="text-lg leading-relaxed whitespace-pre-wrap">{assessment.behavioralObservations.comments || 'لا يوجد ملاحظات إضافية.'}</p>
          </div>

          {assessment.qualitativeObservations && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold border-r-4 border-indigo-600 pr-4">التحليل النوعي والكيفي</h2>
              <div className="grid grid-cols-1 gap-6">
                {[
                  { label: 'مستوى الاندماج والدافعية', val: assessment.qualitativeObservations.engagement },
                  { label: 'أسلوب حل المشكلات', val: assessment.qualitativeObservations.problemSolvingStyle },
                  { label: 'تحمل الإحباط', val: assessment.qualitativeObservations.frustrationTolerance },
                  { label: 'ملاحظات العملية', val: assessment.qualitativeObservations.processNotes }
                ].map(q => q.val && (
                  <div key={q.label} className="bg-zinc-50 p-8 rounded-3xl border border-zinc-100">
                    <p className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-3">{q.label}</p>
                    <p className="text-lg leading-relaxed whitespace-pre-wrap">{q.val}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center pt-12 border-t border-zinc-100 mt-20">
          <p className="text-zinc-400 text-sm italic">تم توليد هذا التقرير آلياً عبر نظام ستانفورد بينيه الرقمي</p>
          <div className="text-right">
             <div className="w-48 h-px bg-zinc-200 mb-2"></div>
             <p className="text-sm font-bold text-zinc-500 uppercase">توقيع الفاحص</p>
          </div>
        </div>
      </div>
    </div>
  );
}
