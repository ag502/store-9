import AuthRequest from '@shared/dtos/auth/request';
import AuthResponse from '@shared/dtos/auth/response';
import BaseApi from './BaseApi';

class AuthApi extends BaseApi {
  login(body: AuthRequest.Login) {
    return this.post<AuthResponse.Login>('/login', body);
  }

  githubLogin(body: AuthRequest.GithubLogin) {
    return this.post<AuthResponse.GithubLogin>('/github', body);
  }

  signup(body: AuthRequest.Signup) {
    return this.post('/signup', body);
  }

  logout() {
    return this.get('/logout');
  }

  check() {
    return this.get<AuthResponse.Login>('/check');
  }

  getTerms() {
    return this.get<AuthResponse.GetTerms>('/terms');
  }
}

export default new AuthApi('auth');
