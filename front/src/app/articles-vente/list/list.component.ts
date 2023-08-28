import { Component, EventEmitter, Input, Output } from '@angular/core';
import { mode } from 'src/app/shared/enums/mode';
import { Article } from 'src/app/shared/interfaces/Article';
import { ArticleVenteData } from 'src/app/shared/interfaces/ArticleVente';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
})
export class ListComponent {
    @Input()
    data!: ArticleVenteData;

    @Input()
    mode!: mode;

    @Input()
    size!: number;

    @Input()
    page!: number;

    @Input()
    total!: number;

    constructor() {}

    @Output()
    editArticle = new EventEmitter();

    @Output()
    deleteArticle = new EventEmitter();

    deleteArticleConfirm: { [key: string]: any } = {};
    confirmationTimeOut: number = 3000;
    countdown!: number;
    countdownTimer!: any;

    onDeleteArticle(article: Article) {
        console.log(article);

        clearInterval(this.countdownTimer);

        const removeConfirmation = () =>
            delete this.deleteArticleConfirm[article.id];

        if (article.id in this.deleteArticleConfirm) {
            this.deleteArticle.emit(article);

            clearTimeout(this.deleteArticleConfirm[article.id]);
            removeConfirmation();
        } else {
            this.deleteArticleConfirm = {};
            clearInterval(this.countdownTimer);

            this.deleteArticleConfirm[article.id] = setTimeout(() => {
                removeConfirmation();

                if (this.countdown < 1) {
                    clearInterval(this.countdownTimer);
                    this.countdown = this.confirmationTimeOut / 1000;
                }
            }, this.confirmationTimeOut);

            this.countdown = this.confirmationTimeOut / 1000;
            this.countdownTimer = setInterval(() => this.countdown--, 1000);
        }
    }
}
