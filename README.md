# ⚡ NodeForge | Doubly Linked List CRUD Studio & Visualizer

A high-performance, eye-catching **CRUD Web Application** built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**, designed and powered directly by a **Doubly Linked List** Data Structure with real-time pointer canvas visualizer and complexity analyzer.

---

## 🌟 Key Features

### 1. 🧬 Doubly Linked List DSA Engine
- **In-Memory Sentinel Pointers**: `HEAD` and `TAIL` pointer tracking with simulated hexadecimal memory addresses (`0x7FA...`).
- **Bidirectional Links**: Each node maintains both `next` and `prev` references.
- **Classic Operations**:
  - `insertHead(data)`: Prepend item in **O(1)** time.
  - `insertTail(data)`: Append item in **O(1)** time.
  - `insertAt(index, data)`: Insert at $k$-th position in **O(n)** time.
  - `deleteHead()`: Pop front node in **O(1)** time.
  - `deleteTail()`: Pop end node in **O(1)** time.
  - `deleteById(id)`: Bypass pointers (`prev.next = next`, `next.prev = prev`) in **O(n)** time.
  - `update(id, data)`: Direct in-place mutation.
  - `reverse()`: In-place pointer inversion swapping `next` and `prev` in **O(n)** time.
  - `sort(compareFn)`: Pointer-safe merge sort in **O(n log n)** time.
  - `search(predicate)`: Animated linear scanner in **O(n)** time.

### 2. 🎨 Eye-Catching Cyberpunk Visualizer
- **Interactive Node Canvas**: Displays each node as an illuminated chip with its pseudo memory address, index, and data payload.
- **Dynamic Directional Arrows**: Animated bidirectional SVG arrows representing `next` and `prev` pointers.
- **NULL Terminators**: Visible `NULL` sentinel chips on the boundaries of the list.
- **Active Traversal Stepper**: Visual step-by-step scanner that highlights nodes with glowing halos and operational status messages.
- **Synthesized Web Audio API Sound Effects**: Zero external audio assets—frequency-synthesized audio tones for prepend, append, delete, traverse, and reversal chimes.

### 3. 📊 Full-Featured CRUD Dashboard
- Filter by status (`Todo`, `In Progress`, `Completed`).
- Instant status cycler.
- Search and filter records by keyword or category.
- Modal editor for allocating new nodes or mutating existing records.
- Pre-configured dataset presets (*Dev Sprint Pipeline*, *Browser History Queue*, *Audio Playlist*).

### 4. 🔬 Live DSA Code Inspector & Big-O Analyzer
- Live algorithmic complexity badges (**Time: O(1) / O(n) / O(n log n)**, **Space: O(1)**).
- Real-time TypeScript code viewer displaying the exact algorithm executed for the action.
- Execution history log with microsecond timestamp tracking.

---

## 🚀 Getting Started Locally

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev

# 3. Open in browser
http://localhost:3000
```

---

## 📦 Production Build

```bash
# Compile and optimize production bundle
npm run build

# Start production server
npm run start
```

---

## ☁️ Deployment to Vercel

### Option 1: Instant CLI Deployment
```bash
# Deploy preview build
npx vercel

# Deploy directly to production
npx vercel --prod
```

### Option 2: GitHub Repository Connection
1. Push this repository to GitHub:
   ```bash
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git branch -M main
   git push -u origin main
   ```
2. Go to [vercel.com/new](https://vercel.com/new), select your repository, and click **Deploy**.

---

## 🧠 Algorithmic Complexity Reference

| Operation | Time Complexity | Space Complexity | Description |
| :--- | :---: | :---: | :--- |
| **Insert Head (Prepend)** | $O(1)$ | $O(1)$ | Point `newNode.next` to `head`, update `head.prev` |
| **Insert Tail (Append)** | $O(1)$ | $O(1)$ | Point `tail.next` to `newNode`, update `tail` |
| **Insert at Index $k$** | $O(n)$ | $O(1)$ | Traverse to position $k$ and splice pointers |
| **Delete Head (Pop)** | $O(1)$ | $O(1)$ | Advance `head = head.next`, set `head.prev = null` |
| **Delete Tail (Pop)** | $O(1)$ | $O(1)$ | Retreat `tail = tail.prev`, set `tail.next = null` |
| **Delete by ID** | $O(n)$ | $O(1)$ | Scan list, rewire `prev.next = next` & `next.prev = prev` |
| **Search / Scan** | $O(n)$ | $O(1)$ | Sequential node-to-node pointer traversal |
| **Reverse In-Place** | $O(n)$ | $O(1)$ | Iteratively swap `next` and `prev` pointers |
| **Sort by Priority** | $O(n \log n)$ | $O(\log n)$ | Merge sort pointer partition and re-link |

---

*Engineered with Google Antigravity.*
