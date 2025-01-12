import Transport from '../../common/Transport';
import { CybozuOfficeSDKException } from '../../common/Errors';
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
  async sendMessage(options: MessageSendOptions): Promise<boolean> {
    try {
      const body = MessageRequestOptions.sendMessage(options);
      await this.transport.post(body);
      return true;
    } catch (error) {
      throw MessageClient.#wrapError('Failed to send message', error);
    }
  }

  /**
   * メッセージを編集
   */
  async modifyMessage(options: MessageModifyOptions): Promise<boolean> {
    try {
      const body = MessageRequestOptions.modifyMessage(options);
      await this.transport.post(body);
      return true;
    } catch (error) {
      throw MessageClient.#wrapError('Failed to modify message', error);
    }
  }

  /**
   * メッセージを削除
   */
  async deleteMessage(mDBID: number, mDID: number): Promise<boolean> {
    try {
      const body = MessageRequestOptions.deleteMessage(mDBID, mDID);
      await this.transport.post(body);
      return true;
    } catch (error) {
      throw MessageClient.#wrapError('Failed to delete message', error);
    }
  }

  /**
   * メッセージを移動
   */
  async moveMessage(mDBID: number, mDID: number, pID: number): Promise<boolean> {
    try {
      const body = MessageRequestOptions.moveMessage(mDBID, mDID, pID);
      await this.transport.post(body);
      return true;
    } catch (error) {
      throw MessageClient.#wrapError('Failed to move message', error);
    }
  }

  /**
   * コメントを取得
   */
  async getComments(mDBID: number, mDID: number, hID?: number): Promise<CommentInfo[]> {
    try {
      const query = MessageRequestOptions.getComments(mDBID, mDID, hID);
      const document = await this.transport.get({ query });
      return MessageHtmlParser.parseComments(document);
    } catch (error) {
      throw MessageClient.#wrapError('Failed to get comments', error);
    }
  }

  /**
   * コメントを追加
   */
  async addComment(mDBID: number, mDID: number, data: string, group = Defaults.GROUP_NAME): Promise<boolean> {
    try {
      const body = MessageRequestOptions.addComment(mDBID, mDID, data, group);
      await this.transport.post(body);
      return true;
    } catch (error) {
      throw MessageClient.#wrapError('Failed to add comment', error);
    }
  }

  /**
   * コメントを削除
   */
  async deleteComment(mDBID: number, mDID: number, followId: number): Promise<boolean> {
    try {
      const body = MessageRequestOptions.deleteComment(mDBID, mDID, followId);
      await this.transport.post(body);
      return true;
    } catch (error) {
      throw MessageClient.#wrapError('Failed to delete comment', error);
    }
  }

  /**
   * リアクションを追加・削除
   */
  async toggleReaction(
    mDBID: number,
    mDID: number,
    followId: number,
    mark: ReactionType = '',
    cancel: number = 0
  ): Promise<boolean> {
    try {
      const body = MessageRequestOptions.toggleReaction(mDBID, mDID, followId, mark, cancel);
      await this.transport.post(body);
      return true;
    } catch (error) {
      throw MessageClient.#wrapError('Failed to toggle reaction', error);
    }
  }

  /**
   * 宛先一覧を取得
   */
  async getReceivers(mDBID: number, mDID: number, eID: number): Promise<ReceiverInfo[]> {
    try {
      const query = MessageRequestOptions.getReceivers(mDBID, mDID, eID);
      const document = await this.transport.get({ query });
      return MessageHtmlParser.parseReceivers(document);
    } catch (error) {
      throw MessageClient.#wrapError('Failed to get receivers', error);
    }
  }

  /**
   * 宛先を修正
   */
  async modifyReceivers(mDBID: number, mDID: number, eID: number, uidList: number[]): Promise<boolean> {
    try {
      const body = MessageRequestOptions.modifyReceivers(mDBID, mDID, eID, uidList);
      await this.transport.post(body);
      return true;
    } catch (error) {
      throw MessageClient.#wrapError('Failed to modify receivers', error);
    }
  }

  /**
   * エラーをラップ
   */
  static #wrapError(message: string, error: unknown): CybozuOfficeSDKException {
    if (error instanceof CybozuOfficeSDKException) {
      return error;
    }
    return new CybozuOfficeSDKException(`${message}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
