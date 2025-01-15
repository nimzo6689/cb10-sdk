import * as cheerio from 'cheerio';
import { Element } from 'domhandler';

import { User } from './models';

type CheerioAPI = cheerio.CheerioAPI;

export default class UserHtmlParser {
  /**
   * ユーザー一覧のHTMLをパース
   *
   * @param html - HTML文字列
   * @returns ユーザー情報の配列
   */
  static parseUserList(html: string): User[] {
    const $ = cheerio.load(html);
    const users: User[] = [];

    $('table.dataList tr > td:nth-child(1) a').each((_: number, elem: Element) => {
      const userInfo = UserHtmlParser.#extractUserInfo($, elem);
      if (userInfo && userInfo.uID !== 0) {
        users.push(userInfo);
      }
    });

    return users;
  }

  static #extractUserInfo($: CheerioAPI, elem: Element): User | null {
    const $elem = $(elem);
    const href = $elem.attr('href');
    const uidMatch = href?.match(/(?<=uid=)[0-9]+/i);

    if (!uidMatch) {
      return null;
    }

    return {
      uID: Number(uidMatch[0]),
      userName: $elem.text(),
    };
  }
}
