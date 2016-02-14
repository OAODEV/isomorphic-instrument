Configure a Node module for linting, testing, integrating, and deploying.

This is an application configured with the following technologies:
- Intern for testing (see /tests/intern.js)
- JSCS, ESLint, and JSHint for linting and style guides (see the dotfiles at the project root)
- CircleCI for integration (see /circle.yml)
- Docker for containerization (see /Dockerfile at the project root)
- npm scripts and Grunt for task management (see /gruntfile.js and /package.json)
- npm scripts for everything else (see /package.json)

# CLI
**publish** _[alias: p]_ Increments the package's version, commits as instructed, then pushes and publishes the package.

  `publish -b master -v prepatch -g v1.0.1 -n next -m "Increments from v1.0.1-0 to v1.0.1-1."`

`-b, --branch [branch]` Sets which branch to push to GitHub. Defaults to master.
`-g, --gittag [tag]` Tags the Git commit. The new version number is used by default.
`-m, --gitmsg ["message"]` Sets the Git commit message. Wrapping your comment in double quotes is recommended.
`-n, --npmtag [tag]` Tags the node module. This is set as "next" by default so releasing as "latest" is a conscious choice.
`-v, --version [version]` Increments the package to the given version. Uses "prepatch" by default.

**increment** Increments the package version, commits the changes, and tags the commit with the new version number. See `-o` to avoid the latter two steps.

`increment -m "Your Git commit message here."`  
`increment -f "--no-git-tag-version -f"`  

`-f, --flags` Sets the flags on the `npm version` command.  
`-m, --message` Sets the git commit message.  
`-o, --only` Ignore your repo's status, and do not commit. Only update the version in package.json.  

# Engineering Tasks (@todo)
- Update Dockerfile
- Evolve configuration for those using this as a starter
- Improve test coverage
- Totally replace Grunt w/ custom scripts
- Add Express

# :wrench: Contributing
Submit your pull requests and feedback to [GitHub](https://github.com/oaodev/isomorphic-instrument/issues).

## Development Guidelines

### jscs
This is not an enforcer, merely a guide for maintainability.

### eslint
Simply because it's in the style guide, doesn't mean it should be enforced.

## Testing
`grunt intern:client`

##  Dependencies
Developers hosting or contributing to this project require the tools that support it:

* [Python](https://www.python.org/): Python v2.7+ is a prerequisite of Node.
* [Node and npm](http://nodejs.org/): Node provides an environment on which to execute JavaScript processes, while npm manages packages.
