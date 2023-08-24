import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ArticlesService } from '../services/articles.service';
import { Response } from '../shared/interfaces/Response';
import { Article } from '../shared/interfaces/Article';
import { mode } from '../shared/enums/mode';
import { Categorie } from '../shared/interfaces/Categorie';
import { AlertMsg } from '../shared/interfaces/AlertMsg';
import { Fournisseur } from '../shared/interfaces/Fournisseur';

@Component({
    selector: 'app-articles',
    templateUrl: './articles.component.html',
})
export class ArticlesComponent implements OnInit {
    data: {
        articles: Article[];
        categories: Categorie[];
        fournisseurs: Fournisseur[];
    } = { articles: [], categories: [], fournisseurs: [] };
    size: number = 10;
    p: number = 1;
    total!: number;
    article!: Article | undefined;
    mode: mode = mode.add;

    alertMsg: AlertMsg = {
        value: false,
        title: '',
        body: '',
        msg: true,
    };

    constructor(private service: ArticlesService) {}

    ngOnInit(): void {
        this.service.all(this.p, this.size).subscribe((response) => {
            this.data.articles = response.data.reverse();
            this.data.categories = response.categories;
            this.data.fournisseurs = response.fournisseurs;
            this.size = response.pagination.per_page;
            this.total = response.pagination.total;
        });
    }

    pageLoad(p: number) {
        this.p = p;

        this.service.paginate(this.p, this.size).subscribe((response) => {
            this.data.articles = response.data.reverse();
            this.size = response.pagination.per_page;
            this.total = response.pagination.total;
        });
    }

    updateCurrentArticle(article: Article | undefined) {
        this.article = article;
        this.mode = mode.edit;
    }

    toAddMode() {
        this.article = undefined;
        this.mode = mode.add;
    }

    formSubmitted(
        data: Article | { [key: string]: number | string | Array<number> }
    ) {
        if ('fournisseurs' in data) {
            let fourn = data.fournisseurs as Array<Fournisseur>;

            // si je reçois un tableau de fournisseurs je le transforme en tableau d'ids
            if (fourn && fourn.every((f) => 'id' in f))
                data.fournisseurs = fourn.map((f) => f.id);
        }

        if (this.mode === mode.add) {
            this.service.create(data as Article).subscribe((response) => {
                let lastPage = Math.floor((this.total + 1) / this.size);
                if ((this.total + 1) / this.size - lastPage > 0) lastPage++;

                this.pageLoad(lastPage);

                this.alertMsg = {
                    value: true,
                    title: 'Article créé avec succès.',
                    body: '',
                    msg: true,
                };
            });
        } else if (this.article) {
            this.service.update(this.article.id, data as Article).subscribe({
                next: (value) => {
                    this.data.articles = this.data.articles?.map((a) => {
                        if (data.id != a.id) return a;
                        return data as Article;
                    });
                    this.alertMsg = {
                        value: true,
                        title: 'Article modifié avec succès.',
                        body: '',
                        msg: true,
                    };
                },
            });
        }
    }

    onDelArticle(id: number) {
        this.service.delete(id).subscribe(() => {
            this.data.articles = this.data.articles.filter(
                (a: Article) => a.id != id
            );
            this.total--;
        });
    }

    onAlert(alert: AlertMsg) {
        this.alertMsg = alert;
        this.alertMsg.value = true;
    }
}
