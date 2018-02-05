import { Observable } from 'rxjs';
import { HttpService } from '../core/http.service';

export class BaseService {
  public path: string;

  constructor(public http: HttpService) {
    this.path = '';
  }

  public getSortByList(): Observable<any> {
    return this.http.get(`${this.path}/sort-by-list`)
      .map(this.extractData)
      .catch(this.handleError);
  }

  public getById(id: string): Observable<any> {
    return this.http.get(`${this.path}/${id}`)
      .map(this.extractData)
      .catch(this.handleError);
  }

  public update(id: string, data: any): Observable<any> {
    return this.http.put(`${this.path}/${id}`, JSON.stringify(data))
      .map(this.extractData)
      .catch(this.handleError);
  }

  public create(data: any): Observable<any> {
    return this.http.post(`${this.path}`, JSON.stringify(data))
      .map(this.extractData)
      .catch(this.handleError);
  }

  public delete(id: string): Observable<any> {
    return this.http.delete(`${this.path}/${id}`)
      .map(this.extractData)
      .catch(this.handleError);
  }

  public extractData(resp: any): any {
    const body = resp.json();
    return body || {};
  }

  public handleError(error: Response): Observable<any> {
    return Observable.throw(error.json());
  }
}
