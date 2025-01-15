import { ReactionType } from '../../common/Constants';
import { FileDownloadQueryOptions } from '../file/models';

export interface MessageOptions {
  mDBID: number;
  mDID: number;
}

export interface MessageFolderOptions extends MessageOptions {
  pID: number;
}

export interface MessageCommentOptions extends MessageOptions {
  hID?: number;
}

export interface MessageCommentDeleteOptions extends MessageOptions {
  followId: number;
}

export interface MessageCommentReactionOptions extends MessageCommentDeleteOptions {
  mark?: ReactionType;
  cancel?: number;
}

export interface MessageReceiversOptions extends MessageOptions {
  eID: number;
}

export interface MessageReceiversModifyOptions extends MessageReceiversOptions {
  uidList: number[];
}

export interface MessageContentOptions {
  subject: string;
  data: string;
  group?: string;
  editableByReceivers?: number;
  useConfirm?: number;
  simpleReplyEnable?: number;
}

export interface MessageModifyOptions extends MessageOptions, MessageContentOptions {}

export interface MessageSendOptions extends MessageContentOptions {
  uidList: number[];
}

export interface MessageCommentSendOptions extends MessageOptions {
  data: string;
  group?: string;
}

/**
 * コメント情報を定義するインターフェース
 */
export interface Comment {
  followId: number;
  userName: string;
  attachedFile?: string;
  attachedQuery?: FileDownloadQueryOptions;
}

/**
 * 宛先ユーザー情報を定義するインターフェース
 */
export interface Receiver {
  uID: number;
  userName: string;
}
