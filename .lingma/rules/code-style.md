# Code Style Rules

## Markdown Custom Components
This project uses custom markdown components with the `a-` prefix. Follow these conventions strictly.

### Component Syntax Rules
- Always preserve self-closing tags: `<a-component ... />` or `<a-component></a-component>`
- Never modify attribute names or values unless fixing obvious typos
- Maintain attribute order as-is (do not reorder)
- Preserve all whitespace within component blocks

### Flight Component
```markdown
<a-flight 
  flight="FD2557" 
  departure="CKG" 
  departure-time="2013-10-08 11:10" 
  destination="DMK" 
  arrive-time="2013-10-08 13:20">
</a-flight>
```
**Attributes:**
- `flight`: Flight number (airline code + numbers)
- `departure`: Departure airport IATA code (3 uppercase letters)
- `departure-time`: ISO format datetime (YYYY-MM-DD HH:mm)
- `destination`: Destination airport IATA code
- `arrive-time`: Arrival datetime

### Map Component
```markdown
<a-map 
  points="longitude,latitude,LocationName|longitude,latitude,LocationName2" 
  route='{"legs":[...],"geometry":{...}}'
  theme="dataviz"
  :padding="[8,8,8,8]">
</a-map>
```
**Validation:**
- Longitude range: -180 to 180
- Latitude range: -90 to 90
- Points separated by `|`
- Route is valid GeoJSON LineString

### Image Component
```markdown
```<a-img>
name:image_name
dir:optional_directory
```
```
**Rules:**
- `name`: Required, image filename without extension
- `dir`: Optional, defaults to root images folder

### Hotel Component
```markdown
<a-hotel 
  name="Hotel Name" 
  date="2013-10-09" 
  nights="3" 
  points="longitude,latitude">
</a-hotel>
```

### Times Component
```markdown
<a-times :times="1" location="Bangkok"></a-times>
```

### Secret Component
```markdown
<a-secret name="timeline" autoload></a-secret>
```

### Background Component
```markdown
<a-bg bg="#000" color="#fff">Text Content</a-bg>
```

## Editing Guidelines
1. **Preserve all custom component attributes exactly**
2. **Do not modify component syntax unless fixing errors**
3. **Maintain the data structure within components**
4. **When editing surrounding text, ensure component blocks remain untouched**
5. **If a component appears malformed, flag it but do not auto-fix without confirmation**

## Code Blocks
- Preserve triple backtick syntax for a-img blocks
- Do not convert between different code block styles
- Maintain indentation within code blocks
