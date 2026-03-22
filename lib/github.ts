import { Octokit } from "@octokit/rest";
import type { GitHubCommit } from "@/types";

const octokit = new Octokit();

export async function getGitHubCommits(
  username: string,
  perPage: number = 5
): Promise<GitHubCommit[]> {
  try {
    // Get user's recent repositories
    const { data: repos } = await octokit.repos.listForUser({
      username,
      sort: "updated",
      per_page: 5,
    });

    if (repos.length === 0) {
      return [];
    }

    // Get commits from the most recently active repos
    const commits: GitHubCommit[] = [];

    for (const repo of repos) {
      if (commits.length >= perPage) break;

      try {
        const { data } = await octokit.repos.listCommits({
          owner: username,
          repo: repo.name,
          per_page: 3,
        });

        for (const commit of data) {
          if (commits.length >= perPage) break;
          commits.push({
            message: commit.commit.message.split("\n")[0],
            branch: repo.name,
            timestamp: formatRelativeTime(new Date(commit.commit.author?.date || Date.now())),
            url: commit.html_url,
          });
        }
      } catch {
        // Skip repos we can't access
      }
    }

    return commits;
  } catch (error) {
    console.error("Failed to fetch commits:", error);
    return [];
  }
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) {
    return `${diffDays}d ago`;
  }
  if (diffHours > 0) {
    return `${diffHours}h ago`;
  }
  return "just now";
}
