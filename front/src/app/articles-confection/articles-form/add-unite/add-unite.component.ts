import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Categorie } from 'src/app/shared/interfaces/Categorie';

@Component({
    selector: 'add-new-unite',
    templateUrl: './add-unite.component.html',
})
export class AddUniteComponent {
    @Output('onSubmit')
    submitEvent = new EventEmitter();
    form!: FormGroup;

    constructor(private fb: FormBuilder) {
        this.form = this.fb.group({
            nom: ['', [Validators.required, Validators.minLength(3)]],
            conversion: ['', [Validators.required, Validators.min(0)]],
        });

        this.form.get('unite')?.valueChanges.subscribe((value) => {
            if (value) this.form.patchValue({ conversion: value.conversion });
        });
    }

    onSubmit() {
        this.submitEvent.emit(this.form.value as Categorie);
    }

    resetForm() {
        this.form.reset();
    }
}
