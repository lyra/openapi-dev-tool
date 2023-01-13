// We override function to catch messages
let messages = [];
console.log = (message) => {
  messages.push(message);
};
let exitCode = 0;
process.exit = (code) => {
  exitCode = code;
};

describe('config.js file', () => {
  beforeEach(() => {
    // Clear logs messages buffer
    messages = [];

    // Clear process args
    process.argv = process.argv.slice(0, 1);
    // clear exit code
    exitCode = 0;
  });

  describe('help messages', () => {
    it('should return help message when no command is sent', async () => {
      await import(`../../src/lib/config.js?${Date.now()}`);
      expect(messages.length > 0).toBe(true);
      const help = messages[0];

      expect(help).toEqual(expect.stringContaining('Available Commands'));
      expect(exitCode).toBe(0);
    });

    it("should return help message when 'help' command is sent", async () => {
      process.argv[2] = 'help';
      await import(`../../src/lib/config.js?${Date.now()}`);
      expect(messages.length > 0).toBe(true);
      const help = messages[0];

      expect(help).toEqual(expect.stringContaining('Available Commands'));
      expect(exitCode).toBe(0);
    });

    it("should return serve help message when 'help serve' command is sent", async () => {
      process.argv[2] = 'help';
      process.argv[3] = 'serve';
      await import(`../../src/lib/config.js?${Date.now()}`);
      expect(messages.length > 0).toBe(true);
      const help = messages[0];

      expect(help).toEqual(expect.stringContaining('openapi-dev-tool serve'));
      expect(exitCode).toBe(0);
    });

    it("should return publish help message when 'help publish' command is sent", async () => {
      process.argv[2] = 'help';
      process.argv[3] = 'publish';
      await import(`../../src/lib/config.js?${Date.now()}`);
      expect(messages.length > 0).toBe(true);
      const help = messages[0];

      expect(help).toEqual(expect.stringContaining('openapi-dev-tool publish'));
      expect(exitCode).toBe(0);
    });

    it("should return publish help message when 'help publish-local' command is sent", async () => {
      process.argv[2] = 'help';
      process.argv[3] = 'publish-local';
      await import(`../../src/lib/config.js?${Date.now()}`);
      expect(messages.length > 0).toBe(true);
      const help = messages[0];

      expect(help).toEqual(
        expect.stringContaining('openapi-dev-tool publish-local')
      );
      expect(exitCode).toBe(0);
    });

    it("should return publish help message when 'help merge' command is sent", async () => {
      process.argv[2] = 'help';
      process.argv[3] = 'merge';
      await import(`../../src/lib/config.js?${Date.now()}`);
      expect(messages.length > 0).toBe(true);
      const help = messages[0];

      expect(help).toEqual(expect.stringContaining('openapi-dev-tool merge'));
      expect(exitCode).toBe(0);
    });
  });

  describe('commands validation error', () => {
    it("should return error when config file doesn't sent in serve command", async () => {
      process.argv[2] = 'serve';
      process.argv[3] = '--config';
      await import(`../../src/lib/config.js?${Date.now()}`);
      expect(messages.length).toBe(4);
      expect(messages[0]).toEqual(expect.stringContaining('Syntax error!'));
      expect(messages[1]).toEqual(
        expect.stringContaining('config is mandatory')
      );
      expect(exitCode).toBe(1);
    });

    it("should return error when port doesn't sent in serve command", async () => {
      process.argv[2] = 'serve';
      process.argv[3] = '--config';
      process.argv[4] = `./tests/assets/config_ok.json`;
      process.argv[5] = '--port';
      await import(`../../src/lib/config.js?${Date.now()}`);
      expect(messages.length).toBe(3);
      expect(messages[0]).toEqual(expect.stringContaining('Syntax error!'));
      expect(messages[1]).toEqual(expect.stringContaining('port is invalid'));
      expect(exitCode).toBe(1);
    });

    it('should return error when port sent is invalid in serve command', async () => {
      process.argv[2] = 'serve';
      process.argv[3] = '--config';
      process.argv[4] = `./tests/assets/config_ok.json`;
      process.argv[5] = '--port';
      process.argv[6] = 'toto';
      await import(`../../src/lib/config.js?${Date.now()}`);
      expect(messages.length).toBe(3);
      expect(messages[0]).toEqual(expect.stringContaining('Syntax error!'));
      expect(messages[1]).toEqual(expect.stringContaining('port is invalid'));
      expect(exitCode).toBe(1);
    });

    it('should return error when viewsFolder sent is invalid in serve command', async () => {
      process.argv[2] = 'serve';
      process.argv[3] = '--config';
      process.argv[4] = `./tests/assets/config_ok.json`;
      process.argv[5] = '--viewsFolder';
      process.argv[6] = 'toto';
      await import(`../../src/lib/config.js?${Date.now()}`);
      expect(messages.length).toBe(3);
      expect(messages[0]).toEqual(expect.stringContaining('Syntax error!'));
      expect(messages[1]).toEqual(
        expect.stringContaining("viewsFolder 'toto' does not exist")
      );
      expect(exitCode).toBe(1);
    });

    it('should return error when viewsFolder sent is invalid in serve command', async () => {
      process.argv[2] = 'serve';
      process.argv[3] = '--config';
      process.argv[4] = `./tests/assets/config_ok.json`;
      process.argv[5] = '--viewsFolder';
      process.argv[6] = `./tests/assets/config_ok.json`;
      await import(`../../src/lib/config.js?${Date.now()}`);
      expect(messages.length).toBe(3);
      expect(messages[0]).toEqual(expect.stringContaining('Syntax error!'));
      expect(messages[1]).toEqual(
        expect.stringContaining(
          "viewsFolder './tests/assets/config_ok.json' does not exist"
        )
      );
      expect(exitCode).toBe(1);
    });

    it('should return error when staticFolders sent is invalid in serve command', async () => {
      process.argv[2] = 'serve';
      process.argv[3] = '--config';
      process.argv[4] = `./tests/assets/config_ok.json`;
      process.argv[5] = '--staticFolders';
      process.argv[6] = '/toto';
      await import(`../../src/lib/config.js?${Date.now()}`);
      expect(messages.length).toBe(3);
      expect(messages[0]).toEqual(expect.stringContaining('Syntax error!'));
      expect(messages[1]).toEqual(
        expect.stringContaining("staticFolders '/toto' incorrect syntax")
      );
      expect(exitCode).toBe(1);
    });

    it('should return error when contextPath sent is invalid in serve command', async () => {
      process.argv[2] = 'serve';
      process.argv[3] = '--config';
      process.argv[4] = `./tests/assets/config_ok.json`;
      process.argv[5] = '--contextPath';
      process.argv[6] = 'toto';
      await import(`../../src/lib/config.js?${Date.now()}`);
      expect(messages.length).toBe(3);
      expect(messages[0]).toEqual(expect.stringContaining('Syntax error!'));
      expect(messages[1]).toEqual(
        expect.stringContaining('contextPath is invalid')
      );
      expect(exitCode).toBe(1);
    });

    it('should return error when staticFolders sent is invalid in serve command', async () => {
      process.argv[2] = 'serve';
      process.argv[3] = '--config';
      process.argv[4] = `./tests/assets/config_ok.json`;
      process.argv[5] = '--staticFolders';
      process.argv[6] = '/redoc:static-folder';
      await import(`../../src/lib/config.js?${Date.now()}`);
      expect(messages.length).toBe(3);
      expect(messages[0]).toEqual(expect.stringContaining('Syntax error!'));
      expect(messages[1]).toEqual(
        expect.stringContaining("staticFolders '/redoc' cannot be used")
      );
      expect(exitCode).toBe(1);
    });

    it('should return error when staticFolders sent is invalid in serve command', async () => {
      process.argv[2] = 'serve';
      process.argv[3] = '--config';
      process.argv[4] = `./tests/assets/config_ok.json`;
      process.argv[5] = '--staticFolders';
      process.argv[6] = '/path:fake';
      await import(`../../src/lib/config.js?${Date.now()}`);
      expect(messages.length).toBe(3);
      expect(messages[0]).toEqual(expect.stringContaining('Syntax error!'));
      expect(messages[1]).toEqual(
        expect.stringContaining("staticFolders 'fake' does not exist")
      );
      expect(exitCode).toBe(1);
    });

    it("should return error when config file doesn't exist in serve command", async () => {
      process.argv[2] = 'serve';
      process.argv[3] = '--config';
      process.argv[4] = 'fake.yaml';
      await import(`../../src/lib/config.js?${Date.now()}`);
      expect(messages.length).toBe(3);
      expect(messages[0]).toEqual(expect.stringContaining('Syntax error!'));
      expect(messages[1]).toEqual(
        expect.stringContaining("File 'fake.yaml' does not exit")
      );
      expect(exitCode).toBe(1);
    });

    it("should return error when config file doesn't exist in publish command", async () => {
      process.argv[2] = 'publish';
      process.argv[3] = '--config';
      process.argv[4] = 'fake.yaml';
      process.argv[5] = '--repoServer';
      process.argv[6] = 'http://server.com';
      process.argv[7] = '--repoUser';
      process.argv[8] = 'user';
      process.argv[9] = '--repoPassword';
      process.argv[10] = 'password';
      await import(`../../src/lib/config.js?${Date.now()}`);
      expect(messages.length).toBe(3);
      expect(messages[0]).toEqual(expect.stringContaining('Syntax error!'));
      expect(messages[1]).toEqual(
        expect.stringContaining("File 'fake.yaml' does not exit")
      );
      expect(exitCode).toBe(1);
    });

    it("should return error when config file doesn't exist in publish-local command", async () => {
      process.argv[2] = 'publish-local';
      process.argv[3] = '--config';
      process.argv[4] = 'fake.yaml';
      await import(`../../src/lib/config.js?${Date.now()}`);
      expect(messages.length).toBe(3);
      expect(messages[0]).toEqual(expect.stringContaining('Syntax error!'));
      expect(messages[1]).toEqual(
        expect.stringContaining("File 'fake.yaml' does not exit")
      );
      expect(exitCode).toBe(1);
    });

    it('should return error when repoServer is not sent in publish command', async () => {
      process.argv[2] = 'publish';
      process.argv[3] = '--config';
      process.argv[4] = `./tests/assets/config_ok.json`;
      process.argv[5] = '--repoServer';
      process.argv[6] = '--repoUser';
      process.argv[7] = 'user';
      process.argv[8] = '--repoPassword';
      process.argv[9] = 'password';
      await import(`../../src/lib/config.js?${Date.now()}`);
      expect(messages.length).toBe(3);
      expect(messages[0]).toEqual(expect.stringContaining('Syntax error!'));
      expect(messages[1]).toEqual(
        expect.stringContaining('repoServer is mandatory')
      );
      expect(exitCode).toBe(1);
    });

    it('should return error when groupId is not sent in publish command', async () => {
      process.argv[2] = 'publish';
      process.argv[3] = '--config';
      process.argv[4] = `./tests/assets/config_ok.json`;
      process.argv[5] = '--groupId';
      process.argv[6] = '--repoServer';
      process.argv[7] = 'http://server.com';
      process.argv[8] = '--repoUser';
      process.argv[9] = 'user';
      process.argv[10] = '--repoPassword';
      process.argv[11] = 'password';
      await import(`../../src/lib/config.js?${Date.now()}`);
      expect(messages.length).toBe(3);
      expect(messages[0]).toEqual(expect.stringContaining('Syntax error!'));
      expect(messages[1]).toEqual(
        expect.stringContaining('groupId is mandatory')
      );
      expect(exitCode).toBe(1);
    });

    it('should return error when groupId is not sent in publish-local command', async () => {
      process.argv[2] = 'publish-local';
      process.argv[3] = '--config';
      process.argv[4] = `./tests/assets/config_ok.json`;
      process.argv[5] = '--groupId';
      await import(`../../src/lib/config.js?${Date.now()}`);
      expect(messages.length).toBe(3);
      expect(messages[0]).toEqual(expect.stringContaining('Syntax error!'));
      expect(messages[1]).toEqual(
        expect.stringContaining('groupId is mandatory')
      );
      expect(exitCode).toBe(1);
    });

    it('should return error when repoServer is incorrect in publish command', async () => {
      process.argv[2] = 'publish';
      process.argv[3] = '--config';
      process.argv[4] = `./tests/assets/config_ok.json`;
      process.argv[5] = '--repoServer';
      process.argv[6] = 'invalidserver';
      process.argv[7] = '--repoUser';
      process.argv[8] = 'user';
      process.argv[9] = '--repoPassword';
      process.argv[10] = 'password';
      await import(`../../src/lib/config.js?${Date.now()}`);
      expect(messages.length).toBe(3);
      expect(messages[0]).toEqual(expect.stringContaining('Syntax error!'));
      expect(messages[1]).toEqual(
        expect.stringContaining('repoServer is not a valid url')
      );
      expect(exitCode).toBe(1);
    });

    it('should return error when repoSnapshotsServer is incorrect in publish command', async () => {
      process.argv[2] = 'publish';
      process.argv[3] = '--config';
      process.argv[4] = `./tests/assets/config_ok.json`;
      process.argv[5] = '--repoServer';
      process.argv[6] = 'http://server.com';
      process.argv[7] = '--repoSnapshotsServer';
      process.argv[8] = 'invalidserver';
      process.argv[9] = '--repoUser';
      process.argv[10] = 'user';
      process.argv[11] = '--repoPassword';
      process.argv[12] = 'password';
      await import(`../../src/lib/config.js?${Date.now()}`);
      expect(messages.length).toBe(3);
      expect(messages[0]).toEqual(expect.stringContaining('Syntax error!'));
      expect(messages[1]).toEqual(
        expect.stringContaining('repoSnapshotsServer is not a valid url')
      );
      expect(exitCode).toBe(1);
    });

    it('should return error when repoUser is not sent in publish command', async () => {
      process.argv[2] = 'publish';
      process.argv[3] = '--config';
      process.argv[4] = `./tests/assets/config_ok.json`;
      process.argv[5] = '--repoUser';
      process.argv[6] = '--repoServer';
      process.argv[7] = 'http://server.com';
      process.argv[8] = '--repoPassword';
      process.argv[9] = 'password';
      await import(`../../src/lib/config.js?${Date.now()}`);
      expect(messages.length).toBe(3);
      expect(messages[0]).toEqual(expect.stringContaining('Syntax error!'));
      expect(messages[1]).toEqual(
        expect.stringContaining('repoUser is mandatory')
      );
      expect(exitCode).toBe(1);
    });

    it('should return error when repoPassword is not sent in publish command', async () => {
      process.argv[2] = 'publish';
      process.argv[3] = '--config';
      process.argv[4] = `./tests/assets/config_ok.json`;
      process.argv[5] = '--repoPassword';
      process.argv[6] = '--repoServer';
      process.argv[7] = 'http://server.com';
      process.argv[8] = '--repoUser';
      process.argv[9] = 'user';
      await import(`../../src/lib/config.js?${Date.now()}`);
      expect(messages.length).toBe(3);
      expect(messages[0]).toEqual(expect.stringContaining('Syntax error!'));
      expect(messages[1]).toEqual(
        expect.stringContaining('repoPassword is mandatory')
      );
      expect(exitCode).toBe(1);
    });
  });

  describe('global validation error', () => {
    it('should return error when unknown option is provided', async () => {
      process.argv[2] = 'serve';
      process.argv[3] = 'toto';
      await import(`../../src/lib/config.js?${Date.now()}`);
      expect(messages.length).toBe(3);
      expect(messages[0]).toEqual(expect.stringContaining('Syntax error!'));
      expect(messages[1]).toEqual(
        expect.stringContaining("Option 'toto' unknown")
      );
      expect(exitCode).toBe(1);
    });

    it('should return error when config file is empty', async () => {
      process.argv[2] = 'serve';
      process.argv[3] = '--config';
      process.argv[4] = `./tests/assets/config_empty.yaml`;
      await import(`../../src/lib/config.js?${Date.now()}`);
      expect(messages.length).toBe(3);
      expect(messages[0]).toEqual(expect.stringContaining('Syntax error!'));
      expect(messages[1]).toEqual(
        expect.stringContaining(
          '\t- In config file: specs.0.file is required but was either undefined or null'
        )
      );
      expect(exitCode).toBe(1);
    });

    it('should return error when config file references wrong files/folder', async () => {
      process.argv[2] = 'serve';
      process.argv[3] = '--config';
      process.argv[4] = `./tests/assets/config_fake.yaml`;
      await import(`../../src/lib/config.js?${Date.now()}`);
      expect(messages.length).toBe(3);
      expect(messages[0]).toEqual(expect.stringContaining('Syntax error!'));
      expect(messages[1]).toEqual(
        expect.stringContaining(
          "\t- In config file: file 'toto/tata' doesn't exist"
        )
      );
      expect(exitCode).toBe(1);
    });

    it('should return error when config file references wrong artifact syntax', async () => {
      process.argv[2] = 'serve';
      process.argv[3] = '--config';
      process.argv[4] = `./tests/assets/config_invalid_artifact.yaml`;
      process.argv[5] = '--urlDownloadTemplate';
      process.argv[6] = 'https://host?[GROUP_ID]&[ARTIFACT_ID]&[VERSION]';
      await import(`../../src/lib/config.js?${Date.now()}`);
      expect(messages.length).toBe(3);
      expect(messages[0]).toEqual(expect.stringContaining('Syntax error!'));
      expect(messages[1]).toEqual(
        expect.stringContaining(
          "\t- In config file: artifact 'fake' is incorrect, should be written like <groupId>:<artifactId>:<version>."
        )
      );
      expect(exitCode).toBe(1);
    });

    it('should return error when urlDownloadTemplate has incorrect syntax', async () => {
      process.argv[2] = 'serve';
      process.argv[3] = '--config';
      process.argv[4] = `./tests/assets/config_valid_artifact.yaml`;
      process.argv[5] = '--urlDownloadTemplate';
      process.argv[6] = 'fake';
      await await await import(`../../src/lib/config.js?${Date.now()}`);
      expect(messages.length).toBe(3);
      expect(messages[0]).toEqual(expect.stringContaining('Syntax error!'));
      expect(messages[1]).toEqual(
        expect.stringContaining(
          "Option 'urlDownloadTemplate' doesn't have a valid syntax url"
        )
      );
      expect(exitCode).toBe(1);
    });

    it('should return error when urlDownloadTemplate does not have artifact tokens', async () => {
      process.argv[2] = 'serve';
      process.argv[3] = '--config';
      process.argv[4] = `./tests/assets/config_valid_artifact.yaml`;
      process.argv[5] = '--urlDownloadTemplate';
      process.argv[6] = 'https://test';
      await await await import(`../../src/lib/config.js?${Date.now()}`);
      expect(messages.length).toBe(3);
      expect(messages[0]).toEqual(expect.stringContaining('Syntax error!'));
      expect(messages[1]).toEqual(
        expect.stringContaining(
          "Option 'urlDownloadTemplate' has to contain token [ARTIFACT_ID], [GROUP_ID] and [VERSION]"
        )
      );
      expect(exitCode).toBe(1);
    });
  });
});
