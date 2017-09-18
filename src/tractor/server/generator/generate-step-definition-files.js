// Constants:
const CUCUMBER_COMMAND = `node ${path.join('node_modules', 'cucumber', 'bin', 'cucumber')}`;
const GIVEN_WHEN_THEN_REGEX = /^(Given|When|Then)/;
const AND_BUT_REGEX = /^(And|But)/;
const STUB_REGEX_REGEX = /this\.[Given|When|Then]*\(\/\^(.*?)\$\//;
const NEW_LINE_REGEX = /\r\n|\n/;
const NEW_LINES_REGEX = /(\r\n|\n){2}/;
const STEP_DEFINITION_REGEX = /^\s*this\.(Given|Then|When)[\s\S]*\}\);$/m;
const ARGUMENTS_REGEX = /[a-zA-Z]*="[^"]*"*/g;
const ARGUMENT_NAME_REGEX = /([a-zA-Z]*)="([^"]*)"/

// Dependencies:
import Promise from 'bluebird';
import childProcess from 'child_process';
import * as esprima from 'esprima';
import estemplate from 'estemplate';
import path from 'path';
import stripcolorcodes from 'stripcolorcodes';
import { StepDefinitionFile } from 'tractor-plugin-step-definitions';

let stepDefinitionsFileStructure;
export function setStepDefinitionsFileStructure (_stepDefinitionsFileStructure) {
    stepDefinitionsFileStructure = _stepDefinitionsFileStructure;
}

export function generate (file) {
    let { content, path } = file;
    let stepNames = extractStepNames(content);

    return childProcess.execAsync(`${CUCUMBER_COMMAND} "${path}" --format snippets`)
    .then(result => generateStepDefinitionFiles(stepNames, result));
}

function extractStepNames (feature) {
    return stripcolorcodes(feature)
    // Split on new-lines:
    .split(NEW_LINE_REGEX)
    // Remove whitespace:
    .map(line => line.trim())
    // Get out each step name:
    .filter(line => GIVEN_WHEN_THEN_REGEX.test(line) || AND_BUT_REGEX.test(line))
    .map((stepName, index, stepNames) => {
        if (AND_BUT_REGEX.test(stepName)) {
            let previousType = stepNames.slice(0, index + 1)
            .reduceRight((p, n) => {
                let type = n.match(GIVEN_WHEN_THEN_REGEX);
                return p || type && type[type.length - 1];
            }, null);
            return stepName.replace(AND_BUT_REGEX, previousType);
        } else {
            return stepName;
        }
    });
}

function generateStepDefinitionFiles (stepNames, result) {
    let stepDefinitionExtension = StepDefinitionFile.prototype.extension;

    let existingFileNames = stepDefinitionsFileStructure.structure.allFiles
    .filter(file => file.path.endsWith(stepDefinitionExtension))
    .map(file => file.basename);

    let stubs = splitResultToStubs(result);

    return Promise.map(stubs, stub => {
        let match = stub.match(STUB_REGEX_REGEX)
        let stubRegex = new RegExp(match[match.length - 1]);
        let stepName = stepNames.find(stepName => stubRegex.test(stepName));
        let fileData = generateStepDefinitionFile(existingFileNames, stub, stepName);
        if (fileData) {
            let { ast, fileName } = fileData;
            let filePath = path.join(stepDefinitionsFileStructure.structure.path, `${fileName}${stepDefinitionExtension}`);
            let file = new StepDefinitionFile(filePath, stepDefinitionsFileStructure);
            return file.save(ast);
        }
    });
}

function splitResultToStubs (result) {
    let pieces = stripcolorcodes(result)
    // Split on new-lines:
    .split(NEW_LINES_REGEX);

    // Filter out everything that isn't a step definition:
    return pieces.filter(piece => !!STEP_DEFINITION_REGEX.exec(piece));
}

function generateStepDefinitionFile (existingFileNames, stub, name) {
    // Remove variables from step definition name:
    let args = name.match(ARGUMENTS_REGEX) || [];
    args.forEach(arg => {
        let [, argName, argValue] = arg.match(ARGUMENT_NAME_REGEX);
        name = name.replace(argValue, argName);
    });

    name = name
    // Replace money:
    .replace(/\$\d+/g, '$amount')
    // Replace numbers:
    .replace(/\d+/g, '$number');

    let fileName = name
    // Escape existing _s:
    .replace(/_/g, '__')
    // Replace / and \:
    .replace(/[/\\]/g, '_')
    // Replace <s and >s:
    .replace(/</g, '_')
    .replace(/>/g, '_')
    // Replace ?, :, *, ". |:
    .replace(/[?:*"|"]/g, '_');

    if (!existingFileNames.includes(fileName)) {
        let template = 'module.exports = function () {%= body %};';
        let body = esprima.parse(stub).body;
        let ast = estemplate(template, { body });
        let meta = { name };
        ast.comments = [{
            type: 'Block',
            value: JSON.stringify(meta)
        }];
        return { ast, fileName };
    }
}
