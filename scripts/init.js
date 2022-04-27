const pkgJson = require('../package.json');
const {execSync} = require('child_process');
const fs = require('fs');

const R = {
  pipe:
    (...fns) =>
    (arg) =>
      fns.reduce((f, g) => g(f), arg),
  curry: (fn) => (a) => (b) => fn(a, b),
  curryR: (fn) => (a) => (b) => fn(b, a),
};

const sh = {
  exec: (command) => execSync(command, {encoding: 'utf8'}).toString().trim(),
  args: {
    get(arg) {
      const index = process.argv.findIndex((value) => value === arg);

      if (index < 0) {
        return '';
      }

      return process.argv[index + 1] || '';
    },
    has(arg) {
      return process.argv.findIndex((value) => value === arg) > -1;
    },
  },
};

const git = {
  repository: {
    getRemoteURL() {
      return sh.exec('git remote get-url --push origin');
    },
  },
  config: {
    getUserName() {
      return sh.exec('git config user.name');
    },
    getUserEmail() {
      return sh.exec('git config user.email');
    },
  },
  utils: {
    getProfilePageURLByName(name) {
      return `https://github.kakaoenterprise.in/${name.replace('.', '-')}`;
    },
  },
};

const pkg = {
  name: R.curryR((pkg, name) => {
    return {
      ...pkg,
      name,
    };
  }),
  private: R.curryR((pkg, isPrivate) => {
    return {
      ...pkg,
      'private': isPrivate
    };
  }),
  author: R.curryR((pkg, {name, email, url}) => {
    return {
      ...pkg,
      author: {
        name,
        email,
        url,
      },
    };
  }),
  repository: R.curryR((pkg, url) => {
    return {
      ...pkg,
      repository: {
        type: 'git',
        url,
      },
    };
  }),
  helpers: {
    getUserFromGit() {
      const name = git.config.getUserName();

      return {
        name,
        email: git.config.getUserEmail(),
        url: git.utils.getProfilePageURLByName(name),
      };
    },

    serialize(pkgJson) {
      return JSON.stringify(pkgJson, null, '  ');
    },

    build(pkgJson, {name, isPrivate}) {
      return R.pipe(
        pkg.name(name),
        pkg.repository(git.repository.getRemoteURL()),
        pkg.author(pkg.helpers.getUserFromGit()),
        pkg.private(isPrivate)
      )(pkgJson);
    },
  },
};

const config = {
  fromArgv() {
    const projectName = sh.args.get('--projectName');
    const isDryRun = sh.args.has('--dryRun');
    const isPrivate = sh.args.has('--private');

    if (!projectName) {
      throw new Error('--projectName 파라미터를 필수로 입력해야 합니다.');
    }

    if (!projectName.startsWith('@kep/')) {
      throw new Error(
        '--projectName 파라미터는 "@kep/" 네임스페이스로 시작해야 합니다.',
      );
    }
    return {
      projectName,
      isDryRun,
      isPrivate
    }
  }
}

const main = {
  init() {
    const {projectName, isPrivate, isDryRun} = config.fromArgv()
    const newPkgJson = pkg.helpers.build(pkgJson, {
      name: projectName,
      isPrivate
    });

    if (isDryRun) {
      console.log(pkg.helpers.serialize(newPkgJson));
    } else {
      fs.writeFileSync('./package.json', pkg.helpers.serialize(newPkgJson));
    }
  },
};

module.exports = main;
