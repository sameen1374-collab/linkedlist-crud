'use client';

import React, { useState, useEffect } from 'react';
import { TaskItem, Priority } from '../dsa/types';
import { X, Sparkles, Check } from 'lucide-react';

interface NodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<TaskItem, 'id' | 'createdAt'>) => void;
  initialData?: TaskItem | null;
  mode: 'create' | 'edit';
  targetIndex?: number | null;
}

export const NodeModal: React.FC<NodeModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
  targetIndex,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState('Core');
  const [status, setStatus] = useState<'todo' | 'in-progress' | 'completed'>('todo');

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setPriority(initialData.priority);
      setCategory(initialData.category);
      setStatus(initialData.status);
    } else {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setCategory('Feature');
      setStatus('todo');
    }
  }, [initialData, mode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      description: description.trim() || 'No description provided.',
      priority,
      category: category.trim() || 'General',
      status,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden p-6 relative">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-100">
                {mode === 'create' ? 'Allocate New List Node' : 'Mutate Node Data'}
              </h3>
              <p className="text-xs text-slate-400">
                {mode === 'create' 
                  ? targetIndex !== undefined && targetIndex !== null 
                    ? `Inserting at position index ${targetIndex}` 
                    : 'Adding node to Doubly Linked List'
                  : `Updating node in memory`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Title */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Title / Label *</label>
            <input
              type="text"
              required
              placeholder="e.g. Optimize Garbage Collection"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Description</label>
            <textarea
              rows={2}
              placeholder="Provide context or instructions..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Category & Priority Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Category / Tag</label>
              <input
                type="text"
                placeholder="e.g. Architecture"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-cyan-500 capitalize"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Status</label>
            <div className="grid grid-cols-3 gap-2">
              {(['todo', 'in-progress', 'completed'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatus(st)}
                  className={`py-1.5 px-2 rounded-lg capitalize border font-medium transition-all ${
                    status === st
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {st.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-semibold flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 active:scale-95 transition-all"
            >
              <Check className="w-4 h-4" />
              {mode === 'create' ? 'Create Node' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
