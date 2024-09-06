import { run } from '../main';
import * as core from '@actions/core';
import * as github from '@actions/github';
import asana from '../asana';

jest.mock('@actions/core');
jest.mock('@actions/github');
jest.mock('../asana');

describe('run', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should fail if no pull request is found', async () => {
        github.context.payload = {};

        await run();

        expect(core.setFailed).toHaveBeenCalledWith('No pull request found.');
    });

    it('should fail if no description is found', async () => {
        github.context.payload = { pull_request: { number: 123 } };

        await run();

        expect(core.setFailed).toHaveBeenCalledWith('No description found for this pull request.');
    });

    it('should fail if no task id is found in the description', async () => {
        github.context.payload = { pull_request: { number: 123, body: 'No task link here' } };

        await run();

        expect(core.setFailed).toHaveBeenCalledWith('No task id found in the description. Or link is missing.');
    });

    it('should fail if no custom field with name Status or Dev Status is found', async () => {
        github.context.payload = { pull_request: { number: 123, body: 'https://app.asana.com/0/123/456' } };
        asana.getTask = jest.fn().mockResolvedValue({ custom_fields: [] });
    
        await run();
    
        expect(core.setFailed).toHaveBeenCalledWith('There is no Field with name Status or Dev Status.');
    });

    it('should fail if not all options are available in the custom field', async () => {
        github.context.payload = { pull_request: { number: 123, body: 'https://app.asana.com/0/123/456' } };
        (asana.getTask as jest.Mock).mockResolvedValue({
            custom_fields: [{
                name: 'Dev Status',
                gid: '123',
                enum_options: [{ name: 'CODE REVIEW', gid: '456' }]
            }]
        });

        await run();

        expect(core.setFailed).toHaveBeenCalledWith('Not all options are available in the field. One or more options is missing: CODE REVIEW,READY FOR QA');
    });

});