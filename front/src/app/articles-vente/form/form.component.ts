import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import {
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { PhotoService } from 'src/app/services/photo.service';
import { mode } from 'src/app/shared/enums/mode';
import { Article } from 'src/app/shared/interfaces/Article';
import { ArticleVenteData } from 'src/app/shared/interfaces/ArticleVente';
import { Categorie } from 'src/app/shared/interfaces/Categorie';

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
})
export class FormComponent implements OnChanges {
    @Input()
    data!: ArticleVenteData;

    @Input()
    article!: Article;

    @Input()
    size!: number;

    @Input()
    total!: number;

    @Input()
    page!: number;

    @Input()
    mode!: mode;

    isPromo: boolean = false;

    totalPrice!: number;

    form!: FormGroup;

    constructor(private fb: FormBuilder, private photoService: PhotoService) {
        this.form = this.fb.group({
            id: ['', Validators.required],
            libelle: ['', Validators.required],
            category: ['', Validators.required],
            stock: ['', Validators.required],
            marge: [0, Validators.required],
            cout_fabrication: ['', Validators.required],
            photo: ['', Validators.required],
            promo: [''],
            confection: this.fb.array([]),
            ref: ['', Validators.required],
        });
    }

    compareCat = (cat1: Categorie, cat2: Categorie) => {
        if (cat1 && cat2) return cat1.id == cat2.id;
        return false;
    };

    get confection() {
        return this.form.get('confection') as FormArray;
    }

    get libelle() {
        return this.form.get('libelle') as FormControl;
    }

    get category() {
        return this.form.get('category') as FormControl;
    }

    get marge() {
        return this.form.get('marge') as FormControl;
    }

    get fabrication() {
        return this.form.get('cout_fabrication') as FormControl;
    }

    onPhotoPicked(event: Event) {
        const target = event.target as HTMLInputElement;

        this.photoService.handle(target, (img: string) =>
            this.form.patchValue({ photo: img })
        );
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.article) {
            this.article.confection?.forEach((item) =>
                this.confection.push(item)
            );
        }
    }

    onSubmit() {
        console.log(this.form.value);
    }

    onCheckPromo(event: Event) {
        const target = event.target as HTMLInputElement;
        this.isPromo = target.checked;
        if (!this.isPromo) this.form.reset('photo');
    }

    addArtConf() {
        this.confection.push(this.fb.control(''));
    }

    updateRef() {
        const ref = (libelle: string, categorie: string, cl: number) =>
            `REF-${libelle.slice(0, 3)}-${categorie.slice(
                0,
                3
            )}-${cl}`.toUpperCase();

        if (this.mode === mode.add) {
            this.form.patchValue({
                ref: ref(
                    this.libelle.value ?? '',
                    this.category.value?.libelle ?? '',
                    this.category.value?.cl + 1 ?? 1
                ),
            });
        } else {
            const refElements = this.article?.ref.split('-');
            if (refElements)
                this.form.patchValue({
                    ref: ref(
                        this.libelle.value ?? '',
                        this.category.value?.libelle ?? '',
                        parseInt(refElements[refElements.length - 1])
                    ),
                });
        }
    }

    calculateTotalPrice() {
        this.totalPrice = this.marge.value + this.fabrication.value;
    }
}
