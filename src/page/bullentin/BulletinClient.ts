import Transport from '../../common/Transport';
import { BulletinCommentRequest } from './models';
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
   * @param options - コメントデータ
   * @returns コメントの追加が成功したかどうか
   * @throws {CybozuOfficeSDKException} コメントの追加に失敗した場合
   */
  sendComment(options: BulletinCommentRequest): Promise<void> {
    return this.transport.post(BulletinRequestOptions.sendComment(options));
  }
}
