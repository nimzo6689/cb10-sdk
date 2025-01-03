import * as cheerio from 'cheerio';
import { Element } from 'domhandler';
import { Utils } from '../common/Helpers';
import Transport from '../common/Transport';
import { CybozuOfficeSDKException } from '../common/Errors';
import { Defaults, MessageEditMode } from '../common/Constants';

type CheerioAPI = cheerio.CheerioAPI;

/**
 * メッセージの送信オプションを定義するインターフェース
 */
interface MessageSendOptions {
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
interface MessageModifyOptions {
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
interface CommentInfo {
  followId: number;
  userName: string;
  attachedFile?: string;
  attachedQuery?: string;
}

/**
 * 宛先ユーザー情報を定義するインターフェース
 */
interface ReceiverInfo {
  uID: number;
  userName: string;
}

/**
 * リアクションのタイプを定義する型
 */
type ReactionType = 'good' | 'ok' | 'smile' | 'sad' | '';

/**
 * Cybozu Office 10の個人フォルダ内メッセージ機能にアクセスするためのクライアントクラス
 */
export default class MessageClient {
  /**
   * メッセージ関連ページの共通プレフィックス
   */
  private static readonly PAGE_PREFIX = 'MyFolderMessage';

  constructor(private readonly transport: Transport) {}

  /**
   * メッセージを送信
   */
  async sendMessage(options: MessageSendOptions): Promise<boolean> {
    try {
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
        page: `${MessageClient.PAGE_PREFIX}Send`,
        Subject: subject,
        Group: group,
        Data: data,
        EditableByReceivers: editableByReceivers,
        UseConfirm: useConfirm,
        SimpleReplyEnable: simpleReplyEnable,
      };

      await this.transport.post(`${Utils.buildQuery(body)}&${uidPairs}`);
      return true;
    } catch (error) {
      throw this.wrapError('Failed to send message', error);
    }
  }

  /**
   * メッセージを編集
   */
  async modifyMessage(options: MessageModifyOptions): Promise<boolean> {
    try {
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
        page: `${MessageClient.PAGE_PREFIX}Modify`,
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

      await this.transport.post(Utils.buildQuery(body));
      return true;
    } catch (error) {
      throw this.wrapError('Failed to modify message', error);
    }
  }

  /**
   * メッセージを削除
   */
  async deleteMessage(mDBID: number, mDID: number): Promise<boolean> {
    try {
      const body = {
        page: `${MessageClient.PAGE_PREFIX}Delete`,
        DBID: mDBID,
        MID: mDID,
        Remove: 1,
        Yes: '移動する',
      };

      await this.transport.post(Utils.buildQuery(body));
      return true;
    } catch (error) {
      throw this.wrapError('Failed to delete message', error);
    }
  }

  /**
   * メッセージを移動
   */
  async moveMessage(mDBID: number, mDID: number, pID: number): Promise<boolean> {
    try {
      const body = {
        page: `${MessageClient.PAGE_PREFIX}View`,
        Cancel: 0,
        FRID: 0,
        DBID: mDBID,
        MID: mDID,
        PID: pID,
      };

      await this.transport.post(Utils.buildQuery(body));
      return true;
    } catch (error) {
      throw this.wrapError('Failed to move message', error);
    }
  }

  /**
   * コメントを取得
   */
  async getComments(mDBID: number, mDID: number, hID?: number): Promise<CommentInfo[]> {
    try {
      const query: Record<string, any> = {
        page: `Ajax${MessageClient.PAGE_PREFIX}FollowNavi`,
        DBID: mDBID,
        MID: mDID,
      };

      if (hID != null) {
        query.hid = hID;
      }

      const document = await this.transport.get({ query });
      return this.parseComments(document);
    } catch (error) {
      throw this.wrapError('Failed to get comments', error);
    }
  }

  /**
   * コメントを追加
   */
  async addComment(mDBID: number, mDID: number, data: string, group = Defaults.GROUP_NAME): Promise<boolean> {
    try {
      const body = {
        page: `Ajax${MessageClient.PAGE_PREFIX}FollowAdd`,
        EditMode: MessageEditMode.TEXT,
        Group: group,
        Data: data,
        DBID: mDBID,
        MID: mDID,
      };

      await this.transport.post(Utils.buildQuery(body));
      return true;
    } catch (error) {
      throw this.wrapError('Failed to add comment', error);
    }
  }

  /**
   * コメントを削除
   */
  async deleteComment(mDBID: number, mDID: number, followId: number): Promise<boolean> {
    try {
      const body = {
        page: `Ajax${MessageClient.PAGE_PREFIX}FollowDelete`,
        FRID: followId,
        DBID: mDBID,
        MID: mDID,
      };

      await this.transport.post(Utils.buildQuery(body));
      return true;
    } catch (error) {
      throw this.wrapError('Failed to delete comment', error);
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
      const body: Record<string, any> = {
        page: 'AjaxSimpleReply',
        Cancel: cancel,
        FRID: followId,
        DBID: mDBID,
        MID: mDID,
      };

      if (mark) {
        body.Value = mark;
      }

      await this.transport.post(Utils.buildQuery(body));
      return true;
    } catch (error) {
      throw this.wrapError('Failed to toggle reaction', error);
    }
  }

  /**
   * 宛先一覧を取得
   */
  async getReceivers(mDBID: number, mDID: number): Promise<ReceiverInfo[]> {
    try {
      const query = {
        page: `${MessageClient.PAGE_PREFIX}ReceiverAdd`,
        DBID: mDBID,
        MID: mDID,
      };

      const document = await this.transport.get({ query });
      return this.parseReceivers(document);
    } catch (error) {
      throw this.wrapError('Failed to get receivers', error);
    }
  }

  /**
   * 宛先を修正
   */
  async modifyReceivers(mDBID: number, mDID: number, eID: number, uidList: number[]): Promise<boolean> {
    try {
      const uidPairs = uidList.map(uid => `UID=${uid}`).join('&');
      const body = {
        page: `${MessageClient.PAGE_PREFIX}ReceiverAdd`,
        DBID: mDBID,
        MID: mDID,
        EID: eID,
      };

      await this.transport.post(`${Utils.buildQuery(body)}&${uidPairs}`);
      return true;
    } catch (error) {
      throw this.wrapError('Failed to modify receivers', error);
    }
  }

  /**
   * コメント一覧のHTMLをパース
   */
  private parseComments(html: string): CommentInfo[] {
    const $ = cheerio.load(html);
    const comments: CommentInfo[] = [];

    $('#Follows > div').each((_: number, el: Element) => {
      const comment = this.extractCommentInfo($, el);
      if (comment) {
        comments.push(comment);
      }
    });

    return comments;
  }

  /**
   * コメント情報を抽出
   */
  private extractCommentInfo($: CheerioAPI, element: Element): CommentInfo | null {
    const $element = $(element);
    const followIdMatch = $element.attr('id')?.match(/(?<=follow-root-)[0-9]+/i);

    if (!followIdMatch) {
      return null;
    }

    const $attachedLink = $element.find('.vr_viewContentsAttach td:first-child a');
    const attached = $attachedLink.attr('href');
    let attachedFile = undefined;
    let attachedQuery = undefined;

    if (attached) {
      const [_, file, query] = attached.split(/[/?]/);
      attachedFile = file || '';
      attachedQuery = query ? query.replace(/&amp;/gi, '&') : '';
    }

    return {
      followId: Number(followIdMatch[0]),
      userName: $element.find('.vr_followUserName').text(),
      attachedFile,
      attachedQuery,
    };
  }

  /**
   * 宛先一覧のHTMLをパース
   */
  private parseReceivers(html: string): ReceiverInfo[] {
    const $ = cheerio.load(html);
    const receivers: ReceiverInfo[] = [];

    $('select[name="UID"] > option').each((_: number, el: Element) => {
      const $element = $(el);
      const uID = Number($element.val());

      if (uID !== 0) {
        receivers.push({
          uID,
          userName: $element.text(),
        });
      }
    });

    return receivers;
  }

  /**
   * エラーをラップ
   */
  private wrapError(message: string, error: unknown): CybozuOfficeSDKException {
    if (error instanceof CybozuOfficeSDKException) {
      return error;
    }
    return new CybozuOfficeSDKException(`${message}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
