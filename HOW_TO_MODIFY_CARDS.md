# How to Modify Cards - Quick Guide

## Making a Card Wider (Span 2 Columns)

It's incredibly simple! Just add the `wide` class to any card component.

### Example: Making Projects Card Wider

**Before**:
```jsx
<BaseCard className="card card-projects">
```

**After**:
```jsx
<BaseCard className="card wide card-projects">
```

That's it! The card will now span 2 columns on desktop and tablet, and automatically adjust to 1 column on mobile.

### Other Size Options

- **Normal card**: No additional class needed (spans 1 column)
- **Wide card**: Add `wide` class (spans 2 columns)
- **Tall card**: Add `tall` class (spans 2 rows)
- **Wide AND Tall**: Add both `wide tall` classes (spans 2x2 grid)

```jsx
{/* Examples */}
<BaseCard className="card">              {/* 1x1 */}
<BaseCard className="card wide">         {/* 2x1 */}
<BaseCard className="card tall">         {/* 1x2 */}
<BaseCard className="card wide tall">    {/* 2x2 */}
```

---

## Adding a New Card

I've created a **ContactCard** as an example. Here's how to add it:

### Step 1: Import and Add to App.jsx

File: `src/App.jsx`

**Add the import at the top**:
```jsx
import ContactCard from './components/ContactCard/ContactCard.jsx'
```

**Add to the card grid**:
```jsx
<main className="card-grid">
  {/* Other cards... */}
  <ContactCard />
</main>
```

Done! The new card is now visible.

---

## Creating Your Own Card from Scratch

### 1. Create the Component Files

Create a new folder: `src/components/YourCardName/`

**YourCardName.jsx**:
```jsx
import { motion } from "framer-motion";
import BaseCard from "../BaseCard/BaseCard";
import "./YourCardName.css";

function YourCardName() {
  return (
    <BaseCard className="card card-yourname">
      <div className="yourname-content">
        <h2 className="yourname-title">Your Title</h2>
        {/* Your content here */}
      </div>
    </BaseCard>
  );
}

export default YourCardName;
```

**YourCardName.css**:
```css
.yourname-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: clamp(12px, 2%, 16px);
  overflow-y: auto;
  min-height: 0;
}

.yourname-title {
  font-size: clamp(16px, 2.5vw, 20px);
  font-weight: 600;
  opacity: 0.95;
  margin: 0;
  flex-shrink: 0;
}

/* Add your custom styles using clamp() for responsiveness */
```

### 2. Import in App.jsx

```jsx
import YourCardName from './components/YourCardName/YourCardName.jsx'
```

### 3. Add to Grid

```jsx
<main className="card-grid">
  {/* Other cards... */}
  <YourCardName />
</main>
```

---

## Swapping Cards Around

Want the WorldCard in position 1 and HeroCard in position 5? Just swap them in the JSX:

**Before**:
```jsx
<HeroCard />
<SkillsCard />
<ExperienceCard />
<ProjectsCard />
<WorldCard />
```

**After**:
```jsx
<WorldCard />
<SkillsCard />
<ExperienceCard />
<ProjectsCard />
<HeroCard />
```

The grid automatically handles the layout!

---

## Tips for Custom Content

### Use clamp() for Responsive Sizing

Always use `clamp()` for sizes that should scale:

```css
/* Font sizes */
font-size: clamp(12px, 2vw, 16px);
/*           min   preferred  max */

/* Padding */
padding: clamp(10px, 2%, 14px);

/* Gaps */
gap: clamp(8px, 1.5%, 12px);

/* Margins */
margin-bottom: clamp(6px, 1%, 10px);
```

### Prevent Text Cutoff

For text that might overflow:

```css
.your-text-element {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

For multi-line text that should wrap:

```css
.your-text-element {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3; /* Show 3 lines max */
  -webkit-box-orient: vertical;
}
```

### Make Content Scrollable

If your content might overflow:

```css
.your-content-container {
  overflow-y: auto;
  min-height: 0; /* Important for flex children */
}

/* Custom scrollbar (optional) */
.your-content-container::-webkit-scrollbar {
  width: 4px;
}

.your-content-container::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 4px;
}
```

---

## Available CSS Variables

Use these for consistent theming:

```css
var(--bg-primary)      /* #0a0a0a - Main background */
var(--bg-card)         /* rgba(20, 20, 20, 0.8) - Card background */
var(--bg-card-solid)   /* #141414 - Solid card background */
var(--border-color)    /* #2a2a2a - Card borders */
var(--text-primary)    /* #ffffff - Primary text */
var(--text-secondary)  /* #888888 - Secondary text */
var(--accent-color)    /* #4ade80 - Green accent */
var(--accent-pink)     /* #ec4899 - Pink accent */
var(--accent-cyan)     /* #22d3ee - Cyan accent */
```

**Example**:
```css
.my-element {
  color: var(--accent-color);
  border: 1px solid var(--border-color);
  background: var(--bg-card);
}
```

---

## Quick Reference

| Task | How to Do It |
|------|-------------|
| Make card wide | Add `wide` class |
| Make card tall | Add `tall` class |
| Add new card | Create component → Import → Add to grid |
| Reorder cards | Move JSX in App.jsx |
| Remove card | Delete or comment out in App.jsx |
| Scale text | Use `clamp(min, preferred, max)` |
| Add animation | Import Framer Motion, use `motion` components |
| Custom scrollbar | See scrollbar CSS example above |

---

## That's It!

The entire system is designed to be:
- ✅ **Simple**: Just add/remove/reorder components
- ✅ **Scalable**: Everything uses clamp() for responsive sizing
- ✅ **Flexible**: Cards work in any position
- ✅ **Consistent**: All cards follow the same patterns

Happy building! 🚀
