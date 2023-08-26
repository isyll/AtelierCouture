import { Injectable } from '@angular/core';
import { AbstractService } from './abstract.service';
import { Article } from '../shared/interfaces/Article';
import { ArticleVenteData } from '../shared/interfaces/ArticleVente';

@Injectable({
    providedIn: 'root',
})
export class ArticlesVenteService extends AbstractService<Article> {
    url() {
        return this.base + 'articles/vente';
    }

    all(page: number, size: number) {
        return this.http.get<ArticleVenteData>(
            `${this.url()}/all?size=${size}&page=${page}`
        );
    }
}
