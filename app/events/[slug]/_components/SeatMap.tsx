"use client";

import { useState } from 'react';
import { PublicEvent } from '@/lib/api';

interface SeatMapProps {
  event: PublicEvent;
  onSelectTier: (tierId: string) => void;
  selectedTierId?: string;
}

export default function SeatMap({ event, onSelectTier, selectedTierId }: SeatMapProps) {
  const [hoveredTierId, setHoveredTierId] = useState<string | null>(null);

  // Helper to find tier by name or type to map to SVG sections
  const getTierId = (sectionName: string) => {
    // Simple matching logic: find a tier that contains the section name
    return event.ticket_tiers.find(t => 
        t.name.toLowerCase().includes(sectionName.toLowerCase()) || 
        t.type.toLowerCase().includes(sectionName.toLowerCase())
    )?.id;
  };

  const sections = [
    { id: 'stage', name: 'Stage', path: "M50,20 L750,20 L750,80 L50,80 Z", color: "#333", label: "STAGE (Front)", interactable: false },
    { id: 'vip', name: 'VIP', path: "M100,100 L300,100 L300,250 L100,250 Z", color: "#713aed", label: "VIP Section" },
    { id: 'tables', name: 'Table', path: "M500,100 L700,100 L700,250 L500,250 Z", color: "#ec4899", label: "Tables" },
    { id: 'general', name: 'General', path: "M100,300 L700,300 L700,500 L100,500 Z", color: "#3b82f6", label: "General Admission" },
  ];

  return (
    <div className="w-full bg-gray-50 rounded-xl border border-gray-200 p-4 overflow-hidden">
      <p className="text-center text-sm text-gray-500 mb-2">Interactive Venue Map</p>
      <svg viewBox="0 0 800 550" className="w-full h-auto drop-shadow-sm select-none">
        {sections.map((section) => {
          const tierId = section.interactable !== false ? getTierId(section.name) : undefined;
          const isInteractable = !!tierId;
          const isSelected = selectedTierId === tierId;
          const isHovered = hoveredTierId === tierId;
          
          return (
            <g 
                key={section.id}
                onClick={() => isInteractable && tierId && onSelectTier(tierId)}
                onMouseEnter={() => isInteractable && tierId && setHoveredTierId(tierId)}
                onMouseLeave={() => setHoveredTierId(null)}
                className={`transition-all duration-300 ${isInteractable ? 'cursor-pointer hover:opacity-90' : ''}`}
                style={{ opacity: isInteractable ? (isSelected || isHovered ? 1 : 0.7) : 1 }}
            >
              <path 
                d={section.path} 
                fill={section.color} 
                stroke={isSelected ? "black" : "none"}
                strokeWidth={3}
              />
              <text 
                x={section.id === 'general' ? 400 : (section.id === 'tables' ? 600 : (section.id === 'vip' ? 200 : 400))} 
                y={section.id === 'general' ? 400 : (section.id === 'tables' ? 175 : (section.id === 'vip' ? 175 : 55))} 
                textAnchor="middle" 
                fill="white" 
                className="font-bold text-lg pointer-events-none"
                style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}
              >
                {section.label}
              </text>
              {isInteractable && (
                   <text 
                   x={section.id === 'general' ? 400 : (section.id === 'tables' ? 600 : 200)} 
                   y={section.id === 'general' ? 425 : (section.id === 'tables' ? 200 : 200)} 
                   textAnchor="middle" 
                   fill="white" 
                   fontSize="12"
                   className="pointer-events-none"
                 >
                   (Click to Select)
                 </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
