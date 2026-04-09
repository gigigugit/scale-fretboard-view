# Scale Fretboard Viewer

A professional web-based tool for visualizing musical scales on stringed instruments, recreating and enhancing a desktop PyQt application for musicians to explore scale patterns across the fretboard.

**Experience Qualities**:
1. **Immediate** - All changes to controls update the fretboard display instantly with no loading states, creating a fluid exploration experience
2. **Professional** - Clean typography, precise spacing, and thoughtful color choices create a tool that feels purpose-built for serious practice
3. **Intuitive** - Controls are organized logically with clear labels, and the relationship between settings and output is immediately obvious

**Complexity Level**: Light Application (multiple features with basic state)
This is a single-purpose tool with interconnected controls and dual output modes (visual + text), but no authentication, data persistence across sessions, or complex user flows.

## Essential Features

### Instrument & Tuning Selection
- **Functionality**: Choose between Guitar and Banjo, then select from instrument-specific tunings
- **Purpose**: Different instruments have different string counts, tunings, and fret ranges
- **Trigger**: User selects from instrument dropdown
- **Progression**: Select instrument → Tuning dropdown updates with available tunings → String count adjusts → Max fret updates to default → Fretboard re-renders
- **Success criteria**: Tuning options refresh correctly, string ranges adjust automatically, default max frets apply (Guitar: 18, Banjo: 22)

### Scale Configuration
- **Functionality**: Select musical key (C-B with flats) and scale type (Major, Minor, Pentatonic Major, Pentatonic Minor)
- **Purpose**: Define which notes appear on the fretboard
- **Trigger**: User changes key or scale dropdown
- **Progression**: Select key → Select scale → Scale intervals calculate note set → Degree checkboxes enable/disable based on scale length → Fretboard updates
- **Success criteria**: Correct notes display, pentatonic scales disable degrees VI and VII, note naming uses musician-friendly flats (Eb, Bb, Ab)

### Display Mode & Degree Filtering
- **Functionality**: Toggle between Fret Number, Note, and Interval display; check/uncheck scale degrees I-VII
- **Purpose**: Show different information types and filter visible positions
- **Trigger**: User selects display mode or toggles degree checkbox
- **Progression**: Change display mode → Labels update in both views → Uncheck degree III → All 3rd scale degree positions hide
- **Success criteria**: Both visual and text outputs reflect current display mode and active degrees synchronously

### Fret & String Range Controls
- **Functionality**: Set start fret, end fret, high string, and low string; adjust max fret
- **Purpose**: Focus on specific fretboard regions for practice
- **Trigger**: User adjusts numeric inputs or selects from dropdowns
- **Progression**: Set start fret to 5 → Set end fret to 12 → Only frets 5-12 display → Set high string to 3 → Top strings filter out
- **Success criteria**: Ranges validate correctly, string numbers stay within bounds, fretboard crops to selection

### Visual Fretboard Rendering
- **Functionality**: Draw fretboard with strings, frets, markers, and active note positions
- **Purpose**: Provide spatial/visual reference for scale patterns
- **Trigger**: Any control change
- **Progression**: Control changes → Calculate active positions → Render grid → Place markers → Label notes according to display mode
- **Success criteria**: Strings display high-to-low, fret markers appear at 0,1,3,5,7,9,12,15,17, active positions show correct labels

### Text/Tab Output
- **Functionality**: Generate tablature-style text representation with header and fret markers
- **Purpose**: Copy-pasteable format for sharing or printing
- **Trigger**: Any control change
- **Progression**: Control changes → Generate header line → Create fret marker row → Build string rows with note positions → Display in monospace
- **Success criteria**: Format matches desktop app, inactive positions show "--", header shows current settings

### Output Actions
- **Functionality**: Copy to clipboard, download as .txt, reset to defaults
- **Purpose**: Export results and quickly return to starting configuration
- **Trigger**: User clicks action button
- **Progression**: Click Copy → Text output copies → Toast confirms → Click Download → Browser downloads .txt file → Click Reset → All controls return to defaults
- **Success criteria**: Clipboard works, file downloads with correct content, reset returns to sensible starting state

## Edge Case Handling

- **Invalid fret ranges**: If start > end, automatically swap or clamp values
- **String range out of bounds**: Limit high/low string selectors to actual string count
- **Empty degree selection**: If all degrees unchecked, show message or re-enable at least one
- **Display mode changes**: Smoothly update labels without layout shift
- **Mobile narrow screens**: Stack controls vertically, make fretboard scrollable horizontally
- **Long tuning names**: Truncate or wrap in dropdowns
- **Copy on unsupported browsers**: Show fallback message if clipboard API unavailable

## Design Direction

The design should evoke a focused, professional music practice tool—like a high-quality tuner app or DAW interface. Dark backgrounds reduce eye strain during long practice sessions, while warm orange accents provide visual energy without distraction. The interface should feel precise and technical, with clear hierarchies that guide the eye from controls to output. Typography should be clean and legible, spacing generous enough to avoid crowding, and interactive elements should respond immediately to create a sense of direct manipulation.

## Color Selection

Inspired by music production tools and practice apps, the palette centers on deep charcoal backgrounds with warm orange accents that feel inviting and energetic.

- **Primary Color**: Warm Orange `oklch(0.65 0.15 45)` (#CC7033 territory) - Communicates focus, creativity, and warmth; used for primary buttons and active states
- **Secondary Colors**: 
  - Deep Charcoal `oklch(0.20 0 0)` (#202020 territory) for main background
  - Dark Gray `oklch(0.25 0 0)` for panels and cards
  - Medium Gray `oklch(0.35 0 0)` for inputs
- **Accent Color**: Bright Orange `oklch(0.70 0.18 45)` (#DD8052 territory) - Brighter variant for hovers and emphasis
- **Foreground/Background Pairings**:
  - Background (Deep Charcoal oklch(0.20 0 0)): Light Gray text (oklch(0.90 0 0)) - Ratio 12.4:1 ✓
  - Card (Dark Gray oklch(0.25 0 0)): Light Gray text (oklch(0.90 0 0)) - Ratio 10.8:1 ✓
  - Primary (Warm Orange oklch(0.65 0.15 45)): White text (oklch(1 0 0)) - Ratio 4.6:1 ✓
  - Muted (Medium Gray oklch(0.35 0 0)): Light Gray text (oklch(0.90 0 0)) - Ratio 7.2:1 ✓

## Font Selection

Typography should be clean, technical, and highly legible—balancing modern sans-serif for UI elements with monospace for the tab output that demands character alignment.

- **Primary Font**: Space Grotesk - A geometric sans with technical character but friendly curves, perfect for a music tool
- **Monospace Font**: JetBrains Mono - Designed for readability with clear character distinction, ideal for tab/text output

- **Typographic Hierarchy**:
  - H1 (App Title): Space Grotesk Bold / 32px / tight letter-spacing / orange accent color
  - H2 (Section Headers): Space Grotesk SemiBold / 18px / normal spacing / light gray
  - Body (Controls, Labels): Space Grotesk Regular / 14px / normal spacing / light gray
  - Code (Tab Output): JetBrains Mono Regular / 13px / monospace / light gray on dark panel

## Animations

Animations should be subtle and purposeful, reinforcing the immediate feedback loop without adding perceived latency. Use micro-interactions to confirm user actions and smooth transitions to maintain context during state changes. Avoid flashy effects that distract from the core workflow.

Key moments:
- Checkbox toggles: 150ms ease for check state with subtle scale
- Button presses: Quick shadow/brightness shift (100ms) to feel tactile
- Fretboard updates: No animation—instant updates feel more responsive
- Toast notifications: Slide in from top with 200ms ease-out, auto-dismiss after 2s
- Dropdown opens: 150ms ease with subtle fade and slide

## Component Selection

- **Components**:
  - **Select** (Shadcn): For instrument, tuning, key, scale, display mode dropdowns—styled with dark backgrounds and orange focus states
  - **Checkbox** (Shadcn): For scale degree toggles (I-VII)—custom orange check color
  - **Input** (Shadcn): For numeric fret/string ranges and max fret
  - **Button** (Shadcn): For Copy, Download, Reset actions—primary variant uses orange, secondary uses muted gray
  - **Card** (Shadcn): To contain controls panel, visual fretboard, and text output—dark gray background with subtle border
  - **Label** (Shadcn): For all form controls with clear contrast
  - **Separator** (Shadcn): To divide control sections
  - **Sonner Toast**: For copy confirmations and error messages

- **Customizations**:
  - **Fretboard Grid Component**: Custom SVG or Canvas-based grid for visual fretboard with string lines, fret divisions, and note circles
  - **Tab Output Display**: Custom monospace pre-formatted text block with scroll
  - **Control Panel Layout**: Custom flex/grid wrapper for responsive control organization

- **States**:
  - Buttons: Default (orange bg) → Hover (brighter orange) → Active (darker, inset shadow feel) → Disabled (muted gray, reduced opacity)
  - Inputs: Default (dark border) → Focus (orange ring) → Disabled (grayed out)
  - Checkboxes: Unchecked (dark border) → Checked (orange fill with white checkmark) → Disabled (grayed)
  - Dropdowns: Closed → Open (dropdown panel with orange highlight on selected item)

- **Icon Selection**:
  - Copy: `@phosphor-icons/react` Copy icon
  - Download: `@phosphor-icons/react` Download icon
  - Reset: `@phosphor-icons/react` ArrowCounterClockwise icon
  - Instrument: `@phosphor-icons/react` GuitarIcon (if available) or MusicNote

- **Spacing**:
  - Section padding: 6 (1.5rem / 24px)
  - Card padding: 4-6 (1-1.5rem / 16-24px)
  - Control gaps: 4 (1rem / 16px) for related items, 6 (1.5rem / 24px) for sections
  - Label-to-input gap: 2 (0.5rem / 8px)
  - Button group gap: 2-3 (0.5-0.75rem / 8-12px)

- **Mobile**:
  - Controls: Stack vertically with full width inputs on <768px
  - Fretboard: Allow horizontal scroll on narrow screens, maintain aspect ratio
  - Text output: Full width with horizontal scroll for long lines
  - Action buttons: Stack vertically or wrap on mobile
  - Hide or collapse less critical controls on very small screens
  - Use bottom sheet or drawer for control panel on mobile if needed
