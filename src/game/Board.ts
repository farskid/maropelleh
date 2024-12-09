interface Snake {
  from: number;
  to: number;
}

interface Ladder {
  from: number;
  to: number;
}

// Start of Selection
function createCells(size: number, rowSize: number) {
  const arr: number[] = [];
  for (let i = 0; i < size; i++) {
    const row = Math.floor(i / rowSize);
    const col = i % rowSize;
    const num = size - i;
    // Reverse the order for odd rows
    const index =
      row % 2 === 1 ? row * rowSize + (rowSize - 1 - col) : row * rowSize + col;
    arr[index] = num;
  }
  return arr;
}

export class Board {
  public readonly size: number;
  public readonly snakes: Snake[] = [];
  public readonly ladders: Ladder[] = [];
  public cells: number[] = [];

  constructor() {
    this.size = 100;
    this.snakes = [
      {
        from: 16,
        to: 6,
      },
      {
        from: 49,
        to: 11,
      },
      {
        from: 62,
        to: 19,
      },
      {
        from: 64,
        to: 60,
      },
      {
        from: 87,
        to: 24,
      },
      {
        from: 95,
        to: 75,
      },
      {
        from: 99,
        to: 79,
      },
    ];
    this.ladders = [
      {
        from: 4,
        to: 14,
      },
      {
        from: 9,
        to: 31,
      },
      {
        from: 18,
        to: 45,
      },
      {
        from: 21,
        to: 42,
      },
      {
        from: 28,
        to: 84,
      },
      {
        from: 51,
        to: 67,
      },
      {
        from: 63,
        to: 83,
      },
      {
        from: 71,
        to: 91,
      },
    ];
    this.cells = createCells(this.size, 10);
  }
}
