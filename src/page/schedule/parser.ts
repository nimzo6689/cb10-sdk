import * as cheerio from 'cheerio';
import { Event } from './models';

export default class ScheduleHtmlParser {
  static parseUserMonth(html: string): Event[] {
    const $ = cheerio.load(html);
    const events: Event[] = [];

    const dateTitle = $('#schedule_um__date_title b').text().trim();
    const [year, month] = dateTitle
      .match(/(\d{4})\s*年\s*(\d{1,2})\s*月/)!
      .slice(1)
      .map(Number);

    $('.eventcell').each((_, cell) => {
      const dateSpan = $(cell).find('.date').text().trim();
      let [cellMonth, day] = dateSpan.split('/').map(Number);

      if (cellMonth !== month) return;

      // Process regular events
      $(cell)
        .find('.eventLink')
        .each((index, eventEl) => {
          const dateTime = $(eventEl)
            .find('.eventDateTime')
            .text()
            .trim()
            .replace(/[\u200B-\u200D\uFEFF]/g, '');

          if (!dateTime) return;

          const timeMatch = dateTime.match(/(\d{1,2}:\d{2})-(\d{1,2}:\d{2})/);
          if (!timeMatch) return;

          const [_, start, end] = timeMatch;

          const titleEl = $(eventEl).find('.eventDetail a');
          const title = titleEl.attr('title')?.replace(/^[^:]+:/, '') || titleEl.text().trim();

          if (!title) return;

          events.push({ year, month, day, start, end, title });
        });

      // Process private events
      $(cell)
        .find('.eventText')
        .each((idx, eventEl) => {
          const dateTime = $(eventEl)
            .find('.eventDateTime')
            .text()
            .trim()
            .replace(/[\u200B-\u200D\uFEFF]/g, '');

          if (!dateTime) return;

          const timeMatch = dateTime.match(/(\d{1,2}:\d{2})-(\d{1,2}:\d{2})/);
          if (!timeMatch) return;

          const [_, start, end] = timeMatch;
          const title = $(eventEl).find('.eventDetail').text().trim();

          if (!title) return;

          events.push({ year, month, day, start, end, title });
        });
    });

    return events;
  }
}
