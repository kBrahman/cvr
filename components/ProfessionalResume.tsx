
"use client";

import React, { useRef } from 'react';
import { ArrowRight, Edit } from "lucide-react";
import EditDrawer from './EditDrawer';
import PaymentModal from './payment/PaymentModal';

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
    links?: string[];
  }[];
  education: {
    degree: string;
    school: string;
    location?: string;
    year: string;
  }[];
  projects?: {
    name: string;
    description: string;
    link?: string;
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
  photo?: string;
  sectionOrder?: string[];
}

// Layout Configuration Types
type LayoutStyle = {
  id: string;
  name: string;
  type: 'single' | 'sidebar-left' | 'sidebar-right';
  colors: {
    primary: string;
    secondary: string;
    text: string;
    bg: string;
    sidebarBg?: string;
    sidebarText?: string;
  };
  font: string;
};

const LAYOUTS: LayoutStyle[] = [
  { 
    id: 'modern-slate', 
    name: 'Modern Slate', 
    type: 'sidebar-left', 
    colors: { primary: '#ffffff', secondary: '#94a3b8', text: '#334155', bg: '#ffffff', sidebarBg: '#334155', sidebarText: '#ffffff' },
    font: 'font-sans'
  },
  { 
    id: 'executive-classic', 
    name: 'Executive Classic', 
    type: 'single', 
    colors: { primary: '#1e3a8a', secondary: '#64748b', text: '#0f172a', bg: '#ffffff' },
    font: 'font-serif'
  },
  { 
    id: 'creative-mint', 
    name: 'Creative Mint', 
    type: 'sidebar-right', 
    colors: { primary: '#0f766e', secondary: '#0d9488', text: '#134e4a', bg: '#f0fdfa', sidebarBg: '#ccfbf1', sidebarText: '#115e59' },
    font: 'font-mono'
  },
  { 
    id: 'minimalist-gray', 
    name: 'Minimalist Gray', 
    type: 'single', 
    colors: { primary: '#111827', secondary: '#6b7280', text: '#374151', bg: '#f9fafb' },
    font: 'font-sans'
  },
  { 
    id: 'bold-impact', 
    name: 'Bold Impact', 
    type: 'single', 
    colors: { primary: '#000000', secondary: '#dc2626', text: '#000000', bg: '#ffffff' },
    font: 'font-sans'
  },
  { 
    id: 'corporate-blue', 
    name: 'Corporate Blue', 
    type: 'sidebar-left', 
    colors: { primary: '#ffffff', secondary: '#bfdbfe', text: '#1e3a8a', bg: '#ffffff', sidebarBg: '#1e40af', sidebarText: '#ffffff' },
    font: 'font-sans'
  },
  { 
    id: 'tech-modern', 
    name: 'Tech Modern', 
    type: 'sidebar-left', 
    colors: { primary: '#ffffff', secondary: '#a78bfa', text: '#4c1d95', bg: '#ffffff', sidebarBg: '#5b21b6', sidebarText: '#ffffff' },
    font: 'font-mono'
  },
  { 
    id: 'elegant-serif', 
    name: 'Elegant Serif', 
    type: 'sidebar-right', 
    colors: { primary: '#451a03', secondary: '#78350f', text: '#451a03', bg: '#fffbeb', sidebarBg: '#fef3c7', sidebarText: '#78350f' },
    font: 'font-serif'
  },
  { 
    id: 'swiss-design', 
    name: 'Swiss Design', 
    type: 'single', 
    colors: { primary: '#ef4444', secondary: '#000000', text: '#000000', bg: '#ffffff' },
    font: 'font-sans'
  },
];

interface ProfessionalResumeProps {
  data: ResumeData;
  onDownload: () => void;
}

const ResumeRenderer = ({ data, layout, onEdit, isEditable }: { data: ResumeData, layout: LayoutStyle, onEdit?: () => void, isEditable?: boolean }) => {
    // Helper helper to get RGBA from hex if needed, but for now we stick to hex or simple rgba strings for static whites
    // layout.colors are all HEX, so they are safe.
    
    const photoUrl = data.photo;

    // Helper to render sections to avoid duplication
    const renderSummary = () => (
        <section className="mb-6">
            <h2 className="text-sm font-bold uppercase tracking-widest border-b pb-1 mb-3" 
                style={{ color: layout.type.includes('sidebar') ? (layout.colors.sidebarBg ? layout.colors.text : layout.colors.primary) : layout.colors.primary, borderColor: layout.colors.secondary }}>
                Professional Summary
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: layout.colors.text }}>{data.summary}</p>
        </section>
    );

    const renderSkills = () => {
        const validSkills = data.skills?.filter(skill => skill && skill.trim().length > 0 && skill !== "Skill 1");
        if (!validSkills || validSkills.length === 0) return null;

        const isClassicLayout = ['executive-classic', 'elegant-serif'].includes(layout.id);

        return (
         <section className="mb-6">
            <h2 className="text-sm font-bold uppercase tracking-widest border-b pb-1 mb-3" 
                style={{ color: layout.type.includes('sidebar') ? (layout.colors.sidebarBg ? layout.colors.text : layout.colors.primary) : layout.colors.primary, borderColor: layout.colors.secondary }}>
                Skills
            </h2>
            {isClassicLayout ? (
                <div className="text-sm leading-relaxed font-medium" style={{ color: layout.colors.text }}>
                    {validSkills.join("  •  ")}
                </div>
            ) : (
                <div className="flex flex-wrap gap-2">
                    {validSkills.map((skill, i) => (
                        <span key={i} className="inline-block px-2 h-[22px] leading-[22px] rounded text-xs font-semibold uppercase opacity-90 align-middle tracking-wide" 
                              style={{ backgroundColor: layout.colors.secondary + '20', color: layout.colors.text }}>
                            {skill}
                        </span>
                    ))}
                </div>
            )}
        </section>
    )};

    const renderExperience = () => {
        const validExperience = data.experience?.filter(job => 
            job.company && 
            job.company.trim().length > 0 && 
            !job.company.includes("Company Name") &&
            !job.role.includes("Job Title")
        );

        if (!validExperience || validExperience.length === 0) return null;
        return (
        <section className="mb-6">
            <h2 className="text-sm font-bold uppercase tracking-widest border-b pb-1 mb-3" 
                style={{ color: layout.type.includes('sidebar') ? (layout.colors.sidebarBg ? layout.colors.text : layout.colors.primary) : layout.colors.primary, borderColor: layout.colors.secondary }}>
                Experience
            </h2>
            <div className="space-y-4">
                {validExperience.map((job, i) => (
                    <div key={i} className="page-break-avoid">
                        <div className="flex justify-between items-baseline mb-1">
                            <h3 className="font-bold" style={{ color: layout.colors.text }}>{job.role}</h3>
                            <span className="text-xs font-medium opacity-75" style={{ color: layout.colors.text }}>{job.period}</span>
                        </div>
                        <div className="text-sm font-medium mb-2 opacity-90" style={{ color: layout.colors.text }}>
                            {job.company}
                            {job.location && <span className="opacity-70 font-normal"> • {job.location}</span>}
                        </div>
                         <div className="space-y-1 ml-1">
                            {job.achievements?.map((ach, j) => (
                                <div key={j} className="flex items-start text-sm" style={{ color: layout.colors.text }}>
                                    <span className="mr-2 rounded-full flex-shrink-0" style={{ width: '5px', height: '5px', marginTop: '9px', backgroundColor: layout.colors.text, opacity: 0.7 }} />
                                    <span className="flex-1 opacity-90">{ach}</span>
                                </div>
                            ))}
                             {job.links && job.links.length > 0 && (
                                <div className="mt-2 text-[10px] opacity-80" style={{ color: layout.colors.text }}>
                                    {job.links.map((link, k) => (
                                        <div key={k} className="flex items-center gap-1 mb-1">
                                            <span className="font-semibold">Link:</span>
                                            <a href={link} target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-current to-current bg-[length:100%_1px] bg-no-repeat bg-bottom pb-[2px] break-all hover:opacity-75 no-underline" style={{ color: layout.type === 'sidebar-left' ? layout.colors.sidebarBg : layout.colors.primary }}>
                                                {link}
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )};

    const renderEducation = () => {
        const validEducation = data.education?.filter(edu => 
            edu.school && 
            edu.school.trim().length > 1 && 
            !edu.school.toLowerCase().includes("university name") && 
            !edu.school.toLowerCase().includes("information not provided") &&
            !edu.school.toLowerCase().includes("universlty") &&
            !edu.school.toLowerCase().includes("not provided")
        );

        if (!validEducation || validEducation.length === 0) return null;
        return (
        <section className="mb-6">
            <h2 className="text-sm font-bold uppercase tracking-widest border-b pb-1 mb-3" 
                style={{ color: layout.type.includes('sidebar') ? (layout.colors.sidebarBg ? layout.colors.text : layout.colors.primary) : layout.colors.primary, borderColor: layout.colors.secondary }}>
                Education
            </h2>
            <div className="space-y-4">
                {validEducation.map((edu, i) => (
                    <div key={i} className="flex justify-between items-baseline page-break-avoid">
                        <div>
                            <h3 className="font-bold" style={{ color: layout.colors.text }}>
                                {edu.school}
                                {edu.location && <span className="text-xs opacity-70 font-normal ml-2">({edu.location})</span>}
                            </h3>
                            <p className="text-sm opacity-90" style={{ color: layout.colors.text }}>{edu.degree}</p>
                        </div>
                        <span className="text-xs font-medium opacity-75" style={{ color: layout.colors.text }}>{edu.year}</span>
                    </div>
                ))}
            </div>
        </section>
    )};

    const renderProjects = () => {
        if (!data.projects || data.projects.length === 0) return null;
        return (
            <section className="mb-6">
                <h2 className="text-sm font-bold uppercase tracking-widest border-b pb-1 mb-3" 
                    style={{ color: layout.type.includes('sidebar') ? (layout.colors.sidebarBg ? layout.colors.text : layout.colors.primary) : layout.colors.primary, borderColor: layout.colors.secondary }}>
                    Projects
                </h2>
                <div className="space-y-4">
                    {data.projects.map((proj, i) => (
                        <div key={i} className="page-break-avoid">
                            <div className="flex justify-between items-baseline mb-1">
                                <h3 className="font-bold" style={{ color: layout.colors.text }}>{proj.name}</h3>
                            </div>
                            <p className="text-sm leading-relaxed opacity-90 mb-2" style={{ color: layout.colors.text }}>{proj.description}</p>
                            {proj.link && (
                                <div className="flex items-center gap-1 text-xs opacity-80">
                                    <span className="font-semibold" style={{ color: layout.colors.text }}>Link:</span>
                                    <a href={proj.link} target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-current to-current bg-[length:100%_1px] bg-no-repeat bg-bottom pb-[2px] break-all hover:opacity-75 no-underline" style={{ color: layout.type === 'sidebar-left' ? layout.colors.sidebarBg : layout.colors.primary }}>
                                        {proj.link}
                                    </a>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>
        );
    };

    const renderAchievements = () => {
        if (!data.achievements || data.achievements.length === 0) return null;
        return (
            <section className="mb-6">
                <h2 className="text-sm font-bold uppercase tracking-widest border-b pb-1 mb-3" 
                    style={{ color: layout.type.includes('sidebar') ? (layout.colors.sidebarBg ? layout.colors.text : layout.colors.primary) : layout.colors.primary, borderColor: layout.colors.secondary }}>
                    Achievements
                </h2>
                <div className="space-y-4">
                    {data.achievements.map((achGroup, i) => (
                        <div key={i} className="page-break-avoid">
                            {achGroup.category && (
                                <h3 className="font-bold text-sm mb-1" style={{ color: layout.colors.text }}>{achGroup.category}</h3>
                            )}
                            <div className="space-y-1 ml-1">
                                {achGroup.items.map((item, j) => (
                                    <div key={j} className="flex items-start text-sm" style={{ color: layout.colors.text }}>
                                        <span className="mr-2 rounded-full flex-shrink-0" style={{ width: '5px', height: '5px', marginTop: '9px', backgroundColor: layout.colors.text, opacity: 0.7 }} />
                                        <span className="flex-1 opacity-90">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        );
    };

    const renderPublications = () => {
        if (!data.publications || data.publications.length === 0) return null;
        return (
            <section className="mb-6">
                <h2 className="text-sm font-bold uppercase tracking-widest border-b pb-1 mb-3" 
                    style={{ color: layout.type.includes('sidebar') ? (layout.colors.sidebarBg ? layout.colors.text : layout.colors.primary) : layout.colors.primary, borderColor: layout.colors.secondary }}>
                    Selected Publications
                </h2>
                <div className="space-y-4">
                    {data.publications.map((pub, i) => (
                        <div key={i} className="page-break-avoid">
                            <h3 className="font-bold text-sm mb-1" style={{ color: layout.colors.text }}>{pub.title}</h3>
                            <div className="text-sm flex justify-between items-baseline mb-1">
                                <span className="opacity-90 italic" style={{ color: layout.colors.text }}>{pub.publisher}</span>
                                <span className="text-xs font-medium opacity-75" style={{ color: layout.colors.text }}>{pub.year}</span>
                            </div>
                            {pub.link && (
                                <div className="flex items-center gap-1 text-xs opacity-80">
                                    <span className="font-semibold" style={{ color: layout.colors.text }}>Link:</span>
                                    <a href={pub.link} target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-current to-current bg-[length:100%_1px] bg-no-repeat bg-bottom pb-[2px] break-all hover:opacity-75 no-underline" style={{ color: layout.type === 'sidebar-left' ? layout.colors.sidebarBg : layout.colors.primary }}>
                                        {pub.link}
                                    </a>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>
        );
    };

    const renderLanguages = () => {
        if (!data.languages || data.languages.length === 0) return null;

        const isClassicLayout = ['executive-classic', 'elegant-serif'].includes(layout.id);

        return (
            <section className="mb-6">
                <h2 className="text-sm font-bold uppercase tracking-widest border-b pb-1 mb-3" 
                    style={{ color: layout.type.includes('sidebar') ? (layout.colors.sidebarBg ? layout.colors.text : layout.colors.primary) : layout.colors.primary, borderColor: layout.colors.secondary }}>
                    Languages
                </h2>
                {isClassicLayout ? (
                    <div className="text-sm leading-relaxed font-medium" style={{ color: layout.colors.text }}>
                        {data.languages.join("  •  ")}
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-2 text-sm">
                        {data.languages.map((lang, i) => (
                            <span key={i} className="inline-block font-medium px-2 h-[22px] leading-[22px] rounded border opacity-80 align-middle tracking-wide" style={{ borderColor: layout.colors.secondary, color: layout.colors.text }}>{lang}</span>
                        ))}
                    </div>
                )}
            </section>
        );
    };



    const renderHeader = () => {
        // Dynamic Font Scaling for Name
        let headerNameClass = "font-bold uppercase tracking-tight mb-2";
        const nameLength = data.header?.name?.length || 0;
        const longestWord = data.header?.name?.split(' ').reduce((a, b) => a.length > b.length ? a : b, '').length || 0;

        if (layout.type === 'single') {
             headerNameClass += " text-4xl";
        } else {
            // Sidebar Layout Logic - stricter shrinking
            if (longestWord > 14) {
                 headerNameClass += " text-base";
            } else if (longestWord > 11) {
                 headerNameClass += " text-lg";
            } else if (longestWord > 9) {
                 headerNameClass += " text-xl";
            } else {
                 headerNameClass += " text-2xl";
            }
        }

        if (layout.id === 'swiss-design') {
             return (
                 <header className="pb-8 mb-10 border-b-4 flex justify-between items-start" style={{ borderColor: layout.colors.primary }}>
                     <div className="flex-1 pr-8">
                         <h1 className="text-6xl font-black uppercase tracking-tighter mb-4 leading-none" style={{ color: layout.colors.primary }}>
                            {data.header?.name?.split(' ')[0]}<br/>
                            <span style={{ color: layout.colors.text }}>{data.header?.name?.split(' ').slice(1).join(' ')}</span>
                         </h1>
                         <p className="text-xl font-bold tracking-wide" style={{ color: layout.colors.secondary }}>{data.header?.title}</p>
                         <p className="text-sm mt-4 font-mono opacity-75">{data.header?.contact}</p>
                         {data.header?.links && data.header.links.length > 0 && (
                            <div className="text-sm font-mono opacity-75 mt-2 flex flex-wrap gap-x-3 items-center">
                                {data.header.links.map((link, idx) => (
                                    <React.Fragment key={idx}>
                                        {idx > 0 && <span className="opacity-50">|</span>}
                                        <a href={link.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                            {link.url.replace(/^https?:\/\/(www\.)?/, '')}
                                        </a>
                                    </React.Fragment>
                                ))}
                            </div>
                        )}
                     </div>
                     {photoUrl && (
                        <img src={photoUrl} className="w-40 h-40 object-cover grayscale border-4 block" style={{ borderColor: '#000000' }} alt="Profile" />
                     )}
                 </header>
             );
        }

        return (
            <header className={`pb-4 mb-6 ${layout.type === 'single' ? 'border-b-2' : ''}`} style={{ borderColor: layout.colors.secondary }}>
                <h1 className={headerNameClass} style={{ color: layout.colors.sidebarBg ? layout.colors.sidebarText : layout.colors.primary }}>
                    {data.header?.name || "Your Name"}
                </h1>
                <p className="text-xl font-medium mb-2 opacity-90" style={{ color: layout.colors.sidebarBg ? layout.colors.sidebarText : layout.colors.secondary }}>{data.header?.title || "Professional Title"}</p>
                <div className={`font-medium opacity-75 tracking-wide ${layout.type === 'sidebar-left' ? 'flex flex-col gap-1 items-start mt-3 text-xs' : 'text-sm flex flex-wrap gap-3 items-center mt-2'}`} style={{ color: layout.colors.sidebarBg ? layout.colors.sidebarText : layout.colors.secondary }}>
                    {layout.type !== 'sidebar-left' && <span>{data.header?.contact}</span>}
                    {data.header?.links && data.header.links.length > 0 && (
                        <>
                            {data.header.links.map((link, idx) => (
                                <React.Fragment key={idx}>
                                    {layout.type !== 'sidebar-left' && (idx > 0 || data.header?.contact) && <span className="opacity-50">|</span>}
                                    <a href={link.url} target="_blank" rel="noopener noreferrer" className={`hover:underline ${layout.type === 'sidebar-left' ? 'break-all w-full' : ''}`}>
                                        {link.url.replace(/^https?:\/\/(www\.)?/, '')}
                                    </a>
                                </React.Fragment>
                            ))}
                        </>
                    )}
                </div>
            </header>
        );
    };

    if (layout.type === 'sidebar-left') {
        return (
            <div className={`flex w-full h-auto min-h-[297mm] ${layout.font}`} style={{ backgroundColor: layout.colors.bg }}>
                {/* Sidebar */}
                <div className="w-1/3 p-8 flex flex-col gap-6" style={{ backgroundColor: layout.colors.sidebarBg, color: layout.colors.sidebarText }}>
                    {layout.id === 'modern-slate' && photoUrl && (
                        <div className="w-full flex justify-center mb-2">
                             <img src={photoUrl} className="w-32 h-32 rounded-full object-cover border-4 shadow-lg" style={{ borderColor: 'rgba(255,255,255,0.2)' }} alt="Profile" />
                        </div>
                    )}
                    {renderHeader()}
                    
                    {/* Sidebar Content */}
                    <div style={{ color: layout.colors.sidebarText }}>
                       <section className="mb-6 page-break-avoid">
                           <h2 className="text-sm font-bold uppercase tracking-widest border-b pb-1 mb-3 opacity-70" style={{ borderColor: layout.colors.secondary }}>Contact</h2>
                           <p className="text-sm opacity-90 whitespace-pre-wrap">{data.header?.contact.replace(/ \| /g, '\n')}</p>
                       </section>

                       {/* Skills */}
                       {(() => {
                           const validSkills = data.skills?.filter(s => s && s.trim().length > 0 && s !== "Skill 1");
                           if (validSkills && validSkills.length > 0) {
                               return (
                                   <section className="mb-6 page-break-avoid">
                                        <h2 className="text-sm font-bold uppercase tracking-widest border-b pb-1 mb-3 opacity-70" style={{ borderColor: layout.colors.secondary }}>Skills</h2>
                                        <div className="flex flex-wrap gap-2">
                                            {validSkills.map((skill, i) => (
                                                <span key={i} className="text-xs font-semibold block w-full tracking-wide">• {skill}</span>
                                            ))}
                                        </div>
                                    </section>
                               );
                           }
                           return null;
                       })()}

                       {/* Languages */}
                       {(() => {
                           if (data.languages && data.languages.length > 0) {
                               return (
                                   <section className="mb-6 page-break-avoid">
                                        <h2 className="text-sm font-bold uppercase tracking-widest border-b pb-1 mb-3 opacity-70" style={{ borderColor: layout.colors.secondary }}>Languages</h2>
                                        <div className="flex flex-wrap gap-2">
                                            {data.languages.map((lang, i) => (
                                                <span key={i} className="text-xs font-semibold block w-full">• {lang}</span>
                                            ))}
                                        </div>
                                    </section>
                               );
                           }
                           return null;
                       })()}

                       {/* Education */}
                       {(() => {
                           const validEducation = data.education?.filter(edu => 
                                edu.school && 
                                edu.school.trim().length > 1 && 
                                !edu.school.toLowerCase().includes("university name") && 
                                !edu.school.toLowerCase().includes("information not provided") &&
                                !edu.school.toLowerCase().includes("not provided")
                            );
                            if (validEducation && validEducation.length > 0) {
                                return (
                                   <div className="mt-8">
                                        <h2 className="text-sm font-bold uppercase tracking-widest border-b pb-1 mb-3 opacity-70" style={{ borderColor: layout.colors.secondary }}>Education</h2>
                                        {validEducation.map((edu, i) => (
                                            <div key={i} className="mb-4 page-break-avoid">
                                                <h3 className="font-bold text-sm">{edu.degree}</h3>
                                                <p className="text-xs opacity-75">{edu.school}</p>
                                                <p className="text-xs opacity-50">{edu.year}</p>
                                            </div>
                                        ))}
                                   </div>
                                );
                            }
                            return null;
                       })()}
                    </div>
                </div>

                {/* Main Content */}
                <div className="w-2/3 p-8">
                     <section className="mb-8">
                        <h2 className="text-xl font-bold uppercase tracking-widest border-b-2 pb-2 mb-4" style={{ color: layout.colors.text, borderColor: layout.colors.secondary }}>Summary</h2>
                        <p className="leading-relaxed" style={{ color: layout.colors.text }}>{data.summary}</p>
                     </section>

                     {renderExperience()}
                     {renderProjects()}
                     {renderAchievements()}
                     {renderPublications()}
                </div>
            </div>
        )
    }

    if (layout.type === 'sidebar-right') {
         // Mirror of left but swapped
         return (
            <div className={`flex w-full h-auto min-h-[297mm] ${layout.font}`} style={{ backgroundColor: layout.colors.bg }}>
                 <div className="w-2/3 p-8">
                     {renderHeader()}
                     {renderSummary()}
                     {renderExperience()}
                     {renderProjects()}
                     {renderAchievements()}
                     {renderPublications()}
                </div>
                 <div className="w-1/3 p-8 flex flex-col gap-6" style={{ backgroundColor: layout.colors.sidebarBg, color: layout.colors.sidebarText }}>
                      {layout.id === 'creative-mint' && photoUrl && (
                        <div className="w-full flex justify-center mb-6">
                             <img src={photoUrl} className="w-32 h-32 rounded-full object-cover border-4 shadow-lg" style={{ borderColor: 'rgba(204,251,241,0.5)' }} alt="Profile" />
                        </div>
                      )}
                       <div style={{ color: layout.colors.sidebarText }}>
                           {/* Skills */}
                           {(() => {
                               const validSkills = data.skills?.filter(s => s && s.trim().length > 0 && s !== "Skill 1");
                               if (validSkills && validSkills.length > 0) {
                                   return (
                                       <section className="mb-6 page-break-avoid">
                                            <h2 className="text-sm font-bold uppercase tracking-widest border-b pb-1 mb-3 opacity-70" style={{ borderColor: layout.colors.secondary }}>Skills</h2>
                                            <div className="flex flex-wrap gap-2">
                                                {validSkills.map((skill, i) => (
                                                    <span key={i} className="text-xs font-semibold block w-full">• {skill}</span>
                                                ))}
                                            </div>
                                        </section>
                                   );
                               }
                               return null;
                           })()}

                           {/* Languages */}
                           {(() => {
                               if (data.languages && data.languages.length > 0) {
                                   return (
                                       <section className="mb-6 page-break-avoid">
                                            <h2 className="text-sm font-bold uppercase tracking-widest border-b pb-1 mb-3 opacity-70" style={{ borderColor: layout.colors.secondary }}>Languages</h2>
                                            <div className="flex flex-wrap gap-2">
                                                {data.languages.map((lang, i) => (
                                                    <span key={i} className="text-xs font-semibold block w-full">• {lang}</span>
                                                ))}
                                            </div>
                                        </section>
                                   );
                               }
                               return null;
                           })()}

                           {/* Education */}
                           {(() => {
                               const validEducation = data.education?.filter(edu => 
                                    edu.school && 
                                    edu.school.trim().length > 1 && 
                                    !edu.school.toLowerCase().includes("university name") && 
                                    !edu.school.toLowerCase().includes("information not provided") &&
                                    !edu.school.toLowerCase().includes("not provided")
                                );
                                if (validEducation && validEducation.length > 0) {
                                    return (
                                       <section className="mb-6 page-break-avoid">
                                            <h2 className="text-sm font-bold uppercase tracking-widest border-b pb-1 mb-3 opacity-70" style={{ borderColor: layout.colors.secondary }}>Education</h2>
                                            {validEducation.map((edu, i) => (
                                                <div key={i} className="mb-4 page-break-avoid">
                                                    <h3 className="font-bold text-sm">{edu.degree}</h3>
                                                    <p className="text-xs opacity-75">{edu.school}</p>
                                                    <p className="text-xs opacity-50">{edu.year}</p>
                                                </div>
                                            ))}
                                       </section>
                                    );
                                }
                                return null;
                           })()}
                       </div>
                 </div>
            </div>
         );
    }

    // Single Column
    const dynamicOrder = data.sectionOrder?.filter(key => 
        ['experience', 'education', 'projects', 'achievements', 'publications', 'skills', 'languages'].includes(key)
    ) || ['skills', 'experience', 'projects', 'achievements', 'publications', 'education', 'languages']; // Default fallback

    const renderSection = (key: string) => {
        switch(key) {
            case 'experience': return renderExperience();
            case 'education': return renderEducation();
            case 'projects': return renderProjects();
            case 'achievements': return renderAchievements();
            case 'publications': return renderPublications();
            case 'skills': return renderSkills();
            case 'languages': return renderLanguages();
            default: return null;
        }
    };

    return (
        <div className={`p-[10mm] w-full h-auto min-h-[297mm] ${layout.font}`} style={{ backgroundColor: layout.colors.bg }}>
            {renderHeader()}
            {renderSummary()}
            {dynamicOrder.map(key => (
                <React.Fragment key={key}>
                    {renderSection(key)}
                </React.Fragment>
            ))}
        </div>
    );
}

export default function ProfessionalResume({ data, onDownload, price = "9.99" }: { data: ResumeData, onDownload?: () => void, price?: string }) {
  const resumeRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null); // For scrolling
  const customLayoutRef = useRef<HTMLDivElement>(null); // NEW: To capture the custom layout for PDF
  const [selectedLayoutId, setSelectedLayoutId] = React.useState<string | null>(null);
  const [resumeData, setResumeData] = React.useState<ResumeData>(data);
  const [showEditDrawer, setShowEditDrawer] = React.useState(false);
  const [editLocation, setEditLocation] = React.useState<'main' | 'detail' | null>(null);
  
  /* PAYMENT STATE */
  const [showPaymentModal, setShowPaymentModal] = React.useState(false);
  const [isPaid, setIsPaid] = React.useState(false);
  const [pendingDownload, setPendingDownload] = React.useState<{ref: React.RefObject<HTMLDivElement>, filename: string} | null>(null);

  /* FEEDBACK STATE */
  const [feedbackEmail, setFeedbackEmail] = React.useState('');
  const [feedbackMessage, setFeedbackMessage] = React.useState('');
  const [isSendingFeedback, setIsSendingFeedback] = React.useState(false);
  const [feedbackStatus, setFeedbackStatus] = React.useState<'idle' | 'success' | 'error'>('idle');

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackEmail || !feedbackMessage) return;
    
    setIsSendingFeedback(true);
    try {
        const response = await fetch('/api/feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: feedbackEmail, message: feedbackMessage })
        });
        
        if (response.ok) {
            setFeedbackStatus('success');
            setFeedbackMessage('');
            // Reset status after 3 seconds
            setTimeout(() => setFeedbackStatus('idle'), 3000);
        } else {
            setFeedbackStatus('error');
        }
    } catch (error) {
        console.error(error);
        setFeedbackStatus('error');
    } finally {
        setIsSendingFeedback(false);
    }
  };

  /* DYNAMIC SIZING LOGIC */
  const [resumeScale, setResumeScale] = React.useState(1);
  const [containerMaxWidth, setContainerMaxWidth] = React.useState<string>('56rem'); // Default max-w-4xl

  React.useEffect(() => {
    const handleResize = () => {
        if (!showEditDrawer) {
            setContainerMaxWidth('56rem');
            setResumeScale(1);
            return;
        }

        const RESUME_WIDTH = 794; // approx 210mm
        const SIDEBAR_WIDTH = 384; // w-96
        const MARGIN = 48; // p-6 approx * 2
        const SCREEN_WIDTH = window.innerWidth;
        
        const totalNeeded = RESUME_WIDTH + SIDEBAR_WIDTH + MARGIN;

        if (totalNeeded < SCREEN_WIDTH) {
            // Screen is wide enough: Expand container
            setContainerMaxWidth(`${totalNeeded}px`);
            setResumeScale(1);
        } else {
            // Screen is narrow: Shrink resume
            const availableForContainer = SCREEN_WIDTH - MARGIN;
            setContainerMaxWidth(`${availableForContainer}px`);
            
            // Calculate scale for resume
            const availableForResume = availableForContainer - SIDEBAR_WIDTH - 32; // Extra padding safety
            const scale = Math.max(0.4, availableForResume / RESUME_WIDTH); // Min scale 0.4
            setResumeScale(scale);
        }
    };

    // Initial call
    handleResize();

    // Listen
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);

  }, [showEditDrawer]);

  React.useEffect(() => {
      setResumeData(data);
  }, [data]);

  const selectedLayout = LAYOUTS.find(l => l.id === selectedLayoutId);

  React.useEffect(() => {
      if (selectedLayoutId && detailRef.current) {
          detailRef.current.scrollIntoView({ behavior: 'smooth' });
      }
  }, [selectedLayoutId]);

  // Updated to support custom targets
  const handleDownload = async (targetRef?: React.RefObject<HTMLDivElement | null>, suffix: string = "Resume") => {
    const element = targetRef?.current || resumeRef.current;
    if (!element) return;

    const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

    if (!isPaid && !isLocal) {
        // @ts-ignore
        setPendingDownload({ ref: { current: element }, filename: suffix });
        setShowPaymentModal(true);
        return;
    }

    // Dynamic import for client-side only library
    const html2pdf = (await import('html2pdf.js')).default;
    // Track download
    fetch('/api/track-download', { method: 'POST' }).catch(console.error);

    const opt: any = {
      margin:       [0, 0, 0, 0], 
      filename:     `${data.header?.name.replace(/\s+/g, '_')}_${suffix}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 3, useCORS: true, letterRendering: true }, 
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  const handlePaymentSuccess = () => {
      setIsPaid(true);
      setShowPaymentModal(false);
  };

  // Trigger download after state update
  React.useEffect(() => {
      if (isPaid && pendingDownload) {
          const timer = setTimeout(() => {
              handleDownload(pendingDownload.ref, pendingDownload.filename);
              setPendingDownload(null);
          }, 500);
          return () => clearTimeout(timer);
      }
  }, [isPaid, pendingDownload]);

  if (!data) return null;

  return (
    <div 
        className="w-full space-y-24 transition-all duration-500 ease-in-out"
        style={{ maxWidth: containerMaxWidth, margin: '0 auto' }}
    >
    <section id="primary-preview" className="w-full">
    <div id="fixed-resume" className="mt-12 animate-in fade-in slide-in-from-bottom-10 duration-700">
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl overflow-hidden shadow-2xl">
            {/* ... Header ... */}
            <div className="bg-zinc-800 px-6 py-4 flex items-center justify-between border-b border-zinc-700">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="ml-3 text-sm font-mono text-zinc-400">Professional_Resume.pdf (Preview)</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded">
                        ATS OPTIMIZED
                    </span>
                    <button 
                        // onClick={() => !isEditMode && setShowPremiumModal(true)} 
                        onClick={() => {
                            setEditLocation('main');
                            setShowEditDrawer(true);
                        }}
                        className="inline-flex items-center justify-center p-1.5 rounded-full hover:bg-zinc-700 transition-colors group"
                        title="Edit Resume"
                    >
                        <Edit className="w-4 h-4 text-zinc-400 group-hover:text-white" />
                    </button>
                </div>
            {/* ... Header Ends ... */}
            </div>

            {/* Resume Preview */}
            <div className={`flex flex-row relative overflow-hidden bg-white h-[800px] transition-all duration-500 ${showEditDrawer ? '' : ''}`}>
                <div className="flex-1 p-8 md:p-12 pb-40 text-black font-sans overflow-y-auto custom-scrollbar relative grid place-items-start justify-center" onContextMenu={(e) => e.preventDefault()}>
               
               {/* Print Protection Style */}
               <style jsx global>{`
                  @media print {
                    #fixed-resume-container, .resume-paper {
                      display: none !important;
                    }
                    body::after {
                      content: "Preview Only. Please purchase to download the full PDF.";
                      display: block;
                      padding: 2rem;
                      font-size: 2rem;
                      text-align: center;
                    }
                  }
                  
                  /* PDF Page Break Rules */
                  .page-break-avoid {
                    page-break-inside: avoid;
                    break-inside: avoid;
                  }
               `}</style>
               
               <div id="fixed-resume-container" ref={resumeRef} className="resume-paper max-w-[210mm] mx-auto bg-white min-h-[297mm] h-auto flex flex-col shadow-[0_0_25px_rgba(0,0,0,0.15)] p-[10mm] text-left select-none relative z-10 transition-transform duration-500 ease-in-out origin-top mb-10" 
                    style={{ 
                        backgroundColor: '#ffffff', 
                        color: '#000000', 
                        userSelect: 'none', 
                        WebkitUserSelect: 'none',
                        fontFamily: 'Arial, sans-serif',
                        letterSpacing: '0.3px',
                        lineHeight: '1.5',
                        transform: `scale(${resumeScale})`,
                        // marginBottom removed to fix scroll cut-off
                    }}>
                  
                  {/* WATERMARK OVERLAY */}
                  <div data-html2canvas-ignore="true" className="absolute inset-0 z-50 pointer-events-none flex flex-col items-center justify-center opacity-10 overflow-hidden select-none" style={{ userSelect: 'none', color: '#000000' }}>
                      <div className="transform -rotate-45 font-black text-9xl whitespace-nowrap">
                          PREVIEW ONLY
                      </div>
                      <div className="transform -rotate-45 font-black text-9xl whitespace-nowrap mt-32">
                          PAY TO DOWNLOAD
                      </div>
                      <div className="transform -rotate-45 font-black text-9xl whitespace-nowrap mt-32">
                          PREVIEW ONLY
                      </div>
                  </div>

                  <header className="border-b-2 border-gray-800 pb-4 mb-6 page-break-avoid" style={{ borderColor: '#1f2937' }}>
                    <h1 className="text-4xl font-bold uppercase tracking-tight text-gray-900 mb-2" style={{ color: '#111827' }}>{resumeData.header?.name || "Your Name"}</h1>
                    <p className="text-xl text-gray-600 font-medium mb-2" style={{ color: '#4b5563' }}>{resumeData.header?.title || "Professional Title"}</p>
                    <p className="text-sm text-gray-500 font-medium mt-2 flex flex-wrap items-center gap-3" style={{ color: '#6b7280' }}>
                        <span>{resumeData.header?.contact}</span>
                        {resumeData.header?.links && resumeData.header.links.length > 0 && (
                            <>
                                {resumeData.header.links.map((link, idx) => (
                                    <React.Fragment key={idx}>
                                        <span className="text-gray-300" style={{ color: '#d1d5db' }}>|</span>
                                        <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline" style={{ color: '#2563eb' }}>
                                            {/* Show clean URL path or platform name? User asked for VALUES. e.g. github.com/user */}
                                            {link.url.replace(/^https?:\/\/(www\.)?/, '')}
                                        </a>
                                    </React.Fragment>
                                ))}
                            </>
                        )}
                    </p>
                  </header>

                  <section className="mb-6 page-break-avoid">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-gray-800 border-b border-gray-300 pb-1 mb-3" style={{ color: '#1f2937', borderColor: '#d1d5db' }}>Professional Summary</h2>
                    <p className="text-gray-700 text-sm leading-relaxed" style={{ color: '#374151' }}>{resumeData.summary}</p>
                  </section>

                  {(() => {
                    const validSkills = resumeData.skills?.filter(skill => skill && skill.trim().length > 0 && skill !== "Skill 1");
                    if (!validSkills || validSkills.length === 0) return null;
                    return (
                      <section className="mb-6 page-break-avoid">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-800 border-b border-gray-300 pb-1 mb-3" style={{ color: '#1f2937', borderColor: '#d1d5db' }}>Core Competencies</h2>
                        <div className="flex flex-wrap gap-2">
                            {validSkills.map((skill, i) => (
                                <span key={i} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-semibold uppercase" style={{ backgroundColor: '#f3f4f6', color: '#374151' }}>{skill}</span>
                            ))}
                        </div>
                      </section>
                    );
                  })()}

                  {(() => {
                    if (!resumeData.languages || resumeData.languages.length === 0) return null;
                    return (
                      <section className="mb-6 page-break-avoid">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-800 border-b border-gray-300 pb-1 mb-3" style={{ color: '#1f2937', borderColor: '#d1d5db' }}>Languages</h2>
                        <div className="flex flex-wrap gap-2 text-sm text-gray-700" style={{ color: '#374151' }}>
                            {resumeData.languages.map((lang, i) => (
                                <span key={i} className="font-medium px-2 py-1 bg-gray-50 rounded text-gray-600 border border-gray-200" style={{ backgroundColor: '#f9fafb', color: '#4b5563', borderColor: '#e5e7eb' }}>{lang}</span>
                            ))}
                        </div>
                      </section>
                    );
                  })()}

                  {(() => {
                    const validExperience = resumeData.experience?.filter(job => 
                        job.company && 
                        job.company.trim().length > 0 && 
                        !job.company.includes("Company Name") &&
                        !job.role.includes("Job Title")
                    );
                    if (!validExperience || validExperience.length === 0) return null;
                    return (
                      <section className="mb-6">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-800 border-b border-gray-300 pb-1 mb-3" style={{ color: '#1f2937', borderColor: '#d1d5db' }}>Professional Experience</h2>
                        <div className="space-y-4">
                            {validExperience.map((job, i) => (
                                <div key={i} className="page-break-avoid">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-bold text-gray-900" style={{ color: '#111827' }}>{job.role}</h3>
                                        <span className="text-xs font-medium text-gray-500" style={{ color: '#6b7280' }}>{job.period}</span>
                                    </div>
                                    <div className="text-sm font-medium text-gray-700 mb-2" style={{ color: '#374151' }}>
                                        {job.company}
                                        {job.location && <span className="opacity-70 font-normal"> • {job.location}</span>}
                                    </div>
                                    <div className="space-y-1 ml-1">
                                        {job.achievements?.map((ach, j) => (
                                            <div key={j} className="flex items-start text-sm text-gray-600" style={{ color: '#4b5563' }}>
                                                <span 
                                                    className="mr-2 rounded-full flex-shrink-0 bg-gray-600" 
                                                    style={{ 
                                                        width: '5px', 
                                                        height: '5px', 
                                                        marginTop: '8px', 
                                                        backgroundColor: '#4b5563' 
                                                    }} 
                                                />
                                                <span className="flex-1">{ach}</span>
                                            </div>
                                        ))}
                                        {job.links && job.links.length > 0 && (
                                            <div className="mt-2 text-xs text-gray-600 pl-4" style={{ color: '#4b5563' }}>
                                                {job.links.map((link, k) => (
                                                    <div key={k} className="flex items-center gap-1 mb-1">
                                                        <span className="font-semibold text-gray-800" style={{ color: '#1f2937' }}>Link:</span>
                                                        <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline break-all hover:text-blue-800" style={{ color: '#2563eb' }}>
                                                            {link}
                                                        </a>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                      </section>
                    );
                  })()}

                  {(() => {
                    const validEducation = resumeData.education?.filter(edu => 
                        edu.school && 
                        edu.school.trim().length > 1 && 
                        !edu.school.toLowerCase().includes("university name") && 
                        !edu.school.toLowerCase().includes("information not provided") &&
                        !edu.school.toLowerCase().includes("universlty") &&
                        !edu.school.toLowerCase().includes("not provided")
                    );
                    if (!validEducation || validEducation.length === 0) return null;
                    return (
                      <section className="mb-6">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-800 border-b border-gray-300 pb-1 mb-3" style={{ color: '#1f2937', borderColor: '#d1d5db' }}>Education</h2>
                        <div className="space-y-4">
                            {validEducation.map((edu, i) => (
                                <div key={i} className="flex justify-between items-baseline page-break-avoid">
                                    <div>
                                        <h3 className="font-bold text-gray-900" style={{ color: '#111827' }}>
                                            {edu.school}
                                            {edu.location && <span className="text-xs opacity-70 font-normal ml-2">({edu.location})</span>}
                                        </h3>
                                        <p className="text-sm text-gray-600" style={{ color: '#4b5563' }}>{edu.degree}</p>
                                    </div>
                                    <span className="text-xs font-medium text-gray-500" style={{ color: '#6b7280' }}>{edu.year}</span>
                                </div>
                            ))}
                        </div>
                      </section>
                    );
                  })()}

                  {(() => {
                    if (!resumeData.projects || resumeData.projects.length === 0) return null;
                    return (
                      <section className="mb-6 page-break-avoid">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-800 border-b border-gray-300 pb-1 mb-3" style={{ color: '#1f2937', borderColor: '#d1d5db' }}>Projects</h2>
                        <div className="space-y-4">
                            {resumeData.projects.map((proj, i) => (
                                <div key={i} className="page-break-avoid">
                                    <h3 className="font-bold text-gray-900 mb-1" style={{ color: '#111827' }}>{proj.name}</h3>
                                    <p className="text-sm text-gray-700 leading-relaxed mb-2" style={{ color: '#374151' }}>{proj.description}</p>
                                    {proj.link && (
                                        <div className="flex items-center gap-1 text-xs text-blue-600">
                                            <span className="font-semibold text-gray-800" style={{ color: '#1f2937' }}>Link:</span>
                                            <a href={proj.link} target="_blank" rel="noopener noreferrer" className="underline break-all hover:text-blue-800" style={{ color: '#2563eb' }}>
                                                {proj.link}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                      </section>
                    );
                  })()}

                  {(() => {
                    if (!resumeData.achievements || resumeData.achievements.length === 0) return null;
                    return (
                      <section className="mb-6">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-800 border-b border-gray-300 pb-1 mb-3" style={{ color: '#1f2937', borderColor: '#d1d5db' }}>Achievements</h2>
                        <div className="space-y-4">
                            {resumeData.achievements.map((achGroup, i) => (
                                <div key={i} className="page-break-avoid">
                                    {achGroup.category && (
                                        <h3 className="font-bold text-sm text-gray-900 mb-1" style={{ color: '#111827' }}>{achGroup.category}</h3>
                                    )}
                                    <div className="space-y-1 ml-1">
                                        {achGroup.items.map((item, j) => (
                                            <div key={j} className="flex items-start text-sm text-gray-600" style={{ color: '#4b5563' }}>
                                                <span 
                                                    className="mr-2 rounded-full flex-shrink-0 bg-gray-600" 
                                                    style={{ width: '5px', height: '5px', marginTop: '8px', backgroundColor: '#4b5563' }} 
                                                />
                                                <span className="flex-1 opacity-90">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                      </section>
                    );
                  })()}

                  {(() => {
                    if (!resumeData.publications || resumeData.publications.length === 0) return null;
                    return (
                      <section className="mb-6 page-break-avoid">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-800 border-b border-gray-300 pb-1 mb-3" style={{ color: '#1f2937', borderColor: '#d1d5db' }}>Selected Publications</h2>
                        <div className="space-y-4">
                            {resumeData.publications.map((pub, i) => (
                                <div key={i} className="page-break-avoid">
                                    <h3 className="font-bold text-gray-900 mb-1" style={{ color: '#111827' }}>{pub.title}</h3>
                                    <div className="text-sm flex justify-between items-baseline mb-1">
                                        <span className="text-gray-700 italic" style={{ color: '#374151' }}>{pub.publisher}</span>
                                        <span className="text-xs font-medium text-gray-500" style={{ color: '#6b7280' }}>{pub.year}</span>
                                    </div>
                                    {pub.link && (
                                        <div className="flex items-center gap-1 text-xs text-blue-600">
                                            <span className="font-semibold text-gray-800" style={{ color: '#1f2937' }}>Link:</span>
                                            <a href={pub.link} target="_blank" rel="noopener noreferrer" className="underline break-all hover:text-blue-800" style={{ color: '#2563eb' }}>
                                                {pub.link}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                      </section>
                    );
                  })()}

                 </div>
            </div>
             {/* Edit Drawer Integration */}
             <EditDrawer
                isOpen={showEditDrawer && editLocation === 'main'}
                onClose={() => setShowEditDrawer(false)}
                data={resumeData}
                onUpdate={setResumeData}
            />
            </div>
            
            {/* Download Section */}
            <div className="bg-zinc-900 p-8 text-center border-t border-zinc-800">
                 <h3 className="text-white text-xl font-bold mb-2">Ready to impress?</h3>
                 <p className="text-zinc-400 mb-6">Get this professionally formatted resume as a PDF.</p>
                 
                 <button
                    onClick={() => handleDownload()}
                    className="w-full md:w-auto px-8 py-4 bg-green-500 hover:bg-green-600 text-black font-black uppercase tracking-wide rounded-xl shadow-lg shadow-green-500/20 transition-all transform hover:scale-105 flex items-center justify-center gap-2 mx-auto"
                 >
                    Download PDF
                    <ArrowRight className="w-5 h-5" />
                 </button>
                 <p className="mt-4 text-xs text-zinc-500">
                    {typeof window !== 'undefined' && window.location.hostname === 'localhost' 
                      ? "Local Development Mode: Payment Bypassed" 
                      : `One-time payment of $${price}. Secure checkout via PayPal.`}
                 </p>
            </div>
        </div>
    </div>
    </section>

    {/* OTHER LAYOUTS SELECTOR */}
    <section id="layouts-list" className="w-full">
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl p-6">
             <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="bg-gradient-to-r from-blue-400 to-purple-500 w-1 h-6 rounded-full"></span>
                Other Layouts
             </h2>
             <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar snap-x">
                 {LAYOUTS.map((layout) => (
                     <button 
                        key={layout.id}
                        onClick={() => setSelectedLayoutId(layout.id)}
                        className={`shrink-0 w-36 h-48 rounded-lg border transition-all p-2 flex flex-col items-center justify-between group snap-start
                            ${selectedLayoutId === layout.id ? 'border-green-500 bg-zinc-800 ring-2 ring-green-500/50' : 'border-zinc-700 bg-black/20 hover:border-zinc-500 hover:bg-zinc-800'}`}
                     >
                         <div className="w-full flex-1 rounded bg-white overflow-hidden relative shadow-sm pointer-events-none">
                             {/* Mini Preview Mockup */}
                             <div className={`w-full h-full flex transform scale-[0.4] origin-top-left w-[250%] h-[250%]`}>
                                 {layout.type === 'sidebar-left' && <div className="w-1/3 h-full" style={{ backgroundColor: layout.colors.sidebarBg || layout.colors.secondary }}></div>}
                                 <div className="flex-1 h-full p-4" style={{ backgroundColor: layout.colors.bg }}>
                                     <div className="w-1/2 h-4 mb-2 rounded" style={{ backgroundColor: layout.colors.text }}></div>
                                     <div className="w-1/3 h-2 mb-6 rounded opacity-50" style={{ backgroundColor: layout.colors.text }}></div>
                                     <div className="space-y-2">
                                         <div className="w-full h-1 rounded" style={{ backgroundColor: layout.colors.secondary }}></div>
                                         <div className="w-full h-1 rounded" style={{ backgroundColor: layout.colors.secondary }}></div>
                                         <div className="w-3/4 h-1 rounded" style={{ backgroundColor: layout.colors.secondary }}></div>
                                     </div>
                                 </div>
                                 {layout.type === 'sidebar-right' && <div className="w-1/3 h-full" style={{ backgroundColor: layout.colors.sidebarBg || layout.colors.secondary }}></div>}
                             </div>
                         </div>
                         <span className={`text-xs font-bold mt-2 ${selectedLayoutId === layout.id ? 'text-green-400' : 'text-zinc-500 group-hover:text-white'}`}>
                            {layout.name}
                         </span>
                     </button>
                 ))}
             </div>
        </div>
    </section>



    {/* DETAIL VIEW OF SELECTED LAYOUT */}
    {selectedLayout && (
        <section id="layout-detail" ref={detailRef} className="w-full animate-in fade-in slide-in-from-bottom-10 duration-500">
             <div className="bg-zinc-900 border border-zinc-700 rounded-xl overflow-hidden shadow-2xl relative">
                  {/* Header / Toolbar */}
                  <div className="bg-zinc-800 px-6 py-4 flex items-center justify-between border-b border-zinc-700 z-10">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500" />
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                            <span className="ml-3 text-sm font-mono text-zinc-400">{selectedLayout.name}.pdf (Preview)</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span 
                                className="text-xs font-bold px-2 py-1 rounded uppercase"
                                style={{ 
                                    color: selectedLayout.colors.primary,
                                    backgroundColor: selectedLayout.colors.primary + '1A',
                                    border: `1px solid ${selectedLayout.colors.primary}40`
                                }}
                            >
                                {selectedLayout.name}
                            </span>
                             <button 
                                onClick={() => {
                                    setEditLocation('detail');
                                    setShowEditDrawer(true);
                                }} 
                                className="inline-flex items-center justify-center p-1.5 rounded-full hover:bg-zinc-700 transition-colors group"
                                title="Edit Resume"
                            >
                                <Edit className="w-4 h-4 text-zinc-400 group-hover:text-white" />
                            </button>
                        </div>
                  </div>

                  {/* Render Area */}
                  <div className="flex flex-row relative h-[800px] bg-white">
                    <div className="flex-1 p-8 md:p-12 text-black font-sans overflow-y-auto custom-scrollbar flex justify-center bg-gray-100">
                       <div ref={customLayoutRef} className="resume-paper origin-top transform transition-transform duration-500 relative h-auto" 
                            style={{ 
                                width: '210mm', 
                                minHeight: '297mm', 
                                transform: `scale(${resumeScale})`,
                                boxShadow: '0 0 25px rgba(0,0,0,0.15)',
                                zIndex: 10,
                                marginBottom: '2.5rem'
                            }}>
                            {/* Watermark for Custom Layouts */}
                            <div data-html2canvas-ignore="true" className="absolute inset-0 z-50 pointer-events-none flex flex-col items-center justify-center opacity-10 overflow-hidden select-none" style={{ userSelect: 'none', color: '#000000' }}>
                                <div className="transform -rotate-45 font-black text-9xl whitespace-nowrap">
                                    PREVIEW ONLY
                                </div>
                                <div className="transform -rotate-45 font-black text-9xl whitespace-nowrap mt-32">
                                    PAY TO DOWNLOAD
                                </div>
                            </div>
                            <ResumeRenderer 
                                data={resumeData} 
                                layout={selectedLayout} 
                                onEdit={() => setShowEditDrawer(true)}
                                isEditable={true} // Force true for testing
                            />
                       </div>
                  </div>
                    <EditDrawer
                        isOpen={showEditDrawer && editLocation === 'detail'}
                        onClose={() => setShowEditDrawer(false)}
                        data={resumeData}
                        onUpdate={setResumeData}
                    />
                  </div>

                  {/* Footer for Logic */}
                   <div className="bg-zinc-900 p-6 text-center border-t border-zinc-800">
                         <h3 className="text-white font-bold mb-1">Want this style?</h3>
                         <p className="text-zinc-500 text-sm mb-4">You can download this layout for the same price.</p>
                         <button
                            onClick={() => handleDownload(customLayoutRef, selectedLayout.name)}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 mx-auto"
                         >
                            Download {selectedLayout.name}
                            <ArrowRight className="w-4 h-4" />
                         </button>
                   </div>
             </div>
        </section>
    )}



    {/* FEEDBACK SECTION */}
    <section id="feedback" className="w-full mt-12 mb-24">
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-8 max-w-2xl mx-auto shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-2 text-center">Have a Feature Request?</h3>
            <p className="text-zinc-400 text-center mb-6">Tell us what you want to see next or ask a question. We listen.</p>
            
            {feedbackStatus === 'success' ? (
                <div className="bg-green-500/10 border border-green-500/50 text-green-400 p-4 rounded-lg text-center mb-4 animate-in fade-in">
                    Message sent! We'll get back to you soon.
                </div>
            ) : (
                <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-zinc-400 mb-1">Your Email</label>
                        <input 
                            type="email" 
                            id="email" 
                            required
                            placeholder="so we can update you"
                            value={feedbackEmail}
                            onChange={(e) => setFeedbackEmail(e.target.value)}
                            className="w-full bg-zinc-800 border-zinc-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-zinc-600"
                        />
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-zinc-400 mb-1">Your Message</label>
                        <textarea 
                            id="message" 
                            required
                            rows={3}
                            placeholder="I wish this app could..."
                            value={feedbackMessage}
                            onChange={(e) => setFeedbackMessage(e.target.value)}
                            className="w-full bg-zinc-800 border-zinc-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-zinc-600 resize-none"
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={isSendingFeedback}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                        {isSendingFeedback ? (
                            <>Sending...</>
                        ) : (
                            <>Send Feedback</>
                        )}
                    </button>
                    {feedbackStatus === 'error' && (
                        <p className="text-red-400 text-sm text-center">Failed to send. Please try again.</p>
                    )}
                </form>
            )}
        </div>
    </section>



    <PaymentModal 
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSuccess={handlePaymentSuccess}
        amount={price}
    />

    </div>
  );
}
