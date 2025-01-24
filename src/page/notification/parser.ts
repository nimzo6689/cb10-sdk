import * as cheerio from 'cheerio';
import { Notification, Message, Comment } from './models';

export default class NotificationHtmlParser {
  static parseContent(html: string): Notification {
    const $ = cheerio.load(html);
    const messages: Message[] = [];

    $('.notificationCategory.notificationCategoryMessage .notificationRow').each((_, element) => {
      const $el = $(element);

      const href = $el.find('.notificationSubject a').attr('href') || '';
      const urlParams = new URLSearchParams(href.split('?')[1] || '');
      const mDBID = parseInt(urlParams.get('mDBID') || '0');
      const mDID = parseInt(urlParams.get('mDID') || '0');

      const subject = $el
        .find('.notificationSubject a')
        .text()
        .replace(/^.*?\] /, '')
        .trim();
      const mainDiv = $el.find('.notificationMain');

      // Extract content from messageText or the first notificationBodyText
      const content = mainDiv.find('.notificationBodyText div#messageText tt').first().text().trim();

      // Extract creator info
      const addressItems = mainDiv.find('.notificationAddressItem');
      let createdBy = '',
        updatedBy = '',
        createdAt = '',
        updatedAt = '';

      addressItems.each((_, item) => {
        const $item = $(item);
        const label = $item.find('.notificationAddressLabel').text().trim();
        const text = $item
          .find('.notificationAddressText')
          .contents()
          .filter((_, node) => node.type === 'text')
          .text()
          .trim();

        switch (label) {
          case '差出人：':
            createdBy = text;
            break;
          case '最終更新者：':
            updatedBy = text;
            break;
        }

        // Get timestamps
        const timeText = $item.find('.notificationAddressText').last().text().trim();
        if (label === '差出人：') createdAt = timeText;
        if (label === '最終更新者：') updatedAt = timeText;
      });

      // If no updatedBy/updatedAt, use created values
      if (!updatedBy) updatedBy = createdBy;
      if (!updatedAt) updatedAt = createdAt;

      // Parse comments
      const comments: Comment[] = [];
      $el.find('.vr_follow').each((_, commentEl) => {
        const $comment = $(commentEl);
        const followIdMatch = $comment.attr('id')?.match(/\d+$/) || [];
        const followId = parseInt(followIdMatch[0] || '0');
        const commentCreatedBy = $comment.find('.vr_followUserName').text().trim();
        const commentCreatedAt = $comment.find('.vr_followTime').text().trim();
        const commentContent = $comment.find('.vr_followContents tt').text().trim().replace(/ /g, ' ');
        const commentHasUpdated = $comment.hasClass('updateContents');

        comments.push({
          followId,
          createdBy: commentCreatedBy,
          createdAt: commentCreatedAt,
          ...(commentContent ? { content: commentContent } : { body: commentContent }),
          hasUpdated: commentHasUpdated,
        });
      });

      messages.push({
        mDBID,
        mDID,
        body: {
          subject,
          content,
        },
        comments,
      });
    });

    return { messages: messages.filter(msg => msg.body.subject) };
  }
}
