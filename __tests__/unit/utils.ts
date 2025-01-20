import fs from 'fs';

export const myFolderMessageViewHtml = fs.readFileSync(`${__dirname}/resources/page_MyFolderMessageView`).toString();

export const normalResponse = {
  status: 200,
  statusText: 'OK',
  headers: {} as any,
  config: {} as any,
};

export const defaultCB10Options = {
  baseUrl: 'https://xxxxx/scripts/office10/ag.cgi',
  id: 'username',
  password: 'password',
  sessionCredentials: {
    cookie: 'skip',
    csrfTicket: 'skip',
  },
};
