import * as typescript from "typescript";
import Ast, * as SimpleAst from "ts-simple-ast";
import * as path from "path";
import chalk from "chalk";

function diagnosticToString(diagnosticMessageChain: SimpleAst.DiagnosticMessageChain, result = "") {
    result += diagnosticMessageChain.getMessageText();
    const next = diagnosticMessageChain.getNext();
    if (next) {
        result += diagnosticToString(next);
    }
    return result;
}

export function getFileDiagnostics(filePath: string, opt?: SimpleAst.CompilerOptions) {

    const tsconfigPath = path.join(__dirname, "..", "tsconfig.json");

    const baseOptions = {
        tsConfigFilePath: tsconfigPath,
        addFilesFromTsConfig: false
    };

    const overrideOptions = opt ? { compilerOptions: opt } : {};
    const finalOptions = { ...baseOptions, ...overrideOptions };
    const ast = new Ast(finalOptions);
    
    ast.addExistingSourceFile(filePath);

    const diagnostics = ast.getDiagnostics();

    return diagnostics.map(diagnostic => {
        const message =  diagnostic.getMessageText();
        if (typeof message === "string") {
            return message;
        } else {
            return diagnosticToString(message);
        }
    });

}

export function shouldNotThrow(filePath: string, opt?: SimpleAst.CompilerOptions) {
    console.log(chalk.blueBright(`Parsing file: ${filePath}`));
    const diagnostics = getFileDiagnostics(filePath, opt);
    diagnostics.forEach((msg) => {
        throw new Error(chalk.redBright(`Expected ${filePath} to not have errors but found:\n- ${msg}`));
    });
    console.log(chalk.greenBright("OK!"));
}

export function shouldThrow(filePath: string, errors: string[], opt?: SimpleAst.CompilerOptions) {
    console.log(chalk.blueBright(`Parsing file: ${filePath}`));
    const diagnostics = getFileDiagnostics(filePath, opt);
    diagnostics.forEach((actual, index) => {
        console.log(chalk.blueBright(`Found: ${actual}`));
        const expected = errors[index];
        if (expected !== actual) {
            throw new Error(chalk.redBright(`Expected ${filePath} to throw:\n- ${expected}\nbut found:\n- ${actual}`));
        } else {
            console.log(chalk.greenBright("OK!"));
        }
    });
}
