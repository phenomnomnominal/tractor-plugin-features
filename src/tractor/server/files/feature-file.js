// Constants:
const REQUEST_ERROR = 400;

// Dependencies:
import { TractorError } from '@tractor/error-handler';
import { File } from '@tractor/file-structure';
import escapeRegExp from 'lodash.escaperegexp';
import path from 'path';
import { generate } from '../generator/generate-step-definition-files';
import { lex } from '../lexer/lex-feature-file';

export class FeatureFile extends File {
    read () {
        // Hack to fix coverage bug: https://github.com/gotwarlost/istanbul/issues/690
        /* istanbul ignore next */
        let read = super.read();

        return read.then(content => setTokens(this, content))
        .then(() => getReferences.call(this))
        .catch(() => {
            throw new TractorError(`Lexing "${this.path}" failed.`, REQUEST_ERROR);
        });
    }

    move (update, options) {
        // Hack to fix coverage bug: https://github.com/gotwarlost/istanbul/issues/690
        /* istanbul ignore next */
        let move = super.move(update, options);

        return move.then(newFile => {
            let { oldPath, newPath } = update;
            if (oldPath && newPath) {
                let oldName = path.basename(oldPath, this.extension);
                let newName = path.basename(newPath, this.extension);

                return refactorName(newFile, oldName, newName);
            }
        });
    }

    save (data) {
        // Hack to fix coverage bug: https://github.com/gotwarlost/istanbul/issues/690
        /* istanbul ignore next */
        let save = super.save(data);

        return save.then(content => {
            setTokens(this, content);
            return generate(this);
        })
        .then(() => this.content)
        .catch(() => {
            throw new TractorError(`Saving "${this.path}" failed.`, REQUEST_ERROR);
        });
    }

    serialise () {
        // Hack to fix coverage bug: https://github.com/gotwarlost/istanbul/issues/690
        /* istanbul ignore next */
        let serialised = super.serialise();

        serialised.tokens = this.tokens;
        return serialised;
    }
}

function getReferences () {
    if (this.initialised) {
        this.clearReferences();
    }

    // TODO: Convert each step in feature to .step.js name and
    // create the reference link:
    // let reference = this.fileStructure.referenceManager.getReference(referencePath);
    // if (reference) {
    //     this.addReference(reference);
    // }

    this.initialised = true;
}

function refactorName (newFile, oldName, newName) {
    let escapedOldName = escapeRegExp(oldName);
    let oldNameRegExp = new RegExp(`(Feature:\\s)${escapedOldName}(\\r\\n|\\n)`);

    return newFile.save(newFile.content.replace(oldNameRegExp, `$1${newName}$2`));
}

function setTokens (file, content) {
    file.tokens = lex(content);
    return content;
}

FeatureFile.prototype.extension = '.feature';
