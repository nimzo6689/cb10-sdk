import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';
import https from 'https';
import { ContentType } from './Constants';
import { CybozuOfficeSDKException } from './Errors';

export type CustomURLParams = Record<string, string | number | boolean | Array<string | number | boolean>>;

/**
 * サイボウズOffice接続の設定オプションを定義するインターフェース
 *
 * @interface CybozuOfficeOptions
 * @property {string} baseUrl - 処理対象となるサイボウズのURL（http~/ag.cgiまで）
 * @property {string} accountId - ログインID
 * @property {string} password - パスワード
 * @property {string} [cookie] - 有効期限内のクッキー情報（未指定の場合は自動で取得）
 */
export interface CybozuOfficeOptions {
  baseUrl: string;
  accountId?: string;
  id?: string;
  password: string;
  sessionCredentials?: SessionCredentials;
  axiosRequestConfig?: AxiosRequestConfig;
}

/**
 * HTTPリクエストのオプションを定義するインターフェース
 *
 * @interface RequestOptions
 * @property {string} method - HTTPメソッド（GET, POST等）
 * @property {string} [path] - リクエストパス
 * @property {string} [contentType] - コンテントタイプ
 * @property {CustomURLPrams} [query] - URLクエリパラメータ
 * @property {CustomURLPrams} [body] - リクエストボディ
 */
interface RequestOptions {
  method: string;
  path?: string;
  contentType?: string;
  query?: CustomURLParams;
  body?: CustomURLParams;
  ensuresLoggedIn: boolean;
  preventSessionRefresh?: boolean;
}

/**
 * GETリクエストのオプションを定義するインターフェース
 *
 * @interface GetOptions
 * @property {string} [path] - リクエストパス
 * @property {CustomURLPrams} [query] - URLクエリパラメータ
 * @property {'text' | 'file'} [responseType] - レスポンスタイプ（デフォルト: 'text'）
 * @property {BufferEncoding} [encoding] - ファイル取得時のエンコーディング（デフォルト: 'utf-8'）
 */
export interface GetOptions {
  path?: string;
  query?: CustomURLParams;
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
 */
export default class Transport {
  readonly #axiosInstance: AxiosInstance;

  get sessionCredentials(): SessionCredentials | undefined {
    return this.options.sessionCredentials;
  }

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
  constructor(private readonly options: CybozuOfficeOptions) {
    const axiosConfig: AxiosRequestConfig = {
      ...(options.axiosRequestConfig || {}),
      baseURL: this.options.baseUrl,
      maxRedirects: 0,
      validateStatus: status => {
        return status === 200 || status === 302;
      },
    };

    this.#axiosInstance = axios.create(axiosConfig);
  }

  /**
   * GETリクエストを実行します
   *
   * @param options - GETリクエストのオプション
   * @returns 取得したコンテンツ
   *
   * @throws {CybozuOfficeSDKException} リクエストが失敗した場合
   */
  async get(options: GetOptions = {}): Promise<string> {
    const { path, query, responseType = 'text', encoding = 'utf-8' } = options;

    const response = await this.#sendRequest({
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
   * @throws {CybozuOfficeSDKException} リクエストが失敗した場合
   */
  async post(body: CustomURLParams): Promise<void> {
    await this.#sendRequest({
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
   */
  async #sendRequest(options: RequestOptions): Promise<AxiosResponse> {
    // ログイン済みが前提のリクエストの場合、 Cookie が未取得であれば Cookie を取得する
    if (options.ensuresLoggedIn && !this.options.sessionCredentials) {
      await this.#initializeSession();
    }

    // ログイン済みが前提の POST リクエストの場合、 CSRF トークンを取得する
    if (options.ensuresLoggedIn && !this.options.sessionCredentials?.csrfTicket && options.method === 'POST') {
      this.options.sessionCredentials!.csrfTicket = await this.#fetchCsrfTicket();
    }

    const requestConfig = this.#buildRequestConfig(options);
    if (options.query) {
      requestConfig.params = Transport.#createURLParams(options.query);
    }

    const response = await this.#axiosInstance.request(requestConfig);
    Transport.#validateResponse(response);

    const needsLogin = response.headers['x-cybozulogin'] === '1';
    if (!options.preventSessionRefresh && needsLogin) {
      await this.#initializeSession();
      return this.#sendRequest({ preventSessionRefresh: true, ...options });
    }
    return response;
  }

  static #createURLParams(params: CustomURLParams): URLSearchParams {
    return new URLSearchParams(
      Object.entries(params).flatMap(([key, value]) => {
        if (Array.isArray(value)) {
          return value.map(v => [key, String(v)]);
        }
        return [[key, String(value)]];
      })
    );
  }

  /**
   * リクエストの設定を構築します
   *
   * @param options - リクエストオプション
   * @returns axiosに渡すリクエスト設定
   */
  #buildRequestConfig(options: RequestOptions): Record<string, unknown> {
    const headers: Record<string, string> = {
      Cookie: this.options.sessionCredentials?.cookie || '',
    };

    if (options.contentType) {
      headers['Content-Type'] = options.contentType;
    }

    const config: Record<string, unknown> = {
      method: options.method,
      headers,
      responseType: 'arraybuffer',
    };
    if (options.query) {
      config.params = Transport.#createURLParams(options.query);
    }
    if (options.body) {
      this.#appendCsrfTicket(options.body);
      config.data = Transport.#createURLParams(options.body);
    }

    return config;
  }

  /**
   * レスポンスを検証します
   *
   * @param response - axiosのレスポンス
   * @throws {CybozuOfficeSDKException} サイボウズからエラーが返された場合
   * @see https://jp.cybozu.help/of10/ja/error.html
   */
  static #validateResponse(response: AxiosResponse): void {
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
   */
  #appendCsrfTicket(body: CustomURLParams): void {
    if (this.options.sessionCredentials?.csrfTicket) {
      body.csrf_ticket = this.options.sessionCredentials.csrfTicket;
    }
  }

  /**
   * セッションを初期化します
   *
   * @throws {CybozuOfficeSDKException} 認証に失敗した場合
   */
  async #initializeSession(): Promise<void> {
    const loginResponse = await this.#performLogin();
    const cookieValue = Transport.#extractSessionCookie(loginResponse);
    this.options.sessionCredentials = {
      cookie: cookieValue,
    };
  }

  /**
   * ログインリクエストを実行します
   *
   * @returns ログインレスポンス
   * @throws {CybozuOfficeSDKException} ログインに失敗した場合
   */
  async #performLogin(): Promise<AxiosResponse> {
    const response = await this.#sendRequest({
      method: 'POST',
      contentType: ContentType.FORM_URLENCODED,
      body: this.#buildLoginBody(),
      ensuresLoggedIn: false,
    });

    return response;
  }

  /**
   * ログインボディを構築します
   *
   * @returns ログインリクエストのボディ文字列
   */
  #buildLoginBody(): CustomURLParams {
    const body: CustomURLParams = {
      Password: this.options.password,
      _System: 'login',
      _Login: '1',
    };
    if (this.options.id) {
      body._ID = this.options.id;
    } else if (this.options.accountId) {
      body._Account = this.options.accountId;
    }

    return body;
  }

  /**
   * セッションクッキーを抽出します
   *
   * @param response - ログインレスポンス
   * @returns セッションクッキー文字列
   * @throws {CybozuOfficeSDKException} クッキーの抽出に失敗した場合
   */
  static #extractSessionCookie(response: AxiosResponse): string {
    const setCookie = response.headers['set-cookie'];
    if (!setCookie || !Array.isArray(setCookie) || setCookie.length === 0) {
      throw new CybozuOfficeSDKException('Failed to get session cookie');
    }

    const AGSESSID_REGEX = /(AGSESSID=.*?);/i;
    const match = setCookie.filter(cookie => AGSESSID_REGEX.test(cookie)).map(cookie => AGSESSID_REGEX.exec(cookie));
    if (!match || !match[0]) {
      throw new CybozuOfficeSDKException('Failed to extract AGSESSID');
    }
    return match[0][1];
  }

  /**
   * CSRFトークンを取得します
   *
   * @returns CSRFトークン文字列
   * @throws {CybozuOfficeSDKException} トークンの取得に失敗した場合
   */
  async #fetchCsrfTicket(): Promise<string> {
    const response = await this.#sendRequest({
      // 「ファイルの追加」ページは HTML のファイルサイズが小さく、かつ、CSRF トークンが取得できるため利用
      query: { page: 'FileAdd' },
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
