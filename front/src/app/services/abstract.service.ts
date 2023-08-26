import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import {
    DataResponse,
    PaginationResponse,
} from '../shared/interfaces/Response';

@Injectable({
    providedIn: 'root',
})
export abstract class AbstractService<T> {
    protected base = 'http://localhost:8000/api/';

    abstract url(): string;

    constructor(protected http: HttpClient) {}

    paginate(page: number, size: number): Observable<PaginationResponse<T>> {
        return this.http.get<PaginationResponse<T>>(
            this.url() + '?page=' + page + '&size=' + size
        );
    }

    delete(id: number): Observable<DataResponse<T>> {
        return this.http.delete<DataResponse<T>>(this.url() + '/' + id);
    }

    search(value: string): Observable<T> {
        return this.http.get<T>(this.url() + '/search?value=' + value);
    }

    create(data: T): Observable<DataResponse<T>> {
        return this.http.post<DataResponse<T>>(this.url(), data);
    }

    update(id: number, data: T): Observable<DataResponse<T>> {
        return this.http.put<DataResponse<T>>(this.url() + '/' + id, data);
    }

    private handleError(error: HttpErrorResponse) {
        if (error.status === 0) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong.
            console.error(
                `Backend returned code ${error.status}, body was: `,
                error.error
            );
        }
        // Return an observable with a user-facing error message.
        return throwError(
            () => new Error('Something bad happened; please try again later.')
        );
    }
}
