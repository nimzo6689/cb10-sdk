import Transport from '../../common/Transport';
import { CybozuOfficeSDKException } from '../../common/Errors';
import { BulletinCommentData } from './models';
import BulletinRequestOptions from './request';

/**
 * Cybozu Office 10の掲示板機能にアクセスするためのクライアントクラス
 *
 * このクラスは掲示板の閲覧、コメントの投稿などの機能を提供します。
 */
export default class BulletinClient {
  constructor(private readonly transport: Transport) {}

  /**
   * 掲示板にコメントを追加
   *
   * @param commentData - コメントデータ
   * @returns コメントの追加が成功したかどうか
   * @throws {CybozuOfficeSDKException} コメントの追加に失敗した場合
   */
  async addComment(commentData: BulletinCommentData): Promise<boolean> {
    try {
      await this.transport.post(BulletinRequestOptions.addComment(commentData));
      return true;
    } catch (error) {
      if (error instanceof CybozuOfficeSDKException) {
        throw error;
      }
      throw new CybozuOfficeSDKException(
        `Failed to add comment: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}
