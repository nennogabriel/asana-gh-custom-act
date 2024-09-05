import { run } from '../main';
import * as core from '@actions/core';
import * as github from '@actions/github';

jest.mock('@actions/core');
jest.mock('@actions/github');

describe('run', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should fail if no description is found', async () => {
        github.context.payload = { pull_request: { number: 123 } };

        await run();

        expect(core.setFailed).toHaveBeenCalledWith('No description found for this pull request.');
    });

    it('should not fail if description is found', async () => {
        github.context.payload = { pull_request: { number: 123, body: 'This is a description' } };

        await run();

        expect(core.setFailed).not.toHaveBeenCalled();
    });

});