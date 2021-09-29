import { axios, axiosStatusError } from '../utils';

describe('invalid scenario', () => {
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
    'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJnIjoiODU3MmU5MWQtM2U0Yy00NmYxLWJkNDEtZWUxMTUxMWI1ZGNlIiwidSI6IjdhYjExNTRhLWJlN2ItNDcwOS1hNjE0LTYxZWQ3NGQ0Yjc0ZSIsImEiOmZhbHNlLCJpYXQiOjE2MzI3NjEwOTh9.YsKjLGHEUwC54SAixJKiVVhMagyhTaI0hiihjAQL7FIbLAc0GGZX4DrEe7qcnqFXd9ckpyYURDxfs5Evmd0dsBCjKj31nbQCOGxXPJfgLWCzGD9aEAMV38a79np19yRWpz9MbGo5Y1Ub8XqmNSc3WXU3gtHMv5DLPmxQqHH_hsPUdk9d8IJuPBuTVTzfXQ5X1rJh6YEPcnaTGNaJ2pSOBjktnNCS6Jk_dYmABtBTzBwj4hKrdCTxQLjyYBo3k1u6TyyU4i5jE6X-iawfD0DTgI-GPMW_lcDlN5UMxNN3-y6KjOggqrSPec9-eqN0wYW2V84O8iprph4ET3ncj6Djvw';
  const adminToken =
    'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJnIjoiODU3MmU5MWQtM2U0Yy00NmYxLWJkNDEtZWUxMTUxMWI1ZGNlIiwidSI6IjAwNjU5ZjQ3LTZkZjgtNDA4Yy1hMmU1LTJkMGEzM2JjMzE1ZCIsImEiOnRydWUsImlhdCI6MTYzMjc1OTM4NX0.R8KZGVNfpBuezxTy98-z5zH-JS-wkmyXIHF4RO_77d1J2IuaNld2uvzV_GEYn8kdFOB2prbJOROrDvlIgADAByGGaRtfCwE7BbcezDCPs3ERX8m5Oe8kaRlgwu72elgJcatRpW9Fr_KkLt23dUeuBrbUl8Vc06uAUI36Nu2RhemjNz7qvH-L2FURnyckguL-Hqf601nCR9bNr731smCn_1Yq5X6LYh6ghrflcjqBsAdUv4VW-Qo68Q76axxzZgjTDZRY57GbLyAfNZrAlOaPG_FGK_Vb9X4nk8mQD7CRVfT12fC4VVn-Q7kv2tQOcceGh7eqQUkT8woo53N3L1HIng';

  describe('get structures', () => {
    test('no token', async () => {
      expect.assertions(1);
      try {
        await axios.get('/structures');
      } catch (err) {
        expect((err as Error).message).toBe(axiosStatusError(401));
      }
    });

    test('invalid token sign', async () => {
      expect.assertions(1);
      try {
        await axios.get('/structures', {
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
        await axios.get('/structures', {
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
        await axios.get('/structures', {
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
        await axios.get('/structures', {
          headers: {
            Authorization: 'Bearer ' + tokenWithIncorrectGroup,
          },
        });
      } catch (err) {
        expect((err as Error).message).toBe(axiosStatusError(401));
      }
    });

    test('invalid token data (incorrect user)', async () => {
      expect.assertions(1);
      try {
        await axios.get('/structures', {
          headers: {
            Authorization: 'Bearer ' + tokenWithIncorrectUser,
          },
        });
      } catch (err) {
        expect((err as Error).message).toBe(axiosStatusError(401));
      }
    });

    test('invalid token data (no data)', async () => {
      expect.assertions(1);
      try {
        await axios.get('/structures', {
          headers: {
            Authorization: 'Bearer ' + tokenWithoutData,
          },
        });
      } catch (err) {
        expect((err as Error).message).toBe(axiosStatusError(401));
      }
    });
  });

  const geoPoint = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Point',
          coordinates: [37.47886061668396, 55.67080239474214],
        },
      },
    ],
  };
  describe('add new structure', () => {
    test('no token', async () => {
      expect.assertions(1);
      try {
        await axios.post('/structures', geoPoint);
      } catch (err) {
        expect((err as Error).message).toBe(axiosStatusError(401));
      }
    });

    test('invalid token sign', async () => {
      expect.assertions(1);
      try {
        await axios.post('/structures', geoPoint, {
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
        await axios.post('/structures', geoPoint, {
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
        await axios.post('/structures', geoPoint, {
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
        await axios.post('/structures', geoPoint, {
          headers: {
            Authorization: 'Bearer ' + tokenWithIncorrectGroup,
          },
        });
      } catch (err) {
        expect((err as Error).message).toBe(axiosStatusError(401));
      }
    });

    test('invalid token data (incorrect user)', async () => {
      expect.assertions(1);
      try {
        await axios.post('/structures', geoPoint, {
          headers: {
            Authorization: 'Bearer ' + tokenWithIncorrectUser,
          },
        });
      } catch (err) {
        expect((err as Error).message).toBe(axiosStatusError(401));
      }
    });

    test('invalid token data (no data)', async () => {
      expect.assertions(1);
      try {
        await axios.post('/structures', geoPoint, {
          headers: {
            Authorization: 'Bearer ' + tokenWithoutData,
          },
        });
      } catch (err) {
        expect((err as Error).message).toBe(axiosStatusError(401));
      }
    });

    test('invalid request body', async () => {
      expect.assertions(1);
      try {
        await axios.post(
          '/structures',
          {},
          {
            headers: {
              Authorization: 'Bearer ' + adminToken,
            },
          }
        );
      } catch (err) {
        expect((err as Error).message).toBe(axiosStatusError(400));
      }
    });
  });

  const structId = '284c0101-38b6-4b6c-86a2-ea95fffd3c3a';

  describe('get structure info', () => {
    test('no token', async () => {
      expect.assertions(1);
      try {
        await axios.get('/structures/' + structId);
      } catch (err) {
        expect((err as Error).message).toBe(axiosStatusError(401));
      }
    });

    test('invalid token sign', async () => {
      expect.assertions(1);
      try {
        await axios.get('/structures/' + structId, {
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
        await axios.get('/structures/' + structId, {
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
        await axios.get('/structures/' + structId, {
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
        await axios.get('/structures/' + structId, {
          headers: {
            Authorization: 'Bearer ' + tokenWithIncorrectGroup,
          },
        });
      } catch (err) {
        expect((err as Error).message).toBe(axiosStatusError(401));
      }
    });

    test('invalid token data (incorrect user)', async () => {
      expect.assertions(1);
      try {
        await axios.get('/structures/' + structId, {
          headers: {
            Authorization: 'Bearer ' + tokenWithIncorrectUser,
          },
        });
      } catch (err) {
        expect((err as Error).message).toBe(axiosStatusError(401));
      }
    });

    test('invalid token data (no data)', async () => {
      expect.assertions(1);
      try {
        await axios.get('/structures/' + structId, {
          headers: {
            Authorization: 'Bearer ' + tokenWithoutData,
          },
        });
      } catch (err) {
        expect((err as Error).message).toBe(axiosStatusError(401));
      }
    });
  });

  describe('edit structure', () => {
    test('no token', async () => {
      expect.assertions(1);
      try {
        await axios.put('/structures/' + structId, geoPoint);
      } catch (err) {
        expect((err as Error).message).toBe(axiosStatusError(401));
      }
    });

    test('invalid token sign', async () => {
      expect.assertions(1);
      try {
        await axios.put('/structures/' + structId, geoPoint, {
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
        await axios.put('/structures/' + structId, geoPoint, {
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
        await axios.put('/structures/' + structId, geoPoint, {
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
        await axios.put('/structures/' + structId, geoPoint, {
          headers: {
            Authorization: 'Bearer ' + tokenWithIncorrectGroup,
          },
        });
      } catch (err) {
        expect((err as Error).message).toBe(axiosStatusError(401));
      }
    });

    test('invalid token data (incorrect user)', async () => {
      expect.assertions(1);
      try {
        await axios.put('/structures/' + structId, geoPoint, {
          headers: {
            Authorization: 'Bearer ' + tokenWithIncorrectUser,
          },
        });
      } catch (err) {
        expect((err as Error).message).toBe(axiosStatusError(401));
      }
    });

    test('invalid token data (no data)', async () => {
      expect.assertions(1);
      try {
        await axios.put('/structures/' + structId, geoPoint, {
          headers: {
            Authorization: 'Bearer ' + tokenWithoutData,
          },
        });
      } catch (err) {
        expect((err as Error).message).toBe(axiosStatusError(401));
      }
    });

    test('invalid request body', async () => {
      expect.assertions(1);
      try {
        await axios.put(
          '/structures/' + structId,
          {},
          {
            headers: {
              Authorization: 'Bearer ' + adminToken,
            },
          }
        );
      } catch (err) {
        expect((err as Error).message).toBe(axiosStatusError(400));
      }
    });

    test('different user without admin permissions', async () => {
      expect.assertions(1);
      try {
        await axios.put(
          '/structures/' + structId,
          geoPoint,
          {
            headers: {
              Authorization: 'Bearer ' + userToken,
            },
          }
        );
      } catch (err) {
        expect((err as Error).message).toBe(axiosStatusError(403));
      }
    });
  });

  describe('delete structure', () => {
    test('no token', async () => {
      expect.assertions(1);
      try {
        await axios.delete('/structures/' + structId);
      } catch (err) {
        expect((err as Error).message).toBe(axiosStatusError(401));
      }
    });

    test('invalid token sign', async () => {
      expect.assertions(1);
      try {
        await axios.delete('/structures/' + structId, {
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
        await axios.delete('/structures/' + structId, {
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
        await axios.delete('/structures/' + structId, {
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
        await axios.delete('/structures/' + structId, {
          headers: {
            Authorization: 'Bearer ' + tokenWithIncorrectGroup,
          },
        });
      } catch (err) {
        expect((err as Error).message).toBe(axiosStatusError(401));
      }
    });

    test('invalid token data (incorrect user)', async () => {
      expect.assertions(1);
      try {
        await axios.delete('/structures/' + structId, {
          headers: {
            Authorization: 'Bearer ' + tokenWithIncorrectUser,
          },
        });
      } catch (err) {
        expect((err as Error).message).toBe(axiosStatusError(401));
      }
    });

    test('invalid token data (no data)', async () => {
      expect.assertions(1);
      try {
        await axios.delete('/structures/' + structId, {
          headers: {
            Authorization: 'Bearer ' + tokenWithoutData,
          },
        });
      } catch (err) {
        expect((err as Error).message).toBe(axiosStatusError(401));
      }
    });

    test('user without permissions', async () => {
      expect.assertions(1);
      try {
        await axios.delete('/structures/' + structId, {
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
  const token =
    'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJnIjoiODU3MmU5MWQtM2U0Yy00NmYxLWJkNDEtZWUxMTUxMWI1ZGNlIiwidSI6IjAwNjU5ZjQ3LTZkZjgtNDA4Yy1hMmU1LTJkMGEzM2JjMzE1ZCIsImEiOnRydWUsImlhdCI6MTYzMjc1OTM4NX0.R8KZGVNfpBuezxTy98-z5zH-JS-wkmyXIHF4RO_77d1J2IuaNld2uvzV_GEYn8kdFOB2prbJOROrDvlIgADAByGGaRtfCwE7BbcezDCPs3ERX8m5Oe8kaRlgwu72elgJcatRpW9Fr_KkLt23dUeuBrbUl8Vc06uAUI36Nu2RhemjNz7qvH-L2FURnyckguL-Hqf601nCR9bNr731smCn_1Yq5X6LYh6ghrflcjqBsAdUv4VW-Qo68Q76axxzZgjTDZRY57GbLyAfNZrAlOaPG_FGK_Vb9X4nk8mQD7CRVfT12fC4VVn-Q7kv2tQOcceGh7eqQUkT8woo53N3L1HIng';
  const geoPoint = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Point',
          coordinates: [37.47886061668396, 55.67080239474214],
        },
      },
    ],
  };
  const geo2Points = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Point',
          coordinates: [37.47886061668396, 55.67080239474214],
        },
      },
      {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Point',
          coordinates: [37.47727811336517, 55.67036070615934],
        },
      },
    ],
  };
  let pointId: string;

  test('create point', async () => {
    const response = await axios.post('/structures', geoPoint, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });
    expect(response.status).toBe(200);
    pointId = response.data.id;
    const exDt = expect(response.data);
    exDt.toHaveProperty('id');
    exDt.toHaveProperty('user', '00659f47-6df8-408c-a2e5-2d0a33bc315d');
    exDt.toHaveProperty('struct', geoPoint);
  });

  test('get point info', async () => {
    const response = await axios.get('/structures/' + pointId, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });
    expect(response.status).toBe(200);
    pointId = response.data.id;
    const exDt = expect(response.data);
    exDt.toHaveProperty('id');
    exDt.toHaveProperty('user', '00659f47-6df8-408c-a2e5-2d0a33bc315d');
    exDt.toHaveProperty('struct', geoPoint);
  });

  test('edit point', async () => {
    const response = await axios.put('/structures/' + pointId, geo2Points, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });
    expect(response.status).toBe(200);
    pointId = response.data.id;
    const exDt = expect(response.data);
    exDt.toHaveProperty('id');
    exDt.toHaveProperty('user', '00659f47-6df8-408c-a2e5-2d0a33bc315d');
    exDt.toHaveProperty('struct', geo2Points);
  });

  test('get point list', async () => {
    const response = await axios.get('/structures', {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });
    expect(response.status).toBe(200);
    const arr = response.data as any[];
    const exDt = expect(arr[arr.length - 1]);
    exDt.toHaveProperty('id');
    exDt.toHaveProperty('user', '00659f47-6df8-408c-a2e5-2d0a33bc315d');
    exDt.toHaveProperty('struct', geo2Points);
  });

  test('delete point', async () => {
    const response = await axios.delete('/structures/' + pointId, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });
    expect(response.status).toBe(200);
  });
});
