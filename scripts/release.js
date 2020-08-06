const { Octokit } = require("@octokit/core");
var fs = require("fs");
// const { create } = require("domain");
const octokit = new Octokit({ auth: process.env.TOKEN });
const repoInfo = {
  owner: "pompomon",
  repo: "vscode-extension-bongo-cat",
};
const version = process.env.ASSETS_VERSION || "0.0.1";
const releaseAssetName = `bongo-cat-${version}.vsix`;
const createRelease = async () => {
  const repoResponse = await octokit.request(
    "GET /repos/{owner}/{repo}",
    repoInfo
  );
  console.log(repoResponse);
  if (repoResponse.data.full_name === "pompomon/vscode-extension-bongo-cat") {
    console.log("Repo found");
    const releaseResponse = await octokit.request(
      "POST /repos/{owner}/{repo}/releases",
      {
        ...repoInfo,
        tag_name: `release-${version}`,
        draft: true,
        name: process.env.RELEASE_NAME || `New release ${version}`,
      }
    );
    if (releaseResponse.status === 201) {
	  const uploadUrl = releaseResponse.data.upload_url;
      const releaseId = releaseResponse.data.id;
      const assetUploadResponse = await octokit.request(
        "POST " + uploadUrl,
        {
          ...repoInfo,
		  release_id: releaseId,
		  name: releaseAssetName,
          body: fs.readFileSync(`./${releaseAssetName}`),
        }
      );
      console.log(assetUploadResponse);
    }
  }
};

createRelease();
