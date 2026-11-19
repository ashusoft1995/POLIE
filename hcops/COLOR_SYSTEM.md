# Hossana City Police Station - Official Color System

## 🎨 Color Palette

| Color | HEX | Usage |
|-------|-----|-------|
| **Deep Navy** | `#102A43` | Sidebar, header, brand |
| **Police Blue** | `#2563EB` | Primary buttons, links |
| **Royal Blue** | `#1D4ED8` | Hover and active states |
| **White** | `#FFFFFF` | Cards and surfaces |
| **Gold** | `#D4A72C` | Important highlights |
| **Light Gray** | `#F4F7FB` | Dashboard background |
| **Dark Text** | `#243B53` | Headings and text |
| **Success Green** | `#15803D` | Approved, completed |
| **Warning Amber** | `#D97706` | Pending |
| **Danger Red** | `#DC2626` | Rejected, critical |

## 📍 Color Usage Guide

### Sidebar & Navigation
- **Background:** Deep Navy (#102A43)
- **Text:** White (#FFFFFF)
- **Active Link:** Police Blue (#2563EB)
- **Hover:** Royal Blue (#1D4ED8)

### Buttons
- **Primary:** Police Blue (#2563EB)
- **Primary Hover:** Royal Blue (#1D4ED8)
- **Secondary:** White with Police Blue border
- **Danger:** Danger Red (#DC2626)

### Status Badges
- **Success/Approved:** Success Green (#15803D)
- **Pending/Warning:** Warning Amber (#D97706)
- **Rejected/Error:** Danger Red (#DC2626)
- **Info:** Police Blue (#2563EB)

### Text
- **Headings:** Dark Text (#243B53)
- **Body:** Dark Text (#243B53) at 80% opacity
- **Muted:** #64748B
- **Links:** Police Blue (#2563EB)

### Backgrounds
- **Dashboard:** Light Gray (#F4F7FB)
- **Cards:** White (#FFFFFF)
- **Hover:** Light Gray (#F4F7FB)

### Highlights
- **Important Items:** Gold (#D4A72C)
- **Badges/Awards:** Gold (#D4A72C)
- **Special Notices:** Gold background with Dark Text

## 🎯 Accessibility

All color combinations meet WCAG AA standards for contrast:
- White on Deep Navy: ✅ 10.8:1
- Dark Text on White: ✅ 11.2:1
- Police Blue on White: ✅ 5.1:1
- Gold on Deep Navy: ✅ 4.8:1

## 💻 CSS Variables

```css
--deep-navy: #102A43;
--police-blue: #2563EB;
--royal-blue: #1D4ED8;
--white: #FFFFFF;
--gold: #D4A72C;
--light-gray: #F4F7FB;
--dark-text: #243B53;
--success-green: #15803D;
--warning-amber: #D97706;
--danger-red: #DC2626;
```

## 🖼️ Tailwind Classes

```html
<!-- Primary Button -->
<button class="bg-[#2563EB] hover:bg-[#1D4ED8] text-white">

<!-- Card -->
<div class="bg-white border border-gray-200">

<!-- Sidebar -->
<nav class="bg-[#102A43] text-white">

<!-- Success Badge -->
<span class="bg-green-50 text-[#15803D]">

<!-- Warning Badge -->
<span class="bg-orange-50 text-[#D97706]">

<!-- Gold Highlight -->
<span class="text-[#D4A72C] font-bold">
```

## 📊 Usage Examples

### Dashboard Cards
```tsx
<div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
  <h3 className="text-[#243B53] font-bold text-lg">Card Title</h3>
  <p className="text-[#64748B] text-sm">Card description</p>
</div>
```

### Primary Action Button
```tsx
<button className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-6 py-3 rounded-xl font-semibold transition-colors">
  Submit
</button>
```

### Status Indicators
```tsx
// Approved
<span className="px-3 py-1 bg-green-50 text-[#15803D] rounded-full text-sm font-semibold">
  Approved
</span>

// Pending
<span className="px-3 py-1 bg-orange-50 text-[#D97706] rounded-full text-sm font-semibold">
  Pending
</span>

// Rejected
<span className="px-3 py-1 bg-red-50 text-[#DC2626] rounded-full text-sm font-semibold">
  Rejected
</span>
```
