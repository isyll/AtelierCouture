import {
    Component,
    OnChanges,
    OnInit,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import { ArticlesConfectionService } from '../services/articles-confection.service';
import { Article } from '../shared/interfaces/Article';
import { mode } from '../shared/enums/mode';
import { Categorie } from '../shared/interfaces/Categorie';
import { AlertMsg } from '../shared/interfaces/AlertMsg';
import { Fournisseur } from '../shared/interfaces/Fournisseur';
import { ArticleConfectionAllResponse } from '../shared/interfaces/Response';
import { catchError, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ArticlesShowComponent } from './articles-form/articles-form.component';
import { CategorieConfectionService } from '../services/categorie-confection.service';
import { AddCategoryComponent } from './articles-form/add-category/add-category.component';

@Component({
    selector: 'app-articles',
    templateUrl: './articles.component.html',
})
export class ArticlesComponent implements OnInit {
    @ViewChild(ArticlesShowComponent, { static: false })
    articleConfectionFormComponent: ArticlesShowComponent = <
        ArticlesShowComponent
    >{};
    data: ArticleConfectionAllResponse = {
        articles: [],
        categories: [],
        fournisseurs: [],
        unites: [],
    };
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

    constructor(
        private service: ArticlesConfectionService,
        private categorieService: CategorieConfectionService
    ) {}

    ngOnInit(): void {
        this.service.all(this.p, this.size).subscribe((response) => {
            this.data.articles = response.data.reverse();
            this.data.categories = response.categories;
            this.data.fournisseurs = response.fournisseurs;
            this.data.unites = response.unites;
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
        if (this.mode === mode.add) {
            this.service
                .create(data as Article)
                .pipe(catchError(this.handleError))
                .subscribe((response) => {
                    // on charge la page ou se trouve l'élément ajouté
                    let lastPage = Math.floor((this.total + 1) / this.size);
                    if ((this.total + 1) / this.size - lastPage > 0) lastPage++;
                    this.pageLoad(lastPage);

                    this.alertMsg = {
                        value: true,
                        title: response.message ?? 'Article créé avec succès',
                        body: '',
                        msg: true,
                    };

                    this.articleConfectionFormComponent.resetForm();
                });
        } else if (this.article) {
            this.service
                .update(this.article.id, data as Article)
                .pipe(catchError(this.handleError))
                .subscribe((response) => {
                    this.pageLoad(this.p);

                    this.alertMsg = {
                        value: true,
                        title:
                            response.message ?? 'Article modifié avec succès.',
                        body: '',
                        msg: true,
                    };

                    this.articleConfectionFormComponent.resetForm();
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

    newCategory(data: Categorie) {
        console.log(data);
        this.categorieService
            .create(data)
            .pipe(catchError(this.handleError))
            .subscribe((response) => {
                this.alertMsg = {
                    value: true,
                    title: response.message ?? 'Catégorie créée avec succès.',
                    body: '',
                    msg: true,
                };

                this.articleConfectionFormComponent.resetAddCategoryForm();
            });
    }

    protected handleError = (error: HttpErrorResponse) => {
        if (error.status === 0) {
            this.alertMsg = {
                msg: true,
                body: "Impossible d'effectuer l'opération",
                title: "Une erreur inconnue s'est produite",
            };
        } else {
            this.alertMsg = {
                value: true,
                msg: false,
                body: error.error.message,
                title: "Une erreur s'est produite",
            };
        }

        return throwError(() => new Error(''));
    };
}
