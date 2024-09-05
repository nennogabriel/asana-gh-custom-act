import * as core from "@actions/core";
import * as github from "@actions/github";
import axios from "axios";

const ASANA_SECRET = core.getInput("asana-secret");
const ASANA_TASK_LINK_REGEX = /https:\/\/app.asana.com\/(\d+)\/(?<project>\d+)\/(?<taskId>\d+).*/gi;

const STATUS_CODE_REVIEW = "Code Review";
const STATUS_READY_FOR_QA = "Ready for QA";
const STATUS_BACK = "Back";

async function updateAsanaTaskStatus(taskId: string, status: string) {
  try {
    await axios.put(
      `https://app.asana.com/api/1.0/tasks/${taskId}`,
      { data: { custom_fields: { "Dev Status": status } } },
      { headers: { Authorization: `Bearer ${ASANA_SECRET}` } }
    );
    core.info(`Task ${taskId} updated to status: ${status}`);
  } catch (error) {
    core.setFailed(`Failed to update task ${taskId}: ${(error as Error).message}`);
  }
}

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
    core.setFailed("No task id found in the description.");
    return;
  }

  let status;
  const eventName = github.context.eventName;
  const action = prInfo.action;

  if (eventName === "pull_request" && (action === "opened" || action === "reopened")) {
    status = STATUS_CODE_REVIEW;
  } else if (eventName === "pull_request_review" && prInfo.review.state === "approved") {
    status = STATUS_READY_FOR_QA;
  } else if (eventName === "workflow_run" && prInfo.workflow_run.conclusion === "failure") {
    status = STATUS_BACK;
  } else {
    core.info("No relevant action detected, skipping status update.");
    return;
  }

  for (const taskId of taskIds) {
    await updateAsanaTaskStatus(taskId, status);
  }
}
