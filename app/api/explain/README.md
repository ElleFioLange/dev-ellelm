# Explain API Route

## [Route](route.ts)

- Takes an array of strings
- Matches strings to keywords
- Assembles context for keywords from prewritten context strings
- Calls LLM API with keyword context and situational context
  - E.G. - "A viewer of my personal portfolio site wants to know more about..."
- Returns stream to front-end

## [Keyword context](/utils/keywords)

- Keyword utility files are structured with each keyword having an individual file
  - Filenames replace spaces with hyphens and are all lowercase
- Context info is written as a string literal (``) with a leading newline for readability
- Files are imported into the [index file](/utils/keywords/index.ts) and exported as a composite object with keys matching the keyword name
  - Keywords with spaces or punctuation are imported as objects named acording to <ins>camelCase</ins> and then remapped in the final export statement

## [Relations](/utils/keywords/relations)

- Keywords which are related have context written about their relationship
- They are stored with a similar file structure (individual files + [index file](/utils/keywords/relations/index.ts))
- Files are named **keyword1_keyword2** with keywords organized in alphabetical order
