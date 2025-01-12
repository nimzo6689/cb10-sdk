import * as cheerio from 'cheerio';
import { Element } from 'domhandler';

import { CommentInfo, ReceiverInfo } from './models';

type CheerioAPI = cheerio.CheerioAPI;

export default class MessageHtmlParser {
  static parseComments(html: string): CommentInfo[] {
    const $ = cheerio.load(html);
    const comments: CommentInfo[] = [];

    $('#Follows > div').each((_: number, el: Element) => {
      const comment = MessageHtmlParser.#extractCommentInfo($, el);
      if (comment) {
        comments.push(comment);
      }
    });

    return comments;
  }

  static #extractCommentInfo($: CheerioAPI, element: Element): CommentInfo | null {
    const $element = $(element);
    const followIdMatch = $element.attr('id')?.match(/(?<=follow-root-)[0-9]+/i);

    if (!followIdMatch) {
      return null;
    }

    const $attachedLink = $element.find('.vr_viewContentsAttach td:first-child a');
    const attached = $attachedLink.attr('href');
    let attachedFile = undefined;
    let attachedQuery = undefined;

    if (attached) {
      const [_, file, query] = attached.split(/[/?]/);
      attachedFile = file || '';
      attachedQuery = query ? query.replace(/&amp;/gi, '&') : '';
    }

    return {
      followId: Number(followIdMatch[0]),
      userName: $element.find('.vr_followUserName').text(),
      attachedFile,
      attachedQuery,
    };
  }

  static parseReceivers(html: string): ReceiverInfo[] {
    const $ = cheerio.load(html);
    const receivers: ReceiverInfo[] = [];

    $('select[name="UID"] > option').each((_: number, el: Element) => {
      const $element = $(el);
      const uID = Number($element.val());

      if (uID !== 0) {
        receivers.push({
          uID,
          userName: $element.text(),
        });
      }
    });

    return receivers;
  }
}
