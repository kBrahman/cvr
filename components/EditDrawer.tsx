
"use client";

import { useState, useEffect } from "react";
import { X, Save, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ResumeData {
    header: {
      name: string;
      title: string;
      contact: string;
      links?: { platform: string; url: string }[];
    };
    languages?: string[];
    summary: string;
    skills: string[];
    experience: {
      role: string;
      company: string;
      location?: string;
      period: string;
      achievements: string[];
    }[];
    education: {
      degree: string;
      school: string;
      location?: string;
      year: string;
      achievements?: string[]; // Made optional to fit standard
    }[];
    projects?: {
      name: string;
      description: string;
    }[];
    achievements?: {
      category?: string;
      items: string[];
    }[];
    publications?: {
      title: string;
      publisher: string;
      year?: string;
      link?: string;
    }[];
  }

interface EditDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  data: ResumeData;
  onUpdate: (data: ResumeData) => void;
}

export default function EditDrawer({ isOpen, onClose, data, onUpdate }: EditDrawerProps) {
  const [formData, setFormData] = useState<ResumeData>(data);

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleChange = (section: keyof ResumeData, value: any) => {
    const updated = { ...formData, [section]: value };
    setFormData(updated);
    onUpdate(updated); // Real-time update
  };
  
  const handleNestedChange = (section: keyof ResumeData, index: number, field: string, value: string) => {
    const updated = { ...formData };
    if (Array.isArray(updated[section])) {
         // @ts-ignore
        updated[section][index][field] = value;
        setFormData(updated);
        onUpdate(updated);
    }
  };

   const handleHeaderChange = (field: string, value: string) => {
    const updated = { ...formData, header: { ...formData.header, [field]: value } };
    setFormData(updated);
    onUpdate(updated); 
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-96 bg-zinc-900 border-l border-zinc-700 h-full overflow-y-auto custom-scrollbar shrink-0 z-20 shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.3)]"
          >
            <div className="p-6">
                <div className="flex items-center justify-between mb-8 sticky top-0 bg-zinc-900 z-10 py-4 border-b border-zinc-800">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <span className="w-2 h-8 bg-blue-500 rounded-full"/>
                        Edit
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-8 pb-40">
                    {/* Header Section */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500">Personal Info</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs text-zinc-400 mb-1 block">Full Name</label>
                                <input 
                                    value={formData.header.name}
                                    onChange={(e) => handleHeaderChange('name', e.target.value)}
                                    className="w-full bg-zinc-800 border-zinc-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-zinc-400 mb-1 block">Professional Title</label>
                                <input 
                                    value={formData.header.title}
                                    onChange={(e) => handleHeaderChange('title', e.target.value)}
                                    className="w-full bg-zinc-800 border-zinc-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                             <div>
                                <label className="text-xs text-zinc-400 mb-1 block">Contact Info</label>
                                <input 
                                    value={formData.header.contact}
                                    onChange={(e) => handleHeaderChange('contact', e.target.value)}
                                    className="w-full bg-zinc-800 border-zinc-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            </div>
                             {/* Social Links Editor */}
                             <div>
                                <label className="text-xs text-zinc-400 mb-2 block flex justify-between">
                                    Social Links
                                    <button 
                                        onClick={() => {
                                            const updated = { ...formData, header: { ...formData.header, links: [...(formData.header.links || []), { platform: '', url: '' }] } };
                                            setFormData(updated);
                                            onUpdate(updated);
                                        }}
                                        className="text-[10px] text-blue-400 hover:text-blue-300 uppercase font-bold"
                                    >
                                        + Add Link
                                    </button>
                                </label>
                                <div className="space-y-2">
                                    {formData.header.links?.map((link, i) => (
                                        <div key={i} className="flex gap-2">
                                            <input 
                                                value={link.url}
                                                onChange={(e) => {
                                                    const newLinks = [...(formData.header.links || [])];
                                                    newLinks[i] = { ...newLinks[i], url: e.target.value };
                                                    const updated = { ...formData, header: { ...formData.header, links: newLinks } };
                                                    setFormData(updated);
                                                    onUpdate(updated);
                                                }}
                                                placeholder="https://github.com/user"
                                                className="flex-1 bg-zinc-800 border-zinc-700 rounded px-2 py-1 text-xs text-white"
                                            />
                                             <button 
                                                onClick={() => {
                                                    const newLinks = [...(formData.header.links || [])];
                                                    newLinks.splice(i, 1);
                                                    const updated = { ...formData, header: { ...formData.header, links: newLinks } };
                                                    setFormData(updated);
                                                    onUpdate(updated);
                                                }}
                                                className="text-zinc-500 hover:text-red-400"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    {/* Summary */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500">Professional Summary</h3>
                        <textarea 
                            value={formData.summary}
                            onChange={(e) => handleChange('summary', e.target.value)}
                            rows={6}
                            className="w-full bg-zinc-800 border-zinc-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm leading-relaxed"
                        />
                    </div>

                    {/* Skills */}
                     <div className="space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500">Skills (Comma Separated)</h3>
                        <textarea 
                            value={formData.skills.join(", ")}
                            onChange={(e) => handleChange('skills', e.target.value.split(',').map(s => s.trim()))}
                            rows={3}
                            className="w-full bg-zinc-800 border-zinc-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        />
                    </div>

                     {/* Languages */}
                     <div className="space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500">Languages</h3>
                        <textarea 
                            value={formData.languages?.join(", ") || ""}
                            onChange={(e) => handleChange('languages', e.target.value.split(',').map(s => s.trim()))}
                            rows={2}
                            className="w-full bg-zinc-800 border-zinc-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                            placeholder="English, Spanish, French..."
                        />
                    </div>

                    {/* Experience (Simplified for Demo) */}
                    <div className="space-y-4">
                         <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 flex justify-between items-center">
                            Experience
                            <span className="text-xs text-zinc-600 font-normal normal-case">(Edit first 3 roles)</span>
                         </h3>
                         {formData.experience.map((exp, i) => (
                             <div key={i} className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-700 space-y-3">
                                 <div className="grid grid-cols-2 gap-2">
                                     <input 
                                        value={exp.role}
                                        onChange={(e) => handleNestedChange('experience', i, 'role', e.target.value)}
                                        className="bg-zinc-900 border-zinc-700 rounded px-2 py-1 text-sm text-white font-bold"
                                        placeholder="Role"
                                     />
                                      <input 
                                        value={exp.company}
                                        onChange={(e) => handleNestedChange('experience', i, 'company', e.target.value)}
                                        className="bg-zinc-900 border-zinc-700 rounded px-2 py-1 text-sm text-white"
                                        placeholder="Company"
                                     />
                                 </div>
                                 <div className="grid grid-cols-2 gap-2">
                                     <input 
                                         value={exp.location || ''}
                                         onChange={(e) => handleNestedChange('experience', i, 'location', e.target.value)}
                                         className="bg-zinc-900 border-zinc-700 rounded px-2 py-1 text-sm text-white"
                                         placeholder="Location (City, State)"
                                     />
                                     <input 
                                         value={exp.period || ''}
                                         onChange={(e) => handleNestedChange('experience', i, 'period', e.target.value)}
                                         className="w-full bg-zinc-900 border-zinc-700 rounded px-2 py-1 text-sm text-white"
                                         placeholder="Period (e.g., 2020 - Present)"
                                     />
                                 </div>
                                 <textarea 
                                     value={exp.achievements.join('\n')}
                                     onChange={(e) => {
                                         const newAch = e.target.value.split('\n');
                                         // Update achievements logic complex, simplified for now
                                          const updated = { ...formData };
                                          updated.experience[i].achievements = newAch;
                                          setFormData(updated);
                                          onUpdate(updated);
                                     }}
                                     rows={4}
                                     className="w-full bg-zinc-900 border-zinc-700 rounded px-2 py-1 text-sm text-zinc-300"
                                     placeholder="Achievements (one per line)"
                                 />
                             </div>
                         ))}
                    </div>

                    {/* Education */}
                     <div className="space-y-4">
                         <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 flex justify-between items-center">
                            Education
                         </h3>
                         {formData.education.map((edu, i) => (
                             <div key={i} className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-700 space-y-3">
                                 <div className="grid grid-cols-2 gap-2">
                                     <input 
                                        value={edu.degree}
                                        onChange={(e) => handleNestedChange('education', i, 'degree', e.target.value)}
                                        className="w-full bg-zinc-900 border-zinc-700 rounded px-2 py-1 text-sm text-white font-bold"
                                        placeholder="Degree"
                                     />
                                      <input 
                                        value={edu.school}
                                        onChange={(e) => handleNestedChange('education', i, 'school', e.target.value)}
                                        className="w-full bg-zinc-900 border-zinc-700 rounded px-2 py-1 text-sm text-white"
                                        placeholder="School"
                                     />
                                 </div>
                                 <div className="grid grid-cols-2 gap-2">
                                     <input 
                                         value={edu.location || ''}
                                         onChange={(e) => handleNestedChange('education', i, 'location', e.target.value)}
                                         className="w-full bg-zinc-900 border-zinc-700 rounded px-2 py-1 text-sm text-white"
                                         placeholder="Location"
                                     />
                                     <input 
                                         value={edu.year}
                                         onChange={(e) => handleNestedChange('education', i, 'year', e.target.value)}
                                         className="w-full bg-zinc-900 border-zinc-700 rounded px-2 py-1 text-sm text-white"
                                         placeholder="Year"
                                     />
                                 </div>
                             </div>
                         ))}
                    </div>

                    {/* Footer Tip */}
                    <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl flex gap-3 items-start">
                        <AlertCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                        <p className="text-xs text-blue-200">
                            Changes are applied automatically to the preview. Click the X button to close this drawer when you are done.
                        </p>
                    </div>

                </div>
            </div>
          </motion.div>
      )}
    </AnimatePresence>
  );
}
