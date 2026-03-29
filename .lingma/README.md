# Tourbook .lingma Configuration

## Project Overview
Tourbook is a travel memoir project documenting seven overseas journeys and the process of self-disillusionment. It employs a dual-gaze narrative technique (past "I" vs present "I") for self-deconstruction.

## Directory Structure
```
.lingma/
├── config.json              # Main configuration file
├── .lingmaignore            # File access rules
├── rules/                   # Rules directory
│   ├── file-access.md       # File access rules
│   ├── code-style.md        # Code style rules
│   └── writing-style.md     # Writing style guide
├── skills/                  # Skills directory
│   ├── autobiography-editor/
│   │   └── SKILL.md         # English autobiography editing skill
│   └── travel-editor/
│       └── SKILL.md         # Travel narrative editing skill
├── agents/                  # Agent configurations
│   └── tourbook-assistant.json  # Main assistant agent
└── README.md                # This file
```

## Quick Start

### Default Agent
Use `tourbook-assistant` as your default helper. It integrates all relevant skills:
- **autobiography-editor**: English grammar and structure refinement
- **travel-editor**: Narrative flow and emotional authenticity

### Accessing Files
When working with the project:
- ✅ **Allowed**: `docs/*.md` and `docs/assets/confidential/*.mdx`
- ❌ **Forbidden**: `docs/assets/confidential/*.md` (raw drafts)

### Custom Components
This project uses custom markdown components (`<a-flight>`, `<a-map>`, `<a-img>`, etc.). When editing:
- Never modify component syntax unless fixing errors
- Preserve all attributes exactly
- Maintain component block integrity

## Configuration Details

### Core Settings (`config.json`)
- **Project Type**: travel-memoir
- **Privacy**: private
- **Primary Language**: English (content)
- **Secondary Language**: Chinese (explanations)
- **Custom Component Prefix**: `a-`

### File Patterns
**Included:**
- `**/*.md` - Markdown files
- `**/*.mdx` - MDX files
- `**/*.json` - JSON configuration
- `**/*.js` - JavaScript scripts

**Excluded:**
- `docs/assets/confidential/*.md` - Raw confidential drafts
- `node_modules/**` - Dependencies
- `.git/**` - Git metadata

### Enabled Rules
1. **file-access**: Controls which files can be accessed
2. **code-style**: Defines custom component syntax rules
3. **writing-style**: Establishes narrative voice and tone guidelines

## Skills

### autobiography-editor
**Purpose**: Analyze and refine English autobiography content

**Capabilities**:
- Grammar correction and structural improvement
- TEM-4 level vocabulary maintenance
- Original voice preservation
- Minimal change principle

**When to Use**:
- Polishing English narrative fragments
- Fixing grammatical errors
- Improving sentence structure
- Integrating Chinese supplementary content

### travel-editor
**Purpose**: Edit travel narrative with focus on emotional authenticity

**Capabilities**:
- Dual-gaze technique preservation
- Emotional arc validation (Ambition → Action → Failure → Emptiness)
- Character consistency ("Precise Waste" archetype)
- Cultural authenticity checks

**When to Use**:
- Editing complete journey chapters
- Refining narrative flow
- Checking emotional progression
- Balancing past/present voices

## Agent

### tourbook-assistant
The main assistant that combines all skills and understands project context.

**Features**:
- Understands seven-journey structure
- Protects confidential materials
- Preserves dual-gaze narrative technique
- Maintains chronological integrity
- Applies minimal changes principle

**Default Behaviors**:
- Respond in Chinese for explanations
- Keep content in English
- Preserve author's voice
- Protect custom components
- Maintain chronology

## Writing Style Guide

### Narrative Technique
**Dual Gaze**: Two voices operating simultaneously
- **Past "I"**: Arrogant, restless traveler (the skeleton)
- **Present "I"**: Ashamed, analyzing observer (the muscle)

Example:
> Past: "I had meticulously planned every detail of the route..."
> Present: "I thought control meant respect. Now I see it was just an excuse to avoid real intimacy."

### Character Archetype
**"The Precise Waste"** - Maintain these contradictions:
- Over-planning routes vs. emotional unpreparedness
- Craving connection but only consuming experiences
- Missing what's valuable until it's gone

### Emotional Tones
- **Primary**: Slate Blue (cold, introspective, like deep-sea diving)
- **Secondary**: Rust Red (physical shame of memories)

### Journey Structure
Each of the seven tours follows:
1. **Ambition** (Planning phase)
2. **Action** (Experiences and encounters)
3. **Failure** (Emptiness and disillusionment)

## Usage Examples

### Example 1: Grammar Correction
```markdown
User: [Provides English fragment with grammar issues]

Assistant responds with:
## 问题分析
### 语法问题
1. [Specific issue with example]

## 修改建议
[Explanation of changes]

## 修订内容
[Corrected English version]
```

### Example 2: Narrative Flow
```markdown
User: How's the transition between these two paragraphs?

Assistant analyzes:
- Paragraph coherence
- Emotional continuity
- Dual-gaze balance
- Provides specific suggestions
```

### Example 3: Component Validation
```markdown
User: Is this flight component correct?

Assistant validates:
- IATA airport codes
- Datetime format
- Flight number pattern
- Confirms or flags issues
```

## Special Instructions

### Always Remember
1. Respect the dual-gaze narrative technique
2. Never modify custom component syntax unless fixing errors
3. Preserve the "Precise Waste" character archetype
4. Maintain chronological integrity (Tour 1 → Tour 7)
5. Protect confidential draft files
6. Apply minimal changes principle
7. Explain how changes affect emotional tone
8. Check for Chinglish patterns
9. Preserve sensory details
10. Ask before making significant structural changes

### Clarification Needed When
- Emotional tone shifts dramatically without setup
- Timeline becomes unclear or contradictory
- Character motivation seems inconsistent
- Cultural details appear inaccurate
- User requests comparison between .md and .mdx versions

## Project Structure Reference

### Public Content
- `docs/README.md` - Introduction
- `docs/episode-1.md`, `episode-2.md` - Prelude
- `docs/1-tour.md` through `7-tour.md` - Main Chronicles
- `docs/appendix.md` - Supplementary material

### Confidential Materials
- `docs/assets/confidential/*.mdx` - Finalized personal stories
- `docs/assets/confidential/autobiography_outline.mdx` - Narrative outline

### Build System
- `package.json` - NPM scripts
- `../scripts/lib/watch` - Development server
- `../scripts/lib/encodeAll` - Build command
- `../scripts/lib/decodeAll` - Revert command

## Troubleshooting

### Common Issues

**Issue**: Component syntax broken after edit
**Solution**: Restore original component, only edit surrounding text

**Issue**: Dual gaze feels unbalanced
**Solution**: Check ratio (~70% past narrative, ~30% present commentary)

**Issue**: Emotional tone too sentimental
**Solution**: Add present "I" commentary for distance

**Issue**: Chronology confusion
**Solution**: Verify tour numbering and event sequence

## Best Practices

1. **Read First**: Understand the fragment's position in the journey arc
2. **Check Components**: Ensure all `<a-*>` tags are intact
3. **Identify Voices**: Mark past vs present narration
4. **Minimal Edits**: Apply smallest necessary changes
5. **Explain Changes**: Provide reasoning in Chinese
6. **Preserve Voice**: Author's expression is paramount
7. **Ask Questions**: When uncertain, clarify before acting

## Notes
- This is a "medical report" on forced confrontation with reality
- The goal is refinement, not rewriting
- Dual gaze is the core technique - protect it fiercely
- Seven journeys form a complete arc - maintain structural integrity
- Confidential materials require special handling

## Support
For questions about .lingma configuration or usage, refer to:
- `config.json` for project settings
- `rules/` directory for specific guidelines
- Skill documentation for editing workflows
