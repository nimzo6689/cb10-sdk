import Transport from '../../common/Transport';
import { Defaults, ReactionType } from '../../common/Constants';
import { CommentInfo, MessageModifyOptions, MessageSendOptions, ReceiverInfo } from './models';
import MessageRequestOptions from './request';
import MessageHtmlParser from './parser';

/**
 * Cybozu Office 10の個人フォルダ内メッセージ機能にアクセスするためのクライアントクラス
 */
export default class MessageClient {
  constructor(private readonly transport: Transport) {}

  /**
   * メッセージを送信
   */
  sendMessage(options: MessageSendOptions): Promise<void> {
    const body = MessageRequestOptions.sendMessage(options);
    return this.transport.post(body);
  }

  /**
   * メッセージを編集
   */
  modifyMessage(options: MessageModifyOptions): Promise<void> {
    const body = MessageRequestOptions.modifyMessage(options);
    return this.transport.post(body);
  }

  /**
   * メッセージを削除
   */
  deleteMessage(mDBID: number, mDID: number): Promise<void> {
    const body = MessageRequestOptions.deleteMessage(mDBID, mDID);
    return this.transport.post(body);
  }

  /**
   * メッセージを移動
   */
  moveMessage(mDBID: number, mDID: number, pID: number): Promise<void> {
    const body = MessageRequestOptions.moveMessage(mDBID, mDID, pID);
    return this.transport.post(body);
  }

  /**
   * コメントを取得
   */
  async getComments(mDBID: number, mDID: number, hID?: number): Promise<CommentInfo[]> {
    const query = MessageRequestOptions.getComments(mDBID, mDID, hID);
    const document = await this.transport.get({ query });
    return MessageHtmlParser.parseComments(document);
  }

  /**
   * コメントを追加
   */
  addComment(mDBID: number, mDID: number, data: string, group = Defaults.GROUP_NAME): Promise<void> {
    const body = MessageRequestOptions.addComment(mDBID, mDID, data, group);
    return this.transport.post(body);
  }

  /**
   * コメントを削除
   */
  deleteComment(mDBID: number, mDID: number, followId: number): Promise<void> {
    const body = MessageRequestOptions.deleteComment(mDBID, mDID, followId);
    return this.transport.post(body);
  }

  /**
   * リアクションを追加・削除
   */
  toggleReaction(
    mDBID: number,
    mDID: number,
    followId: number,
    mark: ReactionType = '',
    cancel: number = 0
  ): Promise<void> {
    const body = MessageRequestOptions.toggleReaction(mDBID, mDID, followId, mark, cancel);
    return this.transport.post(body);
  }

  /**
   * 宛先一覧を取得
   */
  async getReceivers(mDBID: number, mDID: number, eID: number): Promise<ReceiverInfo[]> {
    const query = MessageRequestOptions.getReceivers(mDBID, mDID, eID);
    const document = await this.transport.get({ query });
    return MessageHtmlParser.parseReceivers(document);
  }

  /**
   * 宛先を修正
   */
  modifyReceivers(mDBID: number, mDID: number, eID: number, uidList: number[]): Promise<void> {
    const body = MessageRequestOptions.modifyReceivers(mDBID, mDID, eID, uidList);
    return this.transport.post(body);
  }
}
