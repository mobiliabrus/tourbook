# Tourbook .lingma Configuration

## Project Overview
Tourbook is a travel memoir project documenting seven overseas journeys and the process of self-disillusionment. It employs a dual-gaze narrative technique (past "I" vs present "I") for self-deconstruction.

## Directory Structure
```
.lingma/
├── config.json              # Main configuration file
├── .lingmaignore            # File access rules
├── rules/                   # Rules directory
│   ├── file-access.md       # File access & permission rules
│   ├── code-style.md        # Code style rules
│   └── writing-style.md     # Writing style guide
├── skills/                  # Skills directory
│   ├── autobiography-editor/
│   │   └── SKILL.md         # English autobiography editing skill
│   ├── travel-editor/
│   │   └── SKILL.md         # Travel narrative editing skill
│   └── timeline-context/
│       └── SKILL.md         # Timeline lookup & context skill
├── agents/                  # Agent configurations
│   └── tourbook-assistant.json  # Main assistant agent
└── README.md                # This file
```

## Quick Start

### Default Agent
Use `tourbook-assistant` as your default helper. It integrates all relevant skills:
- **autobiography-editor**: English grammar and structure refinement
- **travel-editor**: Narrative flow and emotional authenticity
- **timeline-context**: Chronological context and cross-reference navigation

### Accessing Files

#### Access Levels

**✅ ALLOWED (No Permission Required)**
- `docs/*.md` - Public content files
- `docs/_sidebar.md`, `docs/_navbar.md` - Navigation files
- `docs/assets/confidential/timeline.mdx` - Timeline index
- `docs/assets/confidential/autobiography_outline.mdx` - Narrative guide

**⚠️ PERMISSION REQUIRED (Must Ask First)**
- `docs/assets/confidential/*.mdx` - Private stories (apple.mdx, hq.mdx, jyy.mdx, etc.)
  - LLM will ask: "This is confidential content from your private stories. Do you want me to access [filename]?"
  - Must wait for your explicit confirmation before proceeding

**❌ FORBIDDEN (Never Access)**
- `docs/assets/confidential/*.md` - Raw drafts

### Permission Workflow Example
```
User: 帮我看看 hq.mdx 里的内容

Assistant: I see you're asking about hq.mdx, which is one of your confidential 
private stories about He Qian. This contains personal content. 
Do you want me to access this file?

User: Yes, please.

Assistant: [Now proceeds to read the file]
```

## Configuration Details

### Core Settings (`config.json`)
- **Project Type**: travel-memoir
- **Privacy**: private
- **Primary Language**: English (content)
- **Secondary Language**: Chinese (explanations)
- **Custom Component Prefix**: `a-`
- **Permission Rules**: Explicit consent required for confidential .mdx files

### File Patterns
**Included:**
- `**/*.md` - Markdown files
- `**/*.mdx` - MDX files (with permission requirements)
- `**/*.json` - JSON configuration
- `**/*.js` - JavaScript scripts

**Excluded:**
- `docs/assets/confidential/*.md` - Raw confidential drafts
- `node_modules/**` - Dependencies
- `.git/**` - Git metadata

**Require Permission:**
- `docs/assets/confidential/*.mdx` - Private stories (except timeline & outline)

### Enabled Rules
1. **file-access**: Controls file access levels + permission workflow
2. **code-style**: Defines custom component syntax rules
3. **writing-style**: Establishes narrative voice and tone guidelines
4. **privacy-protection**: Enforces consent-based access to personal stories

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

### timeline-context
**Purpose**: Provide chronological context and navigation assistance

**Capabilities**:
- Timeline lookup (dates, sequences, relationships)
- Cross-reference mapping between files
- Structural overview provision
- Context awareness during editing

**Access Level**: ✅ Can freely access `timeline.mdx`

**When to Use**:
- "When did this event happen?"
- "What came before/after this?"
- "Which file covers this person?"
- "Show me the overall structure"
- Automatically provides context while editing

## Agent

### tourbook-assistant
The main assistant that combines all skills and understands project context.

**Features**:
- Understands seven-journey structure
- Protects confidential materials with permission workflow
- Preserves dual-gaze narrative technique
- Maintains chronological integrity
- Applies minimal changes principle
- Respects privacy boundaries

**Default Behaviors**:
- Respond in Chinese for explanations
- Keep content in English
- Preserve author's voice
- Protect custom components
- Maintain chronology
- **Ask permission before accessing private stories**
- Respect user's privacy decisions

**Special Instructions**:
1. Respect dual-gaze narrative technique
2. Never modify custom component syntax unless fixing errors
3. Preserve "Precise Waste" character archetype
4. Maintain chronological integrity (Tour 1-7)
5. **PROTECT PRIVACY**: Ask before accessing confidential .mdx files
6. Apply minimal changes principle
7. Explain how changes affect emotional tone
8. Check for Chinglish patterns
9. Preserve sensory details
10. Ask before making significant structural changes
11. Use timeline-context for chronological awareness
12. Respect user's decision if they decline file access

## Privacy Protection

### Three Access Levels

#### Level 1: Public Content (Free Access)
- All `docs/*.md` files
- Navigation and configuration files
- Timeline index and autobiography outline

#### Level 2: Private Stories (Permission Required)
- Personal narratives about real people
- Confidential relationship accounts
- Intimate emotional experiences

**Rule**: LLM must ask: "This is confidential content from your private stories. Do you want me to access [filename]?"

**Wait for**: Your explicit "yes", "please", "go ahead", or equivalent

#### Level 3: Raw Drafts (Never Access)
- Working drafts in `.md` format
- Unfinished or abandoned content
- Internal working documents

### Why Privacy Matters
These are real people's lives and relationships. The confidential designation:
- Protects your privacy and theirs
- Prevents accidental exposure of sensitive content
- Gives you control over what gets processed
- Maintains ethical boundaries around personal narratives

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

### Example 2: Timeline Context
```markdown
User: 我遇到张丹妮是什么时候？

Assistant checks timeline.mdx:
## Time Reference

**Event**: Meeting Zhang Danni
**Date**: January 2014
**Chapter**: Tour II - Backpacking (2-tour.md)
**Context**: During solo travel to Malaysia (Kota Kinabalu, Mabul)
```

### Example 3: Permission Request
```markdown
User: 对比一下 jyy.mdx 和 dl.mdx

Assistant: This will require accessing two confidential files:
- jyy.mdx (about Jia Yangyang)
- dl.mdx (about Du Yue)

May I access both files to help with the comparison?

User: 好的

Assistant: [Now proceeds to read both files]
```

## Best Practices

### For Users
1. ✅ Clearly state which files you want to work on
2. ✅ Grant permission explicitly when asked
3. ✅ Provide context about which time period/journey
4. ✅ Specify if you need timeline context automatically
5. ❌ Don't expect LLM to remember confidential content between sessions

### For LLM
1. ✅ Always check file access level before reading
2. ✅ Pause and ask when confidential file is requested
3. ✅ Be specific about which file you're asking to access
4. ✅ Wait for clear confirmation before proceeding
5. ✅ Use timeline.mdx frequently for context
6. ✅ Respect user's privacy decisions
7. ✅ Never quote private stories in public files without permission

## Troubleshooting

### Common Issues

**Issue**: LLM accessed confidential file without asking
**Solution**: Remind it of the permission rule. It should apologize and wait for consent.

**Issue**: Can't find information about a person/event
**Solution**: Check timeline.mdx first - it has the master index with links

**Issue**: Timeline shows different date than chapter
**Solution**: Flag the inconsistency. Timeline.mdx is usually authoritative.

**Issue**: Need context but don't want to share private story
**Solution**: Ask LLM to check timeline.mdx only - it has metadata without details

## Notes
- This is a "medical report" on forced confrontation with reality
- The goal is refinement, not rewriting
- Dual gaze is the core technique - protect it fiercely
- Seven journeys form a complete arc - maintain structural integrity
- **Privacy protection is paramount - always respect boundaries**
- Timeline.mdx is your friend - use it for navigation and context

## Support
For questions about .lingma configuration or usage, refer to:
- `config.json` for project settings and permission rules
- `rules/file-access.md` for detailed permission workflow
- `skills/timeline-context/SKILL.md` for timeline usage
- `agents/tourbook-assistant.json` for agent capabilities
