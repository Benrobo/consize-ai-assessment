# ConsizeAI Assessment

This is an assessment tied towards webscraping jobs from varieties of sources with default source set to `indeed.com`.

## Monorepo / Microservices Architecture

> **Why?** This architecture was selected specifically by me for the prospect of future implementations, additions, optimizations without causing unnecessary downtime. It's also written to scale from the ground up.

### Monorepo

This repo is built on-top monorepo architecture using `turbo-repo` & `yarn workspace` as the default build system to manage each workspaces, this allows for code sharing without duplicating specific codes.

Below is the tree structure and purpose of the codebase:

```sh
---packages/
        ---database/
            --prisma # prisma definition
        ---shared/ # code sharing packagee (utils, helpers, middlewares)
---services/
    --gateway/ # entry points into other microservices
    --jobs/ # serves as the main api for serving scraped jobs and managing jobs profile (admin only)
    --scraper # webscraping service to encompass multiple sources in the future
    --workers # manage and handles background-jobs and cron-jobs infra
```

With this architecture, whenever one service goes down, it doesn't have a high impact on the rest of the services.

## Setup

In order to get the codebase up and running, make sure you have the following dependencies:

1. Docker
2. Nodejs (16.x.x)
3. Yarn (4.x.x)

Follow the steps below:

### Step 1. Clone the Repo

Clone the repo by running

```sh
git clone https://github.com/benrobo/consize-ai-assessment.git
```
