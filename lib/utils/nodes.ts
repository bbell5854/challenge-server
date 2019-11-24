function generate(count: number, upperBound: number, lowerBound: number): number[] {
  const nodes = [];

  for (let i = 0; i < count; i++) {
    const randNumb = Math.floor(Math.random() * (upperBound - lowerBound) + lowerBound);
    nodes.push(randNumb);
  }

  return nodes.sort((a, b) => (a - b));
}

function minMaxCount(count: number): number {
  if (count < 1) {
    return 1;
  }

  if (count > 15) {
    return 15;
  }

  return count;
}

export default {
  generate,
  minMaxCount,
};
