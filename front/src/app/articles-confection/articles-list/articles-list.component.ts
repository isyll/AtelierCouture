import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Article } from '../../shared/interfaces/Article';
import { AlertMsg } from 'src/app/shared/interfaces/AlertMsg';
import { Categorie } from 'src/app/shared/interfaces/Categorie';
import { Fournisseur } from 'src/app/shared/interfaces/Fournisseur';

@Component({
    selector: 'app-articles-list',
    templateUrl: './articles-list.component.html',
})
export class ArticlesListComponent implements OnInit {
    @Input()
    data!: {
        articles: Article[];
        categories: Categorie[];
        fournisseurs: Fournisseur[];
    };

    @Input()
    page: number = 1;

    @Input()
    total!: number;

    @Input()
    size!: number;

    @Output()
    articleEvent = new EventEmitter();

    @Output()
    delArticleEvent = new EventEmitter();

    @Output()
    onAlert = new EventEmitter<AlertMsg>();

    deleteArticleConfirm: { [key: string]: any } = {};

    confirmationTimeOut: number = 3000;
    countdown!: number;
    countdownTimer!: any;

    constructor() {}

    ngOnInit(): void {}

    updateCurrentArticle(article: Article) {
        this.articleEvent.emit(article);
    }

    onDeleteArticle(article: Article) {
        clearInterval(this.countdownTimer);

        const removeConfirmation = () =>
            delete this.deleteArticleConfirm[article.id];

        if (article.id in this.deleteArticleConfirm) {
            this.delArticleEvent.emit(article.id);

            clearTimeout(this.deleteArticleConfirm[article.id]);
            removeConfirmation();

            this.onAlert.emit({
                title: 'Article supprimé avec succès',
                body: '',
                msg: true,
            });
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
