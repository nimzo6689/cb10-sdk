import Transport from '../../common/Transport';
import { EventRequestOptions, Event } from './models';
import ScheduleHtmlParser from './parser';
import ScheduleRequestOptions from './reqests';

/**
 * Cybozu Office 10 のスケジュール機能にアクセスするためのクライアントクラス
 *
 * このクラスはスケジュール情報の取得などの機能を提供します。
 */
export default class ScheduleClient {
  constructor(private readonly transport: Transport) {}

  async getEvents(options: EventRequestOptions): Promise<Event[]> {
    const query = ScheduleRequestOptions.getEvents(options);
    const html = await this.transport.get({ query });
    return ScheduleHtmlParser.parseUserMonth(html);
  }
}
