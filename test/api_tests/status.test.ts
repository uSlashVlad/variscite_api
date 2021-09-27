import { axios } from '../utils';

describe('/status', () => {
  test('status is OK', async () => {
    const response = await axios.get('/status');
    expect(response.status).toBe(200);
    expect(response.data).toStrictEqual({ text: 'OK!' });
  });
});
