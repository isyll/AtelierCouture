import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Fournisseur } from 'src/app/shared/interfaces/Fournisseur';

@Component({
    selector: 'app-selected-item',
    template: `
        <button
            type="button"
            class="btn bg-dark-subtle position-relative border border-2"
            *ngIf="data"
        >
            {{ data.nom }}
            <span
                class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-dark-subtle text-dark border border-2"
                style="cursor: pointer;"
                (click)="deleteHandler()"
            >
                <i class="bi bi-x-lg"></i>
            </span>
        </button>
    `,
})
export class SelectedItemComponent {
    @Input()
    data!: any;

    @Output()
    itemDeleted = new EventEmitter<Fournisseur>();

    deleteHandler() {
        this.itemDeleted.emit(this.data);
    }
}
