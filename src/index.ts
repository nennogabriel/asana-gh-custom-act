import * as core from '@actions/core';
import * as github from '@actions/github';

export async function run() {
    try {
        const description = github.context.payload.pull_request?.body;
        if (!description) {
            core.setFailed('No description found for this pull request.');
            return;
        }

    } catch (error) {
        core.setFailed((error as Error).message);
    }   
}

run();
