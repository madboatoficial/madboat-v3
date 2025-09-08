/**
 * Synthetic data generation for RLVR training
 * Generates realistic training scenarios and test cases
 */

export interface SyntheticTask {
  id: string;
  category: string;
  difficulty: number;
  input: any;
  expectedOutput: any;
  hints?: string[];
  metadata?: Record<string, any>;
}

export interface GeneratorConfig {
  categories: string[];
  difficultyRange: [number, number];
  taskCount: number;
  seed?: number;
  templates?: Record<string, any>;
}

export interface TaskTemplate {
  name: string;
  category: string;
  inputGenerator: () => any;
  outputGenerator: (input: any) => any;
  difficultyCalculator?: (input: any, output: any) => number;
  hintGenerator?: (input: any, output: any) => string[];
}

export class SyntheticGenerator {
  private config: GeneratorConfig;
  private templates: Map<string, TaskTemplate> = new Map();
  private rng: () => number;
  
  constructor(config: GeneratorConfig) {
    this.config = config;
    this.setupRNG();
    this.initializeDefaultTemplates();
  }
  
  /**
   * Generate a set of synthetic tasks
   */
  generateTasks(count?: number): SyntheticTask[] {
    const taskCount = count || this.config.taskCount;
    const tasks: SyntheticTask[] = [];
    
    for (let i = 0; i < taskCount; i++) {
      const category = this.selectRandomCategory();
      const template = this.selectTemplate(category);
      
      if (template) {
        const task = this.generateTaskFromTemplate(template, `task_${i}`);
        tasks.push(task);
      }
    }
    
    return this.balanceDifficulty(tasks);
  }
  
  /**
   * Generate tasks for a specific category
   */
  generateTasksForCategory(category: string, count: number): SyntheticTask[] {
    const template = this.selectTemplate(category);
    if (!template) {
      throw new Error(`No template found for category: ${category}`);
    }
    
    const tasks: SyntheticTask[] = [];
    for (let i = 0; i < count; i++) {
      const task = this.generateTaskFromTemplate(template, `${category}_${i}`);
      tasks.push(task);
    }
    
    return tasks;
  }
  
  /**
   * Register a custom task template
   */
  registerTemplate(template: TaskTemplate): void {
    this.templates.set(template.name, template);
  }
  
  /**
   * Generate a progressive difficulty curve
   */
  generateProgressiveTasks(
    category: string,
    count: number,
    startDifficulty = 0.1,
    endDifficulty = 0.9
  ): SyntheticTask[] {
    const template = this.selectTemplate(category);
    if (!template) {
      throw new Error(`No template found for category: ${category}`);
    }
    
    const tasks: SyntheticTask[] = [];
    const difficultyStep = (endDifficulty - startDifficulty) / (count - 1);
    
    for (let i = 0; i < count; i++) {
      const targetDifficulty = startDifficulty + (i * difficultyStep);
      const task = this.generateTaskWithDifficulty(template, `progressive_${i}`, targetDifficulty);
      tasks.push(task);
    }
    
    return tasks;
  }
  
  private setupRNG(): void {
    if (this.config.seed !== undefined) {
      // Simple linear congruential generator for reproducible results
      let seed = this.config.seed;
      this.rng = () => {
        seed = (seed * 1103515245 + 12345) & 0x7fffffff;
        return seed / 0x7fffffff;
      };
    } else {
      this.rng = Math.random;
    }
  }
  
  private initializeDefaultTemplates(): void {
    // Code Generation Tasks
    this.registerTemplate({
      name: 'function_implementation',
      category: 'code',
      inputGenerator: () => {
        const functions = [
          { name: 'isPrime', args: ['number'], description: 'Check if a number is prime' },
          { name: 'factorial', args: ['number'], description: 'Calculate factorial' },
          { name: 'fibonacci', args: ['number'], description: 'Calculate nth Fibonacci number' },
          { name: 'reverseString', args: ['string'], description: 'Reverse a string' },
          { name: 'sortArray', args: ['array'], description: 'Sort an array of numbers' }
        ];
        
        const func = functions[Math.floor(this.rng() * functions.length)];
        return {
          functionName: func.name,
          arguments: func.args,
          description: func.description,
          language: 'typescript'
        };
      },
      outputGenerator: (input) => {
        const implementations: Record<string, string> = {
          isPrime: `function isPrime(n: number): boolean {
  if (n <= 1) return false;
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) return false;
  }
  return true;
}`,
          factorial: `function factorial(n: number): number {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}`,
          fibonacci: `function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}`,
          reverseString: `function reverseString(str: string): string {
  return str.split('').reverse().join('');
}`,
          sortArray: `function sortArray(arr: number[]): number[] {
  return arr.slice().sort((a, b) => a - b);
}`
        };
        
        return implementations[input.functionName] || 'function placeholder() { /* TODO */ }';
      },
      hintGenerator: (input) => [
        `Implement the ${input.functionName} function`,
        `Function should accept: ${input.arguments.join(', ')}`,
        `Description: ${input.description}`
      ]
    });
    
    // Text Processing Tasks
    this.registerTemplate({
      name: 'text_processing',
      category: 'nlp',
      inputGenerator: () => {
        const tasks = [
          'summarize',
          'classify_sentiment',
          'extract_entities',
          'translate',
          'generate_tags'
        ];
        
        const texts = [
          "Artificial intelligence is transforming how we work and live.",
          "The weather today is absolutely beautiful and perfect for a walk.",
          "I am frustrated with the poor customer service I received.",
          "Machine learning models require careful tuning and validation.",
          "The new restaurant downtown serves amazing Italian cuisine."
        ];
        
        return {
          task: tasks[Math.floor(this.rng() * tasks.length)],
          text: texts[Math.floor(this.rng() * texts.length)]
        };
      },
      outputGenerator: (input) => {
        const outputs: Record<string, Record<string, string>> = {
          summarize: {
            "Artificial intelligence is transforming how we work and live.": "AI is changing work and life.",
            "The weather today is absolutely beautiful and perfect for a walk.": "Beautiful weather, perfect for walking.",
            "I am frustrated with the poor customer service I received.": "Poor customer service caused frustration.",
            "Machine learning models require careful tuning and validation.": "ML models need tuning and validation.",
            "The new restaurant downtown serves amazing Italian cuisine.": "New downtown restaurant has great Italian food."
          },
          classify_sentiment: {
            "Artificial intelligence is transforming how we work and live.": "neutral",
            "The weather today is absolutely beautiful and perfect for a walk.": "positive",
            "I am frustrated with the poor customer service I received.": "negative",
            "Machine learning models require careful tuning and validation.": "neutral",
            "The new restaurant downtown serves amazing Italian cuisine.": "positive"
          }
        };
        
        return outputs[input.task]?.[input.text] || "Unable to process";
      }
    });
    
    // Mathematical Problem Tasks
    this.registerTemplate({
      name: 'math_problems',
      category: 'math',
      inputGenerator: () => {
        const problemTypes = ['linear_equation', 'quadratic', 'statistics', 'geometry'];
        const type = problemTypes[Math.floor(this.rng() * problemTypes.length)];
        
        switch (type) {
          case 'linear_equation':
            const a = Math.floor(this.rng() * 10) + 1;
            const b = Math.floor(this.rng() * 20) - 10;
            return { type, equation: `${a}x + ${b} = 0`, solve_for: 'x' };
            
          case 'statistics':
            const data = Array.from({ length: 5 + Math.floor(this.rng() * 5) }, 
              () => Math.floor(this.rng() * 100));
            return { type, data, calculate: 'mean' };
            
          default:
            return { type, problem: 'Calculate the area of a circle with radius 5' };
        }
      },
      outputGenerator: (input) => {
        switch (input.type) {
          case 'linear_equation':
            // Parse ax + b = 0, solve for x = -b/a
            const match = input.equation.match(/(\d+)x \+ (-?\d+) = 0/);
            if (match) {
              const a = parseInt(match[1]);
              const b = parseInt(match[2]);
              return -b / a;
            }
            return 0;
            
          case 'statistics':
            if (input.calculate === 'mean') {
              return input.data.reduce((sum: number, val: number) => sum + val, 0) / input.data.length;
            }
            return 0;
            
          default:
            return Math.PI * 25; // Area of circle with radius 5
        }
      }
    });
    
    // Database Query Tasks
    this.registerTemplate({
      name: 'database_queries',
      category: 'database',
      inputGenerator: () => {
        const tables = ['users', 'orders', 'products', 'customers'];
        const operations = ['SELECT', 'INSERT', 'UPDATE', 'DELETE'];
        const table = tables[Math.floor(this.rng() * tables.length)];
        const operation = operations[Math.floor(this.rng() * operations.length)];
        
        return {
          table,
          operation,
          description: `${operation} operation on ${table} table`
        };
      },
      outputGenerator: (input) => {
        const queries: Record<string, Record<string, string>> = {
          SELECT: {
            users: "SELECT * FROM users WHERE active = true",
            orders: "SELECT * FROM orders WHERE date > '2024-01-01'",
            products: "SELECT * FROM products WHERE price > 100",
            customers: "SELECT * FROM customers WHERE created_at > NOW() - INTERVAL '30 days'"
          },
          INSERT: {
            users: "INSERT INTO users (name, email) VALUES ('John Doe', 'john@example.com')",
            orders: "INSERT INTO orders (user_id, total) VALUES (1, 99.99)",
            products: "INSERT INTO products (name, price) VALUES ('Widget', 29.99)",
            customers: "INSERT INTO customers (name, email) VALUES ('Jane Smith', 'jane@example.com')"
          }
        };
        
        return queries[input.operation]?.[input.table] || 
               `-- ${input.operation} query for ${input.table} table`;
      }
    });
  }
  
  private selectRandomCategory(): string {
    return this.config.categories[Math.floor(this.rng() * this.config.categories.length)];
  }
  
  private selectTemplate(category: string): TaskTemplate | undefined {
    const categoryTemplates = Array.from(this.templates.values())
      .filter(t => t.category === category);
    
    if (categoryTemplates.length === 0) {
      // Fallback to any template
      const allTemplates = Array.from(this.templates.values());
      return allTemplates[Math.floor(this.rng() * allTemplates.length)];
    }
    
    return categoryTemplates[Math.floor(this.rng() * categoryTemplates.length)];
  }
  
  private generateTaskFromTemplate(template: TaskTemplate, id: string): SyntheticTask {
    const input = template.inputGenerator();
    const expectedOutput = template.outputGenerator(input);
    const difficulty = template.difficultyCalculator 
      ? template.difficultyCalculator(input, expectedOutput)
      : this.calculateDefaultDifficulty();
    const hints = template.hintGenerator 
      ? template.hintGenerator(input, expectedOutput)
      : undefined;
    
    return {
      id,
      category: template.category,
      difficulty: Math.max(this.config.difficultyRange[0], 
                  Math.min(this.config.difficultyRange[1], difficulty)),
      input,
      expectedOutput,
      hints,
      metadata: {
        template: template.name,
        generated_at: Date.now()
      }
    };
  }
  
  private generateTaskWithDifficulty(
    template: TaskTemplate, 
    id: string, 
    targetDifficulty: number
  ): SyntheticTask {
    let bestTask: SyntheticTask | null = null;
    let bestDifference = Infinity;
    
    // Generate multiple candidates and pick the one closest to target difficulty
    for (let attempt = 0; attempt < 10; attempt++) {
      const candidate = this.generateTaskFromTemplate(template, id);
      const difference = Math.abs(candidate.difficulty - targetDifficulty);
      
      if (difference < bestDifference) {
        bestDifference = difference;
        bestTask = candidate;
      }
      
      if (difference < 0.05) break; // Good enough
    }
    
    if (bestTask) {
      bestTask.difficulty = targetDifficulty; // Override with target
    }
    
    return bestTask || this.generateTaskFromTemplate(template, id);
  }
  
  private calculateDefaultDifficulty(): number {
    const [min, max] = this.config.difficultyRange;
    return min + this.rng() * (max - min);
  }
  
  private balanceDifficulty(tasks: SyntheticTask[]): SyntheticTask[] {
    // Sort by difficulty and ensure good distribution
    tasks.sort((a, b) => a.difficulty - b.difficulty);
    
    // Adjust difficulties to ensure even distribution
    const step = (this.config.difficultyRange[1] - this.config.difficultyRange[0]) / tasks.length;
    
    tasks.forEach((task, index) => {
      const targetDifficulty = this.config.difficultyRange[0] + (index * step);
      // Slight adjustment towards target while preserving original relative ordering
      task.difficulty = (task.difficulty + targetDifficulty) / 2;
    });
    
    return tasks;
  }
  
  /**
   * Export tasks to a standardized format
   */
  exportTasks(tasks: SyntheticTask[], format: 'json' | 'csv' = 'json'): string {
    if (format === 'json') {
      return JSON.stringify(tasks, null, 2);
    } else {
      // CSV format
      const headers = ['id', 'category', 'difficulty', 'input', 'expectedOutput', 'hints'];
      const rows = tasks.map(task => [
        task.id,
        task.category,
        task.difficulty.toString(),
        JSON.stringify(task.input),
        JSON.stringify(task.expectedOutput),
        task.hints ? task.hints.join(';') : ''
      ]);
      
      return [headers, ...rows].map(row => row.join(',')).join('\n');
    }
  }
  
  /**
   * Import tasks from external data
   */
  static importTasks(data: string, format: 'json' | 'csv' = 'json'): SyntheticTask[] {
    if (format === 'json') {
      return JSON.parse(data);
    } else {
      // Parse CSV - simplified implementation
      const lines = data.split('\n');
      const headers = lines[0].split(',');
      
      return lines.slice(1).map((line, index) => {
        const values = line.split(',');
        return {
          id: values[0] || `imported_${index}`,
          category: values[1] || 'unknown',
          difficulty: parseFloat(values[2]) || 0.5,
          input: JSON.parse(values[3] || '{}'),
          expectedOutput: JSON.parse(values[4] || '{}'),
          hints: values[5] ? values[5].split(';') : undefined
        };
      });
    }
  }
}