import 'jest';
import { default as axios } from 'axios';

axios.defaults.baseURL = 'http://localhost:8000';

describe('/status', () => {
  test('status is OK', async () => {
    const response = await axios.get('/status');
    expect(response.status).toBe(200);
    expect(response.data).toStrictEqual({ text: 'OK!' });
  });
});

describe('/groups', () => {
  describe('invalid scenario', () => {
    test('invalid input while group creation 1', async () => {
      expect.assertions(1);
      try {
        await axios.post('/groups', {
          ame: 'Good friends',
          passcode: 'qwerty',
        });
      } catch (err) {
        expect((err as Error).message).toBe(
          'Request failed with status code 400'
        );
      }
    });

    test('invalid input while group creation 2', async () => {
      expect.assertions(1);
      try {
        await axios.post('/groups', {
          name: 'Good friends',
          asscode: 'qwerty',
        });
      } catch (err) {
        expect((err as Error).message).toBe(
          'Request failed with status code 400'
        );
      }
    });

    test('invalid input while group creation 3', async () => {
      expect.assertions(1);
      try {
        await axios.post('/groups', {});
      } catch (err) {
        expect((err as Error).message).toBe(
          'Request failed with status code 400'
        );
      }
    });

    // TODO add more scenarios
  });

  describe('valid scenario', () => {
    let groupInviteCode: string;

    test('create', async () => {
      const response = await axios.post('/groups', {
        name: 'Test BD',
        passcode: 'admin',
      });
      expect(response.status).toBe(200);
      let code = response.data.inviteCode;
      expect(typeof code).toBe('string');
      groupInviteCode = code;
    });

    let adminToken: string;
    test('admin login', async () => {
      const response = await axios.post('/groups/' + groupInviteCode, {
        name: 'Admin',
        passcode: 'admin',
      });
      expect(response.status).toBe(200);
      let tkn = response.data.token;
      expect(typeof tkn).toBe('string');
      adminToken = tkn;
    });

    test('non-admin login', async () => {
      const response = await axios.post('/groups/' + groupInviteCode, {
        name: 'User',
      });
      expect(response.status).toBe(200);
      let tkn = response.data.token;
      expect(typeof tkn).toBe('string');
    });

    test('get info', async () => {
      const response = await axios.get('/groups/my', {
        headers: {
          Authorization: 'Bearer ' + adminToken,
        },
      });
      expect(response.status).toBe(200);
      let exDt = expect(response.data);
      exDt.toHaveProperty('id');
      exDt.toHaveProperty('name', 'Test BD');
      exDt.toHaveProperty('inviteCode', groupInviteCode);
      exDt.toHaveProperty('users');
      expect(response.data.users).toHaveLength(2);
      exDt = expect(response.data.users[0]);
      exDt.toHaveProperty('name', 'Admin');
      exDt.toHaveProperty('isAdmin', true);
      exDt = expect(response.data.users[1]);
      exDt.toHaveProperty('name', 'User');
      exDt.toHaveProperty('isAdmin', false);
    });

    test('delete', async () => {
      const response = await axios.delete('/groups/my', {
        headers: {
          Authorization: 'Bearer ' + adminToken,
        },
      });
      expect(response.status).toBe(200);
    });
  });
});
