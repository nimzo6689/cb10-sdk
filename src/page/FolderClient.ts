import Transport from '../common/Transport';
import { CybozuOfficeSDKException } from '../common/Errors';

/**
 * フォルダ内のメッセージ情報を定義するインターフェース
 *
 * @interface FolderMessage
 * @property {number | null} mDBID - メッセージのデータベースID
 * @property {number | null} mDID - メッセージのドキュメントID
 * @property {string} subject - メッセージの件名
 */
interface FolderMessage {
  mDBID: number | null;
  mDID: number | null;
  subject: string;
}

/**
 * フォルダ一覧取得のオプションを定義するインターフェース
 *
 * @interface FolderIndexOptions
 * @property {number | string} folderId - フォルダID（FID）または特殊フォルダ名
 * @property {number} [reversed] - 昇順フラグ（0は降順、1は昇順）
 */
interface FolderIndexOptions {
  folderId: number | string;
  reversed?: number;
}

/**
 * Cybozu Office 10の個人フォルダ機能にアクセスするためのクライアントクラス
 *
 * このクラスは個人フォルダのメッセージ一覧取得などの機能を提供します。
 *
 * @example
 * ```typescript
 * const transport = new Transport('https://example.cybozu.com/ag.cgi', 'username', 'password');
 * const client = new FolderClient(transport);
 *
 * // 受信箱のメッセージ一覧を取得
 * const messages = await client.inbox();
 * ```
 */
export default class FolderClient {
  /**
   * 個人フォルダ関連ページの共通プレフィックス
   */
  private static readonly PAGE_PREFIX = 'MyFolder';

  /**
   * FolderClientのインスタンスを作成
   *
   * @param transport - サイボウズOffice10への通信を行うTransportインスタンス
   */
  constructor(private readonly transport: Transport) {}

  /**
   * 個人フォルダのメッセージ一覧を取得
   *
   * @param options - フォルダ一覧取得オプション
   * @returns メッセージ一覧、一覧が空の場合はnull
   * @throws {CybozuOfficeSDKException} メッセージの取得に失敗した場合
   */
  async getMessages(options: FolderIndexOptions): Promise<FolderMessage[] | null> {
    try {
      const { folderId, reversed = 0 } = options;

      const query = {
        page: `${FolderClient.PAGE_PREFIX}Index`,
        FID: folderId,
        rv: reversed,
      };

      const document = await this.transport.get({ query });
      const rawMessages = document.match(/(?<=MyFolderMessageView).*?(?=profileImage)/gis);

      if (!rawMessages) {
        return null;
      }

      return rawMessages.map(
        (rawHtml: string): FolderMessage => ({
          mDBID: this.extractNumber(rawHtml, /mDBID=(\d+)/i),
          mDID: this.extractNumber(rawHtml, /mDID=(\d+)/i),
          subject: rawHtml.match(/(?<=clip8x16.png" align=absmiddle>).*?(?=<\/a>)/i)?.[0] || '',
        })
      );
    } catch (error) {
      if (error instanceof CybozuOfficeSDKException) {
        throw error;
      }
      throw new CybozuOfficeSDKException(
        `Failed to get messages: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * 受信箱のメッセージ一覧を取得
   *
   * @param reversed - 昇順フラグ（0は降順、1は昇順）
   * @returns メッセージ一覧、一覧が空の場合はnull
   */
  async inbox(reversed: number = 0): Promise<FolderMessage[] | null> {
    return this.getMessages({ folderId: 'inbox', reversed });
  }

  /**
   * 送信箱のメッセージ一覧を取得
   *
   * @param reversed - 昇順フラグ（0は降順、1は昇順）
   * @returns メッセージ一覧、一覧が空の場合はnull
   */
  async sent(reversed: number = 0): Promise<FolderMessage[] | null> {
    return this.getMessages({ folderId: 'sent', reversed });
  }

  /**
   * 下書きのメッセージ一覧を取得
   *
   * @param reversed - 昇順フラグ（0は降順、1は昇順）
   * @returns メッセージ一覧、一覧が空の場合はnull
   */
  async unsent(reversed: number = 0): Promise<FolderMessage[] | null> {
    return this.getMessages({ folderId: 'unsent', reversed });
  }

  /**
   * 指定のフォルダ内のメッセージ一覧を取得
   *
   * @param folderId - フォルダID（FID）
   * @param reversed - 昇順フラグ（0は降順、1は昇順）
   * @returns メッセージ一覧、一覧が空の場合はnull
   */
  async getByFolderId(folderId: number, reversed: number = 0): Promise<FolderMessage[] | null> {
    return this.getMessages({ folderId, reversed });
  }

  /**
   * HTML文字列から数値を抽出
   *
   * @param html - HTML文字列
   * @param pattern - 抽出パターン
   * @returns 抽出された数値、見つからない場合はnull
   * @private
   */
  private extractNumber(html: string, pattern: RegExp): number | null {
    const match = html.match(pattern);
    return match?.[1] ? Number(match[1]) : null;
  }
}
