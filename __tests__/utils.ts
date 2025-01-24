import fs from 'fs';

export const fileAddHtml = fs.readFileSync(`${__dirname}/resources/page_FileAdd`).toString();
export const myFolderMessageViewHtml = fs.readFileSync(`${__dirname}/resources/page_MyFolderMessageView`).toString();
export const userListIndexHtml = fs.readFileSync(`${__dirname}/resources/page_UserListIndex`).toString();
export const myFolderIndexHtml = fs.readFileSync(`${__dirname}/resources/page_MyFolderIndex`).toString();
export const notificationIndexHtml = fs.readFileSync(`${__dirname}/resources/page_NotificationIndex`).toString();
export const scheduleUserMonthHtml = fs.readFileSync(`${__dirname}/resources/page_ScheduleUserMonth`).toString();

export const error10101Html = fs.readFileSync(`${__dirname}/resources/error/page_error_10101`).toString();

export const normalResponse = {
  status: 200,
  statusText: 'OK',
  headers: {} as any,
  config: {} as any,
};

export const needsLoginCB10Options = {
  baseUrl: 'https://xxxxx/scripts/office10/ag.cgi',
  id: 'username',
  password: 'password',
};

export const defaultCB10Options = {
  ...needsLoginCB10Options,
  sessionCredentials: {
    cookie: 'skip',
    csrfTicket: 'skip',
  },
};
