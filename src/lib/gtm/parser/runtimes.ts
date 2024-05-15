import jsBeautify from "js-beautify";

import type {
    ParsedRuntimes,
    Runtime,
    RuntimeInstruction,
    RuntimeInstructionContent,
    RuntimeOperations,
} from "../types";
import { beautifyOptions } from "./beautify-options";
import { parseTemplateId } from "./utility";

const { js } = jsBeautify;

class RuntimeContext {
    data: Record<string, unknown> = {};

    set = (key: string, value: unknown) => {
        this.data[key] = value;
    };

    get = (key: string) => {
        return this.data[key];
    };

    remove = (key: string) => {
        delete this.data[key];
    };
}

class RuntimeFactory {
    variables: Record<string, string> = {
        a: "data",
    };

    letInitialized: Record<string, boolean> = {};

    context = new RuntimeContext();

    REPLACER = "-REPLACER-";

    operations: RuntimeOperations = {
        // Addition (+)
        0: (content) => {
            const [left, right] = content;
            return `${this.parseInstructionContent(left)} + ${this.parseInstructionContent(right)}`;
        },

        // AND (&&)
        1: (content) => {
            const [left, right] = content;
            return `${this.parseInstructionContent(left)} && ${this.parseInstructionContent(right)}`;
        },

        // Method call
        2: (content) => {
            const [variable, method, args] = content;

            const methodArgs = Array.isArray(args) ? args.slice(1).map(this.parseInstructionContent).join(", ") : args;

            return `${this.parseInstructionContent(variable)}.${method}(${methodArgs})`;
        },

        // Variable assignment
        3: (content) => {
            const [variable, value] = content;

            if (this.letInitialized[variable as string]) {
                return `${variable} = ${this.parseInstructionContent(value)}`;
            }

            this.letInitialized[variable as string] = true;
            return `let ${variable} = ${this.parseInstructionContent(value)}`;
        },

        // Break statement
        4: () => {
            return "break";
        },

        // Case statement
        5: (content, index) => {
            const caseValueList = this.context.get("caseValueList") as string[];

            if (!caseValueList || typeof index !== "number" || !caseValueList[index]) {
                return "";
            }

            const instruction = content[0] as RuntimeInstruction;

            if (instruction.length === 1) {
                return `case ${caseValueList[index]}:`;
            }

            return `case ${caseValueList[index]}:\n${this.parseInstruction(instruction)}\n`;
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

        // default case
        9: (content) => {
            const [instruction] = content;
            return `default:\n${this.parseInstructionContent(instruction)}`;
        },

        // divide (/)
        10: (content) => {
            const [left, right] = content;
            return `${this.parseInstructionContent(left)} / ${this.parseInstructionContent(right)}`;
        },

        // comparison (==)
        12: (content) => {
            const [left, right] = content;
            return `${this.parseInstructionContent(left)} == ${this.parseInstructionContent(right)}`;
        },

        // Self invoking function
        13: (content) => {
            const [, letFuncInstruction] = content;
            const [, , funcInstruction] = letFuncInstruction as RuntimeInstruction;

            return `(${this.parseInstructionContent(funcInstruction)})()`;
        },

        // Variable reference
        15: (content) => {
            const name = content[0] as string;
            return `${this.variables[name] || name}`;
        },

        // Object property reference
        16: (content) => {
            const [object, property] = content;
            return `${this.parseInstructionContent(object)}[${this.parseInstructionContent(property)}]`;
        },

        // Dot notation
        17: (content) => {
            const [variable, property] = content;
            return `${this.parseInstructionContent(variable)}.${property}`;
        },

        // Greater than (>)
        18: (content) => {
            const [left, right] = content;
            return `${this.parseInstructionContent(left)} > ${this.parseInstructionContent(right)}`;
        },

        // Greater than or equal (>=)
        19: (content) => {
            const [left, right] = content;
            return `${this.parseInstructionContent(left)} >= ${this.parseInstructionContent(right)}`;
        },

        // Comparison (===)
        20: (content) => {
            const [left, right] = content;
            return `${this.parseInstructionContent(left)} === ${this.parseInstructionContent(right)}`;
        },

        // Not comparison (!==)
        21: (content) => {
            const [left, right] = content;
            return `${this.parseInstructionContent(left)} !== ${this.parseInstructionContent(right)}`;
        },

        // if statement
        22: (content) => {
            const [condition, ifBlockInstruction, elseBlockInstruction] = content;
            const conditionString = this.parseInstructionContent(condition);
            const ifBlock = this.parseInstructionContent(ifBlockInstruction);

            if (elseBlockInstruction) {
                const elseBlock = this.parseInstructionContent(elseBlockInstruction);

                return `if (${conditionString}) {\n${ifBlock}\n} else {\n${elseBlock}\n}\n`;
            }

            return `if (${conditionString}) {\n${ifBlock}\n}\n`;
        },

        // less than (<)
        23: (content) => {
            const [left, right] = content;
            return `${this.parseInstructionContent(left)} < ${this.parseInstructionContent(right)}`;
        },

        // less than or equal (<=)
        24: (content) => {
            const [left, right] = content;
            return `${this.parseInstructionContent(left)} <= ${this.parseInstructionContent(right)}`;
        },

        // Modulo (%)
        25: (content) => {
            const [left, right] = content;
            return `${this.parseInstructionContent(left)} % ${this.parseInstructionContent(right)}`;
        },

        // Multiplication (*)
        26: (content) => {
            const [left, right] = content;
            return `${this.parseInstructionContent(left)} * ${this.parseInstructionContent(right)}`;
        },

        // minus (-)
        27: (content) => {
            const [value] = content;
            return `-${this.parseInstructionContent(value)}`;
        },

        // Not (!)
        28: (content) => {
            const [value] = content;
            return `!(${this.parseInstructionContent(value)})`;
        },

        // Not comparison (!=)
        29: (content) => {
            const [left, right] = content;
            return `${this.parseInstructionContent(left)} != ${this.parseInstructionContent(right)}`;
        },

        // logical OR (||)
        30: (content) => {
            const [left, right] = content;
            return `${this.parseInstructionContent(left)} || ${this.parseInstructionContent(right)}`;
        },

        // subtraction shorthand
        32: (content) => {
            const [variable] = content;
            return `${this.parseInstructionContent(variable)}--`;
        },

        // addition shorthand
        33: (content) => {
            const [variable] = content;
            return `${this.parseInstructionContent(variable)}++`;
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

        // Switch statement
        38: (content) => {
            const [condition, caseValues, caseInstructions] = content;

            const caseValueList = (caseValues as RuntimeInstruction[]).slice(1).map(this.parseInstructionContent);
            this.context.set("caseValueList", caseValueList);

            const conditionString = this.parseInstructionContent(condition);
            const caseInstructionsString = this.parseInstructionContent(caseInstructions);

            this.context.remove("caseValueList");

            return `switch (${conditionString}) {\n ${caseInstructionsString}}\n`;
        },

        // Ternary operator
        39: (content) => {
            const [conditionInstruction, trueInstruction, falseInstruction] = content;

            const conditionInstructionString = this.parseInstructionContent(conditionInstruction);
            const trueInstructionString = this.parseInstructionContent(trueInstruction);
            const falseInstructionString = this.parseInstructionContent(falseInstruction);

            return `${conditionInstructionString} ? ${trueInstructionString} : ${falseInstructionString}`;
        },

        // typeof
        40: (content) => {
            const [value] = content;
            return `typeof ${this.parseInstructionContent(value)}`;
        },

        // initialize let (no assignment)
        41: (content) => {
            const [name] = content;

            this.letInitialized[name as string] = false;

            return ``;
        },

        // Object property assignment
        43: (content) => {
            const [variable, property, value] = content;
            return `${this.parseInstructionContent(variable)}[${this.parseInstructionContent(property)}] = ${this.parseInstructionContent(value)}`;
        },

        // undefined
        44: () => {
            return "undefined";
        },

        // null
        45: () => {
            return "null";
        },

        // start scoped list of instructions
        // TODO check if we need to do something with this
        46: (content) => {
            if (Array.isArray(content[0])) {
                return content
                    .map(this.parseInstructionContent)
                    .filter((i) => i)
                    .join("\n");
            }

            return "";
        },

        // Define Function declaration
        50: (content) => {
            const [name, argsInstruction, ...bodyInstructions] = content;

            this.operations[name as string] = (content) => {
                return this.operations.func([name, ...content]);
            };

            const args = (argsInstruction as RuntimeInstruction).slice(1).join(", ");
            const body = (bodyInstructions as RuntimeInstruction[])
                .map(this.parseInstruction)
                .filter((i) => i)
                .join("\n");

            return `function ${name}(${args}) {\n${body}\n}\n`;
        },

        // Define Function expression
        // TODO: Maybe use function() {} instead of () => {}
        51: (content) => {
            const [functionName, argsInstruction, ...bodyInstructions] = content;

            const args = (argsInstruction as RuntimeInstruction).slice(1).join(", ");
            const body = (bodyInstructions as RuntimeInstruction[])
                .map(this.parseInstruction)
                .filter((i) => i)
                .join("\n");

            return `function ${functionName}(${args}) {\n${body}\n}\n`;
            // return `\n(${args}) => {\n${body}\n}\n`;
        },

        // Set `const` variable
        52: (content) => {
            const constStatements = [];

            for (let i = 0; i < content.length - 1; i += 2) {
                const name = content[i] as string;
                let newName = name;
                let value = content[i + 1];

                value = this.parseInstructionContent(value);
                const requireMatch = value.match(/require\("(.+)"\)/);
                if (requireMatch) {
                    newName = requireMatch[1];
                }

                this.variables[name] = newName;

                this.operations[name] = (content) => {
                    return this.operations.func([name, ...content]);
                };

                constStatements.push(`const ${newName} = ${value}`);
            }

            return constStatements.join("\n");
        },

        // Probably something with scope, similar to 46
        53: (content) => {
            if (Array.isArray(content[0])) {
                return content
                    .map(this.parseInstructionContent)
                    .filter((i) => i)
                    .join("");
            }

            return "";
        },

        // For..of loop
        55: (content) => {
            const [variable, iterable, bodyInstruction] = content;

            const iterableString = this.parseInstructionContent(iterable);
            const bodyInstructionString = this.parseInstructionContent(bodyInstruction);

            this.variables[variable as string] = `${variable}`;

            return `for (let ${variable} of ${iterableString}) {\n${bodyInstructionString}\n}\n`;
        },

        // Bitwise AND (&)
        56: (content) => {
            const [left, right] = content;
            return `${this.parseInstructionContent(left)} & ${this.parseInstructionContent(right)}`;
        },

        // Bitwise left shift (<<)
        57: (content) => {
            const [left, right] = content;
            return `${this.parseInstructionContent(left)} << ${this.parseInstructionContent(right)}`;
        },

        // Bitwise NOT (~)
        58: (content) => {
            const [value] = content;
            return `~${this.parseInstructionContent(value)}`;
        },

        // Bitwise OR (|)
        59: (content) => {
            const [left, right] = content;
            return `${this.parseInstructionContent(left)} | ${this.parseInstructionContent(right)}`;
        },

        // Bitwise right shift (>>)
        60: (content) => {
            const [left, right] = content;
            return `${this.parseInstructionContent(left)} >> ${this.parseInstructionContent(right)}`;
        },

        // Bitwise unsigned right shift (>>>)
        61: (content) => {
            const [left, right] = content;
            return `${this.parseInstructionContent(left)} >>> ${this.parseInstructionContent(right)}`;
        },

        // Bitwise XOR (^)
        62: (content) => {
            const [left, right] = content;
            return `${this.parseInstructionContent(left)} ^ ${this.parseInstructionContent(right)}`;
        },

        // For loop
        63: (content) => {
            const [_vars, stopInstruction, stepInstruction, bodyInstruction] = content;

            const stopInstructionString = this.parseInstructionContent(stopInstruction);
            const stepInstructionString = this.parseInstructionContent(stepInstruction);
            const bodyInstructionString = this.parseInstructionContent(bodyInstruction);

            return `for (; ${stopInstructionString}; ${stepInstructionString}) {\n${bodyInstructionString}\n}\n`;
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

    parseInstruction = (instruction: RuntimeInstruction, index?: number) => {
        const [opcode, ...content] = instruction;

        if (!this.operations[opcode]) {
            if (typeof opcode === "number") {
                return `\nUNKNOWN OP_CODE ${JSON.stringify(instruction)}`;
            }

            return `${this.REPLACER}${JSON.stringify(instruction)}${this.REPLACER}\n`;
        }

        return this.operations[opcode](content, index);
    };

    parseInstructionContent = (content: RuntimeInstructionContent, index?: number): string => {
        if (typeof content === "undefined") {
            return "";
        }

        if (typeof content === "string") {
            return `"${content}"`;
        }

        if (typeof content === "boolean" || typeof content === "number") {
            return `${content}`;
        }

        return this.parseInstruction(content, index);
    };

    parseReplacers = (code: string) => {
        const replacerRegex = new RegExp(`${this.REPLACER}(.*?)${this.REPLACER}`, "g");

        return code.replace(replacerRegex, (_match, p1) => {
            const instruction = JSON.parse(p1);
            return this.parseInstruction(instruction);
        });
    };
}

export const parseRuntimes = (runtimes: Runtime[]) => {
    const customRuntimes = runtimes.filter(([, name]) => name.startsWith("__cvt_"));

    const parsedRuntimes: ParsedRuntimes = {};

    customRuntimes.map(([, name, ...instructions]) => {
        const runtimeFactory = new RuntimeFactory();
        const parsedInstructions = instructions.map(runtimeFactory.parseInstruction);
        const replacedInstructions = parsedInstructions.map(runtimeFactory.parseReplacers);

        const id = parseTemplateId(name);
        if (!id) {
            return;
        }

        parsedRuntimes[id] = {
            code: js(replacedInstructions.join("\n").trim(), beautifyOptions),
        };
    });

    return parsedRuntimes;
};
