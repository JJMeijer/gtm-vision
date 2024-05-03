import type { Runtime, RuntimeFactory, RuntimeInstruction } from "../types";

const parseInstruction = (instruction: RuntimeInstruction) => {
    const [opcode, ...content] = instruction;

    if (!runtimeFactory[opcode]) {
        return JSON.stringify(instruction);
    }

    return runtimeFactory[opcode](content);
};

const runtimeFactory: RuntimeFactory = {
    // Set `const` variable
    52: (content) => {
        const [name, value] = content;

        return `const ${name} = ${parseInstruction(value)};`;
    },

    // Require Library
    require: (content) => {
        const [name] = content;
        return `require("${name}");`;
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
