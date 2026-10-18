'use client';

import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { DoublyLinkedList } from '../dsa/DoublyLinkedList';
import { TaskItem, SerializedNode, OperationLog, TraversalStep, Priority } from '../dsa/types';
import { INITIAL_TASKS, PRESET_BUNDLES } from '../dsa/presets';
import { Header } from '../components/Header';
import { Visualizer } from '../components/Visualizer';
import { ControlsPanel } from '../components/ControlsPanel';
import { CrudDashboard } from '../components/CrudDashboard';
import { CodeInspector } from '../components/CodeInspector';
import { NodeModal } from '../components/NodeModal';
import { DeployModal } from '../components/DeployModal';
import { sounds } from '../lib/audio';

const INITIAL_CODE_LOG: OperationLog = {
  id: 'log-init',
  type: 'INSERT_HEAD',
  title: 'Doubly Linked List Initialized',
  description: 'Instantiated DoublyLinkedList class with sentinel pointers',
  timeComplexity: 'O(1)',
  spaceComplexity: 'O(1)',
  timestamp: Date.now(),
  codeSnippet: `// Doubly Linked List Structure
class DoublyLinkedList<T> {
  head: ListNode<T> | null = null;
  tail: ListNode<T> | null = null;
  length: number = 0;

  insertHead(data: T): void {
    const newNode = new Node(data);
    if (!this.head) {
      this.head = this.tail = newNode;
    } else {
      newNode.next = this.head;
      this.head.prev = newNode;
      this.head = newNode;
    }
    this.length++;
  }
}`,
};

export default function Home() {
  // Underlying Doubly Linked List instance
  const listRef = useRef<DoublyLinkedList<TaskItem>>(new DoublyLinkedList(INITIAL_TASKS));

  // Reactive UI state
  const [nodes, setNodes] = useState<SerializedNode<TaskItem>[]>([]);
  const [logs, setLogs] = useState<OperationLog[]>([INITIAL_CODE_LOG]);
  const [currentLog, setCurrentLog] = useState<OperationLog | null>(INITIAL_CODE_LOG);
  const [activeStep, setActiveStep] = useState<TraversalStep | null>(null);
  const [isTraversing, setIsTraversing] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'visualizer' | 'crud' | 'split'>('split');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedNode, setSelectedNode] = useState<SerializedNode<TaskItem> | null>(null);
  const [targetInsertIndex, setTargetInsertIndex] = useState<number | null>(null);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState<boolean>(false);

  // Sync state from Linked List
  const syncListState = () => {
    setNodes(listRef.current.serialize());
  };

  useEffect(() => {
    syncListState();
  }, []);

  const addLog = (
    type: OperationLog['type'],
    title: string,
    description: string,
    timeComplexity: OperationLog['timeComplexity'],
    codeSnippet: string,
    spaceComplexity: OperationLog['spaceComplexity'] = 'O(1)'
  ) => {
    const newLog: OperationLog = {
      id: `log-${Date.now()}-${Math.random()}`,
      type,
      title,
      description,
      timeComplexity,
      spaceComplexity,
      timestamp: Date.now(),
      codeSnippet,
    };
    setCurrentLog(newLog);
    setLogs((prev) => [newLog, ...prev.slice(0, 40)]);
  };

  // Traversal animation stepper
  const runTraversalAnimation = async (steps: TraversalStep[]) => {
    if (steps.length === 0) return;
    setIsTraversing(true);

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      setActiveStep(step);
      sounds.playStep();
      await new Promise((resolve) => setTimeout(resolve, 380));
    }

    await new Promise((resolve) => setTimeout(resolve, 600));
    setActiveStep(null);
    setIsTraversing(false);
  };

  // CRUD: Insert Head
  const handleInsertHead = () => {
    setModalMode('create');
    setTargetInsertIndex(0);
    setSelectedNode(null);
    setIsModalOpen(true);
  };

  // CRUD: Insert Tail
  const handleInsertTail = () => {
    setModalMode('create');
    setTargetInsertIndex(listRef.current.length);
    setSelectedNode(null);
    setIsModalOpen(true);
  };

  // CRUD: Insert At Index
  const handleInsertIndex = (index: number) => {
    setModalMode('create');
    setTargetInsertIndex(index);
    setSelectedNode(null);
    setIsModalOpen(true);
  };

  // Handle Form Submission from Modal (Create or Edit)
  const handleModalSubmit = async (formData: Omit<TaskItem, 'id' | 'createdAt'>) => {
    const list = listRef.current;

    if (modalMode === 'create') {
      const newItem: TaskItem = {
        id: `node-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        category: formData.category,
        status: formData.status,
        createdAt: Date.now(),
      };

      const index = targetInsertIndex ?? list.length;

      if (index === 0) {
        const { steps } = list.insertHead(newItem);
        sounds.playInsert();
        syncListState();
        addLog(
          'INSERT_HEAD',
          `Prepend Node [${newItem.title}]`,
          `Linked to head in O(1) time`,
          'O(1)',
          `public insertHead(data: T): ListNode<T> {
  const newNode = this.createNode(data);
  if (!this.head) {
    this.head = this.tail = newNode;
  } else {
    newNode.next = this.head;
    this.head.prev = newNode;
    this.head = newNode;
  }
  this.length++;
  return newNode;
}`
        );
        runTraversalAnimation(steps);
      } else if (index >= list.length) {
        const { steps } = list.insertTail(newItem);
        sounds.playInsert();
        syncListState();
        addLog(
          'INSERT_TAIL',
          `Append Node [${newItem.title}]`,
          `Linked to tail in O(1) time`,
          'O(1)',
          `public insertTail(data: T): ListNode<T> {
  const newNode = this.createNode(data);
  if (!this.tail) {
    this.head = this.tail = newNode;
  } else {
    newNode.prev = this.tail;
    this.tail.next = newNode;
    this.tail = newNode;
  }
  this.length++;
  return newNode;
}`
        );
        runTraversalAnimation(steps);
      } else {
        const { steps } = list.insertAt(index, newItem);
        sounds.playInsert();
        syncListState();
        addLog(
          'INSERT_INDEX',
          `Insert at Index ${index}`,
          `Traversed to position in O(n) time`,
          'O(n)',
          `public insertAt(index: number, data: T) {
  let current = this.head;
  for (let i = 0; i < index; i++) current = current.next;
  const prevNode = current.prev;
  newNode.next = current;
  newNode.prev = prevNode;
  prevNode.next = newNode;
  current.prev = newNode;
  this.length++;
}`
        );
        runTraversalAnimation(steps);
      }
    } else if (modalMode === 'edit' && selectedNode) {
      list.update(selectedNode.id, formData);
      sounds.playSuccess();
      syncListState();
      addLog(
        'UPDATE_NODE',
        `Mutated Node [${formData.title}]`,
        `Direct memory update at ${selectedNode.memoryAddress}`,
        'O(n)',
        `public update(id: string, updatedData: Partial<T>): boolean {
  let current = this.head;
  while (current) {
    if (current.id === id) {
      current.data = { ...current.data, ...updatedData };
      return true;
    }
    current = current.next;
  }
  return false;
}`
      );
    }
  };

  // CRUD: Delete Head
  const handleDeleteHead = () => {
    const { node, steps } = listRef.current.deleteHead();
    if (node) {
      sounds.playDelete();
      syncListState();
      addLog(
        'DELETE_HEAD',
        `Popped Head [${node.data.title}]`,
        `Advanced head pointer to next node in O(1)`,
        'O(1)',
        `public deleteHead(): ListNode<T> | null {
  if (!this.head) return null;
  const removedNode = this.head;
  if (this.head === this.tail) {
    this.head = this.tail = null;
  } else {
    this.head = this.head.next;
    this.head.prev = null;
  }
  this.length--;
  return removedNode;
}`
      );
      runTraversalAnimation(steps);
    }
  };

  // CRUD: Delete Tail
  const handleDeleteTail = () => {
    const { node, steps } = listRef.current.deleteTail();
    if (node) {
      sounds.playDelete();
      syncListState();
      addLog(
        'DELETE_TAIL',
        `Popped Tail [${node.data.title}]`,
        `Retreated tail pointer to prev node in O(1)`,
        'O(1)',
        `public deleteTail(): ListNode<T> | null {
  if (!this.tail) return null;
  const removedNode = this.tail;
  if (this.head === this.tail) {
    this.head = this.tail = null;
  } else {
    this.tail = this.tail.prev;
    this.tail.next = null;
  }
  this.length--;
  return removedNode;
}`
      );
      runTraversalAnimation(steps);
    }
  };

  // CRUD: Delete By ID
  const handleDeleteById = (id: string) => {
    const { node, steps } = listRef.current.deleteById(id);
    if (node) {
      sounds.playDelete();
      syncListState();
      addLog(
        'DELETE_BY_ID',
        `Deleted Node [${node.data.title}]`,
        `Bypassed pointers: prev.next = next, next.prev = prev`,
        'O(n)',
        `public deleteById(id: string): ListNode<T> | null {
  let current = this.head;
  while (current && current.id !== id) current = current.next;
  if (!current) return null;
  if (current === this.head) return this.deleteHead();
  if (current === this.tail) return this.deleteTail();
  current.prev.next = current.next;
  current.next.prev = current.prev;
  this.length--;
  return current;
}`
      );
      runTraversalAnimation(steps);
    }
  };

  // Reverse In-Place
  const handleReverse = () => {
    const { steps } = listRef.current.reverse();
    sounds.playReverse();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#06b6d4', '#6366f1', '#a855f7'],
    });
    syncListState();
    addLog(
      'REVERSE',
      `Inverted Doubly Linked List`,
      `In-place pointer reversal: swapped prev and next on each node`,
      'O(n)',
      `public reverse(): void {
  let current = this.head;
  let temp = null;
  while (current) {
    temp = current.prev;
    current.prev = current.next;
    current.next = temp;
    current = current.prev; // advances because pointers swapped
  }
  if (temp) {
    this.tail = this.head;
    this.head = temp.prev;
  }
}`
    );
    runTraversalAnimation(steps);
  };

  // Sort Linked List
  const handleSort = (type: 'priority' | 'title') => {
    const priorityWeights: Record<Priority, number> = {
      urgent: 4,
      high: 3,
      medium: 2,
      low: 1,
    };

    const { steps } = listRef.current.sort((a, b) => {
      if (type === 'priority') {
        return priorityWeights[b.priority] - priorityWeights[a.priority];
      }
      return a.title.localeCompare(b.title);
    });

    sounds.playSuccess();
    syncListState();
    addLog(
      'SORT',
      `Sorted Linked List by ${type.toUpperCase()}`,
      `Merge sort pointer alignment in O(n log n)`,
      'O(n log n)',
      `public sort(compareFn: (a: T, b: T) => number) {
  // Merge Sort on Doubly Linked List
  // Divides list by slow/fast pointers, merges sub-lists by pointer rewiring
  const items = this.toArray().sort(compareFn);
  this.reassignPointers(items);
}`
    );
    runTraversalAnimation(steps);
  };

  // Traverse Forward or Backward
  const handleTraverse = (direction: 'forward' | 'backward') => {
    const steps: TraversalStep[] = [];
    const list = listRef.current;

    if (direction === 'forward') {
      let curr = list.head;
      let idx = 0;
      while (curr) {
        steps.push({
          nodeId: curr.id,
          action: 'visiting',
          message: `Forward Traversal: Node #${idx} [${curr.memoryAddress}] -> ${curr.data.title}`,
        });
        curr = curr.next;
        idx++;
      }
    } else {
      let curr = list.tail;
      let idx = list.length - 1;
      while (curr) {
        steps.push({
          nodeId: curr.id,
          action: 'visiting',
          message: `Backward Traversal: Node #${idx} [${curr.memoryAddress}] -> ${curr.data.title}`,
        });
        curr = curr.prev;
        idx--;
      }
    }

    addLog(
      'TRAVERSE',
      `Traversed List ${direction.toUpperCase()}`,
      `Visited ${steps.length} nodes sequentially using ${direction === 'forward' ? 'next' : 'prev'} pointers`,
      'O(n)',
      `// Sequential Traversal
let current = ${direction === 'forward' ? 'this.head' : 'this.tail'};
while (current) {
  processNode(current.data);
  current = ${direction === 'forward' ? 'current.next' : 'current.prev'};
}`
    );

    runTraversalAnimation(steps);
  };

  // Search Node
  const handleSearch = (query: string) => {
    const { index, node, steps } = listRef.current.search((item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
    );

    if (node) {
      sounds.playSuccess();
      addLog(
        'SEARCH',
        `Match Found at Index ${index}`,
        `Discovered "${node.data.title}" at address ${node.memoryAddress}`,
        'O(n)',
        `public search(predicate: (data: T) => boolean) {
  let current = this.head;
  let idx = 0;
  while (current) {
    if (predicate(current.data)) return { index: idx, node: current };
    current = current.next;
    idx++;
  }
  return { index: -1, node: null };
}`
      );
    } else {
      sounds.playDelete();
      addLog(
        'SEARCH',
        `No Match Found for "${query}"`,
        `Traversed entire list (O(n)) without match`,
        'O(n)',
        `// Linear search reached TAIL.next (NULL)`
      );
    }

    runTraversalAnimation(steps);
  };

  // Status Change
  const handleStatusChange = (id: string, newStatus: 'todo' | 'in-progress' | 'completed') => {
    listRef.current.update(id, { status: newStatus });
    sounds.playStep();
    syncListState();
  };

  // Load Preset Bundle
  const handleLoadPreset = (presetIndex: number) => {
    const preset = PRESET_BUNDLES[presetIndex];
    if (preset) {
      listRef.current = new DoublyLinkedList<TaskItem>(preset.tasks);
      sounds.playSuccess();
      syncListState();
      addLog(
        'CLEAR',
        `Loaded Preset: ${preset.name}`,
        `Populated linked list with ${preset.tasks.length} pre-configured nodes`,
        'O(n)',
        `// Reset List and Seed
this.clear();
items.forEach(item => this.insertTail(item));`
      );
    }
  };

  // Clear list
  const handleClear = () => {
    listRef.current.clear();
    sounds.playDelete();
    syncListState();
    addLog(
      'CLEAR',
      'Severed All Pointers',
      'Reset HEAD and TAIL to NULL; garbage collected list',
      'O(n)',
      `public clear(): void {
  let current = this.head;
  while (current) {
    const next = current.next;
    current.prev = null;
    current.next = null;
    current = next;
  }
  this.head = this.tail = null;
  this.length = 0;
}`
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Global Header */}
      <Header
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
        onOpenDeployModal={() => setIsDeployModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Controls Toolbar */}
        <ControlsPanel
          onInsertHead={handleInsertHead}
          onInsertTail={handleInsertTail}
          onInsertIndex={handleInsertIndex}
          onDeleteHead={handleDeleteHead}
          onDeleteTail={handleDeleteTail}
          onReverse={handleReverse}
          onSort={handleSort}
          onTraverse={handleTraverse}
          onSearch={handleSearch}
          onClear={handleClear}
          onLoadPreset={handleLoadPreset}
          isTraversing={isTraversing}
          listLength={nodes.length}
        />

        {/* View Layout Switcher */}
        {viewMode === 'split' && (
          <div className="space-y-6">
            {/* Pointer Canvas Visualizer */}
            <Visualizer
              nodes={nodes}
              activeStep={activeStep}
              onSelectNode={(node) => {
                setSelectedNode(node);
                setModalMode('edit');
                setIsModalOpen(true);
              }}
              onDeleteNode={handleDeleteById}
              onEditNode={(node) => {
                setSelectedNode(node);
                setModalMode('edit');
                setIsModalOpen(true);
              }}
              onInsertAfter={(index) => {
                setTargetInsertIndex(index);
                setModalMode('create');
                setSelectedNode(null);
                setIsModalOpen(true);
              }}
            />

            {/* Split Row: CRUD Records Table + DSA Code Inspector */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7">
                <CrudDashboard
                  nodes={nodes}
                  onEdit={(node) => {
                    setSelectedNode(node);
                    setModalMode('edit');
                    setIsModalOpen(true);
                  }}
                  onDelete={handleDeleteById}
                  onStatusChange={handleStatusChange}
                  onAddNew={handleInsertTail}
                />
              </div>
              <div className="lg:col-span-5">
                <CodeInspector logs={logs} currentLog={currentLog} />
              </div>
            </div>
          </div>
        )}

        {viewMode === 'visualizer' && (
          <div className="space-y-6">
            <Visualizer
              nodes={nodes}
              activeStep={activeStep}
              onSelectNode={(node) => {
                setSelectedNode(node);
                setModalMode('edit');
                setIsModalOpen(true);
              }}
              onDeleteNode={handleDeleteById}
              onEditNode={(node) => {
                setSelectedNode(node);
                setModalMode('edit');
                setIsModalOpen(true);
              }}
              onInsertAfter={(index) => {
                setTargetInsertIndex(index);
                setModalMode('create');
                setSelectedNode(null);
                setIsModalOpen(true);
              }}
            />
            <div className="max-w-3xl mx-auto">
              <CodeInspector logs={logs} currentLog={currentLog} />
            </div>
          </div>
        )}

        {viewMode === 'crud' && (
          <div className="space-y-6">
            <CrudDashboard
              nodes={nodes}
              onEdit={(node) => {
                setSelectedNode(node);
                setModalMode('edit');
                setIsModalOpen(true);
              }}
              onDelete={handleDeleteById}
              onStatusChange={handleStatusChange}
              onAddNew={handleInsertTail}
            />
            <CodeInspector logs={logs} currentLog={currentLog} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-900 bg-slate-950 py-6 text-center text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span>NODEFORGE Next.js DSA Platform</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Doubly Linked List Engine</span>
            <span>•</span>
            <span>Memory Pointer Emulation</span>
            <span>•</span>
            <span>Vercel Edge Ready</span>
          </div>
        </div>
      </footer>

      {/* Add / Edit Task Modal */}
      <NodeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={selectedNode?.data}
        mode={modalMode}
        targetIndex={targetInsertIndex}
      />

      {/* Vercel Deployment Modal */}
      <DeployModal
        isOpen={isDeployModalOpen}
        onClose={() => setIsDeployModalOpen(false)}
      />
    </div>
  );
}
