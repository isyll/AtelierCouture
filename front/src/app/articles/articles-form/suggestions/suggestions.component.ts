import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    Renderer2,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import { Fournisseur } from 'src/app/shared/interfaces/Fournisseur';

@Component({
    selector: 'app-suggestions',
    styleUrls: ['./suggestions.component.scss'],
    template: `
        <div
            class="suggestions-box shadow"
            #container
            *ngIf="items && items.length"
        >
            <div
                class="suggestion-item"
                *ngFor="let i of items"
                (click)="itemClicked.emit(i)"
            >
                {{ i.nom }}
            </div>
        </div>
    `,
})
export class SuggestionsComponent {
    @ViewChild('container', { read: ElementRef }) container!: ElementRef;

    @Input()
    items!: any[];

    @Output()
    itemClicked = new EventEmitter<Fournisseur>();

    constructor() {}
}
