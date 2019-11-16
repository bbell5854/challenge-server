function generate(count: number, upperBound: number, lowerBound: number): number[] {
  const nodes = [];

  for (let i = 0; i < count; i++) {
    const randNumb = Math.floor(Math.random() * (upperBound - lowerBound) + lowerBound);
    nodes.push(randNumb);
  }

  return nodes.sort((a, b) => (a - b));
}

export default {
  generate,
};
