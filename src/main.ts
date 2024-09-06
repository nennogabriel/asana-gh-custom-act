import * as core from "@actions/core";
import * as github from "@actions/github";
import asana from "./asana";

const ASANA_TASK_LINK_REGEX = /https:\/\/app.asana.com\/(\d+)\/(?<project>\d+)\/(?<taskId>\d+).*/gi;

const CODE_REVIEW = "CODE REVIEW";
const READY_FOR_QA = "READY FOR QA";

export async function run() {
  const prInfo = github.context.payload;
  if (!prInfo.pull_request) {
    core.setFailed("No pull request found.");
    return;
  }

  const description = prInfo.pull_request.body;
  if (!description) {
    core.setFailed("No description found for this pull request.");
    return;
  }

  const taskIds = [];
  let rawParseUrlTask;
  while ((rawParseUrlTask = ASANA_TASK_LINK_REGEX.exec(description)) !== null) {
    if (rawParseUrlTask.groups) {
      taskIds.push(rawParseUrlTask.groups.taskId);
    }
  }

  if (taskIds.length === 0) {
    core.setFailed("No task id found in the description. Or link is missing.");
    return;
  }

  const task = await asana.getTask(taskIds[0]);

  const filterDevStatusId = task.custom_fields.filter((t) => ["STATUS", "DEV STATUS"].includes(t.name.toUpperCase()));
  if (!filterDevStatusId) {
    core.setFailed("There is no Field with name Status or Dev Status.");
  }

  const devStatusId = filterDevStatusId[0].gid;

  const optionsList = [CODE_REVIEW, READY_FOR_QA];
  const filteredOptions = filterDevStatusId[0].enum_options.filter((o) => optionsList.includes(o.name.toUpperCase()));

  if (optionsList.length !== filteredOptions.length) {
    core.setFailed(`Not all options are available in the field. One or more options is missing: ${optionsList}`);
  }

  const option = filteredOptions.reduce((acc: { [key: string]: string }, curr) => {
    acc[curr.name.toUpperCase()] = curr.gid;
    return acc;
  }, {});

  let status;
  const eventName = github.context.eventName;
  const action = prInfo.action;

  if (eventName === "pull_request" && (action === "opened" || action === "reopened")) {
    status = option.CODE_REVIEW;
  } else if (eventName === "pull_request_review" && prInfo.review.state === "approved") {
    status = option.READY_FOR_QA;
  } else {
    core.info("No relevant action detected, skipping status update.");
    return;
  }

  for (const taskId of taskIds) {
    await asana.updateTask(taskId, {
      custom_fields: {
        [devStatusId]: status,
      },
    });
  }
}
