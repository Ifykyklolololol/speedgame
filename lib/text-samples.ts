const easySamples = [
  "The quick brown fox jumps over the lazy dog.",
  "She sells seashells by the seashore.",
  "How much wood would a woodchuck chuck if a woodchuck could chuck wood?",
  "Peter Piper picked a peck of pickled peppers.",
  "All that glitters is not gold.",
  "The early bird catches the worm.",
  "Actions speak louder than words.",
  "A picture is worth a thousand words.",
  "Don't judge a book by its cover.",
  "Practice makes perfect.",
]

const mediumSamples = [
  "The five boxing wizards jump quickly. The job requires extra pluck and zeal from every young wage earner.",
  "We promptly judged antique ivory buckles for the next prize. How razorback-jumping frogs can level six piqued gymnasts!",
  "Crazy Fredrick bought many very exquisite opal jewels. Pack my box with five dozen liquor jugs.",
  "The quick onyx goblin jumps over the lazy dwarf. Sphinx of black quartz, judge my vow.",
  "A wizard's job is to vex chumps quickly in fog. Amazingly few discotheques provide jukeboxes.",
  "The early morning sun shone brightly through the window, casting long shadows across the room.",
  "She walked down the street with a confident stride, her head held high despite the challenges ahead.",
  "The ancient oak tree stood tall against the stormy sky, its branches swaying in the fierce wind.",
  "The concert was a spectacular display of musical talent, with performers from around the world.",
  "The detective examined the crime scene carefully, looking for any clues that might solve the case.",
]

const hardSamples = [
  "The generation of random paragraphs can be useful in a number of different situations. The painter dipped his brush into the vibrant colors on his palette, creating a masterpiece that would be admired for generations.",
  "Quantum computing uses quantum bits or qubits which can exist in superposition states. The Byzantine Empire, also referred to as the Eastern Roman Empire, was the continuation of the Roman Empire primarily in its eastern provinces during Late Antiquity and the Middle Ages.",
  "The intricate relationship between technology and society has been a subject of extensive research. Photosynthesis is the process by which green plants and certain other organisms transform light energy into chemical energy.",
  "The economic implications of artificial intelligence on the global workforce remain a topic of heated debate. The Fibonacci sequence is a series of numbers where each number is the sum of the two preceding ones, usually starting with 0 and 1.",
  "The philosophical concept of existentialism emphasizes individual existence, freedom, and choice. The mitochondrion is a double membrane-bound organelle found in most eukaryotic organisms, often referred to as the powerhouse of the cell.",
  "The development of sustainable energy sources is crucial for addressing climate change and ensuring a habitable planet for future generations. The complex interplay between genetics and environment in determining human behavior has fascinated scientists for decades.",
  "The Renaissance was a period in European history marking the transition from the Middle Ages to modernity and covering the span of the 15th and 16th centuries. The human brain contains approximately 86 billion neurons, forming a complex network that enables consciousness and cognitive functions.",
  "The principles of quantum mechanics challenge our intuitive understanding of reality, suggesting that particles can exist in multiple states simultaneously until observed. The biodiversity of tropical rainforests provides countless resources for medical research, including potential treatments for various diseases.",
  "The development of artificial general intelligence raises profound ethical questions about the nature of consciousness and the potential risks of creating entities with superhuman capabilities. The geological processes that shape Earth's surface, including plate tectonics, erosion, and volcanic activity, operate on timescales ranging from seconds to millions of years.",
  "The cultural significance of literature varies across societies, reflecting and influencing collective values, beliefs, and historical narratives. The complex interactions between different species in an ecosystem create a delicate balance that can be disrupted by human activities and environmental changes.",
]

export function getRandomText(difficulty = "medium"): string {
  let samples: string[]

  switch (difficulty) {
    case "easy":
      samples = easySamples
      break
    case "hard":
      samples = hardSamples
      break
    case "medium":
    default:
      samples = mediumSamples
      break
  }

  const randomIndex = Math.floor(Math.random() * samples.length)
  return samples[randomIndex]
}
