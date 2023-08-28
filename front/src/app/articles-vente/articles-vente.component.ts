import { Component, OnInit, ViewChild } from '@angular/core';
import { ArticleVenteData } from '../shared/interfaces/ArticleVente';
import { ArticlesVenteService } from '../services/articles-vente.service';
import { mode } from '../shared/enums/mode';
import { AlertMsg } from '../shared/interfaces/AlertMsg';
import { catchError, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { FormComponent } from './form/form.component';
import { Article } from '../shared/interfaces/Article';

@Component({
    selector: 'app-articles-vente',
    templateUrl: './articles-vente.component.html',
})
export class ArticlesVenteComponent implements OnInit {
    @ViewChild(FormComponent, { static: false })
    form: FormComponent = <any>{};

    data!: ArticleVenteData;

    page = 1;

    size = 2;

    total!: number;

    mode: mode = mode.add;

    alert: AlertMsg = {
        value: false,
        msg: true,
        title: '',
        body: '',
    };

    article!: Article | undefined;

    constructor(private service: ArticlesVenteService) {}

    ngOnInit(): void {
        this.service.all(this.page, this.size).subscribe((response) => {
            this.data = response;
            this.total = response.articles_vente.pagination.total;
        });
    }

    pageLoad(p: number): void {
        this.page = p;

        this.service.paginate(this.page, this.size).subscribe((response) => {
            console.log(response);

            this.data.articles_vente = response;
            this.total = response.pagination.total;
            this.size = response.pagination.per_page;
        });
    }

    switchMode() {
        if (this.mode === mode.add) this.mode = mode.edit;
        else {
            this.article = undefined;
            this.form.resetForm();
            this.mode = mode.add;
        }
    }

    submitForm(data: any) {
        if (this.mode === mode.add) {
            this.service
                .create(data)
                .pipe(catchError(this.handleError))
                .subscribe((response: any) => {
                    this.alert = {
                        value: true,
                        msg: true,
                        body: '',
                        title: response.message,
                    };

                    this.form.resetForm();
                });

            // on charge la derniere page ou se trouve le nouvel article
            let lastPage = Math.floor((this.total + 1) / this.size);
            if ((this.total + 1) / this.size - lastPage > 0) lastPage++;
            this.pageLoad(lastPage);
        } else {
            this.service
                .update(data.id, data)
                .pipe(catchError(this.handleError))
                .subscribe((response: any) => {
                    this.alert = {
                        value: true,
                        msg: true,
                        body: '',
                        title: response.message,
                    };

                    this.form.resetForm();
                });
        }
    }

    onDeleteArticle(art: any) {
        this.service
            .delete(art.id)
            .pipe(catchError(this.handleError))
            .subscribe((response: any) => {
                this.alert = {
                    value: true,
                    msg: true,
                    body: '',
                    title: response.message,
                };

                this.data.articles_vente.data =
                    this.data.articles_vente.data.filter(
                        (item) => item.id != art.id
                    );
            });
    }

    onEditArticle(art: any) {
        this.article = art;
        this.switchMode(); // mode == 'edit'
    }

    protected handleError = (error: HttpErrorResponse) => {
        if (error.status === 0) {
            this.alert = {
                msg: true,
                body: "Impossible d'effectuer l'opération",
                title: "Une erreur inconnue s'est produite",
            };
        } else {
            this.alert = {
                value: true,
                msg: false,
                body: error.error.message,
                title: "Une erreur s'est produite",
            };
        }

        return throwError(() => new Error(''));
    };
}
