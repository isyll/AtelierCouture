import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    Output,
    ViewChild,
} from '@angular/core';

@Component({
    selector: 'app-suggestions',
    styleUrls: ['./suggestions.component.scss'],
    template: `
        <input
            type="text"
            class="form-control"
            (input)="onInputEvent($event)"
            #input
        />
        <div class="suggestions-box shadow" *ngIf="items && items.length">
            <div
                class="suggestion-item"
                *ngFor="let i of items"
                (click)="itemClickedEvent(i)"
            >
                {{ print(i) }}
            </div>
        </div>
    `,
})
export class SuggestionsComponent {
    @ViewChild('input', { read: ElementRef }) input!: ElementRef;

    @Input()
    items!: any[];

    // cette variable doit contenir une fonction qui doit spécifier
    // de quelle manière les données de suggestion devront être affichés
    @Input()
    print!: (i: any) => any;

    @Output()
    itemClicked = new EventEmitter<any>();

    @Output()
    onInput = new EventEmitter<any>();

    constructor() {}

    onInputEvent(event: Event) {
        const target = event.target as HTMLInputElement;
        this.onInput.emit(
            target.value.trim().replace(/\s+/g, ' ').toLowerCase()
        );
    }

    itemClickedEvent(i: any) {
        this.input.nativeElement.value = this.print(i);
        this.itemClicked.emit(i);
    }
}
