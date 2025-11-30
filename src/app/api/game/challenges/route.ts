import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const gameType = searchParams.get('gameType');
        const difficulty = searchParams.get('difficulty');
        const language = searchParams.get('language');

        // In production, fetch from database
        const challenges = getChallenges(gameType, difficulty, language);

        return NextResponse.json(challenges);
    } catch (error: any) {
        console.error('Error fetching challenges:', error);
        return NextResponse.json(
            { error: 'Failed to fetch challenges', details: error.message },
            { status: 500 }
        );
    }
}

function getChallenges(gameType: string | null, difficulty: string | null, language: string | null) {
    const bugHuntChallenges = {
        easy: [
            {
                id: 1,
                title: 'Missing Semicolon',
                description: 'Find and fix the missing semicolon',
                code: `function greet(name) {
  console.log("Hello, " + name)
  return true;
}`,
                bugLine: 2,
                bugDescription: 'Missing semicolon at end of line',
                solution: `function greet(name) {
  console.log("Hello, " + name);
  return true;
}`,
                xpReward: 50,
                timeLimit: 60,
            },
            {
                id: 2,
                title: 'Undefined Variable',
                description: 'Fix the undefined variable error',
                code: `function calculate() {
  let x = 10;
  let y = 20;
  return x + z;
}`,
                bugLine: 4,
                bugDescription: 'Variable z is not defined',
                solution: `function calculate() {
  let x = 10;
  let y = 20;
  return x + y;
}`,
                xpReward: 50,
                timeLimit: 60,
            },
        ],
        medium: [
            {
                id: 3,
                title: 'Array Index Error',
                description: 'Fix the array index out of bounds error',
                code: `function getLastElement(arr) {
  return arr[arr.length];
}

const numbers = [1, 2, 3, 4, 5];
console.log(getLastElement(numbers));`,
                bugLine: 2,
                bugDescription: 'Array index should be length - 1',
                solution: `function getLastElement(arr) {
  return arr[arr.length - 1];
}

const numbers = [1, 2, 3, 4, 5];
console.log(getLastElement(numbers));`,
                xpReward: 100,
                timeLimit: 120,
            },
            {
                id: 4,
                title: 'Infinite Loop',
                description: 'Fix the infinite loop bug',
                code: `function countdown(n) {
  while (n > 0) {
    console.log(n);
  }
  console.log("Done!");
}`,
                bugLine: 2,
                bugDescription: 'Missing decrement in loop',
                solution: `function countdown(n) {
  while (n > 0) {
    console.log(n);
    n--;
  }
  console.log("Done!");
}`,
                xpReward: 100,
                timeLimit: 120,
            },
        ],
        hard: [
            {
                id: 5,
                title: 'Async/Await Error',
                description: 'Fix the async/await implementation',
                code: `function fetchData() {
  const response = await fetch('https://api.example.com/data');
  const data = await response.json();
  return data;
}`,
                bugLine: 1,
                bugDescription: 'Missing async keyword',
                solution: `async function fetchData() {
  const response = await fetch('https://api.example.com/data');
  const data = await response.json();
  return data;
}`,
                xpReward: 200,
                timeLimit: 180,
            },
            {
                id: 6,
                title: 'Closure Bug',
                description: 'Fix the closure variable issue',
                code: `function createCounters() {
  const counters = [];
  for (var i = 0; i < 3; i++) {
    counters.push(function() {
      return i;
    });
  }
  return counters;
}

const counters = createCounters();
console.log(counters[0]()); // Should be 0`,
                bugLine: 3,
                bugDescription: 'Use let instead of var for block scope',
                solution: `function createCounters() {
  const counters = [];
  for (let i = 0; i < 3; i++) {
    counters.push(function() {
      return i;
    });
  }
  return counters;
}

const counters = createCounters();
console.log(counters[0]()); // Should be 0`,
                xpReward: 200,
                timeLimit: 180,
            },
        ],
    };

    const difficultyLevel = difficulty || 'medium';
    return bugHuntChallenges[difficultyLevel as keyof typeof bugHuntChallenges] || bugHuntChallenges.medium;
}
