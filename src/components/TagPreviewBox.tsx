import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface TagPreviewBoxProps {
  tag: string;
  tagColor: string;
  chatColor?: string;
}

export const TagPreviewBox: React.FC<TagPreviewBoxProps> = ({
  tag,
  tagColor,
  chatColor = '#ffffff',
}) => {
  const { user } = useAuth();
  const [ign, setIgn] = useState(user?.minecraftUsername || 'Steve');

  return (
    <div className="rounded-xl bg-[#080c16] border border-slate-800 p-3 font-mono text-xs">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80 text-[10px] text-slate-400">
        <span className="flex items-center gap-1">
          <MessageSquare className="w-3 h-3 text-cyan-400" />
          <span>In-Game Chat Simulation</span>
        </span>
        <input
          type="text"
          value={ign}
          onChange={(e) => setIgn(e.target.value.replace(/[^a-zA-Z0-9_]/g, '').slice(0, 16))}
          placeholder="IGN"
          className="bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-[10px] text-cyan-300 w-24 text-right focus:outline-none focus:border-cyan-500"
          title="Type your IGN to test"
        />
      </div>

      <div className="p-2.5 rounded bg-black/60 border border-slate-900 text-slate-100 flex items-center gap-1.5 text-xs shadow-inner overflow-x-auto whitespace-nowrap">
        <span
          className="font-bold px-1 rounded bg-black/40"
          style={{ color: tagColor }}
        >
          {tag}
        </span>
        <span className="font-bold text-amber-300">{ign || 'Player'}:</span>
        <span style={{ color: chatColor }}>
          GG everyone, ready for the dragon fight!
        </span>
      </div>
    </div>
  );
};
