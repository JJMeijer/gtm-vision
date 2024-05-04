import jsBeautify from "js-beautify";

import type { Runtime, RuntimeInstruction, RuntimeInstructionContent, RuntimeOperations } from "../types";
import { beautifyOptions } from "./beautify-options";

const { js } = jsBeautify;

class RuntimeFactory {
    variables: Record<string, string> = {
        a: "data",
    };

    operations: RuntimeOperations = {
        // Addition (+)
        0: (content) => {
            const [left, right] = content;
            return `${this.parseInstructionContent(left)} + ${this.parseInstructionContent(right)}`;
        },

        // Variable assignment
        3: (content) => {
            const [variable, value] = content;

            return `${variable} = ${this.parseInstructionContent(value)}`;
        },

        // Define Array
        7: (content) => {
            return `[${content.map(this.parseInstructionContent).join(", ")}]`;
        },

        // Define Object
        8: (content) => {
            const pairs = [];
            for (let i = 0; i < content.length; i += 2) {
                pairs.push(
                    `${this.parseInstructionContent(content[i])}: ${this.parseInstructionContent(content[i + 1])}`,
                );
            }

            return `{\n${pairs.join(",\n")}\n}`;
        },

        // Variable reference
        15: (content) => {
            const name = content[0] as string;
            return `${this.variables[name] || name}`;
        },

        // Return statement
        36: (content) => {
            const [value] = content;

            return `return ${this.parseInstructionContent(value)}`;
        },

        // Substraction (-)
        37: (content) => {
            const [left, right] = content;
            return `${this.parseInstructionContent(left)} - ${this.parseInstructionContent(right)}`;
        },

        // initialize let (no assignment)
        41: (content) => {
            const [name] = content;

            return `let ${name}`;
        },

        // undefined
        44: () => {
            return "undefined";
        },

        // null
        45: () => {
            return "null";
        },

        // initiate data object
        46: () => {
            return "";
        },

        // Define Function declaration
        50: (content) => {
            const [name, argsInstruction, ...bodyInstructions] = content;

            this.operations[name as string] = (content) => {
                return this.operations.func([name, ...content]);
            };

            const args = (argsInstruction as RuntimeInstruction).slice(1).join(", ");
            const body = (bodyInstructions as RuntimeInstruction[]).map(this.parseInstruction).join("\n");

            return `function ${name}(${args}) {\n${body}\n}`;
        },

        // Define Function expression
        51: (content) => {
            const [_functionName, argsInstruction, ...bodyInstructions] = content;

            const args = (argsInstruction as RuntimeInstruction).slice(1).join(", ");
            const body = (bodyInstructions as RuntimeInstruction[]).map(this.parseInstruction).join("\n");

            return `(${args}) => {\n${body}\n}`;
        },

        // Set `const` variable
        52: (content) => {
            const name = content[0] as string;
            let newName = name;
            let value = content[1];

            value = this.parseInstructionContent(value);

            const requireMatch = value.match(/require\("(.+)"\)/);
            if (requireMatch) {
                newName = requireMatch[1];
            }

            this.variables[name] = newName;

            this.operations[name] = (content) => {
                return this.operations.func([name, ...content]);
            };

            return `const ${newName} = ${value}`;
        },

        // Require Library
        require: (content) => {
            const [name] = content;
            return `require("${name}")`;
        },

        // function call
        func: (content) => {
            const name = content[0] as string;
            const ref = this.variables[name] || name;

            const args = content.slice(1).map(this.parseInstructionContent).join(", ");

            return `${ref}(${args})`;
        },
    };

    parseInstruction = (instruction: RuntimeInstruction) => {
        const [opcode, ...content] = instruction;

        if (!this.operations[opcode]) {
            return JSON.stringify(instruction);
        }

        return this.operations[opcode](content);
    };

    parseInstructionContent = (content: RuntimeInstructionContent): string => {
        if (typeof content === "string") {
            return `"${content}"`;
        }

        if (typeof content === "boolean" || typeof content === "number") {
            return `${content}`;
        }

        return this.parseInstruction(content);
    };
}

export const parseRuntimes = (runtimes: Runtime[]) => {
    const customRuntimes = runtimes.filter(([, name]) => name.startsWith("__cvt_"));

    const runtimeFactory = new RuntimeFactory();

    return customRuntimes.map(([, name, ...instructions]) => {
        const start = Date.now();
        const parsedInstructions = instructions.map(runtimeFactory.parseInstruction);

        console.log(`Parsed ${name} in ${Date.now() - start}ms`);
        console.log(runtimeFactory.variables);

        return {
            name,
            code: js(parsedInstructions.join("\n").trim(), beautifyOptions),
        };
    });
};
