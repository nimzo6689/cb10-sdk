import { CustomURLParams } from '../../common/Transport';
import { EventRequestOptions } from './models';

const PAGE_PREFIX = 'Schedule';

export default class ScheduleRequestOptions {
  /**
   * グループメンバー取得のリクエストオプション
   *
   * @param options - グループメンバー取得オプション
   * @returns リクエストオプション
   */
  static getEvents(options: EventRequestOptions): CustomURLParams {
    return {
      page: `${PAGE_PREFIX}UserMonth`,
      UID: options.uID,
      date: `da.${options.year}.${options.month}.1`,
    };
  }
}
