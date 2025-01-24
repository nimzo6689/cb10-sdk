import { AxiosAdapter, AxiosRequestConfig } from 'axios';
import { CybozuOffice } from '../../src/index';
import { defaultCB10Options, scheduleUserMonthHtml, normalResponse } from '../utils';

describe('スケジュール', () => {
  it('個人月のスケジュールを取得', async () => {
    const adapter: AxiosAdapter = function (config: AxiosRequestConfig) {
      if (config.params.get('page') === 'ScheduleUserMonth') {
        return new Promise(resolve => resolve({ ...normalResponse, data: scheduleUserMonthHtml }));
      }
      throw new Error(`Unknown request.`);
    };
    const client = new CybozuOffice({ ...defaultCB10Options, axiosRequestConfig: { adapter } });

    const entries = await client.schedule.getEvents({ year: 2025, month: 1, uID: 17 });
    const actual = entries.filter(event => event.day === 1 || event.day === 2);
    const expected = [
      { year: 2025, month: 1, day: 1, start: '11:00', end: '12:00', title: '次期製品プロジェクト打合せ' },
      { year: 2025, month: 1, day: 1, start: '17:00', end: '19:00', title: '予定あり' },
      { year: 2025, month: 1, day: 2, start: '15:00', end: '16:00', title: 'すずき製作所' },
    ];

    expect(JSON.stringify(actual)).toBe(JSON.stringify(expected));
  });
});
