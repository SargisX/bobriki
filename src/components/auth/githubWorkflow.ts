import axios from 'axios';

async function triggerWorkflow() {
  try {
    const url = `https://api.github.com/repos/${process.env.GITHUB_REPOSITORY}/actions/workflows/update-json.yml/dispatches`;

    await axios.post(
      url,
      { ref: 'main' }, // Specify the branch where the workflow should run
      {
      }
    );

    console.log('Workflow triggered successfully!');
  } catch (error) {
    console.error('Error triggering workflow:', error);
  }
}

export default triggerWorkflow;
