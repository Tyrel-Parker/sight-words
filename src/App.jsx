import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Trophy, Home, Play, BookOpen, Trash2 } from 'lucide-react';

// Add CSS for safe areas
const safeAreaStyles = `
  .pb-safe {
    padding-bottom: max(1rem, env(safe-area-inset-bottom));
  }
  
  @supports (height: 100dvh) {
    .dvh-full {
      height: 100dvh;
    }
  }
`;

const SightWordsApp = () => {
  // Add styles to document head
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = safeAreaStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  // Word lists (cleaned of duplicates)
  const wordLists = {
    'Pre-K': ["the", "to", "and", "a", "I", "you", "it", "in", "said", "for", "up", "look", "is", "go", "we", "little", "down", "can", "see", "not", "one", "my", "me", "big", "come", "blue", "red", "where", "yellow", "he", "was", "that", "she", "on", "they", "but", "at", "with", "all", "there", "out", "be", "have", "am", "do", "did", "what", "so", "how", "tell", "know", "work", "call", "myself", "over", "before", "sleep", "five", "try", "start", "ten"],

    'Kindergarten': ["are", "as", "his", "this", "from", "or", "had", "by", "word", "were", "when", "your", "use", "an", "each", "which", "their", "if", "will", "other", "about", "many", "then", "them", "these", "some", "her", "would", "make", "like", "him", "into", "time", "has", "two", "more", "write", "number", "no", "way", "could", "people", "than", "first", "water", "been", "who", "oil", "its", "now", "find", "long", "day", "get", "made", "may", "part"],

    '1st Grade': ["of", "ask", "just", "off", "any", "does", "every", "goes", "light", "pick", "hurt", "cut", "kind", "live", "very", "around", "don't", "right", "green", "today", "wash", "cold", "only", "better", "hold", "warm", "full", "much", "keep", "got", "six", "never", "seven", "eight", "nine", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty"],

    '2nd Grade': ["again", "along", "always", "animal", "around", "away", "because", "been", "before", "best", "between", "both", "buy", "call", "change", "close", "cold", "different", "does", "don't", "even", "every", "example", "fast", "father", "first", "five", "follow", "food", "form", "found", "gave", "give", "goes", "great", "green", "group", "hard", "head", "home", "house", "its", "kind", "large", "learn", "left", "letter", "light", "little", "live", "made", "many", "mean", "might", "mother", "move", "much", "never", "next", "off", "old", "or", "our", "page", "picture", "place", "point", "pull", "read", "right", "school", "sentence", "show", "sing", "sit", "sleep", "study", "such", "tell", "their", "these", "those", "though", "thought", "three", "together", "turn", "upon", "us", "use", "very", "want", "wash", "which", "while", "why", "wish", "work", "world", "would", "write", "year", "your"], 

    '3rd Grade': ["about", "above", "add", "almost", "along", "always", "begin", "began", "being", "below", "better", "between", "book", "both", "bring", "car", "carry", "children", "city", "clean", "close", "country", "cut", "don't", "done", "draw", "drink", "earth", "eat", "eight", "enough", "example", "eyes", "face", "fall", "family", "far", "father", "feet", "few", "food", "four", "full", "girl", "got", "group", "grow", "hard", "head", "hear", "high", "hold", "hot", "hurt", "idea", "if", "important", "Indian", "it's", "keep", "kind", "last", "late", "laugh", "leave", "left", "let", "life", "light", "list", "long", "mile", "might", "miss", "mountains",   "much", "myself", "near", "never", "next", "night", "often", "once", "only", "open", "own", "paper", "pick", "plant", "real", "river", "run", "saw", "school", "sea", "second", "seem", "seven", "shall", "show", "side", "six", "small", "something", "sometimes", "song", "soon", "start", "state", "stop", "story", "talk", "ten", "those", "thought", "today", "together", "took", "tree", "try", "under", "until", "walk", "warm", "watch", "white", "while", "without", "young"],

    '4th Grade': ["body", "music", "color", "stand", "sun", "questions", "fish", "area", "mark", "dog", "horse", "birds", "problem", "complete", "room", "knew", "since", "ever", "piece", "told", "usually", "didn't", "friends", "easy", "heard", "order", "red", "door", "sure", "become", "top", "ship", "across", "today", "during", "short", "better", "best", "however", "low", "hours", "black", "products", "happened", "whole", "measure", "remember", "early", "waves", "reached", "listen", "wind", "rock", "space", "covered", "fast", "several", "hold", "himself", "toward", "five", "step", "morning", "passed", "vowel", "true", "hundred", "against", "pattern", "numeral", "table", "north", "slowly", "money", "map", "farm", "pulled", "draw", "voice", "seen", "cold", "cried", "plan", "notice", "south", "sing", "war", "ground", "fall", "king", "town", "I'll", "unit", "figure", "certain", "field", "travel", "wood", "fire", "upon", "done", "English", "road", "half", "ten", "fly", "gave", "box", "finally", "wait", "correct", "oh", "quickly", "person", "became", "shown", "minutes", "strong", "verb", "stars", "front", "feel", "fact", "inches", "street", "decided", "contain", "course", "surface", "produce", "building", "ocean", "class", "note", "nothing", "rest", "carefully", "scientists", "inside", "wheels", "stay", "green", "known", "island", "week", "less", "machine", "base", "ago", "stood", "plane", "system", "behind", "ran", "round", "boat", "game", "force", "brought", "understand", "warm", "common", "bring", "explain", "dry", "though", "language", "shape", "deep", "thousands", "yes", "clear", "equation", "yet", "government", "filled", "heat", "full", "hot", "check", "object", "am", "rule", "among", "noun", "power", "cannot", "able", "six", "size", "dark", "ball", "material", "special", "heavy", "fine", "pair", "circle", "include", "built", "anything", "arms", "beautiful", "believe", "beside", "bill", "blue", "brother", "can't", "cause", "cells", "center", "clothes", "dance", "describe", "developed", "difference", "direction", "discovered", "distance", "divided", "drive", "drop", "edge", "eggs", "energy", "Europe", "exercise", "farmers", "felt", "finished", "flowers", "forest", "general", "gone", "grass", "happy", "heart", "held", "instruments", "interest", "job", "kept", "lay", "legs", "length", "love", "main", "matter", "meet", "members", "million", "mind", "months", "moon", "paint", "paragraph", "past", "perhaps", "picked", "present", "probably", "race", "rain", "raised", "ready", "reason", "record", "region", "represent", "return", "root", "sat", "shall", "sign", "simple", "site", "sky", "soft", "square", "store", "subject", "suddenly", "sum", "summer", "syllables", "teacher", "test", "third", "train", "wall", "weather", "west", "whether", "wide", "wild", "window", "winter", "wish", "written"],

    '5th Grade': ["act", "Africa", "age", "already", "although", "amount", "angle", "appear", "baby", "bear", "beat", "bed", "bottom", "bright", "broken", "build", "buy", "care", "case", "cat", "century", "consonant", "copy", "couldn't", "count", "cross", "dictionary", "died", "dress", "either", "everyone", "everything", "exactly", "factors", "fight", "fingers", "floor", "fraction", "free", "French", "gold", "hair", "hill", "hole", "hope", "ice", "instead", "iron", "jumped", "killed", "lake", "laughed", "lead", "let's", "lot", "melody", "metal", "method", "middle", "milk", "moment", "nation", "natural", "outside", "per", "phrase", "poor", "possible", "pounds", "pushed", "quiet", "quite", "remain", "result", "ride", "rolled", "sail", "scale", "section", "sleep", "smiled", "snow", "soil", "solve", "someone", "son", "speak", "speed", "spring", "stone", "surprise", "tall", "temperature", "themselves", "tiny", "trip", "type", "village", "within", "wonder", "alone", "art", "bad", "bank", "bit", "break", "brown", "burning", "business", "captain", "catch", "caught", "cents", "child", "choose", "clean", "climbed", "cloud", "coast", "continued", "control", "cool", "cost", "decimal", "desert", "design", "direct", "drawing", "ears", "east", "else", "engine", "England", "equal", "experiment", "express", "feeling", "fell", "flow", "foot", "garden", "gas", "glass", "God", "grew", "history", "human", "hunting", "increase", "information", "itself", "joined", "key", "lady", "law", "least", "lost", "maybe", "mouth", "party", "pay", "period", "plains", "please", "practice", "president", "received", "report", "ring", "rise", "row", "save", "seeds", "sent", "separate", "serve", "shouted", "single", "skin", "statement", "stick", "straight", "strange", "students", "suppose", "symbols", "team", "touch", "trouble", "uncle", "valley", "visit", "wear", "whose", "wire", "woman", "wrote", "yard", "you're", "yourself", "addition", "army", "bell", "belong", "block", "blood", "blow", "board", "bones", "branches", "cattle", "chief", "compare", "compound", "consider", "cook", "corner", "crops", "crowd", "current", "doctor", "dollars", "eight", "electric", "elements", "enjoy", "entered", "except", "exciting", "expect", "famous", "fit", "flat", "fruit", "fun", "guess", "hat", "hit", "indicate", "industry", "insects", "interesting", "Japanese", "lie", "lifted", "loud", "major", "mall", "meat", "mine", "modern", "movement", "necessary", "observe", "park", "particular", "planets", "poem", "pole", "position", "process", "property", "provide", "rather", "rhythm", "rich", "safe", "sand", "science", "sell", "send", "sense", "seven", "sharp", "shoulder", "sight", "silent", "soldiers", "spot", "spread", "stream", "string", "suggested", "supply", "swim", "terms", "thick", "thin", "thus", "tied", "tone", "trade", "tube", "value", "wash", "wasn't", "weight", "wife", "wings", "won't", "action", "actually", "adjective", "afraid", "agreed", "ahead", "allow", "apple", "arrived", "born", "bought", "British", "capital", "chance", "chart", "church", "column", "company", "conditions", "corn", "cotton", "cows", "create", "dead", "deal", "death", "details", "determine", "difficult", "division", "doesn't", "effect", "entire", "especially", "evening", "experience", "factories", "fair", "fear", "fig", "forward", "France", "fresh", "Greek", "gun", "hoe", "huge", "isn't", "led", "level", "located", "march", "match", "molecules", "northern", "nose", "office", "opposite", "oxygen", "plural", "prepared", "pretty", "printed", "radio", "repeated", "rope", "rose", "score", "seat", "settled", "shoes", "shop", "similar", "sir", "sister", "smell", "solution", "southern", "steel", "stretched", "substances", "suffix", "sugar", "tools", "total", "track", "triangle", "truck", "underline", "various", "view", "Washington", "we'll", "western", "win", "women", "workers", "wouldn't", "wrong", "yellow"],

    '6th Grade': ["analyze", "compare", "contrast", "describe", "explain", "identify", "summarize", "predict", "conclude", "observe", "character", "setting", "plot", "theme", "conflict", "narrator", "fiction", "nonfiction", "biography", "poetry", "fraction", "decimal", "percent", "ratio", "proportion", "area", "perimeter", "volume", "integer", "variable", "ancient", "civilization", "empire", "culture", "religion", "government", "democracy", "citizen", "geography", "continent", "energy", "matter", "solid", "liquid", "gas", "temperature", "weather", "climate", "ecosystem", "habitat", "evidence", "opinion", "fact", "detail", "example", "sequence", "cause", "effect", "problem", "solution"],

    '7th Grade': ["evaluate", "interpret", "synthesize", "distinguish", "categorize", "classify", "investigate", "hypothesis", "experiment", "method", "metaphor", "simile", "symbolism", "imagery", "mood", "tone", "protagonist", "antagonist", "dialogue", "monologue", "equation", "expression", "coefficient", "exponent", "inequality", "coordinate", "slope", "intercept", "probability", "statistics", "medieval", "renaissance", "exploration", "colony", "revolution", "constitution", "amendment", "federal", "state", "judicial", "organism", "cell", "tissue", "organ", "system", "photosynthesis", "respiration", "reproduction", "heredity", "adaptation", "perspective", "bias", "reliable", "credible", "source", "research", "paraphrase", "quotation", "citation", "plagiarism"],

    '8th Grade': ["scrutinize", "substantiate", "corroborate", "deduce", "infer", "justify", "refute", "advocate", "critique", "formulate", "allegory", "allusion", "irony", "foreshadowing", "flashback", "satire", "rhetoric", "persuasion", "argument", "thesis", "polynomial", "quadratic", "linear", "exponential", "logarithm", "function", "domain", "range", "transformation", "congruent", "nationalism", "imperialism", "industrialization", "urbanization", "immigration", "segregation", "suffrage", "prohibition", "depression", "totalitarian", "molecule", "atom", "element", "compound", "reaction", "catalyst", "solution", "mixture", "periodic", "isotope", "methodology", "validity", "reliability", "variable", "control", "correlation", "causation", "assumption", "implication", "significance"],

    '9th Grade': ["substantiate", "extrapolate", "interpolate", "synthesize", "juxtapose", "contextualize", "conceptualize", "theorize", "hypothesize", "rationalize", "archetype", "motif", "paradox", "oxymoron", "synecdoche", "metonymy", "euphemism", "hyperbole", "understatement", "characterization", "trigonometry", "calculus", "derivative", "integral", "asymptote", "parabola", "ellipse", "hyperbola", "matrix", "vector", "hegemony", "sovereignty", "autonomy", "ideology", "propaganda", "apartheid", "genocide", "diaspora", "assimilation", "pluralism", "equilibrium", "entropy", "stoichiometry", "electronegativity", "oxidation", "reduction", "thermodynamics", "kinetics", "nuclear", "radioactive", "epistemology", "ontology", "paradigm", "dialectic", "empirical", "theoretical", "abstract", "concrete", "subjective", "objective"],

    '10th Grade': ["elucidate", "corroborate", "substantiate", "extrapolate", "juxtapose", "synthesize", "contextualize", "delineate", "articulate", "postulate", "bildungsroman", "epistolary", "picaresque", "allegory", "verisimilitude", "catharsis", "denouement", "exposition", "peripeteia", "anagnorisis", "logarithmic", "exponential", "polynomial", "rational", "irrational", "transcendental", "infinitesimal", "convergent", "divergent", "continuous", "totalitarianism", "authoritarianism", "fascism", "communism", "capitalism", "socialism", "imperialism", "colonialism", "neocolonialism", "globalization", "thermodynamics", "quantum", "relativity", "electromagnetic", "nuclear", "molecular", "biochemistry", "genetics", "biotechnology", "nanotechnology", "existentialism", "nihilism", "determinism", "relativism", "empiricism", "rationalism", "phenomenology", "hermeneutics", "epistemology", "metaphysics"],

    '11th Grade': ["aberration", "abstract", "accolade", "accommodate", "aesthetic", "affinity", "altercation", "ameliorate", "amicable", "anarchy", "anomaly", "appall", "archaic", "arduous", "articulate", "astute", "authoritarian", "aversion", "biased", "brevity", "cajole", "callous", "capitulate", "catalyst", "catharsis", "caustic", "censure", "chastise", "clamor", "coalesce", "cognizant", "commiserate", "composure", "conciliatory", "copious", "cordial", "dearth", "debilitate", "decadence", "deference", "delineate", "deprecate", "despot", "devious", "didactic", "disparage", "dissonance", "duplicity", "edifice", "effervescent", "egregious", "elusive", "equivocal", "erroneous", "exemplary", "expedient", "extraneous", "formidable", "frivolous", "grueling", "haphazard", "heretic", "hindrance", "hypocrisy", "iconoclast", "incessant", "incidental", "incite", "incorrigible", "indoctrinate", "insurgent", "intangible", "judicious", "lavish", "listless", "meager", "meander", "negligent", "obliterate", "ponderous", "preclude", "prerequisite", "proximity", "rectify", "rescind", "resolution", "rigorous", "scrutinize", "substantiate", "surmise", "tirade", "turbulence", "unimpeachable", "unobtrusive", "usurp", "vacillate", "whimsical", "accrue", "acquiescent", "acumen", "adage", "adipose", "alchemy", "altruism", "ambiguous", "ambrosia", "benevolent", "bombast", "convalescent", "cryptic", "culmination", "culpable", "curriculum", "deceptive", "delegate", "derogatory", "desolation", "dilettante", "diligent", "disconcert", "disdainfully", "disingenuous", "disperse", "distinction", "distinguished", "dolefully", "dormitory", "earnest", "ecstasy", "egalitarian", "electrify", "eliminate", "embargo", "emphatically", "ennui", "enrapture", "enumerate", "enunciate", "essential", "estimation", "etiquette", "exasperation", "exceedingly", "exceptional", "excitable", "exhibition", "expatiate", "expunged", "extraordinary", "extrapolate", "fallacy", "favorably", "fiery", "foreigner", "forfeit", "fragile", "fraught", "futile", "gentleman", "grotesquely", "gymnasium", "harebrained", "havoc", "heroic", "horticulture", "humbug", "humorist", "hybrid", "hygiene", "immense", "impersonal", "implacable", "importune", "impudent", "inability", "inauguration", "incalculable", "incidentally", "inclement", "incredulously", "indispensable", "indoctrination", "ineffectual", "infidel", "inflammatory", "influential", "influx", "innocence", "inquiry", "institute", "intellect", "intensity", "interference", "interloper", "interminable", "intermittently", "interpretation", "interval", "inviolable", "irreparable", "laborious", "laboriously", "lackadaisically", "legendary", "leniently", "liability", "libation", "lifelike", "likelihood", "locally", "luxury", "magnificence", "magnitude", "maintenance", "martyr", "maturity", "meddlesome", "mediation", "merit", "merriment", "miser", "monotony", "municipal", "narrative", "nonchalantly", "occasionally", "occupy", "offensive", "opposition", "optimism", "ordinary", "ornament", "outbreak", "outlive", "outpost", "outreach", "outright", "overdo", "overthrow", "pageant", "pamphlet", "parochial", "paternal", "patronize", "peaceable", "peasant", "peril", "perpetuity", "perplexed", "perseverance", "perspiration", "pertain", "petite", "phase", "philanthropy", "plausible", "playwright", "possibility", "powerless", "practically", "precede", "precisely", "predominant", "prevalent", "primitive", "priority", "privation", "procrastination", "profligate", "profound", "proposition", "prosperous", "prove", "provincial", "psychology", "publicity", "readily", "reciprocity", "recur", "reference", "regard", "rehabilitate", "relic", "religious", "remembrance", "remunerate", "renown", "reparation", "repent", "representative", "repugnant", "requisite", "resistance", "resolutely", "resplendent", "responsibility", "restrictive", "resurgence", "retort", "revel", "revenue", "reverberate", "revile", "ridiculous", "rubble", "sage", "satisfactorily", "scarce", "scoundrel", "scrawny", "security", "segregation", "sensibility", "serene", "simile", "situated", "skittish", "sleek", "sleuth", "specimen", "spendthrift", "spiritual", "sporadic", "squalor", "squeamish", "stagnant", "stagnate", "stalwart", "stamina", "stately", "steadfast", "stealthy", "stipulate", "strenuous", "stupendous", "sublime", "substantial", "subvert", "successful", "sufficient", "summarize", "supernatural", "supersede", "suppress", "surgeon", "surpass", "surreptitiously", "suspense", "sustenance", "syllable", "symphony", "synonymous", "tactful", "technique", "telepathy", "temperance", "tendency", "terrestrial", "thesaurus", "throng", "tiresome", "toil", "traffic", "transitive", "tribulation", "tyranny", "unanimous", "undaunted", "underrate", "undoubtedly", "unforgettable", "unpleasant", "unseemly", "untenable", "unusually", "uproot", "vengeance", "vexed", "vivacious", "voluminous", "voracious", "warily", "warlike", "whereabouts", "witchcraft", "wrangle"],

    '12th Grade': ["anachronistic", "abbreviate", "abdicate", "abstinence", "adulation", "adversity", "aesthetic", "amicable", "anecdote", "anonymous", "antagonist", "arid", "assiduous", "asylum", "benevolent", "camaraderie", "censure", "circuitous", "clairvoyant", "collaborate", "compassion", "compromise", "condescending", "conditional", "conformist", "congregation", "convergence", "deleterious", "demagogue", "digression", "diligent", "discredit", "disdain", "divergent", "empathy", "emulate", "enervating", "enhance", "ephemeral", "evanescent", "exasperation", "exemplary", "extenuating", "florid", "fortuitous", "frugal", "hackneyed", "haughty", "hedonist", "hypothesis", "impetuous", "impute", "incompatible", "inconsequential", "inevitable", "integrity", "intrepid", "intuitive", "jubilation", "lobbyist", "longevity", "mundane", "nonchalant", "novice", "opulent", "orator", "ostentatious", "parched", "perfidious", "precocious", "pretentious", "procrastinate", "prosaic", "prosperity", "provocative", "prudent", "querulous", "rancorous", "reclusive", "reconciliation", "renovation", "resilient", "restrained", "reverence", "sagacity", "scrutinize", "spontaneity", "spurious", "submissive", "substantiate", "superficial", "superfluous", "suppress", "surreptitious", "tactful", "tenacious", "transient", "venerable", "vindicate", "wary", "zealot", "abate", "aberration", "abject", "abstruse", "abysmal", "acerbic", "acquiesce", "acrimonious", "acumen", "adept", "admonish", "affectation", "aggregate", "allure", "allusion", "ambience", "amphitheater", "annihilate", "annul", "antithesis", "apathetic", "apex", "aphorism", "appalling", "ardent", "atrocious", "august", "auspicious", "authoritative", "automation", "avow", "banal", "befall", "bland", "blasphemy", "blurb", "bogus", "bourgeois", "brandish", "brevity", "broach", "bureaucracy", "cajole", "callow", "cancellation", "candor", "capillary", "capricious", "carnivorous", "castigate", "cater", "catharsis", "catholic", "celibacy", "cervical", "chagrin", "charisma", "charlatan", "choleric", "choreography", "chronic", "circumspect", "clarion", "clemency", "clientele", "cognizant", "colleague", "collegiate", "communicable", "complicity", "component", "compression", "concept", "conclusive", "concord", "concurrence", "concurrent", "condone", "confound", "conjure", "consecrate", "consul", "consultant", "contemptuous", "contentious", "continuance", "contradictory", "conveyance", "convivial", "convulsion", "cosmic", "covert", "credentials", "creditor", "crucial", "crypt", "culminate", "cumulative", "curtail", "curvature", "cynic", "cynical", "daunt", "dearth", "debit", "debutante", "decorous", "default", "deference", "deficient", "defile", "definitive", "deflation", "deft", "deity", "delineate", "delve", "demented", "demolition", "demoralize", "demure", "denigrate", "denizen", "deplorable", "deposition", "depreciate", "derivative", "designate", "deteriorate", "devastate", "dialect", "diaphragm", "dictum", "dignitary", "dilate", "discretion", "disgruntle", "disillusion", "disintegrate", "dispel", "dispensary", "dispense", "displacement", "disquiet", "disreputable", "dissect", "disuse", "diverse", "docile", "dogged", "dogmatic", "domination", "dormant", "dote", "dregs", "droll", "duct", "dupe", "dynamic", "eccentric", "eclectic", "effusion", "egocentric", "elongate", "eloquent", "emancipate", "embellish", "emboss", "embryo", "eminent", "emit", "encampment", "enigma", "ensemble", "enthrall", "entreaty", "epiphany", "epitome", "equanimity", "equilibrium", "equivocal", "equivocation", "eradicate", "esteem", "ethical", "evangelical", "evasion", "exacerbate", "expatriate", "expedite", "expressive", "expressly", "extradition", "exuberant", "facetious", "farcical", "feasible", "feign", "ferocity", "ferret", "fidelity", "finale", "finesse", "flail", "flange", "flaunt", "focal", "foible", "folio", "foment", "formulate", "forthright", "forum", "frivolous", "frontage", "froth", "frustrate", "furtive", "gainsay", "gaseous", "genteel", "germinate", "glaze", "glib", "glutton", "grandiose", "granulate", "gratify", "grotesque", "grovel", "guerrilla", "hapless", "heirloom", "heritage", "hew", "hoax", "hovel", "humdrum", "humiliate", "humility", "hypocrite", "hysteria", "idiom", "illegitimate", "illustrious", "impeach", "imperative", "imperial", "impertinent", "impoverish", "impregnate", "inaccessible", "incandescent", "incision", "inclination", "inclusive", "incorporate", "incriminate", "indemnify", "indisposed", "induce", "inducement", "inert", "infatuate", "infernal", "inkling", "innumerable", "inquisitive", "insufferable", "integral", "intolerable", "intolerant", "intuition", "inundate", "invertebrate", "invincible", "invoke", "ire", "irony", "irreducible", "jargon", "kinetic", "lateral", "laud", "legacy", "liberalism", "linear", "linguistics", "liquidate", "listless", "lucid", "mainstay", "malady", "manipulate", "manor", "materialize", "maternal", "maudlin", "maul", "mechanization", "medley", "mendicant", "metaphysical", "minutiae", "mire", "misconception", "momentum", "morbid", "mutation", "mystical", "narcotic", "narrate", "necessitate", "nefarious", "negotiate", "neural", "nucleus", "obituary", "oblique", "oblivion", "obnoxious", "obscene", "obtuse", "opaque", "optics", "oratory", "ordinance", "organic", "organism", "overture", "pacify", "panorama", "parry", "parse", "passive", "patron", "pensive", "permeate", "personage", "perspective", "pertinent", "pervasive", "pessimistic", "phenomenal", "pictorial", "pigment", "pilgrimage", "pinnacle", "piteous", "plebeian", "pliable", "populate", "portal", "portly", "precept", "precinct", "pregnant", "prelude", "preoccupy", "prestige", "profess", "proficient", "progression", "prophylactic", "prose", "providence", "pulverize", "putrid", "qualm", "quandary", "quell", "radiate", "radical", "ratify", "rational", "ravenous", "ravish", "readjust", "rebuff", "rebuke", "recondite", "recuperate", "reformatory", "reimburse", "reinstate", "remittance", "renounce", "renovate", "reorganize", "repercussion", "reprove", "repudiate", "reputable", "residue", "resolute", "respite", "revere", "reverie", "revert", "revoke", "rhapsody", "rift", "ritual", "rogue", "roster", "rostrum", "rue", "sally", "satire", "saturate", "scope", "scrimmage", "sear", "secluded", "sector", "sediment", "segment", "segregate", "silhouette", "simultaneous", "skeptical", "skirmish", "slothful", "smelt", "sodden", "solitude", "solvent", "somber", "spasm", "squander", "stability", "stance", "sterile", "stigma", "stimulate", "stolid", "stupefy", "stupor", "suave", "subside", "sundry", "superimpose", "superlative", "symmetry", "synthetic", "tabulate", "taint", "tangent", "tantalize", "tart", "tawdry", "temperate", "theorem", "tier", "timely", "tirade", "tolerable", "torrid", "torso", "tout", "transcribe", "transpose", "tributary", "tumult", "ultimate", "ultimatum", "uncouth", "unerring", "unkempt", "usage", "usurp", "variable", "venerate", "vestige", "vex", "vigil", "vigilant", "vilify", "visualize", "vitality", "volatile", "waif", "wan", "wanton", "wend", "whet", "wistful", "zealous"]
  };

  const gradeOrder = ['Pre-K', 'Kindergarten', '1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade', '6th Grade', '7th Grade', '8th Grade', '9th Grade', '10th Grade', '11th Grade', '12th Grade'];

  const [currentView, setCurrentView] = useState('menu'); // 'menu', 'game', 'highscores', 'nameEntry', 'review'
  const [selectedGrade, setSelectedGrade] = useState('');
  const [gameWords, setGameWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [highScores, setHighScores] = useState({});
  const [completionTime, setCompletionTime] = useState(0);
  const [playerName, setPlayerName] = useState('');
  const [currentScore, setCurrentScore] = useState(null);
  const nameInputRef = useRef(null);

  // Load high scores and last selected grade from localStorage on component mount
  useEffect(() => {
    const savedScores = {};
    gradeOrder.forEach(grade => {
      try {
        const stored = localStorage?.getItem(`highScores_${grade}`);
        savedScores[grade] = stored ? JSON.parse(stored) : [];
      } catch (e) {
        savedScores[grade] = [];
      }
    });
    setHighScores(savedScores);

    // Load last selected grade
    try {
      const lastSelectedGrade = localStorage?.getItem('lastSelectedGrade');
      if (lastSelectedGrade && gradeOrder.includes(lastSelectedGrade)) {
        setSelectedGrade(lastSelectedGrade);
      }
    } catch (e) {
      // Handle localStorage not available
    }
  }, []);

  // Save selected grade to localStorage whenever it changes
  useEffect(() => {
    if (selectedGrade) {
      try {
        localStorage?.setItem('lastSelectedGrade', selectedGrade);
      } catch (e) {
        // Handle localStorage not available
      }
    }
  }, [selectedGrade]);

  // Timer effect
  useEffect(() => {
    let interval;
    if (currentView === 'game' && startTime) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [currentView, startTime]);

  // Focus name input when entering name entry view
  useEffect(() => {
    if (currentView === 'nameEntry' && nameInputRef.current) {
      setTimeout(() => {
        nameInputRef.current.focus();
      }, 100);
    }
  }, [currentView]);

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const centiseconds = Math.floor((ms % 1000) / 10);
    
    if (minutes > 0) {
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
    }
    return `${remainingSeconds}.${centiseconds.toString().padStart(2, '0')}s`;
  };

  const getCombinedWordList = (targetGrade) => {
    const targetIndex = gradeOrder.indexOf(targetGrade);
    let combined = [];
    
    for (let i = 0; i <= targetIndex; i++) {
      const grade = gradeOrder[i];
      if (wordLists[grade] && wordLists[grade].length > 0) {
        combined = [...combined, ...wordLists[grade]];
      }
    }
    
    // Shuffle the combined list
    const shuffled = [...combined];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return shuffled;
  };

  const startGame = () => {
    if (!selectedGrade) return;
    
    const words = getCombinedWordList(selectedGrade);
    if (words.length === 0) {
      alert('No words available for this grade level yet.');
      return;
    }
    
    setGameWords(words);
    setCurrentWordIndex(0);
    setStartTime(Date.now());
    setElapsedTime(0);
    setCurrentView('game');
  };

  const startGameFromHighScores = (grade) => {
    setSelectedGrade(grade);
    const words = getCombinedWordList(grade);
    if (words.length === 0) {
      alert('No words available for this grade level yet.');
      return;
    }
    
    setGameWords(words);
    setCurrentWordIndex(0);
    setStartTime(Date.now());
    setElapsedTime(0);
    setCurrentScore(null); // Clear previous score when starting new game
    setCurrentView('game');
  };

  const goToNextWord = () => {
    if (currentWordIndex < gameWords.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
    } else {
      // Game completed
      const finalTime = Date.now() - startTime;
      setCompletionTime(finalTime);
      checkHighScore(finalTime);
    }
  };

  const goToPrevWord = () => {
    if (currentWordIndex > 0) {
      setCurrentWordIndex(currentWordIndex - 1);
    }
  };

  const checkHighScore = (finalTime) => {
    const gradeScores = highScores[selectedGrade] || [];
    const newScore = {
      name: '',
      date: new Date().toLocaleDateString(),
      wordsCompleted: gameWords.length,
      timeCompleted: finalTime
    };

    setCurrentScore(newScore);

    // Check if this is a top 5 score
    if (gradeScores.length < 5 || finalTime < gradeScores[gradeScores.length - 1]?.timeCompleted) {
      setCurrentView('nameEntry');
    } else {
      // Not a high score, go directly to high scores view to show comparison
      setCurrentView('highscores');
    }
  };

  const saveHighScore = () => {
    if (!playerName.trim()) return;

    const newScore = {
      name: playerName.trim(),
      date: new Date().toLocaleDateString(),
      wordsCompleted: gameWords.length,
      timeCompleted: completionTime
    };

    const gradeScores = [...(highScores[selectedGrade] || [])];
    gradeScores.push(newScore);
    gradeScores.sort((a, b) => a.timeCompleted - b.timeCompleted);
    gradeScores.splice(5); // Keep only top 5

    const newHighScores = { ...highScores };
    newHighScores[selectedGrade] = gradeScores;
    setHighScores(newHighScores);

    // Save to localStorage
    try {
      localStorage.setItem(`highScores_${selectedGrade}`, JSON.stringify(gradeScores));
    } catch (e) {
      // Handle localStorage not available
    }

    // Update current score with name and go to high scores
    setCurrentScore(newScore);
    setPlayerName('');
    setCurrentView('highscores');
  };

  const deleteHighScore = (grade, scoreIndex) => {
    const gradeScores = [...(highScores[grade] || [])];
    gradeScores.splice(scoreIndex, 1);
    
    const newHighScores = { ...highScores };
    newHighScores[grade] = gradeScores;
    setHighScores(newHighScores);

    // Save to localStorage
    try {
      localStorage.setItem(`highScores_${grade}`, JSON.stringify(gradeScores));
    } catch (e) {
      // Handle localStorage not available
    }
  };

  const MenuView = () => (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 to-purple-500 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Sight Words</h1>
        
        <div className="space-y-6">
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">Select Grade Level:</label>
            <select 
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full p-3 border-2 border-gray-300 rounded-lg text-lg focus:border-blue-500 focus:outline-none"
            >
              <option value="">Choose a grade...</option>
              {gradeOrder.filter(grade => {
                const words = getCombinedWordList(grade);
                return words.length > 0;
              }).map(grade => (
                <option key={grade} value={grade}>{grade}</option>
              ))}
            </select>
          </div>

          {selectedGrade && (
            <div className="text-center text-gray-600">
              <p>{getCombinedWordList(selectedGrade).length} words to practice</p>
            </div>
          )}

          <button
            onClick={startGame}
            disabled={!selectedGrade}
            className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white font-bold py-4 px-6 rounded-lg text-xl flex items-center justify-center gap-2 transition-colors"
          >
            <Play size={24} />
            Start Practice
          </button>

          <button
            onClick={() => setCurrentView('review')}
            disabled={!selectedGrade}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-bold py-4 px-6 rounded-lg text-xl flex items-center justify-center gap-2 transition-colors"
          >
            <BookOpen size={24} />
            Review Words
          </button>

          <button
            onClick={() => setCurrentView('highscores')}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-4 px-6 rounded-lg text-xl flex items-center justify-center gap-2 transition-colors"
          >
            <Trophy size={24} />
            High Scores
          </button>
        </div>
      </div>
    </div>
  );

  const GameView = () => {
    const currentWord = gameWords[currentWordIndex];
    const progressPercent = Math.round(((currentWordIndex + 1) / gameWords.length) * 100);

    return (
      <div className="fixed inset-0 bg-gradient-to-b from-green-400 to-blue-500 flex flex-col">
        {/* Top Bar */}
        <div className="flex justify-between items-center p-3 md:p-4 bg-white bg-opacity-20 flex-shrink-0">
          <div className="text-white font-bold text-base md:text-lg">
            {currentWordIndex + 1}/{gameWords.length}
          </div>
          <div className="text-white font-bold text-lg md:text-xl">
            {progressPercent}%
          </div>
          <div className="text-white font-bold text-base md:text-lg">
            {formatTime(elapsedTime)}
          </div>
        </div>

        {/* Word Card - Takes remaining space */}
        <div className="flex-1 flex items-center justify-center p-4 md:p-8 min-h-0">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl aspect-[4/3] flex items-center justify-center">
            <div className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-bold text-gray-800 leading-none text-center px-4 py-4 break-words">
              {currentWord}
            </div>
          </div>
        </div>

        {/* Bottom Navigation - Fixed height */}
        <div className="flex justify-between items-center p-4 md:p-6 flex-shrink-0 pb-safe">
          <button
            onClick={goToPrevWord}
            disabled={currentWordIndex === 0}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 active:bg-opacity-40 disabled:opacity-50 text-white p-4 md:p-5 rounded-full transition-all"
          >
            <ChevronLeft size={28} className="md:w-8 md:h-8" />
          </button>

          <button
            onClick={() => setCurrentView('menu')}
            className="bg-red-500 hover:bg-red-600 active:bg-red-700 text-white px-6 py-3 md:px-8 md:py-4 rounded-lg font-bold transition-colors flex items-center gap-2"
          >
            <Home size={20} className="md:w-6 md:h-6" />
            <span className="hidden sm:inline">Menu</span>
          </button>

          <button
            onClick={goToNextWord}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 active:bg-opacity-40 text-white p-4 md:p-5 rounded-full transition-all"
          >
            <ChevronRight size={28} className="md:w-8 md:h-8" />
          </button>
        </div>
      </div>
    );
  };

  const HighScoresView = () => (
    <div className="min-h-screen bg-gradient-to-b from-purple-400 to-pink-500 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">High Scores</h1>
            <button
              onClick={() => {
                setCurrentScore(null);
                setCurrentView('menu');
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-bold transition-colors"
            >
              Back to Menu
            </button>
          </div>

          {/* Show current score comparison if available */}
          {currentScore && (
            <div className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
              <h2 className="text-lg font-semibold text-yellow-800 mb-2">🎯 Your Recent Score</h2>
              <div className="bg-yellow-100 rounded-lg p-3 flex justify-between items-center">
                <div>
                  <div className="font-bold text-gray-800">
                    {currentScore.name || 'Your Score'} - {selectedGrade}
                  </div>
                  <div className="text-sm text-gray-600">{currentScore.date}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-yellow-600">{formatTime(currentScore.timeCompleted)}</div>
                  <div className="text-sm text-gray-600">{currentScore.wordsCompleted} words</div>
                </div>
              </div>
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            {gradeOrder.filter(grade => {
              const words = getCombinedWordList(grade);
              return words.length > 0;
            }).map(grade => (
              <div key={grade} className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-800">{grade}</h2>
                  <button
                    onClick={() => startGameFromHighScores(grade)}
                    className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full transition-colors flex items-center justify-center"
                    title={`Challenge ${grade}`}
                  >
                    <Play size={20} />
                  </button>
                </div>
                <div className="space-y-2">
                  {(highScores[grade] || []).map((score, index) => {
                    // Check if this score matches the current score
                    const isCurrentScore = currentScore && 
                      grade === selectedGrade && 
                      score.timeCompleted === currentScore.timeCompleted &&
                      score.name === currentScore.name &&
                      score.date === currentScore.date;
                    
                    return (
                      <div 
                        key={index} 
                        className={`rounded-lg p-3 flex justify-between items-center ${
                          isCurrentScore 
                            ? 'bg-green-100 border-2 border-green-400' 
                            : 'bg-white'
                        }`}
                      >
                        <div>
                          <div className={`font-bold ${isCurrentScore ? 'text-green-800' : 'text-gray-800'}`}>
                            #{index + 1} {score.name}
                            {isCurrentScore && ' 🎉'}
                          </div>
                          <div className="text-sm text-gray-600">{score.date}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className={`font-bold ${isCurrentScore ? 'text-green-600' : 'text-blue-600'}`}>
                              {formatTime(score.timeCompleted)}
                            </div>
                            <div className="text-sm text-gray-600">{score.wordsCompleted} words</div>
                          </div>
                          <button
                            onClick={() => deleteHighScore(grade, index)}
                            className="bg-red-500 hover:bg-red-600 text-white p-1 rounded transition-colors"
                            title="Delete this score"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  {(!highScores[grade] || highScores[grade].length === 0) && (
                    <div className="text-center text-gray-500 py-4">No scores yet!</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const ReviewWordsView = () => {
    const combinedWords = getCombinedWordList(selectedGrade);
    
    // Sort all combined words alphabetically (case-insensitive)
    const sortedCombinedWords = [...combinedWords].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-400 to-purple-500 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{selectedGrade} Words</h1>
                <p className="text-lg text-gray-600">{combinedWords.length} words (alphabetical)</p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => startGameFromHighScores(selectedGrade)}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-bold transition-colors flex items-center gap-2"
                  title={`Challenge ${selectedGrade}`}
                >
                  <Play size={20} />
                  Practice
                </button>
                <button
                  onClick={() => setCurrentView('menu')}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-bold transition-colors"
                >
                  Back to Menu
                </button>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <div className="bg-white rounded-lg p-6">
                <p className="text-lg text-gray-800 leading-relaxed">
                  {sortedCombinedWords.join(', ')}
                </p>
              </div>
            </div>

            <div className="mt-8 p-4 bg-green-50 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-2">💡 Parent Tip</h3>
              <p className="text-green-700">
                These sight words are high-frequency words that children encounter often in reading. 
                Mastering them helps improve reading fluency and comprehension. Practice regularly 
                and celebrate progress!
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const NameEntryView = () => (
    <div className="min-h-screen bg-gradient-to-b from-yellow-400 to-orange-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Congratulations!</h1>
        <p className="text-lg text-gray-600 mb-6">
          You made it to the top 5 for {selectedGrade}!
        </p>
        <p className="text-md text-gray-600 mb-6">
          Time: {formatTime(completionTime)} | Words: {gameWords.length}
        </p>
        
        <div className="space-y-4">
          <input
            ref={nameInputRef}
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && playerName.trim() && saveHighScore()}
            placeholder="Enter your name"
            className="w-full p-3 border-2 border-gray-300 rounded-lg text-lg focus:border-blue-500 focus:outline-none"
            maxLength={20}
            autoFocus
          />
          
          <div className="flex gap-4">
            <button
              onClick={saveHighScore}
              disabled={!playerName.trim()}
              className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Save Score
            </button>
            <button
              onClick={() => setCurrentView('menu')}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Skip
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="font-sans w-screen overflow-x-hidden">
      {currentView === 'menu' && <MenuView />}
      {currentView === 'game' && <GameView />}
      {currentView === 'highscores' && <HighScoresView />}
      {currentView === 'review' && <ReviewWordsView />}
      {currentView === 'nameEntry' && <NameEntryView />}
    </div>
  );
};

export default SightWordsApp;