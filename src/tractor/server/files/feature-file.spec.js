/* global describe:true, it:true */

// Test setup:
import { expect, Promise, sinon } from '@tractor/unit-test';

// Constants:
const REQUEST_ERROR = 400;

// Dependencies:
import { TractorError } from '@tractor/error-handler';
import { File, FileStructure } from '@tractor/file-structure';
import path from 'path';
import * as lexFeatureFile from '../lexer/lex-feature-file';

// Under test:
import { FeatureFile } from './feature-file';

describe('tractor-plugin-features - feature-file:', () => {
    describe('FeatureFile constructor:', () => {
        it('should create a new FeatureFile', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file');

            let file = new FeatureFile(filePath, fileStructure);

            expect(file).to.be.an.instanceof(FeatureFile);
        });

        it('should inherit from File', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file');

            let file = new FeatureFile(filePath, fileStructure);

            expect(file).to.be.an.instanceof(File);
        });
    });

    describe('FeatureFile.read:', () => {
        it('should read the file from disk', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file');

            sinon.stub(File.prototype, 'read').returns(Promise.resolve());
            sinon.stub(lexFeatureFile, 'lex');

            let file = new FeatureFile(filePath, fileStructure);

            return file.read()
            .then(() => {
                expect(File.prototype.read).to.have.been.called();
            })
            .finally(() => {
                File.prototype.read.restore();
                lexFeatureFile.lex.restore();
            });
        });

        it('should lex the contents', () => {
            let features = ['feature1', 'feature2'];
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file');

            sinon.stub(lexFeatureFile, 'lex').returns(features);
            sinon.stub(File.prototype, 'read').returns(Promise.resolve());

            let file = new FeatureFile(filePath, fileStructure);

            return file.read()
            .then(() => {
                expect(file.tokens).to.deep.equal(['feature1', 'feature2']);
                expect(lexFeatureFile.lex).to.have.been.called();
            })
            .finally(() => {
                lexFeatureFile.lex.restore();
                File.prototype.read.restore();
            });
        });

        it('should turn log any errors and create a TractorError', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file.feature');

            sinon.stub(File.prototype, 'read').returns(Promise.reject());

            let file = new FeatureFile(filePath, fileStructure);

            return file.read()
            .catch((tractorError) => {
                expect(tractorError).to.be.an.instanceof(TractorError);
                expect(tractorError.message).to.equal(`Lexing "${path.join(path.sep, 'file-structure', 'directory', 'file.feature')}" failed.`);
                expect(tractorError.status).to.equal(REQUEST_ERROR);
            })
            .finally(() => {
                File.prototype.read.restore();
            });
        });
    });

    describe('FeatureFile.move:', () => {
        it('should move the file', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file.feature');
            let file = new FeatureFile(filePath, fileStructure);
            let newFilePath = path.join(path.sep, 'file-structure', 'directory', 'new file.feature');
            let newFile = new FeatureFile(newFilePath, fileStructure);

            sinon.stub(File.prototype, 'move').returns(Promise.resolve(newFile));
            sinon.stub(FeatureFile.prototype, 'save').returns(Promise.resolve());

            let update = {};
            let options = {};

            return file.move(update, options)
            .then(() => {
                expect(File.prototype.move).to.have.been.calledWith(update, options);
            })
            .finally(() => {
                File.prototype.move.restore();
                FeatureFile.prototype.save.restore();
            });
        });

        it('should update the name of the feature', () => {
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file.feature');
            let file = new FeatureFile(filePath, fileStructure);
            let newFilePath = path.join(path.sep, 'file-structure', 'directory', 'new file.feature');
            let newFile = new FeatureFile(newFilePath, fileStructure);
            newFile.content = 'Feature: file\n';

            sinon.stub(File.prototype, 'move').returns(Promise.resolve(newFile));
            sinon.stub(FeatureFile.prototype, 'save').returns(Promise.resolve());

            let update = {
                oldPath: filePath,
                newPath: newFilePath
            };
            let options = {};

            return file.move(update, options)
            .then(() => {
                expect(FeatureFile.prototype.save).to.have.been.calledWith('Feature: new file\n');
            })
            .finally(() => {
                File.prototype.move.restore();
                FeatureFile.prototype.save.restore();
            });
        });
    });

    describe('FeatureFile.save:', () => {
        it('should save the file to disk', () => {
            let content = '';
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file.feature');

            let file = new FeatureFile(filePath, fileStructure);

            // Hack:
            // Using file.constructor.prototype to access the correct reference
            // to File.prototype...
            sinon.stub(file.constructor.prototype, 'save').returns(Promise.resolve());
            sinon.stub(lexFeatureFile, 'lex');

            return file.save(content)
            .then(() => {
                expect(file.constructor.prototype.save).to.have.been.called();
            })
            .finally(() => {
                file.constructor.prototype.save.restore();
                lexFeatureFile.lex.restore();
            });
        });

        it('should turn log any errors and create a TractorError', () => {
            let content = '';
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file.feature');
            let file = new FeatureFile(filePath, fileStructure);

            sinon.stub(File.prototype, 'save').returns(Promise.reject());

            return file.save(content)
            .catch(error => {
                expect(error).to.be.an.instanceof(TractorError);
                expect(error.message).to.equal(`Saving "${path.join(path.sep, 'file-structure', 'directory', 'file.feature')}" failed.`);
                expect(error.status).to.equal(REQUEST_ERROR);
            })
            .finally(() => {
                File.prototype.save.restore();
            });
        });
    });

    describe('FeatureFile.serialise:', () => {
        it(`should include the file's tokens`, () => {
            let tokens = { };
            let fileStructure = new FileStructure(path.join(path.sep, 'file-structure'));
            let filePath = path.join(path.sep, 'file-structure', 'directory', 'file.feature');

            sinon.stub(File.prototype, 'serialise').returns({});

            let file = new FeatureFile(filePath, fileStructure);
            file.tokens = tokens;

            file.serialise();

            expect(file.tokens).to.equal(tokens);

            File.prototype.serialise.restore();
        });
    });
});
