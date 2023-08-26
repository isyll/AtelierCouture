import { Component, Input } from '@angular/core';
import { mode } from 'src/app/shared/enums/mode';
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
}
