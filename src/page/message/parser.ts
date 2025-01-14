import * as cheerio from 'cheerio';
import { Element } from 'domhandler';

import { Comment, Receiver } from './models';
import { FileDownloadQueryOptions } from '../file/models';

type CheerioAPI = cheerio.CheerioAPI;

export default class MessageHtmlParser {
  static parseComments(html: string): Comment[] {
    const $ = cheerio.load(html);
    const comments: Comment[] = [];

    $('#Follows > div').each((_: number, el: Element) => {
      const comment = MessageHtmlParser.#extractCommentInfo($, el);
      if (comment) {
        comments.push(comment);
      }
    });

    return comments;
  }

  static #extractCommentInfo($: CheerioAPI, element: Element): Comment | null {
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
      const attachedQueryStr = query ? query.replace(/&amp;/gi, '&') : '';
      if (attachedQueryStr) {
        attachedQuery = Object.fromEntries(
          new URLSearchParams(attachedQueryStr)
        ) as unknown as FileDownloadQueryOptions;
      }
    }

    return {
      followId: Number(followIdMatch[0]),
      userName: $element.find('.vr_followUserName').text(),
      attachedFile,
      attachedQuery,
    };
  }

  static parseReceivers(html: string): Receiver[] {
    const $ = cheerio.load(html);
    const receivers: Receiver[] = [];

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
