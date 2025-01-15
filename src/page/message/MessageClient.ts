import Transport from '../../common/Transport';
import {
  Comment,
  MessageOptions,
  MessageFolderOptions,
  MessageCommentOptions,
  MessageCommentSendOptions,
  MessageCommentDeleteOptions,
  MessageCommentReactionOptions,
  MessageModifyOptions,
  MessageSendOptions,
  MessageReceiversOptions,
  MessageReceiversModifyOptions,
  Receiver,
} from './models';
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
  deleteMessage(options: MessageOptions): Promise<void> {
    const body = MessageRequestOptions.deleteMessage(options);
    return this.transport.post(body);
  }

  /**
   * メッセージを移動
   */
  moveMessage(options: MessageFolderOptions): Promise<void> {
    const body = MessageRequestOptions.moveMessage(options);
    return this.transport.post(body);
  }

  /**
   * コメントを取得
   */
  async getComments(options: MessageCommentOptions): Promise<Comment[]> {
    const query = MessageRequestOptions.getComments(options);
    const document = await this.transport.get({ query });
    return MessageHtmlParser.parseComments(document);
  }

  /**
   * コメントを追加
   */
  sendComment(options: MessageCommentSendOptions): Promise<void> {
    const body = MessageRequestOptions.sendComment(options);
    return this.transport.post(body);
  }

  /**
   * コメントを削除
   */
  deleteComment(options: MessageCommentDeleteOptions): Promise<void> {
    const body = MessageRequestOptions.deleteComment(options);
    return this.transport.post(body);
  }

  /**
   * リアクションを追加・削除
   */
  toggleReaction(options: MessageCommentReactionOptions): Promise<void> {
    const body = MessageRequestOptions.toggleReaction(options);
    return this.transport.post(body);
  }

  /**
   * 宛先一覧を取得
   */
  async getReceivers(options: MessageReceiversOptions): Promise<Receiver[]> {
    const query = MessageRequestOptions.getReceivers(options);
    const document = await this.transport.get({ query });
    return MessageHtmlParser.parseReceivers(document);
  }

  /**
   * 宛先を修正
   */
  modifyReceivers(options: MessageReceiversModifyOptions): Promise<void> {
    const body = MessageRequestOptions.modifyReceivers(options);
    return this.transport.post(body);
  }
}
