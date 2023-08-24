import { Injectable } from '@angular/core';
import { AbstractService } from './abstract.service';
import { Article, ArticleAll } from '../shared/interfaces/Article';
import { Subscriber } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ArticlesService extends AbstractService<Article> {
    url() {
        return 'articles';
    }

    all(page: number, limit: number) {
        return this.http.get<ArticleAll>(
            `${this.base}${this.url()}/all?page=${page}&size=${limit}`
        );
    }
}