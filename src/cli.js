import vorpal from 'vorpal';
import shell from 'shelljs';

let
cli = vorpal(),
app = Object.create({
  defaults: {
    branch: 'master',
    v: 'prepatch',
  },
  errors: {
    nogit: 'This script requires git. Consider executing `git init`.',
  },
  flags: {
    increment: '--no-git-tag-version -f',
  },
}),
np = {}, // Holds Node-related commands.
gi = {}, // Holds Git-related commands.

// Removes trailing line break.
clean = (str) => {
  if (str.charAt(str.length - 1) === '\n') {
    return str.toString().substring(0, str.length - 1);
  }

  return str;
};

// Get version of given package.
np.getVersion = (pkg) => {
  return clean(shell.exec('npm view ' + pkg + ' version').output);
};

// Increment the version in the package.json.
np.increment = (version, flags, message) => {
  flags = flags && flags !== true ? ' ' + flags : '';
  message = message ? ' -m ' + message : '';
  shell.exec('npm' + flags + message + ' version ' + version);
  return np;
};

// Publish the module to the npm public repository.
np.publish = (tag) => {
  shell.exec('npm publish --tag=' + tag);
  return np;
};

// Confirm this is a Git repository.
gi.is = () => {
  if (!shell.which('git')) {
    shell.echo(app.errors.nogit);
    return false;
  }

  return true;
};

gi.commit = (msg) => {
  shell.exec('git commit -m ' + msg);
  return gi;
};

gi.push = (branch) => {
  shell.exec('git push origin ' + branch);
  return gi;
};

gi.tag = (tag, msg) => {
  shell.exec('git tag ' + tag + ' -m ' + msg);
  return gi;
};

app.init = () => {
  if (!gi.is()) {
    shell.exit(1);
  }
};

// Updates the package version, tags the commit, pushes, and publishes.
cli.
command('publish', 'Publishes the package to GitHub and npm.').
alias('p').
option('-b, --branch [branch]', 'Set the branch to push to GitHub.').
option('-g, --gittag [tag]', 'Tag the Git commit.').
option('-m, --gitmsg [msg]', 'Set the Git commit message.').
option('-n, --npmtag [tag]', 'Tag the node module.').
option('-v, --version [version]', 'Increment to the given version.').
action((args, callback) => {
  // Validates.
  app.init();

  let branch = args.options.branch || app.defaults.branch,
    version = args.options.version || app.defaults.v,
    currentVersion = np.getVersion('.'),
    msg, gitmsg, gittag;

  cli.log('Publishing package. Current version: ' + currentVersion + '.');

  // Starts building the message.
  msg = '"Increments from v' + currentVersion;

  // Increments node module version. Does not git tag nor git commit.
  np.increment(version, app.flags.increment);

  // Sets the values requiring knowledge of new version.
  currentVersion = np.getVersion('.');
  msg += ' to v' + currentVersion + '."';
  gitmsg = args.options.gitmsg || msg;
  gittag = args.options.gittag || 'v' + currentVersion;

  // Executes Git publishing process.
  gi.commit(msg).tag(gittag, gitmsg).push(branch);

  // Executes npm publishing process.
  np.tag(args.options.npmtag || args.options.tag || 'next');

  // Updates user.
  cli.log('Your package, now at v' + currentVersion + ', has been published.');

  // Returns user to our application rather than exit.
  callback();
});

// Increment the node module's version.
cli.
command('increment [version]', 'Increment the npm version.').
option('-m, --message [msg]', 'Sets the git commit message.').
option('-f, --flag [flags]', 'Sets the flags on the `npm version` command.').
option('-o, --only', 'Does not commit nor tag after updating the npm version.').
option('-v, --version', 'Sets the version.').
action((args, callback) => {
  let flags = args.flag || undefined;

  if (args.options.only) {
    flags = app.flags.increment;
  }

  np.increment(args.options.version || app.defaults.v, flags, args.message);

  callback();
});

// Set the prompt.
cli.delimiter('on >>').show();
