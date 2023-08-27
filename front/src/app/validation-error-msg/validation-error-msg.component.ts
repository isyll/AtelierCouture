import { Component, Input } from '@angular/core';

@Component({
    selector: 'validation-error-msg',
    template: `
        <div *ngIf="condition" class="text-danger" style="font-size: 93%">
            <ng-content></ng-content>
        </div>
    `,
})
export class ValidationErrorMsgComponent {
    @Input()
    condition!: any;
}
