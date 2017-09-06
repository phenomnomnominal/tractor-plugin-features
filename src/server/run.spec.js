/* global describe:true, it:true */

// Test setup:
import { expect, ineeda, NOOP } from '../../test-setup';

// Under test:
import run from './run';

describe('tractor-plugin-features - run:', () => {
    it('should read the file structure', () => {
        let featuresFileStructure = ineeda({
            read: NOOP
        });

        run(featuresFileStructure);

        expect(featuresFileStructure.read).to.have.been.called();
    });
});
