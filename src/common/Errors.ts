/**
 * Cybozu Office SDKで発生するエラーを表すカスタム例外クラス
 *
 * @example
 * ```typescript
 * throw new CybozuOfficeSDKException('ログインに失敗しました');
 * ```
 */
export class CybozuOfficeSDKException extends Error {
  /**
   * エラーの種類を示す名前
   */
  public override readonly name = 'CybozuOfficeSDKException';

  /**
   * CybozuOfficeSDKExceptionのインスタンスを作成
   *
   * @param message - エラーメッセージ
   */
  constructor(message: string) {
    super(message);
    // Error クラスを継承する際の TypeScript の制限に対する対処
    Object.setPrototypeOf(this, CybozuOfficeSDKException.prototype);
  }
}
