import axios from 'axios';

const token = process.env.BOBRIKI_GITHUB_TOKEN!;
const owner = process.env.BOBRIKI_REPO_OWNER!;
const repo = process.env.BOBRIKI_REPO_NAME!;

async function triggerWorkflow() {
  try {
    const url = `https://api.github.com/repos/${owner}/${repo}/actions/workflows/update-json.yml/dispatches`;

    await axios.post(
      url,
      { ref: 'main' }, // Specify the branch where the workflow should run
      {
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    console.log('Workflow triggered successfully!');
  } catch (error) {
    console.error('Error triggering workflow:', error);
  }
}

export default triggerWorkflow;
