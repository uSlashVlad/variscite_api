import { axios, setBaseUrl, axiosStatusError } from '../utils';

setBaseUrl();

describe('/groups', () => {
  describe('invalid scenario', () => {
    describe('creation', () => {
      test('invalid input (~name~)', async () => {
        expect.assertions(1);
        try {
          await axios.post('/groups', {
            ame: 'Good friends',
            passcode: 'qwerty',
          });
        } catch (err) {
          expect((err as Error).message).toBe(axiosStatusError(400));
        }
      });

      test('invalid input (~passcode~)', async () => {
        expect.assertions(1);
        try {
          await axios.post('/groups', {
            name: 'Good friends',
            asscode: 'qwerty',
          });
        } catch (err) {
          expect((err as Error).message).toBe(axiosStatusError(400));
        }
      });

      test('invalid input (no data)', async () => {
        expect.assertions(1);
        try {
          await axios.post('/groups', {});
        } catch (err) {
          expect((err as Error).message).toBe(axiosStatusError(400));
        }
      });
    });

    describe('login', () => {
      test('invalid invite code (short)', async () => {
        expect.assertions(1);
        try {
          await axios.post('/groups/UYMe78B653NTKZ', {
            name: 'TEST group',
            passcode: '123',
          });
        } catch (err) {
          expect((err as Error).message).toBe(axiosStatusError(404));
        }
      });

      test('invalid invite code (long)', async () => {
        expect.assertions(1);
        try {
          await axios.post('/groups/UYMe78B653NTKZZZ', {
            name: 'TEST group',
            passcode: '123',
          });
        } catch (err) {
          expect((err as Error).message).toBe(axiosStatusError(404));
        }
      });

      test('invalid invite code (incorrect)', async () => {
        expect.assertions(1);
        try {
          await axios.post('/groups/123456789012345', {
            name: 'TEST group',
            passcode: '123',
          });
        } catch (err) {
          expect((err as Error).message).toBe(axiosStatusError(404));
        }
      });

      test('invalid input (~name~)', async () => {
        expect.assertions(1);
        try {
          await axios.post('/groups/UYMe78B653NTKZg', {
            ame: 'TEST group',
            passcode: '123',
          });
        } catch (err) {
          expect((err as Error).message).toBe(axiosStatusError(400));
        }
      });

      test('invalid input (no data)', async () => {
        expect.assertions(1);
        try {
          await axios.post('/groups/UYMe78B653NTKZg', {});
        } catch (err) {
          expect((err as Error).message).toBe(axiosStatusError(400));
        }
      });

      // TODO invalid name test

      test('invalid input (invalid passcode)', async () => {
        expect.assertions(1);
        try {
          await axios.post('/groups/UYMe78B653NTKZg', {
            name: 'TEST group',
            passcode: '000',
          });
        } catch (err) {
          expect((err as Error).message).toBe(axiosStatusError(401));
        }
      });
    });

    const adminTokenWithInvalidSign =
      'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJnIjoiZmE5MWJiMmItYjYyMy00Y2Y2LWI4ODYtMTYxNTA5ODNhYzNlIiwidSI6IjczZjUxM2Y4LTNlN2YtNGMyYS05YjUzLTFjYzJiY2ZjZDhmMyIsImEiOnRydWUsImlhdCI6MTYzMjQ3OTUxMn0.cEC22ZUvfCBFIGzAdyfxZTzyHeEFTx1qrW-LavYUU6ftdzKC-NxgGU0nbfSDRMuw-Ivz3P8aIwUk-fY2WteUFTlFCFdeaZFmOT9l8_R5ECTWcXVTK9eQLlGdQ0fR2jqZKTiKHsVR9Mgo7GcM6I6hjjPOCc93hw5onxpQq8PM2tQPc7cV1jnrFBKIUYyyvEWKbov2a1fbMfzM-CyDz0U71RmwkdQjmcw4bHvKDyWeyeoRTYU-9Nm3DAphvjDLj5qedYmeU9J1Gs9pSqGD5uyFi6p8vElYEgz-o8bbIQRywtkyRxKN-e0klvwmhp3Fi0UJlYEKc-d7gfd_npW8N43G';
    const adminTokenWithInvalidHeader =
      'yJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJnIjoiZmE5MWJiMmItYjYyMy00Y2Y2LWI4ODYtMTYxNTA5ODNhYzNlIiwidSI6IjczZjUxM2Y4LTNlN2YtNGMyYS05YjUzLTFjYzJiY2ZjZDhmMyIsImEiOnRydWUsImlhdCI6MTYzMjQ3OTUxMn0.cEC22ZUvfCBFIGzAdyfxZTzyHeEFTx1qrW-LavYUU6ftdzKC-NxgGU0nbfSDRMuw-Ivz3P8aIwUk-fY2WteUFTlFCFdeaZFmOT9l8_R5ECTWcXVTK9eQLlGdQ0fR2jqZKTiKHsVR9Mgo7GcM6I6hjjPOCc93hw5onxpQq8PM2tQPc7cV1jnrFBKIUYyyvEWKbov2a1fbMfzM-CyDz0U71RmwkdQjmcw4bHvKDyWeyeoRTYU-9Nm3DAphvjDLj5qedYmeU9J1Gs9pSqGD5uyFi6p8vElYEgz-o8bbIQRywtkyRxKN-e0klvwmhp3Fi0UJlYEKc-d7gfd_npW8N43GoA';
    const adminTokenWithInvalidPayload =
      'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.yJnIjoiZmE5MWJiMmItYjYyMy00Y2Y2LWI4ODYtMTYxNTA5ODNhYzNlIiwidSI6IjczZjUxM2Y4LTNlN2YtNGMyYS05YjUzLTFjYzJiY2ZjZDhmMyIsImEiOnRydWUsImlhdCI6MTYzMjQ3OTUxMn0.cEC22ZUvfCBFIGzAdyfxZTzyHeEFTx1qrW-LavYUU6ftdzKC-NxgGU0nbfSDRMuw-Ivz3P8aIwUk-fY2WteUFTlFCFdeaZFmOT9l8_R5ECTWcXVTK9eQLlGdQ0fR2jqZKTiKHsVR9Mgo7GcM6I6hjjPOCc93hw5onxpQq8PM2tQPc7cV1jnrFBKIUYyyvEWKbov2a1fbMfzM-CyDz0U71RmwkdQjmcw4bHvKDyWeyeoRTYU-9Nm3DAphvjDLj5qedYmeU9J1Gs9pSqGD5uyFi6p8vElYEgz-o8bbIQRywtkyRxKN-e0klvwmhp3Fi0UJlYEKc-d7gfd_npW8N43GoA';
    const tokenWithIncorrectGroup =
      'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJnIjoiMDAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDAwMDAwMDAwIiwidSI6IjczZjUxM2Y4LTNlN2YtNGMyYS05YjUzLTFjYzJiY2ZjZDhmMyIsImEiOnRydWUsImlhdCI6MTYzMjQ3OTUxMn0.lolBqQFpHYOBaxqW1gDNnlDmmc1E6hkgFsxvF5VkVQXAgDYhqWUfed_wU-Q55FVDBpXNQuW9pMYkZ-eSmzSf2gND41OJipzZbhOKQmcimjeGAmFJ0F1YlcToVOAQISND9Yz3hvQ0WoWNXy40p2lN1gaPIrmWJc0-9cPQaih5dUv-MGzu_NZh5K8ZcPB8ac9Jh-d1ZUlqYSAZ_gOSnbSxHi0BXWs0CsEFDP2yCY88w2Tzzw3O2bpo25O5yqIwxkquzniurm6oX7NTz6lbW0U4uLOAG7ywnoZJZ6WIQez8B1734U5Dq5NhLsgtLRnXf6YaMLCvCtNa3rLstJULUaYN1Q';
    const tokenWithIncorrectUser =
      'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJnIjoiZmE5MWJiMmItYjYyMy00Y2Y2LWI4ODYtMTYxNTA5ODNhYzNlIiwidSI6IjAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMCIsImEiOnRydWUsImlhdCI6MTYzMjQ3OTUxMn0.HuEWQph4505Du6KADKKaWBa7o8-UiPcw8yh9SvHORYskFozfHxMIohMzqsWEdvnxegrzBUEYNtkHqgMHMQrPyUulhiJlXEiX06wPS5OMBM1wa6VY1Vc09AzSyyf1OoM3Gt5hh1nv5I1Dtb4lxxlCXXaHknv8hPgJFwojV1ADj4baugUR82crXLGZAIy5qzLyM9A8IIhqQ3tAn7y6JtYnOnj4vT-vJQk2-o23wvcvjVEDYONReeiSeILN8a7bp3HEAYgZJl-zF_1UzgkdWPywpUM9Qp04forWOiSwXJ4TZsZK-jqIx-Os7YRp1LkBmuGb6tujtgs5UoaSoGB3yQdtKg';
    const tokenWithoutData =
      'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MzI0Nzk1MTJ9.hPJ7eflTIxE0NwDi4I6v_TO3p0TKlOIbj1XZDp9a_U7GOhBiBmUzcoWTKtaXaOvMEqLg1ba52wcJogyCFNzpM_tSY7jn7fa5zTz2uJ0HLf1ePxjUmOeHYPdfG5HQk_RJorl3VthP3blrOUf3i3eSWFo0c8JnqD2VdhX9k3mVhH033qqS57cvTCMYdX53Wce-rbyduzYtFNlqbPQTYmqdRDrkNvaL17SFs7G7_FcBUgKkrdgsadIzXz5xwqX0LyDcu097rWat41YOROl4NkjP8G_5by7iny1UrCJUO9xXHjSDZXD6zru_-Luc9SEv9_DshpYMgLYeLNMjFS-aaWMxdA';
    const userToken =
      'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJnIjoiZmE5MWJiMmItYjYyMy00Y2Y2LWI4ODYtMTYxNTA5ODNhYzNlIiwidSI6IjRjZjlkNmYxLWQyZTEtNGFlNS1iNmI4LTgwNzI2OGNjZmY0MyIsImEiOmZhbHNlLCJpYXQiOjE2MzI0Nzk1NTB9.wFYNJPne-4dFDeGohh46-k1AEHQ92NcHBRnpBNHUq9twmtpYXJyJ-dt5FZISJseHnZl7XSlVAw1c24_1CzRjBg4sR-_itZSJAAXkXI7acAtHl9B3mK-Fz-vlgDmcKlzfT53rhMxUKWinoygKmudM_UkVeApp3Kjyf4vX0iY14EuOs9rQMYQvIiFx3VR4IfjmLhrjUg3fjU0Yt7T84YUDoleRgNCymUnuGxjNqgdpgL1rokFmdRam3bKsGVQCAO-nbSRJKhk_B1wGTgnEYvGjMCz_ptF5zzNf3mAUgcRKfoXOKVlBWEO9UF7ag3l1i4PexwbbdHBYhjEWhWM5XTEtew';

    describe('get info', () => {
      test('no token', async () => {
        expect.assertions(1);
        try {
          await axios.get('/groups/my');
        } catch (err) {
          expect((err as Error).message).toBe(
            'Request failed with status code 401'
          );
        }
      });

      test('invalid token sign', async () => {
        expect.assertions(1);
        try {
          await axios.get('/groups/my', {
            headers: {
              Authorization: 'Bearer ' + adminTokenWithInvalidSign,
            },
          });
        } catch (err) {
          expect((err as Error).message).toBe(
            'Request failed with status code 401'
          );
        }
      });

      test('invalid token header', async () => {
        expect.assertions(1);
        try {
          await axios.get('/groups/my', {
            headers: {
              Authorization: 'Bearer ' + adminTokenWithInvalidHeader,
            },
          });
        } catch (err) {
          expect((err as Error).message).toBe(
            'Request failed with status code 401'
          );
        }
      });

      test('invalid token payload', async () => {
        expect.assertions(1);
        try {
          await axios.get('/groups/my', {
            headers: {
              Authorization: 'Bearer ' + adminTokenWithInvalidPayload,
            },
          });
        } catch (err) {
          expect((err as Error).message).toBe(
            'Request failed with status code 401'
          );
        }
      });

      test('invalid token data (incorrect group)', async () => {
        expect.assertions(1);
        try {
          await axios.get('/groups/my', {
            headers: {
              Authorization: 'Bearer ' + tokenWithIncorrectGroup,
            },
          });
        } catch (err) {
          expect((err as Error).message).toBe(
            'Request failed with status code 404'
          );
        }
      });

      test('invalid token data (incorrect user)', async () => {
        expect.assertions(1);
        try {
          await axios.get('/groups/my', {
            headers: {
              Authorization: 'Bearer ' + tokenWithIncorrectUser,
            },
          });
        } catch (err) {
          expect((err as Error).message).toBe(
            'Request failed with status code 404'
          );
        }
      });

      test('invalid token data (no data)', async () => {
        expect.assertions(1);
        try {
          await axios.get('/groups/my', {
            headers: {
              Authorization: 'Bearer ' + tokenWithoutData,
            },
          });
        } catch (err) {
          expect((err as Error).message).toBe(
            'Request failed with status code 404'
          );
        }
      });
    });

    describe('get users', () => {
      test('no token', async () => {
        expect.assertions(1);
        try {
          await axios.get('/groups/my/users');
        } catch (err) {
          expect((err as Error).message).toBe(axiosStatusError(401));
        }
      });

      test('invalid token sign', async () => {
        expect.assertions(1);
        try {
          await axios.get('/groups/my/users', {
            headers: {
              Authorization: 'Bearer ' + adminTokenWithInvalidSign,
            },
          });
        } catch (err) {
          expect((err as Error).message).toBe(axiosStatusError(401));
        }
      });

      test('invalid token header', async () => {
        expect.assertions(1);
        try {
          await axios.get('/groups/my/users', {
            headers: {
              Authorization: 'Bearer ' + adminTokenWithInvalidHeader,
            },
          });
        } catch (err) {
          expect((err as Error).message).toBe(axiosStatusError(401));
        }
      });

      test('invalid token payload', async () => {
        expect.assertions(1);
        try {
          await axios.get('/groups/my/users', {
            headers: {
              Authorization: 'Bearer ' + adminTokenWithInvalidPayload,
            },
          });
        } catch (err) {
          expect((err as Error).message).toBe(axiosStatusError(401));
        }
      });

      test('invalid token data (incorrect group)', async () => {
        expect.assertions(1);
        try {
          await axios.get('/groups/my/users', {
            headers: {
              Authorization: 'Bearer ' + tokenWithIncorrectGroup,
            },
          });
        } catch (err) {
          expect((err as Error).message).toBe(axiosStatusError(404));
        }
      });

      test('invalid token data (incorrect user)', async () => {
        expect.assertions(1);
        try {
          await axios.get('/groups/my/users', {
            headers: {
              Authorization: 'Bearer ' + tokenWithIncorrectUser,
            },
          });
        } catch (err) {
          expect((err as Error).message).toBe(axiosStatusError(404));
        }
      });

      test('invalid token data (no data)', async () => {
        expect.assertions(1);
        try {
          await axios.get('/groups/my/users', {
            headers: {
              Authorization: 'Bearer ' + tokenWithoutData,
            },
          });
        } catch (err) {
          expect((err as Error).message).toBe(axiosStatusError(404));
        }
      });
    });

    describe('delete group', () => {
      test('no token', async () => {
        expect.assertions(1);
        try {
          await axios.delete('/groups/my');
        } catch (err) {
          expect((err as Error).message).toBe(axiosStatusError(401));
        }
      });

      test('invalid token sign', async () => {
        expect.assertions(1);
        try {
          await axios.delete('/groups/my', {
            headers: {
              Authorization: 'Bearer ' + adminTokenWithInvalidSign,
            },
          });
        } catch (err) {
          expect((err as Error).message).toBe(axiosStatusError(401));
        }
      });

      test('invalid token header', async () => {
        expect.assertions(1);
        try {
          await axios.delete('/groups/my', {
            headers: {
              Authorization: 'Bearer ' + adminTokenWithInvalidHeader,
            },
          });
        } catch (err) {
          expect((err as Error).message).toBe(axiosStatusError(401));
        }
      });

      test('invalid token payload', async () => {
        expect.assertions(1);
        try {
          await axios.delete('/groups/my', {
            headers: {
              Authorization: 'Bearer ' + adminTokenWithInvalidPayload,
            },
          });
        } catch (err) {
          expect((err as Error).message).toBe(axiosStatusError(401));
        }
      });

      test('invalid token data (incorrect group)', async () => {
        expect.assertions(1);
        try {
          await axios.delete('/groups/my', {
            headers: {
              Authorization: 'Bearer ' + tokenWithIncorrectGroup,
            },
          });
        } catch (err) {
          expect((err as Error).message).toBe(axiosStatusError(404));
        }
      });

      test('invalid token data (incorrect user)', async () => {
        expect.assertions(1);
        try {
          await axios.delete('/groups/my', {
            headers: {
              Authorization: 'Bearer ' + tokenWithIncorrectUser,
            },
          });
        } catch (err) {
          expect((err as Error).message).toBe(axiosStatusError(404));
        }
      });

      test('invalid token data (no data)', async () => {
        expect.assertions(1);
        try {
          await axios.delete('/groups/my', {
            headers: {
              Authorization: 'Bearer ' + tokenWithoutData,
            },
          });
        } catch (err) {
          expect((err as Error).message).toBe(axiosStatusError(404));
        }
      });

      test('try to delete without permission', async () => {
        expect.assertions(1);
        try {
          await axios.delete('/groups/my', {
            headers: {
              Authorization: 'Bearer ' + userToken,
            },
          });
        } catch (err) {
          expect((err as Error).message).toBe(axiosStatusError(403));
        }
      });
    });
  });

  describe('valid scenario', () => {
    let groupInviteCode: string;

    test('create', async () => {
      const response = await axios.post('/groups', {
        name: 'Test group for tests',
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
      exDt.toHaveProperty('name', 'Test group for tests');
      exDt.toHaveProperty('inviteCode', groupInviteCode);
    });

    test('get users', async () => {
      const response = await axios.get('/groups/my/users', {
        headers: {
          Authorization: 'Bearer ' + adminToken,
        },
      });
      expect(response.status).toBe(200);
      expect(response.data).toHaveLength(2);
      let exDt = expect(response.data[0]);
      exDt.toHaveProperty('name', 'Admin');
      exDt.toHaveProperty('isAdmin', true);
      exDt = expect(response.data[1]);
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
