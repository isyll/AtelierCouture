import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    Output,
    ViewChild,
} from '@angular/core';

@Component({
    selector: 'app-art-suggestions',
    styleUrls: ['./art-suggestions.component.scss'],
    template: ` <div
        class="suggestions-box shadow"
        *ngIf="items && items.length"
    >
        <div
            class="suggestion-item"
            *ngFor="let i of items"
            (click)="itemClickedEvent(i)"
        >
            {{ print(i) }}
        </div>
    </div>`,
})
export class ArtSuggestionsComponent {
    @Input()
    items!: any[];
    @Input()
    input!: HTMLInputElement;

    // cette variable doit contenir une fonction qui doit spécifier
    // de quelle manière les données de suggestion devront être affichés
    @Input()
    print!: (i: any) => any;

    @Output()
    itemClicked = new EventEmitter<any>();

    constructor() {}

    itemClickedEvent(i: any) {
        this.input.value = this.print(i);
        this.itemClicked.emit(i);
    }
}
