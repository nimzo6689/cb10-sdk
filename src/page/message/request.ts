import { Defaults, MessageEditMode } from '../../common/Constants';
import { CustomURLParams } from '../../common/Transport';
import {
  MessageOptions,
  MessageFolderOptions,
  MessageCommentOptions,
  MessageCommentSendOptions,
  MessageCommentDeleteOptions,
  MessageCommentReactionOptions,
  MessageSendOptions,
  MessageModifyOptions,
  MessageReceiversOptions,
  MessageReceiversModifyOptions,
} from './models';

const PAGE_PREFIX = 'MyFolderMessage';

export default class MessageRequestOptions {
  static sendMessage({
    subject,
    data,
    uidList,
    group = Defaults.GROUP_NAME,
    editableByReceivers = 1,
    useConfirm = 0,
    simpleReplyEnable = 1,
  }: MessageSendOptions): CustomURLParams {
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

  static modifyMessage({
    mDBID,
    mDID,
    subject,
    data,
    group = Defaults.GROUP_NAME,
    editableByReceivers = 1,
    useConfirm = 0,
    simpleReplyEnable = 1,
  }: MessageModifyOptions): CustomURLParams {
    return {
      page: `${PAGE_PREFIX}Modify`,
      EditMode: MessageEditMode.TEXT,
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

  static deleteMessage(options: MessageOptions): CustomURLParams {
    return {
      page: `${PAGE_PREFIX}Delete`,
      DBID: options.mDBID,
      MID: options.mDID,
      Remove: 1,
      Yes: '移動する',
    };
  }

  static moveMessage(options: MessageFolderOptions): CustomURLParams {
    return {
      page: `${PAGE_PREFIX}View`,
      Cancel: 0,
      FRID: 0,
      DBID: options.mDBID,
      MID: options.mDID,
      PID: options.pID,
    };
  }

  static getComments(options: MessageCommentOptions): CustomURLParams {
    const query: CustomURLParams = {
      page: `Ajax${PAGE_PREFIX}FollowNavi`,
      DBID: options.mDBID,
      MID: options.mDID,
    };

    if (options.hID) {
      query.hid = options.hID;
    }

    return query;
  }

  static sendComment(options: MessageCommentSendOptions): CustomURLParams {
    return {
      page: `Ajax${PAGE_PREFIX}FollowAdd`,
      EditMode: MessageEditMode.TEXT,
      Group: options.group || Defaults.GROUP_NAME,
      Data: options.data,
      DBID: options.mDBID,
      MID: options.mDID,
    };
  }

  static deleteComment(options: MessageCommentDeleteOptions): CustomURLParams {
    return {
      page: `Ajax${PAGE_PREFIX}FollowDelete`,
      FRID: options.followId,
      DBID: options.mDBID,
      MID: options.mDID,
    };
  }

  static toggleReaction(options: MessageCommentReactionOptions): CustomURLParams {
    const body: CustomURLParams = {
      page: 'AjaxSimpleReply',
      Cancel: options.cancel || 0,
      FRID: options.followId,
      DBID: options.mDBID,
      MID: options.mDID,
    };

    if (options.mark) {
      body.Value = options.mark;
    }

    return body;
  }

  static getReceivers(options: MessageReceiversOptions): CustomURLParams {
    return {
      page: `${PAGE_PREFIX}ReceiverAdd`,
      DBID: options.mDBID,
      MID: options.mDID,
      eID: options.eID,
    };
  }

  static modifyReceivers(options: MessageReceiversModifyOptions): CustomURLParams {
    return {
      page: `${PAGE_PREFIX}ReceiverAdd`,
      UID: options.uidList,
      DBID: options.mDBID,
      MID: options.mDID,
      EID: options.eID,
      Submit: '変更する',
    };
  }
}
