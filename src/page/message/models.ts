import { FileDownloadQueryOptions } from '../file/models';

/**
 * メッセージの送信オプションを定義するインターフェース
 */
export interface MessageSendOptions {
  subject: string;
  data: string;
  uidList: number[];
  group?: string;
  editableByReceivers?: number;
  useConfirm?: number;
  simpleReplyEnable?: number;
}

/**
 * メッセージの編集オプションを定義するインターフェース
 */
export interface MessageModifyOptions {
  mDBID: number;
  mDID: number;
  subject: string;
  data: string;
  group?: string;
  editableByReceivers?: number;
  useConfirm?: number;
  simpleReplyEnable?: number;
}

/**
 * コメント情報を定義するインターフェース
 */
export interface CommentInfo {
  followId: number;
  userName: string;
  attachedFile?: string;
  attachedQuery?: FileDownloadQueryOptions;
}

/**
 * 宛先ユーザー情報を定義するインターフェース
 */
export interface ReceiverInfo {
  uID: number;
  userName: string;
}
