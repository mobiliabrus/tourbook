# File Access Rules

## Confidential Assets Protection
- ✅ ALLOW: Access `docs/*.md` files
- ✅ ALLOW: Access `docs/assets/confidential/*.mdx` files  
- ❌ FORBIDDEN: Access `docs/assets/confidential/*.md` files (raw versions)
- ✅ ALLOW: Access `docs/assets/confidential/autobiography_outline.mdx` for reference

## Reason
The `.md` files in confidential directory are raw drafts, while `.mdx` files are processed versions with embedded metadata and components. Only work with finalized `.mdx` versions to maintain content integrity.

## Directory Structure
```
docs/
├── *.md (public content - ALLOWED)
├── _sidebar.md, _navbar.md, index.html (config files - ALLOWED)
└── assets/confidential/
    ├── *.mdx (finalized versions - ALLOWED)
    └── *.md (raw drafts - FORBIDDEN)
```

## Special Cases
- When user explicitly requests comparison between .md and .mdx versions, ask for clarification
- Never suggest modifications to forbidden .md files
- If a .mdx file references its .md counterpart, flag this as a potential issue
