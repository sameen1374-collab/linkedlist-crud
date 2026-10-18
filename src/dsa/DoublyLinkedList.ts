import { ListNode, SerializedNode, TraversalStep } from './types';

function generateMemoryAddress(): string {
  const hex = Math.floor(0x1000 + Math.random() * 0xEFFF).toString(16).toUpperCase();
  return `0x7FA${hex}`;
}

export class DoublyLinkedList<T extends { id: string }> {
  public head: ListNode<T> | null = null;
  public tail: ListNode<T> | null = null;
  public length: number = 0;

  constructor(items?: T[]) {
    if (items && items.length > 0) {
      items.forEach(item => this.insertTail(item));
    }
  }

  private createNode(data: T): ListNode<T> {
    return {
      id: data.id,
      memoryAddress: generateMemoryAddress(),
      data,
      next: null,
      prev: null,
    };
  }

  /**
   * Insert at Head: O(1) Time, O(1) Space
   */
  public insertHead(data: T): { node: ListNode<T>; steps: TraversalStep[] } {
    const newNode = this.createNode(data);
    const steps: TraversalStep[] = [];

    steps.push({
      nodeId: newNode.id,
      action: 'visiting',
      message: `Allocating new node at address ${newNode.memoryAddress} with ID ${newNode.id}`,
      codeLine: 2,
    });

    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
      steps.push({
        nodeId: newNode.id,
        action: 'pointer_update',
        message: `List was empty: HEAD and TAIL both point to new node (${newNode.memoryAddress})`,
        codeLine: 4,
      });
    } else {
      newNode.next = this.head;
      this.head.prev = newNode;
      this.head = newNode;
      steps.push({
        nodeId: newNode.id,
        action: 'pointer_update',
        message: `Linked: newNode.next = HEAD, old HEAD.prev = newNode, new HEAD assigned`,
        codeLine: 7,
      });
    }

    this.length++;
    return { node: newNode, steps };
  }

  /**
   * Insert at Tail: O(1) Time, O(1) Space
   */
  public insertTail(data: T): { node: ListNode<T>; steps: TraversalStep[] } {
    const newNode = this.createNode(data);
    const steps: TraversalStep[] = [];

    steps.push({
      nodeId: newNode.id,
      action: 'visiting',
      message: `Allocating new node at address ${newNode.memoryAddress}`,
      codeLine: 2,
    });

    if (!this.tail) {
      this.head = newNode;
      this.tail = newNode;
      steps.push({
        nodeId: newNode.id,
        action: 'pointer_update',
        message: `List was empty: HEAD and TAIL both point to new node`,
        codeLine: 4,
      });
    } else {
      newNode.prev = this.tail;
      this.tail.next = newNode;
      this.tail = newNode;
      steps.push({
        nodeId: newNode.id,
        action: 'pointer_update',
        message: `Linked: TAIL.next = newNode, newNode.prev = TAIL, new TAIL assigned`,
        codeLine: 7,
      });
    }

    this.length++;
    return { node: newNode, steps };
  }

  /**
   * Insert at Index: O(n) Time, O(1) Space
   */
  public insertAt(index: number, data: T): { node: ListNode<T> | null; steps: TraversalStep[] } {
    const steps: TraversalStep[] = [];
    if (index < 0 || index > this.length) {
      return { node: null, steps };
    }

    if (index === 0) {
      return this.insertHead(data);
    }
    if (index === this.length) {
      return this.insertTail(data);
    }

    const newNode = this.createNode(data);
    let current = this.head;
    let currIdx = 0;

    // Traverse to index
    while (current && currIdx < index) {
      steps.push({
        nodeId: current.id,
        action: 'visiting',
        message: `Traversing pointer: Current index is ${currIdx}, target is ${index}`,
        codeLine: 6,
      });
      current = current.next;
      currIdx++;
    }

    if (current && current.prev) {
      const prevNode = current.prev;
      newNode.next = current;
      newNode.prev = prevNode;
      prevNode.next = newNode;
      current.prev = newNode;

      steps.push({
        nodeId: newNode.id,
        action: 'pointer_update',
        message: `Spliced newNode between ${prevNode.memoryAddress} and ${current.memoryAddress}`,
        codeLine: 11,
      });

      this.length++;
      return { node: newNode, steps };
    }

    return { node: null, steps };
  }

  /**
   * Delete Head: O(1) Time, O(1) Space
   */
  public deleteHead(): { node: ListNode<T> | null; steps: TraversalStep[] } {
    const steps: TraversalStep[] = [];
    if (!this.head) return { node: null, steps };

    const removedNode = this.head;
    steps.push({
      nodeId: removedNode.id,
      action: 'visiting',
      message: `Identifying HEAD node (${removedNode.memoryAddress}) for removal`,
      codeLine: 2,
    });

    if (this.head === this.tail) {
      this.head = null;
      this.tail = null;
      steps.push({
        nodeId: removedNode.id,
        action: 'pointer_update',
        message: `Single node list: Resetting HEAD and TAIL to NULL`,
        codeLine: 4,
      });
    } else {
      this.head = this.head.next;
      if (this.head) {
        this.head.prev = null;
      }
      removedNode.next = null;
      steps.push({
        nodeId: removedNode.id,
        action: 'pointer_update',
        message: `Advanced HEAD to next node and cleared its prev pointer`,
        codeLine: 8,
      });
    }

    this.length--;
    return { node: removedNode, steps };
  }

  /**
   * Delete Tail: O(1) Time, O(1) Space
   */
  public deleteTail(): { node: ListNode<T> | null; steps: TraversalStep[] } {
    const steps: TraversalStep[] = [];
    if (!this.tail) return { node: null, steps };

    const removedNode = this.tail;
    steps.push({
      nodeId: removedNode.id,
      action: 'visiting',
      message: `Identifying TAIL node (${removedNode.memoryAddress}) for removal`,
      codeLine: 2,
    });

    if (this.head === this.tail) {
      this.head = null;
      this.tail = null;
      steps.push({
        nodeId: removedNode.id,
        action: 'pointer_update',
        message: `Single node list: Resetting HEAD and TAIL to NULL`,
        codeLine: 4,
      });
    } else {
      this.tail = this.tail.prev;
      if (this.tail) {
        this.tail.next = null;
      }
      removedNode.prev = null;
      steps.push({
        nodeId: removedNode.id,
        action: 'pointer_update',
        message: `Retreated TAIL to prev node and severed next pointer`,
        codeLine: 8,
      });
    }

    this.length--;
    return { node: removedNode, steps };
  }

  /**
   * Delete by ID: O(n) Time, O(1) Space
   */
  public deleteById(id: string): { node: ListNode<T> | null; steps: TraversalStep[] } {
    const steps: TraversalStep[] = [];
    let current = this.head;

    while (current) {
      steps.push({
        nodeId: current.id,
        action: 'visiting',
        message: `Inspecting node ${current.memoryAddress} (ID: ${current.id.slice(0, 8)})`,
        codeLine: 3,
      });

      if (current.id === id) {
        steps.push({
          nodeId: current.id,
          action: 'found',
          message: `Target found at ${current.memoryAddress}! Re-routing surrounding pointers.`,
          codeLine: 5,
        });

        if (current === this.head) {
          return this.deleteHead();
        }
        if (current === this.tail) {
          return this.deleteTail();
        }

        const prevNode = current.prev;
        const nextNode = current.next;

        if (prevNode) prevNode.next = nextNode;
        if (nextNode) nextNode.prev = prevNode;

        current.prev = null;
        current.next = null;
        this.length--;

        steps.push({
          nodeId: current.id,
          action: 'pointer_update',
          message: `Bypassed node: prevNode.next = nextNode, nextNode.prev = prevNode`,
          codeLine: 12,
        });

        return { node: current, steps };
      }

      current = current.next;
    }

    return { node: null, steps };
  }

  /**
   * Update Node Data: O(n) Time to find, O(1) to mutate
   */
  public update(id: string, updatedData: Partial<T>): boolean {
    let current = this.head;
    while (current) {
      if (current.id === id) {
        current.data = { ...current.data, ...updatedData };
        return true;
      }
      current = current.next;
    }
    return false;
  }

  /**
   * Linear Search: O(n) Time, O(1) Space
   */
  public search(predicate: (data: T) => boolean): { index: number; node: ListNode<T> | null; steps: TraversalStep[] } {
    const steps: TraversalStep[] = [];
    let current = this.head;
    let idx = 0;

    while (current) {
      steps.push({
        nodeId: current.id,
        action: 'visiting',
        message: `Visiting index ${idx} [${current.memoryAddress}]`,
        codeLine: 4,
      });

      if (predicate(current.data)) {
        steps.push({
          nodeId: current.id,
          action: 'found',
          message: `Match discovered at index ${idx} (${current.memoryAddress})!`,
          codeLine: 6,
        });
        return { index: idx, node: current, steps };
      }

      current = current.next;
      idx++;
    }

    return { index: -1, node: null, steps };
  }

  /**
   * Reverse Doubly Linked List in-place: O(n) Time, O(1) Space
   * Swaps next and prev pointers for every node
   */
  public reverse(): { steps: TraversalStep[] } {
    const steps: TraversalStep[] = [];
    if (!this.head || this.head === this.tail) {
      return { steps };
    }

    let current: ListNode<T> | null = this.head;
    let temp: ListNode<T> | null = null;

    // Swap pointers for each node
    while (current) {
      steps.push({
        nodeId: current.id,
        action: 'swapping',
        message: `Swapping prev (${current.prev?.memoryAddress ?? 'null'}) and next (${current.next?.memoryAddress ?? 'null'}) at ${current.memoryAddress}`,
        codeLine: 5,
      });

      temp = current.prev;
      current.prev = current.next;
      current.next = temp;

      // Since next and prev are swapped, to advance forward we go to current.prev
      current = current.prev;
    }

    // Swap head and tail
    if (temp) {
      this.tail = this.head;
      this.head = temp.prev;
    }

    steps.push({
      nodeId: this.head ? this.head.id : '',
      action: 'pointer_update',
      message: `Reversal complete: HEAD and TAIL pointers successfully inverted!`,
      codeLine: 12,
    });

    return { steps };
  }

  /**
   * Sort the Doubly Linked List using Merge Sort: O(n log n) Time, O(log n) Space
   */
  public sort(compareFn: (a: T, b: T) => number): { steps: TraversalStep[] } {
    const steps: TraversalStep[] = [];
    if (!this.head || !this.head.next) {
      return { steps };
    }

    // Convert to array for stable pointer-safe re-linking
    const items = this.toArray();
    items.sort(compareFn);

    // Rebuild the linked list structure with existing memory addresses
    const nodes: ListNode<T>[] = [];
    let curr: ListNode<T> | null = this.head;
    while (curr) {
      nodes.push(curr);
      curr = curr.next;
    }

    // Re-assign sorted data
    for (let i = 0; i < items.length; i++) {
      nodes[i].data = items[i];
      nodes[i].id = items[i].id;
      steps.push({
        nodeId: nodes[i].id,
        action: 'swapping',
        message: `Placed sorted item into node ${nodes[i].memoryAddress}`,
        codeLine: 8,
      });
    }

    return { steps };
  }

  /**
   * Clear list
   */
  public clear(): void {
    let current = this.head;
    while (current) {
      const next = current.next;
      current.prev = null;
      current.next = null;
      current = next;
    }
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  /**
   * Convert list to array of data items
   */
  public toArray(): T[] {
    const result: T[] = [];
    let current = this.head;
    while (current) {
      result.push(current.data);
      current = current.next;
    }
    return result;
  }

  /**
   * Serialize for visualizer state rendering
   */
  public serialize(): SerializedNode<T>[] {
    const serialized: SerializedNode<T>[] = [];
    let current = this.head;
    let idx = 0;

    while (current) {
      serialized.push({
        id: current.id,
        memoryAddress: current.memoryAddress,
        data: current.data,
        nextAddress: current.next ? current.next.memoryAddress : null,
        prevAddress: current.prev ? current.prev.memoryAddress : null,
        nextId: current.next ? current.next.id : null,
        prevId: current.prev ? current.prev.id : null,
        index: idx,
      });
      current = current.next;
      idx++;
    }

    return serialized;
  }
}
