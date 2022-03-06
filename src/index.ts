import * as core from "@actions/core";
import * as github from "@actions/github";

async function run() {
    try {
        core.debug("Starting PR Title check for Jira Issue Key");
        const title = getPullRequestTitle();
        const projectKeys = getProjectKeys();

        core.debug(title);
        core.debug(projectKeys);
        if (projectKeys.length > 0) {
            for (let i = 0; i < projectKeys.length; i++) {
                let currentKey = projectKeys[i];
                let regex = new RegExp(`(.*?)(${currentKey}-[0-9]+)(.*?)`);
                if (regex.test(title)) {
                    core.info("Key " + currentKey + " found!");
                    core.info("Title Passed");
                    return
                }
            }

            core.setFailed("PullRequest title does not start with a Jira Issue key.");
            return;
        }

        core.info("Title Passed");

    } catch (error) {
        core.setFailed(error.message);
    }
}

export function getProjectKeys() {
    let projectKey = core.getInput("projectKey", { required: false });
    if (projectKey) {
        return projectKey.split(",");
    }
    return [];
}

export function getPullRequestTitle() {
    let pull_request = github.context.payload.pull_request;
    core.debug(`Pull Request: ${JSON.stringify(github.context.payload.pull_request)}`);
    if (pull_request == undefined || pull_request.title == undefined) {
        throw new Error("This action should only be run with Pull Request Events");
    }
    return pull_request.title;
}

run()