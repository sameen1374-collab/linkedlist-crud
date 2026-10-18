'use client';

import React, { useState } from 'react';
import { SerializedNode, TaskItem } from '../dsa/types';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Layers
} from 'lucide-react';

interface CrudDashboardProps {
  nodes: SerializedNode<TaskItem>[];
  onEdit: (node: SerializedNode<TaskItem>) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, newStatus: 'todo' | 'in-progress' | 'completed') => void;
  onAddNew: () => void;
}

export const CrudDashboard: React.FC<CrudDashboardProps> = ({
  nodes,
  onEdit,
  onDelete,
  onStatusChange,
  onAddNew,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState<string>('');

  const filteredNodes = nodes.filter((node) => {
    const matchesStatus = filterStatus === 'all' || node.data.status === filterStatus;
    const matchesSearch = 
      node.data.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      node.data.description.toLowerCase().includes(searchFilter.toLowerCase()) ||
      node.data.category.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-md bg-rose-500/15 text-rose-400 border border-rose-500/30">Urgent</span>;
      case 'high':
        return <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-md bg-amber-500/15 text-amber-400 border border-amber-500/30">High</span>;
      case 'medium':
        return <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-md bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">Medium</span>;
      default:
        return <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-md bg-slate-500/15 text-slate-400 border border-slate-500/30">Low</span>;
    }
  };

  const cycleStatus = (node: SerializedNode<TaskItem>) => {
    const nextStatus = 
      node.data.status === 'todo' 
        ? 'in-progress' 
        : node.data.status === 'in-progress' 
        ? 'completed' 
        : 'todo';
    onStatusChange(node.id, nextStatus);
  };

  return (
    <div className="w-full bg-slate-900/90 rounded-2xl border border-slate-800 shadow-2xl backdrop-blur-xl overflow-hidden">
      {/* Dashboard Header & Filters */}
      <div className="p-6 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              Linked Records Management
              <span className="text-xs font-mono font-normal text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                {nodes.length} Items in Memory
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              CRUD updates directly mutate Doubly Linked List nodes in real-time
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Status Tabs */}
          <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
            {['all', 'todo', 'in-progress', 'completed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-all ${
                  filterStatus === status
                    ? 'bg-cyan-500/20 text-cyan-300 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {status.replace('-', ' ')}
              </button>
            ))}
          </div>

          {/* Quick Search */}
          <input
            type="text"
            placeholder="Filter list..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 w-44"
          />

          {/* Add New Record */}
          <button
            onClick={onAddNew}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-semibold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            New Record
          </button>
        </div>
      </div>

      {/* Table / List View */}
      {filteredNodes.length === 0 ? (
        <div className="p-12 text-center text-slate-500 text-sm">
          No records matching current filter criteria.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800/80 bg-slate-950/40 text-slate-400 font-mono text-[11px]">
                <th className="py-3 px-4">INDEX / ADDR</th>
                <th className="py-3 px-4">RECORD TITLE & DESCRIPTION</th>
                <th className="py-3 px-4">POINTER LINKS (PREV ⇄ NEXT)</th>
                <th className="py-3 px-4">CATEGORY</th>
                <th className="py-3 px-4">PRIORITY</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredNodes.map((node) => (
                <tr 
                  key={node.id}
                  className="hover:bg-slate-800/30 transition-colors group"
                >
                  {/* Index and Address */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-500 w-6">#{node.index}</span>
                      <span className="font-mono text-cyan-400 font-semibold bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-900/40">
                        {node.memoryAddress}
                      </span>
                    </div>
                  </td>

                  {/* Title & Description */}
                  <td className="py-3 px-4 max-w-xs">
                    <div className="font-semibold text-slate-100 line-clamp-1">{node.data.title}</div>
                    <div className="text-slate-400 line-clamp-1 text-[11px] mt-0.5">
                      {node.data.description}
                    </div>
                  </td>

                  {/* Pointer Links */}
                  <td className="py-3 px-4 whitespace-nowrap font-mono text-[10px]">
                    <div className="flex items-center gap-1.5">
                      <span className="text-purple-400 bg-purple-950/40 px-1.5 py-0.5 rounded border border-purple-900/40">
                        {node.prevAddress ?? 'NULL'}
                      </span>
                      <span className="text-slate-600">⇄</span>
                      <span className="text-cyan-400 bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-900/40">
                        {node.nextAddress ?? 'NULL'}
                      </span>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono text-[10px]">
                      {node.data.category}
                    </span>
                  </td>

                  {/* Priority */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    {getPriorityBadge(node.data.priority)}
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <button
                      onClick={() => cycleStatus(node)}
                      title="Click to advance status"
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition-colors"
                    >
                      {node.data.status === 'completed' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                      {node.data.status === 'in-progress' && <Clock className="w-3.5 h-3.5 text-amber-400" />}
                      {node.data.status === 'todo' && <AlertCircle className="w-3.5 h-3.5 text-slate-400" />}
                      <span className="capitalize">{node.data.status.replace('-', ' ')}</span>
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onEdit(node)}
                        title="Edit Record"
                        className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-cyan-400 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDelete(node.id)}
                        title="Delete from Linked List"
                        className="p-1.5 rounded-lg hover:bg-rose-950/50 text-slate-400 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
