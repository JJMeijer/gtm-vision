import type { Runtime, RuntimeFactory, RuntimeInstruction, RuntimeInstructionContent } from "../types";

const parseInstruction = (instruction: RuntimeInstruction) => {
    const [opcode, ...content] = instruction;

    if (!runtimeFactory[opcode]) {
        return JSON.stringify(instruction);
    }

    return runtimeFactory[opcode](content);
};

const parseInstructionContent = (content: RuntimeInstructionContent): string => {
    if (typeof content === "string") {
        return `"${content}"`;
    }

    if (typeof content === "boolean" || typeof content === "number") {
        return `${content}`;
    }

    return parseInstruction(content);
};

const runtimeFactory: RuntimeFactory = {
    // Variable assignment
    3: (content) => {
        const [variable, value] = content;

        return `${variable} = ${parseInstructionContent(value)}`;
    },

    // Define Array
    7: (content) => {
        return `[${content.map(parseInstructionContent).join(", ")}]`;
    },

    // Define Object
    8: (content) => {
        const pairs = [];
        for (let i = 0; i < content.length; i += 2) {
            pairs.push(`${parseInstructionContent(content[i])}: ${parseInstructionContent(content[i + 1])}`);
        }

        return `{\n${pairs.join(",\n")}\n}`;
    },

    // Variable reference
    15: (content) => {
        const [name] = content;

        if (name === "a") {
            return "data";
        }

        return `${name}`;
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

    // Set `const` variable
    52: (content) => {
        const [name, value] = content;

        return `const ${name} = ${parseInstructionContent(value)}`;
    },

    // Require Library
    require: (content) => {
        const [name] = content;
        return `require("${name}")`;
    },
};

export const parseRuntimes = (runtimes: Runtime[]) => {
    const customRuntimes = runtimes.filter(([, name]) => name.startsWith("__cvt_"));

    return customRuntimes.map(([, name, ...instructions]) => {
        const parsedInstructions = instructions.map(parseInstruction);

        return {
            name,
            code: parsedInstructions.join("\n"),
        };
    });
};
