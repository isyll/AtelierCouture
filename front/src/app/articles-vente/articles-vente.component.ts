import { Component, OnInit } from '@angular/core';
import { ArticleVenteData } from '../shared/interfaces/ArticleVente';
import { ArticlesVenteService } from '../services/articles-vente.service';
import { mode } from '../shared/enums/mode';

@Component({
    selector: 'app-articles-vente',
    templateUrl: './articles-vente.component.html',
})
export class ArticlesVenteComponent implements OnInit {
    data!: ArticleVenteData;
    page = 1;
    size = 2;
    total!: number;
    mode: mode = mode.add;

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
            this.data.articles_vente = response;
            this.total = response.pagination.total;
            this.size = response.pagination.per_page;
        });
    }

    switchMode() {
        if (this.mode === mode.add) this.mode = mode.edit;
        else this.mode = mode.add;
    }
}
