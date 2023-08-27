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
}
