export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  category: string;
  status: 'todo' | 'in-progress' | 'completed';
  createdAt: number;
}

export interface ListNode<T> {
  id: string;
  memoryAddress: string;
  data: T;
  next: ListNode<T> | null;
  prev: ListNode<T> | null;
}

export interface SerializedNode<T> {
  id: string;
  memoryAddress: string;
  data: T;
  nextAddress: string | null;
  prevAddress: string | null;
  nextId: string | null;
  prevId: string | null;
  index: number;
}

export type OperationType = 
  | 'INSERT_HEAD'
  | 'INSERT_TAIL'
  | 'INSERT_INDEX'
  | 'DELETE_HEAD'
  | 'DELETE_TAIL'
  | 'DELETE_BY_ID'
  | 'DELETE_INDEX'
  | 'UPDATE_NODE'
  | 'REVERSE'
  | 'SORT'
  | 'SEARCH'
  | 'TRAVERSE'
  | 'CLEAR';

export interface OperationLog {
  id: string;
  type: OperationType;
  title: string;
  description: string;
  timeComplexity: 'O(1)' | 'O(n)' | 'O(n log n)';
  spaceComplexity: 'O(1)' | 'O(n)';
  timestamp: number;
  codeSnippet: string;
}

export interface TraversalStep {
  nodeId: string;
  action: 'visiting' | 'found' | 'swapping' | 'pointer_update';
  message: string;
  codeLine?: number;
}
