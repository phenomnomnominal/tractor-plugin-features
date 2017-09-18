/* global describe:true, it:true */

// Test setup:
import { dedent, expect, Promise, sinon } from '../../../../test-setup';

// Dependencies:
import path from 'path';
import childProcess from 'child_process';
import { FileStructure } from 'tractor-file-structure';
import { StepDefinitionFile } from 'tractor-plugin-step-definitions';
import { FeatureFile } from '../files/feature-file';

// Under test:
import { generate, setStepDefinitionsFileStructure } from './generate-step-definition-files';

describe('tractor-plugin-features - generate-step-definition-files:', () => {
    describe('generate:', () => {
        it('should generate files for each step in a feature', () => {
            let stepDefinitionsFileStructure = new FileStructure(path.join(path.sep, 'step-definitions'));

            let featureFileStructure = new FileStructure(path.join(path.sep, 'features'));
            let file = new FeatureFile(path.join(path.sep, 'features', 'feature.feature'), featureFileStructure);

            file.content = dedent(`
                Feature: Test
                In order to test
                As a test
                I want to test
                Scenario: Test
                  Given something
                  And something else
                  When something happens
                  Then something else happens
                  But something else does not happen
            `);
            let result = `
                this.Given(/^something$/, function (callback) {
                    // Write code here that turns the phrase above into concrete actions
                    callback(null, 'pending');
                });

                this.Given(/^something else$/, function (callback) {
                    // Write code here that turns the phrase above into concrete actions
                    callback(null, 'pending');
                });

                this.When(/^something happens$/, function (callback) {
                    // Write code here that turns the phrase above into concrete actions
                    callback(null, 'pending');
                });

                this.Then(/^something else happens$/, function (callback) {
                    // Write code here that turns the phrase above into concrete actions'
                    callback(null, 'pending');
                });

                this.Then(/^something else does not happen$/, function (callback) {
                    // Write code here that turns the phrase above into concrete actions
                    callback(null, 'pending');
                });
            `;

            sinon.stub(childProcess, 'execAsync').returns(Promise.resolve(result));
            sinon.stub(StepDefinitionFile.prototype, 'save').returns(Promise.resolve());

            setStepDefinitionsFileStructure(stepDefinitionsFileStructure);

            return generate(file)
            .then(() => {
                let paths = Object.keys(stepDefinitionsFileStructure.allFilesByPath)
                expect(paths).to.deep.equal([
                    '/step-definitions/Given something.step.js',
                    '/step-definitions/Given something else.step.js',
                    '/step-definitions/When something happens.step.js',
                    '/step-definitions/Then something else happens.step.js',
                    '/step-definitions/Then something else does not happen.step.js'
                ]);
            })
            .finally(() => {
                childProcess.execAsync.restore();
                StepDefinitionFile.prototype.save.restore();

                setStepDefinitionsFileStructure(null);
            });
        });

        it('should escape underscore', () => {
            let stepDefinitionsFileStructure = new FileStructure(path.join(path.sep, 'step-definitions'));

            let featureFileStructure = new FileStructure(path.join(path.sep, 'features'));
            let file = new FeatureFile(path.join(path.sep, 'features', 'feature.feature'), featureFileStructure);

            file.content = dedent(`
                Feature: Test
                In order to test
                As a test
                I want to test
                Scenario: Test
                  Given _
            `);
            let result = `
                this.Given(/^_$/, function (callback) {
                    // Write code here that turns the phrase above into concrete actions
                    callback(null, 'pending');
                });
            `;

            sinon.stub(childProcess, 'execAsync').returns(Promise.resolve(result));
            sinon.stub(StepDefinitionFile.prototype, 'save').returns(Promise.resolve());
            sinon.spy(stepDefinitionsFileStructure, 'addItem');

            setStepDefinitionsFileStructure(stepDefinitionsFileStructure);

            return generate(file)
            .then(() => {
                let addFileCall = stepDefinitionsFileStructure.addItem.getCall(0);
                let [file] = addFileCall.args;
                let saveCall = StepDefinitionFile.prototype.save.getCall(0);
                let [ast] = saveCall.args;
                let [comment] = ast.comments;
                let meta = comment.value;

                expect(file.basename).to.equal('Given __');
                expect(JSON.parse(meta).name).to.equal('Given _');
            })
            .finally(() => {
                childProcess.execAsync.restore();
                StepDefinitionFile.prototype.save.restore();

                setStepDefinitionsFileStructure(null);
            });
        });

        it('should escape slashes', () => {
            let stepDefinitionsFileStructure = new FileStructure(path.join(path.sep, 'step-definitions'));

            let featureFileStructure = new FileStructure(path.join(path.sep, 'features'));
            let file = new FeatureFile(path.join(path.sep, 'features', 'feature.feature'), featureFileStructure);

            file.content = dedent(`
                Feature: Test
                In order to test'
                As a test
                I want to test
                Scenario: Test
                  Given /\\\\
            `);
            let result = `
                this.Given(/^\\/\\\\$/, function (callback) {
                    // Write code here that turns the phrase above into concrete actions
                    callback(null, 'pending');
                });
            `;

            sinon.stub(childProcess, 'execAsync').returns(Promise.resolve(result));
            sinon.stub(StepDefinitionFile.prototype, 'save').returns(Promise.resolve());
            sinon.spy(stepDefinitionsFileStructure, 'addItem');

            setStepDefinitionsFileStructure(stepDefinitionsFileStructure);

            return generate(file)
            .then(() => {
                let addFileCall = stepDefinitionsFileStructure.addItem.getCall(0);
                let [file] = addFileCall.args;
                let saveCall = StepDefinitionFile.prototype.save.getCall(0);
                let [ast] = saveCall.args;
                let [comment] = ast.comments;
                let meta = comment.value;

                expect(file.basename).to.equal('Given __');
                expect(JSON.parse(meta).name).to.equal('Given /\\');
            })
            .finally(() => {
                childProcess.execAsync.restore();
                StepDefinitionFile.prototype.save.restore();

                setStepDefinitionsFileStructure(null);
            });
        });

        it('should escape brackets', () => {
            let stepDefinitionsFileStructure = new FileStructure(path.join(path.sep, 'step-definitions'));

            let featureFileStructure = new FileStructure(path.join(path.sep, 'features'));
            let file = new FeatureFile(path.join(path.sep, 'features', 'feature.feature'), featureFileStructure);

            file.content = dedent(`
                Feature: Test
                In order to test
                As a test
                I want to test
                Scenario: Test
                  Given <>
            `);
            let result = `
                this.Given(/^<>$/, function (callback) {
                    // Write code here that turns the phrase above into concrete actions
                    callback(null, 'pending');
                });
            `;

            sinon.stub(childProcess, 'execAsync').returns(Promise.resolve(result));
            sinon.stub(StepDefinitionFile.prototype, 'save').returns(Promise.resolve());
            sinon.spy(stepDefinitionsFileStructure, 'addItem');

            setStepDefinitionsFileStructure(stepDefinitionsFileStructure);

            return generate(file)
            .then(() => {
                let addFileCall = stepDefinitionsFileStructure.addItem.getCall(0);
                let [file] = addFileCall.args;
                let saveCall = StepDefinitionFile.prototype.save.getCall(0);
                let [ast] = saveCall.args;
                let [comment] = ast.comments;
                let meta = comment.value;

                expect(file.basename).to.equal('Given __');
                expect(JSON.parse(meta).name).to.equal('Given <>');
            })
            .finally(() => {
                childProcess.execAsync.restore();
                StepDefinitionFile.prototype.save.restore();

                setStepDefinitionsFileStructure(null);
            });
        });

        it('should escape special characters', () => {
            let stepDefinitionsFileStructure = new FileStructure(path.join(path.sep, 'step-definitions'));

            let featureFileStructure = new FileStructure(path.join(path.sep, 'features'));
            let file = new FeatureFile(path.join(path.sep, 'features', 'feature.feature'), featureFileStructure);

            file.content = dedent(`
                Feature: Test
                In order to test
                As a test
                I want to test
                Scenario: Test
                  Given ?:*"|
            `);
            let result = `
                this.Given(/^\\?\\:\\*\\"\\|$/, function (callback) {
                    // Write code here that turns the phrase above into concrete actions
                    callback(null, 'pending');
                });
            `;

            sinon.stub(childProcess, 'execAsync').returns(Promise.resolve(result));
            sinon.stub(StepDefinitionFile.prototype, 'save').returns(Promise.resolve());
            sinon.spy(stepDefinitionsFileStructure, 'addItem');

            setStepDefinitionsFileStructure(stepDefinitionsFileStructure);

            return generate(file)
                .then(() => {
                    let addFileCall = stepDefinitionsFileStructure.addItem.getCall(0);
                    let [file] = addFileCall.args;
                    let saveCall = StepDefinitionFile.prototype.save.getCall(0);
                    let [ast] = saveCall.args;
                    let [comment] = ast.comments;
                    let meta = comment.value;

                    expect(file.basename).to.equal('Given _____');
                    expect(JSON.parse(meta).name).to.equal('Given ?:*"|');
                })
                .finally(() => {
                    childProcess.execAsync.restore();
                    StepDefinitionFile.prototype.save.restore();

                    setStepDefinitionsFileStructure(null);
                });
        });

        it('should escape money amounts:', () => {
            let stepDefinitionsFileStructure = new FileStructure(path.join(path.sep, 'step-definitions'));

            let featureFileStructure = new FileStructure(path.join(path.sep, 'features'));
            let file = new FeatureFile(path.join(path.sep, 'features', 'feature.feature'), featureFileStructure);

            file.content = dedent(`
                Feature: Test
                In order to test
                As a test
                I want to test
                Scenario: Test
                  When $100
            `);
            let result = `
                this.When(/^\\$\\d+$/, function (callback) {
                    // Write code here that turns the phrase above into concrete actions
                    callback(null, 'pending');
                });
            `;

            sinon.stub(childProcess, 'execAsync').returns(Promise.resolve(result));
            sinon.stub(StepDefinitionFile.prototype, 'save').returns(Promise.resolve());
            sinon.spy(stepDefinitionsFileStructure, 'addItem');

            setStepDefinitionsFileStructure(stepDefinitionsFileStructure);

            return generate(file)
            .finally(() => {
                let addFileCall = stepDefinitionsFileStructure.addItem.getCall(0);
                let [file] = addFileCall.args;
                let saveCall = StepDefinitionFile.prototype.save.getCall(0);
                let [ast] = saveCall.args;
                let [comment] = ast.comments;
                let meta = comment.value;

                expect(file.basename).to.equal('When $amount');
                expect(JSON.parse(meta).name).to.equal('When $amount');
            })
            .finally(() => {
                childProcess.execAsync.restore();
                StepDefinitionFile.prototype.save.restore();

                setStepDefinitionsFileStructure(null);
            });
        });

        it('should escape number amounts:', () => {
            let stepDefinitionsFileStructure = new FileStructure(path.join(path.sep, 'step-definitions'));

            let featureFileStructure = new FileStructure(path.join(path.sep, 'features'));
            let file = new FeatureFile(path.join(path.sep, 'features', 'feature.feature'), featureFileStructure);

            file.content = dedent(`
                Feature: Test
                In order to test
                As a test
                I want to test
                Scenario: Test
                  When 100
            `);
            let result = `
                this.When(/^\\d+$/, function (callback) {
                    // Write code here that turns the phrase above into concrete actions
                    callback(null, 'pending');
                });
            `;

            sinon.stub(childProcess, 'execAsync').returns(Promise.resolve(result));
            sinon.stub(StepDefinitionFile.prototype, 'save').returns(Promise.resolve());
            sinon.spy(stepDefinitionsFileStructure, 'addItem');

            setStepDefinitionsFileStructure(stepDefinitionsFileStructure);

            return generate(file)
            .then(() => {
                let addFileCall = stepDefinitionsFileStructure.addItem.getCall(0);
                let [file] = addFileCall.args;
                let saveCall = StepDefinitionFile.prototype.save.getCall(0);
                let [ast] = saveCall.args;
                let [comment] = ast.comments;
                let meta = comment.value;

                expect(file.basename).to.equal('When $number');
                expect(JSON.parse(meta).name).to.equal('When $number');
            })
            .finally(() => {
                childProcess.execAsync.restore();
                StepDefinitionFile.prototype.save.restore();

                setStepDefinitionsFileStructure(null);
            });
        });

        it('should remove variable names:', () => {
            let stepDefinitionsFileStructure = new FileStructure(path.join(path.sep, 'step-definitions'));

            let featureFileStructure = new FileStructure(path.join(path.sep, 'features'));
            let file = new FeatureFile(path.join(path.sep, 'features', 'feature.feature'), featureFileStructure);

            file.content = dedent(`
                Feature: Test
                In order to test
                As a test
                I want to test
                Scenario: Test
                  When foo="bar" and baz="bop"
            `);
            let result = `
                this.When(/^foo="([^"]*)" and baz="([^"]*)"$/, function (callback) {
                    // Write code here that turns the phrase above into concrete actions
                    callback(null, 'pending');
                });
            `;

            sinon.stub(childProcess, 'execAsync').returns(Promise.resolve(result));
            sinon.stub(StepDefinitionFile.prototype, 'save').returns(Promise.resolve());
            sinon.spy(stepDefinitionsFileStructure, 'addItem');

            setStepDefinitionsFileStructure(stepDefinitionsFileStructure);

            return generate(file)
            .then(() => {
                let addFileCall = stepDefinitionsFileStructure.addItem.getCall(0);
                let [file] = addFileCall.args;
                let saveCall = StepDefinitionFile.prototype.save.getCall(0);
                let [ast] = saveCall.args;
                let [comment] = ast.comments;
                let meta = comment.value;

                expect(file.basename).to.equal('When foo=_foo_ and baz=_baz_');
                expect(JSON.parse(meta).name).to.equal('When foo="foo" and baz="baz"');
            })
            .finally(() => {
                childProcess.execAsync.restore();
                StepDefinitionFile.prototype.save.restore();

                setStepDefinitionsFileStructure(null);
            });
        });

        it('should not overwrite existing files:', () => {
            let stepDefinitionsFileStructure = new FileStructure(path.join(path.sep, 'step-definitions'));
            let existingFile = new StepDefinitionFile(path.join(path.sep, 'step-definitions', 'Given something.step.js'), stepDefinitionsFileStructure);

            let featureFileStructure = new FileStructure(path.join(path.sep, 'features'));
            let file = new FeatureFile(path.join(path.sep, 'features', 'feature.feature'), featureFileStructure);

            file.content = dedent(`
                Feature: Test
                In order to test
                As a test
                I want to test
                Scenario: Test
                  Given something
            `);
            let result = `
                this.Given(/^something$/, function (callback) {
                    // Write code here that turns the phrase above into concrete actions
                    callback(null, 'pending');
                });
            `;

            stepDefinitionsFileStructure.structure.allFiles = [existingFile];
            sinon.stub(childProcess, 'execAsync').returns(Promise.resolve(result));
            sinon.stub(StepDefinitionFile.prototype, 'save').returns(Promise.resolve());

            setStepDefinitionsFileStructure(stepDefinitionsFileStructure);

            return generate(file)
            .then(() => {
                expect(StepDefinitionFile.prototype.save).to.not.have.been.called();
            })
            .finally(() => {
                childProcess.execAsync.restore();
                StepDefinitionFile.prototype.save.restore();
            });
        });
    });
});
