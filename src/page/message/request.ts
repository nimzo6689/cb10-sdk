import { Defaults, MessageEditMode, ReactionType } from '../../common/Constants';
import { Utils } from '../../common/Helpers';
import { MessageSendOptions, MessageModifyOptions } from './models';

const PAGE_PREFIX = 'MyFolderMessage';

export default class MessageRequestOptions {
  static sendMessage(options: MessageSendOptions): string {
    const {
      subject,
      data,
      uidList,
      group = Defaults.GROUP_NAME,
      editableByReceivers = 1,
      useConfirm = 0,
      simpleReplyEnable = 1,
    } = options;

    const uidPairs = uidList.map(uid => `UID=${uid}`).join('&');
    const body = {
      page: `${PAGE_PREFIX}Send`,
      Subject: subject,
      Group: group,
      Data: data,
      EditableByReceivers: editableByReceivers,
      UseConfirm: useConfirm,
      SimpleReplyEnable: simpleReplyEnable,
    };

    return `${Utils.buildQuery(body)}&${uidPairs}`;
  }

  static modifyMessage(options: MessageModifyOptions): string {
    const {
      mDBID,
      mDID,
      subject,
      data,
      group = Defaults.GROUP_NAME,
      editableByReceivers = 1,
      useConfirm = 0,
      simpleReplyEnable = 1,
    } = options;

    const body = {
      page: `${PAGE_PREFIX}Modify`,
      EditMode: MessageEditMode.TEXT.toString(),
      Cancel: 0,
      FRID: 0,
      Subject: subject,
      Group: group,
      Data: data,
      EditableByReceivers: editableByReceivers,
      UseConfirm: useConfirm,
      SimpleReplyEnable: simpleReplyEnable,
      DBID: mDBID,
      MID: mDID,
      Submit: '変更する',
    };

    return Utils.buildQuery(body);
  }

  static deleteMessage(mDBID: number, mDID: number): string {
    const body = {
      page: `${PAGE_PREFIX}Delete`,
      DBID: mDBID,
      MID: mDID,
      Remove: 1,
      Yes: '移動する',
    };

    return Utils.buildQuery(body);
  }

  static moveMessage(mDBID: number, mDID: number, pID: number): string {
    const body = {
      page: `${PAGE_PREFIX}View`,
      Cancel: 0,
      FRID: 0,
      DBID: mDBID,
      MID: mDID,
      PID: pID,
    };

    return Utils.buildQuery(body);
  }

  static getComments(mDBID: number, mDID: number, hID?: number): Record<string, string | number> {
    const query: Record<string, string | number> = {
      page: `Ajax${PAGE_PREFIX}FollowNavi`,
      DBID: mDBID,
      MID: mDID,
    };

    if (hID) {
      query.hid = hID;
    }

    return query;
  }

  static addComment(mDBID: number, mDID: number, data: string, group = Defaults.GROUP_NAME): string {
    const body = {
      page: `Ajax${PAGE_PREFIX}FollowAdd`,
      EditMode: MessageEditMode.TEXT,
      Group: group,
      Data: data,
      DBID: mDBID,
      MID: mDID,
    };

    return Utils.buildQuery(body);
  }

  static deleteComment(mDBID: number, mDID: number, followId: number): string {
    const body = {
      page: `Ajax${PAGE_PREFIX}FollowDelete`,
      FRID: followId,
      DBID: mDBID,
      MID: mDID,
    };

    return Utils.buildQuery(body);
  }

  static toggleReaction(
    mDBID: number,
    mDID: number,
    followId: number,
    mark: ReactionType = '',
    cancel: number = 0
  ): string {
    const body: Record<string, string | number> = {
      page: 'AjaxSimpleReply',
      Cancel: cancel,
      FRID: followId,
      DBID: mDBID,
      MID: mDID,
    };

    if (mark) {
      body.Value = mark;
    }

    return Utils.buildQuery(body);
  }

  static getReceivers(mDBID: number, mDID: number, eID: number): Record<string, string | number> {
    const query = {
      page: `${PAGE_PREFIX}ReceiverAdd`,
      DBID: mDBID,
      MID: mDID,
      eID: eID,
    };

    return query;
  }

  static modifyReceivers(mDBID: number, mDID: number, eID: number, uidList: number[]): string {
    const uidPairs = uidList.map(uid => `UID=${uid}`).join('&');
    const body = {
      page: `${PAGE_PREFIX}ReceiverAdd`,
      DBID: mDBID,
      MID: mDID,
      EID: eID,
      Submit: '変更する',
    };

    return `${Utils.buildQuery(body)}&${uidPairs}`;
  }
}
