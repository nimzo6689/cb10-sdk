import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ContentType } from './Constants';
import { Utils } from './Helpers';
import { CybozuOfficeSDKException } from './Errors';

type QueryParams = Record<string, string | number | boolean>;

/**
 * HTTPリクエストのオプションを定義するインターフェース
 *
 * @interface RequestOptions
 * @property {string} method - HTTPメソッド（GET, POST等）
 * @property {string} [path] - リクエストパス
 * @property {string} [contentType] - コンテントタイプ
 * @property {string | Record<string, unknown>} [query] - URLクエリパラメータ
 * @property {string} [body] - リクエストボディ
 */
interface RequestOptions {
  method: string;
  path?: string;
  contentType?: string;
  query?: string | Record<string, unknown>;
  body?: string;
  ensuresLoggedIn: boolean;
  preventSessionRefresh?: boolean;
}

/**
 * GETリクエストのオプションを定義するインターフェース
 *
 * @interface GetOptions
 * @property {string} [path] - リクエストパス
 * @property {string | Record<string, unknown>} [query] - URLクエリパラメータ
 * @property {'text' | 'file'} [responseType] - レスポンスタイプ（デフォルト: 'text'）
 * @property {BufferEncoding} [encoding] - ファイル取得時のエンコーディング（デフォルト: 'utf-8'）
 */
interface GetOptions {
  path?: string;
  query?: string | Record<string, unknown>;
  responseType?: 'text' | 'file';
  encoding?: BufferEncoding;
}

/**
 * セッション認証情報を定義するインターフェース
 *
 * @interface SessionCredentials
 * @property {string} cookie - セッションクッキー
 * @property {string} csrfTicket - CSRFトークン
 */
export interface SessionCredentials {
  cookie: string;
  csrfTicket?: string;
}

/**
 * Cybozu Office 10 APIへのアクセスを管理するクラス
 *
 * このクラスはCybozu Office 10のHTTP APIへのアクセスを簡素化します。
 * セッション管理、認証、CSRFトークンの処理を自動的に行います。
 *
 * @example
 * ```typescript
 * const transport = new Transport(
 *   'https://example.cybozu.com/ag.cgi',
 *   'username',
 *   'password'
 * );
 *
 * // 通常のGETリクエスト
 * const content = await transport.get({ query: 'page=1' });
 *
 * // ファイル取得
 * const file = await transport.get({
 *   path: 'file.txt',
 *   responseType: 'file'
 * });
 *
 * // POSTリクエスト
 * await transport.post('action=update&id=1');
 * ```
 */
export default class Transport {
  private readonly axiosInstance: AxiosInstance;

  /**
   * Transportクラスのインスタンスを作成します
   *
   * @param baseUrl - サイボウズのベースURL（http~/ag.cgiまで）
   * @param accountId - ログインID
   * @param password - パスワード
   * @param cookie - 有効な既存のクッキー（オプション）
   *
   * @throws {CybozuOfficeSDKException} 認証に失敗した場合
   */
  constructor(
    private readonly baseUrl: string,
    private readonly password: string,
    private readonly accountId?: string,
    private readonly id?: string,
    private sessionCredentials?: SessionCredentials
  ) {
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      maxRedirects: 0,
      validateStatus: status => {
        return status === 200 || status === 302;
      },
    });
  }

  /**
   * GETリクエストを実行します
   *
   * @param options - GETリクエストのオプション
   * @returns 取得したコンテンツ
   *
   * @example
   * ```typescript
   * // 通常のGETリクエスト
   * const content = await transport.get({ query: 'param=value' });
   *
   * // ファイルの取得
   * const file = await transport.get({
   *   path: 'filename.txt',
   *   query: 'param=value',
   *   responseType: 'file',
   *   encoding: 'utf-8'
   * });
   * ```
   *
   * @throws {CybozuOfficeSDKException} リクエストが失敗した場合
   */
  async get(options: GetOptions = {}): Promise<string> {
    const { path, query = '', responseType = 'text', encoding = 'utf-8' } = options;

    const response = await this.sendRequest({
      method: 'GET',
      path,
      query,
      ensuresLoggedIn: true,
    });

    if (responseType === 'file') {
      return Buffer.from(response.data).toString(encoding).trim();
    }

    return response.data;
  }

  /**
   * POSTリクエストを実行します
   *
   * @param body - POSTリクエストのボディ
   *
   * @example
   * ```typescript
   * await transport.post('action=update&id=1&value=new');
   * ```
   *
   * @throws {CybozuOfficeSDKException} リクエストが失敗した場合
   */
  async post(body: string): Promise<void> {
    await this.sendRequest({
      method: 'POST',
      contentType: ContentType.FORM_URLENCODED,
      body,
      ensuresLoggedIn: true,
    });
  }

  /**
   * HTTPリクエストを実行します
   *
   * @param options - リクエストオプション
   * @returns axiosのレスポンス
   * @private
   */
  private async sendRequest(options: RequestOptions): Promise<AxiosResponse> {
    // ログイン済みが前提のリクエストの場合、 Cookie が未取得であれば Cookie を取得する
    if (options.ensuresLoggedIn && !this.sessionCredentials) {
      await this.initializeSession();
    }

    // ログイン済みが前提の POST リクエストの場合、 CSRF トークンを取得する
    if (options.ensuresLoggedIn && !this.sessionCredentials?.csrfTicket && options.method === 'POST') {
      this.sessionCredentials!.csrfTicket = await this.fetchCsrfTicket();
    }

    const url = this.buildRequestUrl(options);
    const requestConfig = this.buildRequestConfig(options);

    const response = await this.axiosInstance.request({
      url,
      ...requestConfig,
    });

    this.validateResponse(response);

    const needsLogin = response.headers['x-cybozulogin'] === '1';
    if (!options.preventSessionRefresh && needsLogin) {
      await this.initializeSession();
      return this.sendRequest({ preventSessionRefresh: true, ...options });
    }

    return response;
  }

  /**
   * リクエストURLを構築します
   *
   * @param options - リクエストオプション
   * @returns 構築されたURL
   * @private
   */
  private buildRequestUrl(options: RequestOptions): string {
    const { query = null } = options;
    const queryString = query ? `${Utils.buildQuery(query as string | QueryParams)}` : '';
    return queryString ? `?${queryString}` : '';
  }

  /**
   * リクエストの設定を構築します
   *
   * @param options - リクエストオプション
   * @returns axiosに渡すリクエスト設定
   * @private
   */
  private buildRequestConfig(options: RequestOptions): Record<string, unknown> {
    const headers: Record<string, string> = {
      Cookie: this.sessionCredentials?.cookie || '',
    };

    if (options.contentType) {
      headers['Content-Type'] = options.contentType;
    }

    const config: Record<string, unknown> = {
      method: options.method,
      headers,
      responseType: 'arraybuffer',
    };

    if (options.body) {
      config.data = this.appendCsrfTicket(options.body);
    }

    return config;
  }

  /**
   * レスポンスを検証します
   *
   * @param response - axiosのレスポンス
   * @throws {CybozuOfficeSDKException} サイボウズからエラーが返された場合
   * @private
   * @see https://jp.cybozu.help/of10/ja/error.html
   */
  private validateResponse(response: AxiosResponse): void {
    const cybozuError = response.headers['x-cybozu-error'];
    if (cybozuError) {
      throw new CybozuOfficeSDKException(cybozuError);
    }
  }

  /**
   * CSRFトークンをボディに追加します
   *
   * @param body - 元のリクエストボディ
   * @returns CSRFトークンが追加されたボディ
   * @private
   */
  private appendCsrfTicket(body: string): string {
    if (this.sessionCredentials?.csrfTicket) {
      return `${body}&csrf_ticket=${this.sessionCredentials?.csrfTicket}`;
    }

    return body;
  }

  /**
   * セッションを初期化します
   *
   * @throws {CybozuOfficeSDKException} 認証に失敗した場合
   * @private
   */
  private async initializeSession(): Promise<void> {
    const loginResponse = await this.performLogin();
    const cookieValue = await this.extractSessionCookie(loginResponse);
    this.sessionCredentials = {
      cookie: cookieValue,
    };
  }

  /**
   * ログインリクエストを実行します
   *
   * @returns ログインレスポンス
   * @throws {CybozuOfficeSDKException} ログインに失敗した場合
   * @private
   */
  private async performLogin(): Promise<AxiosResponse> {
    const response = await this.sendRequest({
      method: 'POST',
      contentType: ContentType.FORM_URLENCODED,
      body: this.buildLoginBody(),
      ensuresLoggedIn: false,
    });

    this.validateResponse(response);
    return response;
  }

  /**
   * ログインボディを構築します
   *
   * @returns ログインリクエストのボディ文字列
   * @private
   */
  private buildLoginBody(): string {
    return [
      this.accountId ? `_Account=${this.accountId}` : `_ID=${this.id}`,
      `Password=${this.password}`,
      '_System=login',
      '_Login=1',
      `LoginMethod=${this.accountId ? '2' : ''}`,
    ].join('&');
  }

  /**
   * セッションクッキーを抽出します
   *
   * @param response - ログインレスポンス
   * @returns セッションクッキー文字列
   * @throws {CybozuOfficeSDKException} クッキーの抽出に失敗した場合
   * @private
   */
  private async extractSessionCookie(response: AxiosResponse): Promise<string> {
    const setCookie = response.headers['set-cookie'];
    if (!setCookie || !Array.isArray(setCookie) || setCookie.length === 0) {
      throw new CybozuOfficeSDKException('Failed to get session cookie');
    }

    const match = /AGSESSID=(.*?);/i.exec(setCookie[0]);
    if (!match) {
      throw new CybozuOfficeSDKException('Failed to extract AGSESSID');
    }

    return Utils.createCookieValue(match[1]);
  }

  /**
   * CSRFトークンを取得します
   *
   * @returns CSRFトークン文字列
   * @throws {CybozuOfficeSDKException} トークンの取得に失敗した場合
   * @private
   */
  private async fetchCsrfTicket(): Promise<string> {
    const response = await this.sendRequest({
      method: 'GET',
      ensuresLoggedIn: false,
    });
    const page = response.data.toString();
    const match = /<input type="hidden" name="csrf_ticket" value="(.*?)">/i.exec(page);

    if (!match) {
      throw new CybozuOfficeSDKException('Failed to extract CSRF ticket');
    }

    return match[1];
  }
}
