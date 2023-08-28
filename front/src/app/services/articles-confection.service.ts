import { Injectable } from '@angular/core';
import { AbstractService } from './abstract.service';
import { Article, ArticleAll } from '../shared/interfaces/Article';
import { Subscriber, tap } from 'rxjs';
import { ArticleConfectionAllResponse } from '../shared/interfaces/Response';

@Injectable({
    providedIn: 'root',
})
export class ArticlesConfectionService extends AbstractService<Article> {
    url() {
        return this.base + 'articles/confection';
    }

    all(page: number, limit: number) {
        return this.http.get<any>(
            `${this.url()}/all?page=${page}&size=${limit}`
        );
    }
}
