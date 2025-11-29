interface Challenge {
    id: number;
    title: string;
    description: string;
    code: string;
    targetLine?: number;
    solution: string;
    hint: string;
    xpReward: number;
    timeLimit: number;
    question?: string;
    testCases?: Array<{ input: string; output: string }>;
}

const bugHuntChallenges: Record<string, Record<string, Challenge[]>> = {
    javascript: {
        easy: [
            {
                id: 1,
                title: 'Missing Semicolon',
                description: 'Find the missing semicolon',
                code: `function greet(name) {\n  console.log("Hello, " + name)\n  return true;\n}`,
                targetLine: 2,
                solution: `function greet(name) {\n  console.log("Hello, " + name);\n  return true;\n}`,
                hint: 'Look at the console.log statement',
                xpReward: 50,
                timeLimit: 60,
            },
            {
                id: 2,
                title: 'Undefined Variable',
                description: 'Find the undefined variable',
                code: `function sum(a, b) {\n  let result = a + b;\n  return reslt;\n}`,
                targetLine: 3,
                solution: `function sum(a, b) {\n  let result = a + b;\n  return result;\n}`,
                hint: 'Check the return statement carefully',
                xpReward: 50,
                timeLimit: 60,
            },
        ],
        medium: [
            {
                id: 3,
                title: 'Array Index Error',
                description: 'Find the array indexing bug',
                code: `function getLastElement(arr) {\n  return arr[arr.length];\n}`,
                targetLine: 2,
                solution: `function getLastElement(arr) {\n  return arr[arr.length - 1];\n}`,
                hint: 'Array indices start at 0',
                xpReward: 75,
                timeLimit: 90,
            },
        ],
    },
    python: {
        easy: [
            {
                id: 1,
                title: 'Indentation Error',
                description: 'Find the indentation issue',
                code: `def greet(name):\nprint(f"Hello, {name}")\n    return True`,
                targetLine: 2,
                solution: `def greet(name):\n    print(f"Hello, {name}")\n    return True`,
                hint: 'Python requires proper indentation',
                xpReward: 50,
                timeLimit: 60,
            },
        ],
    },
    java: {
        easy: [
            {
                id: 1,
                title: 'Missing Semicolon',
                description: 'Find the missing semicolon',
                code: `public class Main {\n    public static void greet(String name) {\n        System.out.println("Hello, " + name)\n    }\n}`,
                targetLine: 3,
                solution: `public class Main {\n    public static void greet(String name) {\n        System.out.println("Hello, " + name);\n    }\n}`,
                hint: 'Java statements must end with semicolons',
                xpReward: 50,
                timeLimit: 60,
            },
        ],
    },
    cpp: {
        easy: [
            {
                id: 1,
                title: 'Missing Semicolon',
                description: 'Find the missing semicolon',
                code: `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello World"\n    return 0;\n}`,
                targetLine: 5,
                solution: `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello World";\n    return 0;\n}`,
                hint: 'C++ statements must end with semicolons',
                xpReward: 50,
                timeLimit: 60,
            },
        ],
    },
    typescript: {
        easy: [
            {
                id: 1,
                title: 'Type Mismatch',
                description: 'Find the type error',
                code: `function add(a: number, b: number): string {\n    return a + b;\n}`,
                targetLine: 1,
                solution: `function add(a: number, b: number): number {\n    return a + b;\n}`,
                hint: 'Check the return type',
                xpReward: 50,
                timeLimit: 60,
            },
        ],
    },
    go: {
        easy: [
            {
                id: 1,
                title: 'Missing Return',
                description: 'Find the missing return statement',
                code: `package main\n\nfunc add(a int, b int) int {\n    result := a + b\n}`,
                targetLine: 4,
                solution: `package main\n\nfunc add(a int, b int) int {\n    result := a + b\n    return result\n}`,
                hint: 'Function must return a value',
                xpReward: 50,
                timeLimit: 60,
            },
        ],
    },
};

const codeCompletionChallenges: Record<string, Record<string, Challenge[]>> = {
    javascript: {
        easy: [
            {
                id: 1,
                title: 'Complete Array Sum',
                description: 'Complete the function to sum array elements',
                code: `function calculateSum(arr) {\n  let sum = 0;\n  for (let i = 0; i < arr.length; i++) {\n    // Add your code here\n  }\n  return sum;\n}`,
                solution: `function calculateSum(arr) {\n  let sum = 0;\n  for (let i = 0; i < arr.length; i++) {\n    sum += arr[i];\n  }\n  return sum;\n}`,
                hint: 'Add each array element to the sum variable',
                xpReward: 75,
                timeLimit: 90,
            },
            {
                id: 2,
                title: 'Complete Filter Function',
                description: 'Complete the function to filter even numbers',
                code: `function filterEven(arr) {\n  return arr.filter(num => {\n    // Add your condition here\n  });\n}`,
                solution: `function filterEven(arr) {\n  return arr.filter(num => {\n    return num % 2 === 0;\n  });\n}`,
                hint: 'Use modulo operator to check if number is even',
                xpReward: 75,
                timeLimit: 90,
            },
        ],
    },
    python: {
        easy: [
            {
                id: 1,
                title: 'Complete List Sum',
                description: 'Complete the function to sum list elements',
                code: `def calculate_sum(arr):\n    total = 0\n    for num in arr:\n        # Add your code here\n    return total`,
                solution: `def calculate_sum(arr):\n    total = 0\n    for num in arr:\n        total += num\n    return total`,
                hint: 'Add each element to the total variable',
                xpReward: 75,
                timeLimit: 90,
            },
        ],
    },
};

const refactorChallenges: Record<string, Record<string, Challenge[]>> = {
    javascript: {
        easy: [
            {
                id: 1,
                title: 'Simplify Nested Conditions',
                description: 'Refactor nested if statements',
                code: `function checkAge(age) {\n  if (age >= 18) {\n    if (age < 65) {\n      return "adult";\n    } else {\n      return "senior";\n    }\n  } else {\n    return "minor";\n  }\n}`,
                solution: `function checkAge(age) {\n  if (age < 18) return "minor";\n  if (age >= 65) return "senior";\n  return "adult";\n}`,
                hint: 'Use early returns to simplify the logic',
                xpReward: 100,
                timeLimit: 120,
            },
            {
                id: 2,
                title: 'Remove Code Duplication',
                description: 'Refactor duplicate code',
                code: `function processUser(user) {\n  if (user.type === "admin") {\n    console.log("Processing admin");\n    user.permissions = ["read", "write", "delete"];\n    user.active = true;\n  } else {\n    console.log("Processing user");\n    user.permissions = ["read"];\n    user.active = true;\n  }\n}`,
                solution: `function processUser(user) {\n  console.log(\`Processing \${user.type === "admin" ? "admin" : "user"}\`);\n  user.permissions = user.type === "admin" ? ["read", "write", "delete"] : ["read"];\n  user.active = true;\n}`,
                hint: 'Extract common code and use ternary operators',
                xpReward: 100,
                timeLimit: 120,
            },
        ],
    },
    python: {
        easy: [
            {
                id: 1,
                title: 'Simplify Nested Conditions',
                description: 'Refactor nested if statements',
                code: `def check_age(age):\n    if age >= 18:\n        if age < 65:\n            return "adult"\n        else:\n            return "senior"\n    else:\n        return "minor"`,
                solution: `def check_age(age):\n    if age < 18:\n        return "minor"\n    if age >= 65:\n        return "senior"\n    return "adult"`,
                hint: 'Use early returns to simplify the logic',
                xpReward: 100,
                timeLimit: 120,
            },
        ],
    },
};

const speedCodingChallenges: Record<string, Record<string, Challenge[]>> = {
    javascript: {
        easy: [
            {
                id: 1,
                title: 'Reverse String',
                description: 'Write a function to reverse a string',
                question: 'Write a function that takes a string and returns it reversed.',
                code: `// Write your solution here\nfunction reverseString(str) {\n  \n}`,
                solution: `function reverseString(str) {\n  return str.split('').reverse().join('');\n}`,
                hint: 'Use split, reverse, and join methods',
                xpReward: 60,
                timeLimit: 120,
                testCases: [
                    { input: '"hello"', output: '"olleh"' },
                    { input: '"world"', output: '"dlrow"' },
                ],
            },
            {
                id: 2,
                title: 'Find Maximum',
                description: 'Find the maximum number in an array',
                question: 'Write a function that returns the largest number in an array.',
                code: `// Write your solution here\nfunction findMax(arr) {\n  \n}`,
                solution: `function findMax(arr) {\n  return Math.max(...arr);\n}`,
                hint: 'Use Math.max with spread operator',
                xpReward: 60,
                timeLimit: 120,
                testCases: [
                    { input: '[1, 5, 3, 9, 2]', output: '9' },
                    { input: '[10, 20, 5]', output: '20' },
                ],
            },
        ],
    },
    python: {
        easy: [
            {
                id: 1,
                title: 'Reverse String',
                description: 'Write a function to reverse a string',
                question: 'Write a function that takes a string and returns it reversed.',
                code: `# Write your solution here\ndef reverse_string(s):\n    pass`,
                solution: `def reverse_string(s):\n    return s[::-1]`,
                hint: 'Use Python string slicing',
                xpReward: 60,
                timeLimit: 120,
                testCases: [
                    { input: '"hello"', output: '"olleh"' },
                    { input: '"world"', output: '"dlrow"' },
                ],
            },
        ],
    },
};

export function getChallengesByType(
    gameType: string,
    difficulty: string,
    language: string
): Challenge[] {
    const challengeMap: Record<string, any> = {
        'bug-hunt': bugHuntChallenges,
        'code-completion': codeCompletionChallenges,
        'refactor-challenge': refactorChallenges,
        'speed-coding': speedCodingChallenges,
    };

    const challenges = challengeMap[gameType];
    if (!challenges) return [];

    const langChallenges = challenges[language] || challenges['javascript'];
    const diffChallenges = langChallenges[difficulty] || langChallenges['easy'];

    return diffChallenges || [];
}
