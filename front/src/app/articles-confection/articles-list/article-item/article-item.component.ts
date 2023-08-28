import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Article } from 'src/app/shared/interfaces/Article';

@Component({
    selector: '[article-item]',
    template: `
        <td>
            {{ article.libelle }}
        </td>
        <td>
            {{ article.prix }}
        </td>
        <td>
            {{ article.stock }}
        </td>
        <td>
            {{ article.category.libelle }}
        </td>
        <td>
            <button
                class="text-warning btn btn-link"
                [value]="article.id"
                (click)="editHandler(article)"
            >
                Edit
            </button>
            <code class="text-dark"> / </code>
            <button
                class="text-danger btn btn-link"
                [value]="article.id"
                (click)="deleteHandler(article)"
            >
                {{ deleteLabel }}
            </button>
        </td>
    `,
})
export class ArticleItemComponent {
    @Input()
    article!: Article;

    @Input()
    deleteLabel!: string;

    @Output()
    editEvent = new EventEmitter<Article>();

    @Output()
    deleteEvent = new EventEmitter<Article>();

    editHandler(article: Article) {
        this.editEvent.emit(article);
    }

    deleteHandler(article: Article) {
        this.deleteEvent.emit(article);
    }
}
