import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface CodeEditorProps {
  projectId: number;
}

export default function CodeEditor({ projectId }: CodeEditorProps) {
  const [code, setCode] = useState<string>(`// Write your code here
function helloWorld() {
  console.log("Hello from the AI Workspace!");
  return "Hello, World!";
}

// Call the function
helloWorld();
`);
  const [language, setLanguage] = useState<string>("javascript");
  const [output, setOutput] = useState<string>("");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const { toast } = useToast();

  // Languages supported by the editor
  const languages = [
    { id: "javascript", name: "JavaScript" },
    { id: "typescript", name: "TypeScript" },
    { id: "python", name: "Python" },
    { id: "html", name: "HTML" },
    { id: "css", name: "CSS" },
  ];

  // Simulate code execution
  const runCode = () => {
    setIsRunning(true);
    setOutput("");
    
    // Simulate execution delay
    setTimeout(() => {
      try {
        // Simple JavaScript execution simulation - in a real app, we'd use a safer approach
        if (language === "javascript") {
          // Capture console.log output
          const originalLog = console.log;
          let logs: string[] = [];
          
          console.log = (...args) => {
            logs.push(args.join(" "));
            originalLog.apply(console, args);
          };
          
          // Execute the code in a try/catch block
          try {
            // eslint-disable-next-line no-new-func
            new Function(code)();
            setOutput(logs.join("\n"));
          } catch (error) {
            if (error instanceof Error) {
              setOutput(`Error: ${error.message}`);
            } else {
              setOutput("An unknown error occurred");
            }
          }
          
          // Restore the original console.log
          console.log = originalLog;
        } else {
          // For other languages, just show a simulation message
          setOutput(`[${language.toUpperCase()} Execution Simulated]\nHello from the AI Workspace!`);
        }
        
        toast({
          title: "Code executed",
          description: "Your code has been executed successfully",
        });
      } catch (error) {
        setOutput(`Error executing code: ${error}`);
        toast({
          title: "Execution error",
          description: "There was an error executing your code",
          variant: "destructive",
        });
      } finally {
        setIsRunning(false);
      }
    }, 1000);
  };

  // Simulate generating code from a prompt
  const generateCode = () => {
    setIsRunning(true);
    
    // Pretend we're asking an AI to generate code
    setTimeout(() => {
      const newCode = `// AI-generated code
function calculateFibonacci(n) {
  if (n <= 1) return n;
  
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) {
    const temp = a + b;
    a = b;
    b = temp;
  }
  
  return b;
}

// Generate the first 10 Fibonacci numbers
for (let i = 0; i < 10; i++) {
  console.log(\`Fibonacci(\${i}) = \${calculateFibonacci(i)}\`);
}`;

      setCode(newCode);
      setIsRunning(false);
      
      toast({
        title: "Code generated",
        description: "New code has been generated based on your prompt",
      });
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      {/* Toolbar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-200"
          >
            {languages.map(lang => (
              <option key={lang.id} value={lang.id}>{lang.name}</option>
            ))}
          </select>
          
          <button 
            onClick={runCode}
            disabled={isRunning}
            className="px-3 py-1.5 bg-primary hover:bg-blue-600 text-white rounded-md text-sm font-medium disabled:opacity-50 flex items-center"
          >
            {isRunning ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Running...
              </>
            ) : (
              <>
                <i className="fas fa-play mr-2"></i>
                Run
              </>
            )}
          </button>
          
          <button 
            onClick={generateCode}
            disabled={isRunning}
            className="px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-md text-sm font-medium disabled:opacity-50 flex items-center"
          >
            <i className="fas fa-magic mr-2"></i>
            Generate Code
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-md">
            <i className="fas fa-download"></i>
          </button>
          <button className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-md">
            <i className="fas fa-cog"></i>
          </button>
        </div>
      </div>
      
      {/* Code editor area */}
      <div className="flex-1 grid grid-rows-2 md:grid-rows-1 md:grid-cols-2 gap-4 p-4 h-full overflow-hidden">
        <div className="h-full flex flex-col">
          <div className="text-xs text-gray-500 dark:text-gray-400 font-mono mb-1 flex justify-between">
            <span>Editor</span>
            <span className="text-gray-400 dark:text-gray-500">{language}</span>
          </div>
          <div className="flex-1 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="font-mono text-sm p-4 w-full h-full bg-transparent text-gray-800 dark:text-gray-200 outline-none resize-none"
              spellCheck={false}
            />
          </div>
        </div>
        
        <div className="h-full flex flex-col">
          <div className="text-xs text-gray-500 dark:text-gray-400 font-mono mb-1">Output</div>
          <div className="flex-1 bg-gray-800 rounded-md border border-gray-700 p-4 overflow-auto">
            <pre className="font-mono text-sm text-green-400 whitespace-pre-wrap">
              {output || 'Run your code to see output here...'}
            </pre>
          </div>
        </div>
      </div>
      
      {/* File explorer/prompt area */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-3">
        <div className="flex">
          <input 
            type="text" 
            placeholder="Ask AI for code suggestions..." 
            className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-l-md text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button 
            className="px-4 py-2 bg-primary hover:bg-blue-600 text-white rounded-r-md text-sm"
            onClick={generateCode}
          >
            <i className="fas fa-bolt"></i>
          </button>
        </div>
      </div>
    </div>
  );
}