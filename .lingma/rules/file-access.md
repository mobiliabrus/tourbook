# File Access Rules

## Confidential Assets Protection

### Access Levels

#### ✅ ALLOWED (No Permission Required)
- `docs/*.md` - Public content files
- `docs/_sidebar.md`, `docs/_navbar.md` - Navigation files
- `docs/index.html`, `docs/style.css` - Configuration files
- `docs/assets/confidential/timeline.mdx` - Timeline index (metadata only)
- `docs/assets/confidential/autobiography_outline.mdx` - Narrative outline for reference

#### ⚠️ PERMISSION REQUIRED (Must Ask First)
- `docs/assets/confidential/*.mdx` (except timeline.mdx and autobiography_outline.mdx) - Private stories
  - **Pattern**: `apple.mdx`, `hq.mdx`, `jyy.mdx`, `danni.mdx`, etc.
  - **Rule**: Must obtain explicit user permission before accessing
  - **Message**: "This is confidential content from your private stories. Do you want me to access [filename]?"
  - **Wait for**: User confirmation before proceeding
  - **Rationale**: These contain personal narratives about real people and events

#### ❌ FORBIDDEN (Never Access)
- `docs/assets/confidential/*.md` - Raw drafts
  - These are working drafts, not final versions
  - Only .mdx versions should be used

### Directory Structure
```
docs/
├── *.md (public content - ALLOWED)
├── _sidebar.md, _navbar.md (config files - ALLOWED)
└── assets/confidential/
    ├── timeline.mdx (index/metadata - ALLOWED)
    ├── autobiography_outline.mdx (narrative guide - ALLOWED)
    ├── *.mdx (private stories - PERMISSION REQUIRED)
    └── *.md (raw drafts - FORBIDDEN)
```

## Permission Workflow

### Step-by-Step Process

1. **Detect**
   - Identify that requested file matches `docs/assets/confidential/*.mdx`
   - Check if it's an exception (timeline.mdx or autobiography_outline.mdx)

2. **Pause**
   - Do not proceed with file access
   - Do not read or process the file content

3. **Ask**
   - Use this format: "I see you're asking about [filename], which is one of your confidential private stories [optional: about X person/event]. Do you want me to access this file?"
   
4. **Wait**
   - Do not continue until user explicitly agrees
   - Accept: "yes", "please", "go ahead", "sure", etc.

5. **Proceed**
   - Only after receiving clear confirmation
   - Access only the specific file mentioned

### Example Interactions

**Example 1: Single File Request**
```
User: 帮我看看 hq.mdx 里的内容

Assistant: I see you're asking about hq.mdx, which is one of your confidential private stories 
about He Qian. This contains personal content. Do you want me to access this file?

User: Yes, please.

Assistant: [Now proceeds to read the file]
```

**Example 2: Multiple Files**
```
User: 对比一下 jyy.mdx 和 dl.mdx

Assistant: This will require accessing two confidential files:
- jyy.mdx (about Jia Yangyang)
- dl.mdx (about Du Yue)

May I access both files to help with the comparison?

User: 好的

Assistant: [Now proceeds to read both files]
```

**Example 3: Contextual Reference**
```
User: 我在 1-tour.md 里提到了 RedLight，详细信息在哪？

Assistant: Your public text mentions RedLight in Tour 1 (Thailand). 
This likely references content in your private stories. 
Would you like me to check which .mdx file contains this information?
```

## Special Cases

### Timeline Exception
`docs/assets/confidential/timeline.mdx` can be accessed without permission because:
- It serves as a metadata index and table of contents
- Contains only dates, links, and brief references
- Used for chronological context and navigation
- Does not contain detailed narrative content

### Autobiography Outline Exception
`docs/assets/confidential/autobiography_outline.mdx` can be accessed without permission because:
- It provides narrative structure guidance
- Contains meta-information about the project
- Used for maintaining consistency across chapters
- Does not contain personal stories itself

### Cross-References
If a public .md file references a confidential .mdx:
- Acknowledge the reference exists
- Do not follow the link without permission
- Say: "This references [person/event] in your private stories ([filename.mdx]). Would you like me to check that?"

### Incidental Mentions
When editing public content that briefly mentions confidential content:
- Can acknowledge the mention exists
- Cannot expand on details without accessing the .mdx file
- Must ask permission before providing context from private stories

## Privacy Principles

### Respect Boundaries
- These are real people's lives and relationships
- Content is marked confidential for good reason
- Never suggest making private stories public
- Never quote from private stories in public files without permission

### Minimal Access
- Only access files specifically needed for the task
- Do not "browse" or "explore" confidential files out of curiosity
- Close files after completing the specific task

### Context Awareness
- Understand that fragments connect to broader personal narratives
- Be sensitive when handling relationship content
- Recognize that some topics may be emotionally charged

## Implementation Notes

### For LLM
When implementing these rules:
1. Always check file path against patterns before accessing
2. Maintain a mental list of which files require permission
3. Pause and ask even if you've accessed the file before
4. Be specific about which file you're asking to access
5. Respect user's decision if they decline access

### Error Handling
If you accidentally access a confidential file without permission:
1. Immediately acknowledge the mistake
2. Apologize to the user
3. Stop processing that content
4. Wait for explicit permission to continue
