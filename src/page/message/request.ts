import { Defaults, MessageEditMode, ReactionType } from '../../common/Constants';
import { CustomURLPrams } from '../../common/Transport';
import { MessageSendOptions, MessageModifyOptions } from './models';

const PAGE_PREFIX = 'MyFolderMessage';

export default class MessageRequestOptions {
  static sendMessage(options: MessageSendOptions): CustomURLPrams {
    const {
      subject,
      data,
      uidList,
      group = Defaults.GROUP_NAME,
      editableByReceivers = 1,
      useConfirm = 0,
      simpleReplyEnable = 1,
    } = options;

    return {
      page: `${PAGE_PREFIX}Send`,
      Subject: subject,
      Group: group,
      Data: data,
      EditableByReceivers: editableByReceivers,
      UseConfirm: useConfirm,
      SimpleReplyEnable: simpleReplyEnable,
      UID: uidList,
    };
  }

  static modifyMessage(options: MessageModifyOptions): CustomURLPrams {
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

    return {
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
  }

  static deleteMessage(mDBID: number, mDID: number): CustomURLPrams {
    return {
      page: `${PAGE_PREFIX}Delete`,
      DBID: mDBID,
      MID: mDID,
      Remove: 1,
      Yes: '移動する',
    };
  }

  static moveMessage(mDBID: number, mDID: number, pID: number): CustomURLPrams {
    return {
      page: `${PAGE_PREFIX}View`,
      Cancel: 0,
      FRID: 0,
      DBID: mDBID,
      MID: mDID,
      PID: pID,
    };
  }

  static getComments(mDBID: number, mDID: number, hID?: number): CustomURLPrams {
    const query: CustomURLPrams = {
      page: `Ajax${PAGE_PREFIX}FollowNavi`,
      DBID: mDBID,
      MID: mDID,
    };

    if (hID) {
      query.hid = hID;
    }

    return query;
  }

  static addComment(mDBID: number, mDID: number, data: string, group = Defaults.GROUP_NAME): CustomURLPrams {
    return {
      page: `Ajax${PAGE_PREFIX}FollowAdd`,
      EditMode: MessageEditMode.TEXT,
      Group: group,
      Data: data,
      DBID: mDBID,
      MID: mDID,
    };
  }

  static deleteComment(mDBID: number, mDID: number, followId: number): CustomURLPrams {
    return {
      page: `Ajax${PAGE_PREFIX}FollowDelete`,
      FRID: followId,
      DBID: mDBID,
      MID: mDID,
    };
  }

  static toggleReaction(
    mDBID: number,
    mDID: number,
    followId: number,
    mark: ReactionType = '',
    cancel: number = 0
  ): CustomURLPrams {
    const body: CustomURLPrams = {
      page: 'AjaxSimpleReply',
      Cancel: cancel,
      FRID: followId,
      DBID: mDBID,
      MID: mDID,
    };

    if (mark) {
      body.Value = mark;
    }

    return body;
  }

  static getReceivers(mDBID: number, mDID: number, eID: number): CustomURLPrams {
    return {
      page: `${PAGE_PREFIX}ReceiverAdd`,
      DBID: mDBID,
      MID: mDID,
      eID: eID,
    };
  }

  static modifyReceivers(mDBID: number, mDID: number, eID: number, uidList: number[]): CustomURLPrams {
    return {
      page: `${PAGE_PREFIX}ReceiverAdd`,
      UID: uidList,
      DBID: mDBID.toString(),
      MID: mDID.toString(),
      EID: eID.toString(),
      Submit: '変更する',
    };
  }
}
