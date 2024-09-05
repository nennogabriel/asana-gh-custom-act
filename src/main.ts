import * as core from '@actions/core';
import * as github from '@actions/github';
import * as Asana from 'asana';

export async function run() {

    const ASANA_SECRET = core.getInput('asana-secret');

    // Get project and task id from the PR description # thanks Alex
    const ASANA_TASK_LINK_REGEX = /https:\/\/app.asana.com\/(\d+)\/(?<project>\d+)\/(?<taskId>\d+).*/gi

    const prInfo = github.context.payload
    if (!prInfo.pull_request) {
        core.setFailed('No pull request found.');
        return;
    }
    
    const description = prInfo.pull_request.body;
    if (!description) {
        core.setFailed('No description found for this pull request.');
        return;
    }

    // rightfully stolen from @alex who stolen from https://github.com/seniorly/Abott/blob/master/src/lib/git.js
    let taskIds = [], rawParseUrlTask;
    while ((rawParseUrlTask = ASANA_TASK_LINK_REGEX.exec(description)) !== null) {
        if (rawParseUrlTask.groups) {
            taskIds.push(rawParseUrlTask.groups.taskId);
        }
    }
    if (taskIds.length === 0) {
        core.setFailed('No task id found in the description.');
        return;
    }

    const asana = Asana.Client.create({
        defaultHeaders: { 'asana-enable': 'string_ids,new_sections' },
        clientSecret: ASANA_SECRET
    })

    for (let taskId of taskIds) {
        const task = await asana.tasks.findById(taskId);
        console.log(task);
    }

}