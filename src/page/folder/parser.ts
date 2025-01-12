import { CybozuOfficeSDKException } from '../../common/Errors';
import { FolderMessage } from './models';

export default class FolderHtmlParser {
  static getMessages(document: string): FolderMessage[] | null {
    try {
      const rawMessages = document.match(/(?<=MyFolderMessageView).*?(?=profileImage)/gis);

      if (!rawMessages) {
        return null;
      }

      return rawMessages.map(
        (rawHtml: string): FolderMessage => ({
          mDBID: FolderHtmlParser.#extractNumber(rawHtml, /mDBID=(\d+)/i),
          mDID: FolderHtmlParser.#extractNumber(rawHtml, /mDID=(\d+)/i),
          subject: rawHtml.match(/(?<=clip8x16.png" align=absmiddle>).*?(?=<\/a>)/i)?.[0] || '',
        })
      );
    } catch (error) {
      if (error instanceof CybozuOfficeSDKException) {
        throw error;
      }
      throw new CybozuOfficeSDKException(
        `Failed to get messages: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  static #extractNumber(html: string, pattern: RegExp): number | null {
    const match = html.match(pattern);
    return match?.[1] ? Number(match[1]) : null;
  }
}
