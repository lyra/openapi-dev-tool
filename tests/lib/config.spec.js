import path from 'path';
import chai from 'chai';
import chaiString from 'chai-string';

chai.use(chaiString);

const assert = chai.assert;

// We override function to catch messages
let messages = [];
console.log = message => {
  messages.push(message);
};
let exitCode = 0;
process.exit = code => {
  exitCode = code;
};

describe('config.js file', function () {
  beforeEach(function () {
    // Clear logs messages buffer
    messages = [];
    // Clear process args
    process.argv = process.argv.slice(0, 1);
    // clear exit code
    exitCode = 0;
    // Clear cache module (to be able to reimport module several time)
    delete require.cache[require.resolve('../../src/lib/config')];
  });

  describe('help messages', function () {
    it('should return help message when no command is sent', async function () {
      require('../../src/lib/config');
      assert.isTrue(messages.length > 0);
      const help = messages[0];
      assert.include(help, 'Available Commands');
      assert.equal(0, exitCode);
    });

    it("should return help message when 'help' command is sent", async function () {
      process.argv[2] = 'help';
      require('../../src/lib/config');
      assert.isTrue(messages.length > 0);
      const help = messages[0];
      assert.include(help, 'Available Commands');
      assert.equal(0, exitCode);
    });

    it("should return serve help message when 'help serve' command is sent", async function () {
      process.argv[2] = 'help';
      process.argv[3] = 'serve';
      require('../../src/lib/config');
      assert.isTrue(messages.length > 0);
      const help = messages[0];
      assert.include(help, 'openapi-dev-tool serve');
      assert.equal(0, exitCode);
    });

    it("should return publish help message when 'help publish' command is sent", async function () {
      process.argv[2] = 'help';
      process.argv[3] = 'publish';
      require('../../src/lib/config');
      assert.isTrue(messages.length > 0);
      const help = messages[0];
      assert.include(help, 'openapi-dev-tool publish');
      assert.equal(0, exitCode);
    });

    it("should return publish help message when 'help publish-local' command is sent", async function () {
      process.argv[2] = 'help';
      process.argv[3] = 'publish-local';
      require('../../src/lib/config');
      assert.isTrue(messages.length > 0);
      const help = messages[0];
      assert.include(help, 'openapi-dev-tool publish-local');
      assert.equal(0, exitCode);
    });

    it("should return publish help message when 'help merge' command is sent", async function () {
      process.argv[2] = 'help';
      process.argv[3] = 'merge';
      require('../../src/lib/config');
      assert.isTrue(messages.length > 0);
      const help = messages[0];
      assert.include(help, 'openapi-dev-tool merge');
      assert.equal(0, exitCode);
    });
  });

  describe('commands validation error', function () {
    it("should return error when config file doesn't sent in serve command", async function () {
      process.argv[2] = 'serve';
      process.argv[3] = '--config';
      require('../../src/lib/config');
      assert.equal(4, messages.length);
      assert.include(messages[0], 'Syntax error!');
      assert.include(messages[1], 'config is mandatory');
      assert.equal(1, exitCode);
    });

    it("should return error when port doesn't sent in serve command", async function () {
      process.argv[2] = 'serve';
      process.argv[3] = '--config';
      process.argv[4] = `${__dirname}/../assets/config_ok.json`;
      process.argv[5] = '--port';
      require('../../src/lib/config');
      assert.equal(3, messages.length);
      assert.include(messages[0], 'Syntax error!');
      assert.include(messages[1], 'port is invalid');
      assert.equal(1, exitCode);
    });

    it('should return error when port sent is invalid in serve command', async function () {
      process.argv[2] = 'serve';
      process.argv[3] = '--config';
      process.argv[4] = `${__dirname}/../assets/config_ok.json`;
      process.argv[5] = '--port';
      process.argv[6] = 'toto';
      require('../../src/lib/config');
      assert.equal(3, messages.length);
      assert.include(messages[0], 'Syntax error!');
      assert.include(messages[1], 'port is invalid');
      assert.equal(1, exitCode);
    });

    it('should return error when viewsFolder sent is invalid in serve command', async function () {
      process.argv[2] = 'serve';
      process.argv[3] = '--config';
      process.argv[4] = `${__dirname}/../assets/config_ok.json`;
      process.argv[5] = '--viewsFolder';
      process.argv[6] = 'toto';
      require('../../src/lib/config');
      assert.equal(3, messages.length);
      assert.include(messages[0], 'Syntax error!');
      assert.include(messages[1], 'viewsFolder \'toto\' does not exist');
      assert.equal(1, exitCode);
    });

    it('should return error when staticFolders sent is invalid in serve command', async function () {
      process.argv[2] = 'serve';
      process.argv[3] = '--config';
      process.argv[4] = `${__dirname}/../assets/config_ok.json`;
      process.argv[5] = '--staticFolders';
      process.argv[6] = '/toto';
      require('../../src/lib/config');
      assert.equal(3, messages.length);
      assert.include(messages[0], 'Syntax error!');
      assert.include(messages[1], 'staticFolders \'/toto\' incorrect syntax');
      assert.equal(1, exitCode);
    });

    it('should return error when contextPath sent is invalid in serve command', async function () {
      process.argv[2] = 'serve';
      process.argv[3] = '--config';
      process.argv[4] = `${__dirname}/../assets/config_ok.json`;
      process.argv[5] = '--contextPath';
      process.argv[6] = 'toto';
      require('../../src/lib/config');
      assert.equal(3, messages.length);
      assert.include(messages[0], 'Syntax error!');
      assert.include(messages[1], 'contextPath is invalid');
      assert.equal(1, exitCode);
    });

    it('should return error when staticFolders sent is invalid in serve command', async function () {
      process.argv[2] = 'serve';
      process.argv[3] = '--config';
      process.argv[4] = `${__dirname}/../assets/config_ok.json`;
      process.argv[5] = '--staticFolders';
      process.argv[6] = '/redoc:static-folder';
      require('../../src/lib/config');
      assert.equal(3, messages.length);
      assert.include(messages[0], 'Syntax error!');
      assert.include(messages[1], 'staticFolders \'/redoc\' cannot be used');
      assert.equal(1, exitCode);
    });

    it('should return error when staticFolders sent is invalid in serve command', async function () {
      process.argv[2] = 'serve';
      process.argv[3] = '--config';
      process.argv[4] = `${__dirname}/../assets/config_ok.json`;
      process.argv[5] = '--staticFolders';
      process.argv[6] = '/path:fake';
      require('../../src/lib/config');
      assert.equal(3, messages.length);
      assert.include(messages[0], 'Syntax error!');
      assert.include(messages[1], 'staticFolders \'fake\' does not exist');
      assert.equal(1, exitCode);
    });


    it("should return error when config file doesn't exist in serve command", async function () {
      process.argv[2] = 'serve';
      process.argv[3] = '--config';
      process.argv[4] = 'fake.yaml';
      require('../../src/lib/config');
      assert.equal(3, messages.length);
      assert.include(messages[0], 'Syntax error!');
      assert.include(messages[1], "File 'fake.yaml' does not exit");
      assert.equal(1, exitCode);
    });

    it("should return error when config file doesn't exist in publish command", async function () {
      process.argv[2] = 'publish';
      process.argv[3] = '--config';
      process.argv[4] = 'fake.yaml';
      process.argv[5] = '--repoServer';
      process.argv[6] = 'http://server.com';
      process.argv[7] = '--repoUser';
      process.argv[8] = 'user';
      process.argv[9] = '--repoPassword';
      process.argv[10] = 'password';
      require('../../src/lib/config');
      assert.equal(3, messages.length);
      assert.include(messages[0], 'Syntax error!');
      assert.include(messages[1], "File 'fake.yaml' does not exit");
      assert.equal(1, exitCode);
    });

    it("should return error when config file doesn't exist in publish-local command", async function () {
      process.argv[2] = 'publish-local';
      process.argv[3] = '--config';
      process.argv[4] = 'fake.yaml';
      require('../../src/lib/config');
      assert.equal(3, messages.length);
      assert.include(messages[0], 'Syntax error!');
      assert.include(messages[1], "File 'fake.yaml' does not exit");
      assert.equal(1, exitCode);
    });

    it('should return error when repoServer is not sent in publish command', async function () {
      process.argv[2] = 'publish';
      process.argv[3] = '--config';
      process.argv[4] = `${__dirname}/../assets/config_ok.json`;
      process.argv[5] = '--repoServer';
      process.argv[6] = '--repoUser';
      process.argv[7] = 'user';
      process.argv[8] = '--repoPassword';
      process.argv[9] = 'password';
      require('../../src/lib/config');
      assert.equal(3, messages.length);
      assert.include(messages[0], 'Syntax error!');
      assert.include(messages[1], 'repoServer is mandatory');
      assert.equal(1, exitCode);
    });

    it('should return error when repoPath is not sent in publish-local command', async function () {
      process.argv[2] = 'publish-local';
      process.argv[3] = '--config';
      process.argv[4] = `${__dirname}/../assets/config_ok.json`;
      process.argv[5] = '--repoPath';
      require('../../src/lib/config');
      assert.equal(3, messages.length);
      assert.include(messages[0], 'Syntax error!');
      assert.include(messages[1], 'repoPath is mandatory');
      assert.equal(1, exitCode);
    });

    it('should return error when repoPath is invalid in publish-local command', async function () {
      process.argv[2] = 'publish-local';
      process.argv[3] = '--config';
      process.argv[4] = `${__dirname}/../assets/config_ok.json`;
      process.argv[5] = '--repoPath';
      process.argv[6] = 'fake';
      require('../../src/lib/config');
      assert.equal(3, messages.length);
      assert.include(messages[0], 'Syntax error!');
      assert.include(messages[1], 'repoPath \'fake\' folder does not exist');
      assert.equal(1, exitCode);
    });

    it('should return error when repoServer is incorrect in publish command', async function () {
      process.argv[2] = 'publish';
      process.argv[3] = '--config';
      process.argv[4] = `${__dirname}/../assets/config_ok.json`;
      process.argv[5] = '--repoServer';
      process.argv[6] = 'invalidserver';
      process.argv[7] = '--repoUser';
      process.argv[8] = 'user';
      process.argv[9] = '--repoPassword';
      process.argv[10] = 'password';
      require('../../src/lib/config');
      assert.equal(3, messages.length);
      assert.include(messages[0], 'Syntax error!');
      assert.include(messages[1], 'repoServer is not a valid url');
      assert.equal(1, exitCode);
    });

    it('should return error when repoSnapshotsServer is incorrect in publish command', async function () {
      process.argv[2] = 'publish';
      process.argv[3] = '--config';
      process.argv[4] = `${__dirname}/../assets/config_ok.json`;
      process.argv[5] = '--repoServer';
      process.argv[6] = 'http://server.com';
      process.argv[7] = '--repoSnapshotsServer';
      process.argv[8] = 'invalidserver';
      process.argv[9] = '--repoUser';
      process.argv[10] = 'user';
      process.argv[11] = '--repoPassword';
      process.argv[12] = 'password';
      require('../../src/lib/config');
      assert.equal(3, messages.length);
      assert.include(messages[0], 'Syntax error!');
      assert.include(messages[1], 'repoSnapshotsServer is not a valid url');
      assert.equal(1, exitCode);
    });

    it('should return error when groupId is not sent in publish command', async function () {
      process.argv[2] = 'publish';
      process.argv[3] = '--config';
      process.argv[4] = `${__dirname}/../assets/config_ok.json`;
      process.argv[5] = '--groupId';
      process.argv[6] = '--repoServer';
      process.argv[7] = 'http://server.com';
      process.argv[8] = '--repoUser';
      process.argv[9] = 'user';
      process.argv[10] = '--repoPassword';
      process.argv[11] = 'password';
      require('../../src/lib/config');
      assert.equal(3, messages.length);
      assert.include(messages[0], 'Syntax error!');
      assert.include(messages[1], 'groupId is mandatory');
      assert.equal(1, exitCode);
    });

    it('should return error when groupId is not sent in publish-local command', async function () {
      process.argv[2] = 'publish-local';
      process.argv[3] = '--config';
      process.argv[4] = `${__dirname}/../assets/config_ok.json`;
      process.argv[5] = '--groupId';
      require('../../src/lib/config');
      assert.equal(3, messages.length);
      assert.include(messages[0], 'Syntax error!');
      assert.include(messages[1], 'groupId is mandatory');
      assert.equal(1, exitCode);
    });

    it('should return error when repoServer is incorrect in publish command', async function () {
      process.argv[2] = 'publish';
      process.argv[3] = '--config';
      process.argv[4] = `${__dirname}/../assets/config_ok.json`;
      process.argv[5] = '--repoServer';
      process.argv[6] = 'invalidserver';
      process.argv[7] = '--repoUser';
      process.argv[8] = 'user';
      process.argv[9] = '--repoPassword';
      process.argv[10] = 'password';
      require('../../src/lib/config');
      assert.equal(3, messages.length);
      assert.include(messages[0], 'Syntax error!');
      assert.include(messages[1], 'repoServer is not a valid url');
      assert.equal(1, exitCode);
    });

    it('should return error when repoSnapshotsServer is incorrect in publish command', async function () {
      process.argv[2] = 'publish';
      process.argv[3] = '--config';
      process.argv[4] = `${__dirname}/../assets/config_ok.json`;
      process.argv[5] = '--repoServer';
      process.argv[6] = 'http://server.com';
      process.argv[7] = '--repoSnapshotsServer';
      process.argv[8] = 'invalidserver';
      process.argv[9] = '--repoUser';
      process.argv[10] = 'user';
      process.argv[11] = '--repoPassword';
      process.argv[12] = 'password';
      require('../../src/lib/config');
      assert.equal(3, messages.length);
      assert.include(messages[0], 'Syntax error!');
      assert.include(messages[1], 'repoSnapshotsServer is not a valid url');
      assert.equal(1, exitCode);
    });

    it('should return error when repoUser is not sent in publish command', async function () {
      process.argv[2] = 'publish';
      process.argv[3] = '--config';
      process.argv[4] = `${__dirname}/../assets/config_ok.json`;
      process.argv[5] = '--repoUser';
      process.argv[6] = '--repoServer';
      process.argv[7] = 'http://server.com';
      process.argv[8] = '--repoPassword';
      process.argv[9] = 'password';
      require('../../src/lib/config');
      assert.equal(3, messages.length);
      assert.include(messages[0], 'Syntax error!');
      assert.include(messages[1], 'repoUser is mandatory');
      assert.equal(1, exitCode);
    });

    it('should return error when repoPassword is not sent in publish command', async function () {
      process.argv[2] = 'publish';
      process.argv[3] = '--config';
      process.argv[4] = `${__dirname}/../assets/config_ok.json`;
      process.argv[5] = '--repoPassword';
      process.argv[6] = '--repoServer';
      process.argv[7] = 'http://server.com';
      process.argv[8] = '--repoUser';
      process.argv[9] = 'user';
      require('../../src/lib/config');
      assert.equal(3, messages.length);
      assert.include(messages[0], 'Syntax error!');
      assert.include(messages[1], 'repoPassword is mandatory');
      assert.equal(1, exitCode);
    });
  });

  describe('global validation error', function () {
    it('should return error when unknown option is provided', async function () {
      process.argv[2] = 'serve';
      process.argv[3] = 'toto';
      require('../../src/lib/config');
      assert.equal(3, messages.length);
      assert.include(messages[0], 'Syntax error!');
      assert.include(messages[1], "Option 'toto' unknow");

      assert.equal(1, exitCode);
    });

    it('should return error when config file is empty', async function () {
      process.argv[2] = 'serve';
      process.argv[3] = '--config';
      process.argv[4] = `${__dirname}/../assets/config_empty.yaml`;
      require('../../src/lib/config');
      assert.equal(4, messages.length);
      assert.include(messages[0], 'Syntax error!');
      assert.include(
        messages[1],
        '\t- In config file: folder is required but was either undefined or null'
      );
      assert.include(
        messages[2],
        '\t- In config file: specs.0.file is required but was either undefined or null'
      );
      assert.equal(1, exitCode);
    });

    it('should return error when config file references wrong files/folder', async function () {
      process.argv[2] = 'serve';
      process.argv[3] = '--config';
      process.argv[4] = `${__dirname}/../assets/config_fake.yaml`;
      require('../../src/lib/config');
      assert.equal(4, messages.length);
      assert.include(messages[0], 'Syntax error!');
      assert.include(
        messages[1],
        "\t- In config file: Folder toto doesn't exist"
      );
      assert.include(
        messages[2],
        `\t- In config file: File ${path.join('toto', 'tata')} doesn't exist`
      );
      assert.equal(1, exitCode);
    });
  });
});
