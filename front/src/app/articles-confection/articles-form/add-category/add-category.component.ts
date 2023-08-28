import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Categorie } from 'src/app/shared/interfaces/Categorie';
import { Unite } from 'src/app/shared/interfaces/Unite';

@Component({
    selector: 'add-new-category',
    templateUrl: './add-category.component.html',
})
export class AddCategoryComponent {
    @Input()
    unites!: Unite[];
    @Output('onSubmit')
    submitEvent = new EventEmitter();
    form!: FormGroup;

    constructor(private fb: FormBuilder) {
        this.form = this.fb.group({
            libelle: ['', [Validators.required, Validators.minLength(3)]],
            unite: [null, Validators.required],
            conversion: null,
        });

        this.form.get('unite')?.valueChanges.subscribe((value) => {
            if (value) this.form.patchValue({ conversion: value.conversion });
        });
    }

    compareUnite = (u1: Unite, u2: Unite) =>
        u1 && u2 ? u1.id == u2.id : u1 == u2;

    onSubmit() {
        this.submitEvent.emit(this.form.value as Categorie);
    }

    resetForm() {
        this.form.reset();
    }
}
