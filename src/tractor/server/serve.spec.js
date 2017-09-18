/* global describe:true, it:true */

// Test setup:
import { expect, ineeda, NOOP, sinon } from '../../../test-setup';

// Dependencies:
import { FileStructure } from 'tractor-file-structure';
import { FeatureFile } from './files/feature-file';

// Under test:
import { serve } from './serve';

describe('tractor-plugin-features - serve:', () => {
    it('should create a new FileStructure', () => {
        let featuresFileStructure = null;
        let config = {
            features: {
                directory: './tractor/features'
            }
        };
        let di = ineeda({
            call: () => NOOP,
            constant: constants => {
                featuresFileStructure = constants.featuresFileStructure;
            }
        });

        serve(config, di);

        expect(featuresFileStructure).to.be.an.instanceof(FileStructure);
    });

    it('should add the FileStructure to the DI container', () => {
        let config = {

                features: {
                    directory: './tractor/features'
                }
        };
        let di = ineeda({
            call: () => NOOP,
            constant: NOOP
        });

        serve(config, di);

        expect(di.constant).to.have.been.called();
    });

    it('should add the FeatureFile type to the FileStructure', () => {
        let config = {
            features: {
                directory: './tractor/features'
            }
        };
        let di = ineeda({
            call: () => NOOP,
            constant: NOOP
        });

        sinon.stub(FileStructure.prototype, 'addFileType');

        serve(config, di);

        expect(FileStructure.prototype.addFileType).to.have.been.calledWith(FeatureFile);
    });
});
