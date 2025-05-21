// Defines the shapes and colors for all standard Tetrominoes.
// Each Tetromino shape is represented as a 2D array (matrix) for its different rotation states.
// A '1' represents a filled cell, and '0' an empty cell within its bounding box.

const TETROMINOES_DATA = {
  0: { shape: [[[0]]], color: 'rgb(50, 50, 50)' }, // Represents an empty cell or the board background
  I: {
    shape: [
      [ // Rotation 0: Horizontal ----
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ],
      [ // Rotation 1: Vertical |
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0]
      ]
      // I-shape only has 2 distinct rotations, others are mirrors
    ],
    color: 'rgb(0, 255, 255)', // Cyan
  },
  J: {
    shape: [
      [ // Rotation 0
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]
      ],
      [ // Rotation 1
        [0, 1, 1],
        [0, 1, 0],
        [0, 1, 0]
      ],
      [ // Rotation 2
        [0, 0, 0],
        [1, 1, 1],
        [0, 0, 1]
      ],
      [ // Rotation 3
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 0]
      ]
    ],
    color: 'rgb(0, 0, 255)', // Blue
  },
  L: {
    shape: [
      [ // Rotation 0
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]
      ],
      [ // Rotation 1
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 1]
      ],
      [ // Rotation 2
        [0, 0, 0],
        [1, 1, 1],
        [1, 0, 0]
      ],
      [ // Rotation 3
        [1, 1, 0],
        [0, 1, 0],
        [0, 1, 0]
      ]
    ],
    color: 'rgb(255, 165, 0)', // Orange
  },
  O: {
    shape: [ // O-shape only has 1 rotation
      [
        [1, 1],
        [1, 1]
      ]
    ],
    color: 'rgb(255, 255, 0)', // Yellow
  },
  S: {
    shape: [
      [ // Rotation 0
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
      ],
      [ // Rotation 1
        [0, 1, 0],
        [0, 1, 1],
        [0, 0, 1]
      ]
      // S-shape only has 2 distinct rotations
    ],
    color: 'rgb(0, 255, 0)', // Green
  },
  T: {
    shape: [
      [ // Rotation 0
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]
      ],
      [ // Rotation 1
        [0, 1, 0],
        [0, 1, 1],
        [0, 1, 0]
      ],
      [ // Rotation 2
        [0, 0, 0],
        [1, 1, 1],
        [0, 1, 0]
      ],
      [ // Rotation 3
        [0, 1, 0],
        [1, 1, 0],
        [0, 1, 0]
      ]
    ],
    color: 'rgb(128, 0, 128)', // Purple
  },
  Z: {
    shape: [
      [ // Rotation 0
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
      ],
      [ // Rotation 1
        [0, 0, 1],
        [0, 1, 1],
        [0, 1, 0]
      ]
      // Z-shape only has 2 distinct rotations
    ],
    color: 'rgb(255, 0, 0)', // Red
  }
};

// To make this available in a no-module environment if loaded via <script> tag before index.js:
// window.TETROMINOES_DATA = TETROMINOES_DATA;
// However, the subtask specified Option A: define directly in index.js.
// This file is created to fulfill the "Create tetrominoes.js" part of the requirement.
// Its content will be effectively copied into index.js in the next step.
