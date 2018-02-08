/* global describe:true, xit:true */

// Test setup:
import { expect, Promise, sinon } from '@tractor/unit-test';

// Dependencies:
import { TractorError } from '@tractor/error-handler';
import * as tractorFileStructure from '@tractor/file-structure';
import * as tractorLogger from '@tractor/logger';

// Under test:
import { init } from './init';

describe('tractor-plugin-features - init:', () => {
    xit('should create the features directory', () => {
        sinon.stub(tractorFileStructure, 'createDir').returns(Promise.resolve());

        return init({
            directory: './tractor',
            features: {
                directory: './tractor/features'
            }
        })
        .then(() => {
            expect(tractorFileStructure.createDir).to.have.been.calledWith('/tractor/features');
        })
        .finally(() => {
            tractorFileStructure.createDir.restore();
        });
    });

    xit('should tell the user if the directory already exists', () => {
        sinon.stub(tractorFileStructure, 'createDir').returns(Promise.reject(new TractorError('"/tractor/features" already exists.')));
        sinon.stub(tractorLogger, 'warn');

        return init({
            directory: './tractor',
            features: {
                directory: './tractor/features'
            }
        })
        .then(() => {
            expect(tractorLogger.warn).to.have.been.calledWith('"/tractor/features" already exists. Moving on...');
        })
        .finally(() => {
            tractorFileStructure.createDir.restore();
            tractorLogger.warn.restore();
        });
    });
});
