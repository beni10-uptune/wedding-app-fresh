# Wedding Music Builder - Enhanced Song Management PRD

## Executive Summary
Transform the song management experience with intuitive drag-and-drop functionality, flexible playlist assignment, and seamless reordering capabilities across all three panes of the wedding music builder.

## Current Pain Points
1. **Immutable Songs**: Once added, songs cannot be removed or reordered
2. **Limited Playlist Assignment**: Songs from curated collections can only go to the selected timeline moment
3. **No Visual Feedback**: Unclear which playlist is active when adding songs
4. **Rigid Structure**: No way to move songs between different wedding moments

## Proposed Solution

### 1. Drag-and-Drop System

#### Core Interactions
- **Drag from Search (Left Pane)** → Drop on any timeline moment
- **Drag from Collections (Middle Pane)** → Drop on any timeline moment  
- **Drag within Timeline (Right Pane)** → Reorder or move between moments
- **Drag out of Timeline** → Remove song (with visual trash zone)

#### Visual Feedback
- **Dragging State**: Song card becomes semi-transparent with cursor
- **Valid Drop Zones**: Highlight potential drop areas with dashed borders
- **Hover Effects**: Show insertion point between songs
- **Remove Zone**: Red-tinted area appears at bottom when dragging from timeline

### 2. Alternative Adding Methods

#### Method A: Smart Add Button
- Each song has a dropdown "Add to..." button
- Shows all wedding moments with current song counts
- Recently used moments appear at top
- Visual preview of where song will go

#### Method B: Context Menu
- Right-click any song for options:
  - Add to → [Submenu of moments]
  - Preview
  - View on Spotify
  - Find similar songs

#### Method C: Keyboard Shortcuts
- Select song + number keys (1-9) for quick add to moments
- Delete key removes selected songs
- Arrow keys to reorder within timeline

### 3. Timeline Enhancements

#### Song Management
- **Inline Controls**: Each song has grab handle, play button, remove button
- **Bulk Actions**: Select multiple songs with checkbox or shift-click
- **Undo/Redo**: Full history of changes with Cmd+Z support
- **Duration Warnings**: Visual indicators when moments are too long/short

#### Visual Improvements
```
┌─────────────────────────────────┐
│ 🎵 First Dance (3:45 / 4:00)   │ ← Progress bar
├─────────────────────────────────┤
│ ⋮⋮ Perfect - Ed Sheeran    3:23│ ← Drag handle
│    [▶️] [❤️]              [✕]   │ ← Actions
│ ⋮⋮ All of Me - John Legend 4:29│
│    [▶️] [❤️]              [✕]   │
├─────────────────────────────────┤
│ + Add another song             │
└─────────────────────────────────┘
```

### 4. Smart Features

#### Auto-Suggestions
- "This moment needs 2 more minutes of music"
- "Similar energy songs you might like"
- "Popular songs for this moment"

#### Playlist Templates
- Quick-apply curated sets to moments
- "Replace all" or "Add to existing"
- Save custom templates

#### Flow Analysis
- Visual energy flow across timeline
- Warnings for jarring transitions
- AI-powered flow optimization

## Implementation Phases

### Phase 1: Core Drag-and-Drop (Week 1)
1. Implement drag-and-drop library (react-beautiful-dnd or @dnd-kit)
2. Add drag handlers to all song cards
3. Create drop zones in timeline
4. Implement reordering within moments
5. Add remove functionality

### Phase 2: Enhanced Adding Methods (Week 1)
1. Add dropdown "Add to..." buttons
2. Implement context menus
3. Add keyboard shortcuts
4. Create visual feedback system

### Phase 3: Timeline Improvements (Week 2)
1. Add inline controls to timeline songs
2. Implement bulk selection
3. Add undo/redo system
4. Create duration warnings

### Phase 4: Smart Features (Week 2)
1. Add auto-suggestions
2. Implement playlist templates
3. Create flow analysis
4. Add AI optimization

## Technical Architecture

### Components Structure
```
<DndContext>
  <SearchPane>
    <DraggableSong />
  </SearchPane>
  
  <CollectionsPane>
    <DraggableSong />
  </CollectionsPane>
  
  <TimelinePane>
    <DroppableMoment>
      <SortableSong />
    </DroppableMoment>
  </TimelinePane>
  
  <TrashZone />
</DndContext>
```

### State Management
```typescript
interface TimelineState {
  moments: {
    [momentId: string]: {
      songs: Song[]
      targetDuration: number
    }
  }
  draggedSong: Song | null
  selectedSongs: string[]
  history: TimelineAction[]
  historyIndex: number
}
```

### Key Libraries
- **@dnd-kit/sortable**: Modern, accessible drag-and-drop
- **framer-motion**: Smooth animations
- **react-hotkeys-hook**: Keyboard shortcuts
- **immer**: Immutable state updates

## Success Metrics
1. **Time to Add Song**: Reduce from 3 clicks to 1 drag
2. **Error Rate**: Less than 1% accidental deletions
3. **Engagement**: 80% of users use drag-and-drop
4. **Satisfaction**: Positive feedback on flexibility

## Edge Cases
1. **Long Song Lists**: Virtual scrolling for performance
2. **Mobile Support**: Touch-friendly tap-to-select flow
3. **Accessibility**: Full keyboard navigation
4. **Conflict Resolution**: Duplicate songs warning
5. **Network Issues**: Offline queue for changes

## Visual Design

### Drag States
- **Default**: Normal appearance
- **Hovering**: Slight scale and shadow
- **Dragging**: 0.8 opacity, follows cursor
- **Can Drop**: Green border on drop zone
- **Cannot Drop**: Red tint, shake animation

### Drop Zones
- **Empty Moment**: Large dashed border box
- **Between Songs**: Blue line appears on hover
- **Trash Zone**: Red gradient appears at bottom

## Migration Strategy
1. Add new UI without removing old buttons
2. Show tooltip: "Try dragging songs!"
3. Track usage of both methods
4. Gradually phase out old method

## Future Enhancements
1. **Collaborative Editing**: See other users' cursors
2. **Version History**: Save/restore timeline versions
3. **AI DJ**: "Generate perfect flow" button
4. **Spotify Integration**: Drag directly from Spotify playlists
5. **Mobile App**: Native drag-and-drop on mobile

---

This PRD focuses on creating an intuitive, flexible, and delightful experience for managing wedding music. The drag-and-drop system will feel natural and responsive, while alternative methods ensure accessibility for all users.