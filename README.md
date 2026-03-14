# Sight Words Practice

A timed sight words practice app for kids, built with React and Tailwind CSS.

## Features

### Practice Mode
- Select a grade level (Pre-K through 1st Grade currently populated)
- Word lists are **cumulative** — practicing 1st Grade includes all Pre-K and Kindergarten words too
- Choose how many words to practice: pick a preset count (10, 15, 20, 25, 30...) or **All** words
- A random selection of words from the set is shown for each test
- Words are displayed one at a time on a large card; navigate forward and back with arrow buttons
- A live timer and progress indicator run during the test

### High Scores
- Top 5 scores are tracked per grade level, stored in browser `localStorage`
- Scores are ranked by **average time per word** (total time ÷ words completed), so runs with different word counts are fairly compared
- Each record shows the avg time per word, word count, and total time
- After finishing a test, you're prompted to enter your name if you made the top 5
- Use **Edit** mode on the High Scores screen to delete individual scores

### Review Mode
- Browse all words for the selected grade level in alphabetical order
- Launch a practice session directly from the review screen

## Grade Levels

| Grade | Words in Set | Cumulative Total |
|-------|-------------|-----------------|
| Pre-K | 61 | 61 |
| Kindergarten | 54 | 115 |
| 1st Grade | 45 | 160 |
| 2nd–12th Grade | — | (coming soon) |

## Running Locally

```bash
npm install
npm run dev
```
