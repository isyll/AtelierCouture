import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import { Article } from '../../shared/interfaces/Article';
import { mode } from 'src/app/shared/enums/mode';
import {
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { Categorie } from 'src/app/shared/interfaces/Categorie';
import { Fournisseur } from 'src/app/shared/interfaces/Fournisseur';
import { AlertMsg } from 'src/app/shared/interfaces/AlertMsg';
import { PhotoService } from 'src/app/services/photo.service';

@Component({
    selector: 'app-articles-form',
    templateUrl: './articles-form.component.html',
})
export class ArticlesShowComponent implements OnChanges {
    @ViewChild('photoContainer')
    photoImg!: any;

    @Input()
    mode: mode = mode.add;

    @Input()
    article!: Article | undefined;

    @Input()
    data!: {
        articles: Article[];
        categories: Categorie[];
        fournisseurs: Fournisseur[];
    };

    @Output()
    toAddModeEvent = new EventEmitter<void>();

    @Output()
    onAlert = new EventEmitter<AlertMsg>();

    @Output()
    formOk = new EventEmitter<any>();

    submitBtnDisabled = true;

    fournItems!: Fournisseur[];

    selectedFournisseurs: Fournisseur[] = [];

    libelleExists = false;

    form: FormGroup;

    get fournisseurs() {
        return this.form.get('fournisseurs') as FormArray;
    }

    addFournisseur(f: Fournisseur) {
        this.fournisseurs.push(this.fb.control(f));
    }

    compareCat = (cat: Categorie, cat2: Categorie): boolean =>
        cat && cat2 ? cat.id == cat2.id : cat == cat2;

    constructor(private photoService: PhotoService, private fb: FormBuilder) {
        this.form = this.fb.group({
            id: ['', Validators.required],
            libelle: ['', Validators.required],
            prix: ['', Validators.required],
            stock: ['', Validators.required],
            category: ['', Validators.required],
            ref: ['', Validators.required],
            photo: ['', Validators.required],
            fournisseurs: [[], []],
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.article) {
            this.form.patchValue(this.article);
            this.article.fournisseurs.forEach((f) => this.addFournisseur(f));
        } else this.form.reset();
    }

    onPhotoPicked(event: Event) {
        const target = event.target as HTMLInputElement;

        this.photoService.handle(target, (img: string) =>
            this.form.patchValue({ photo: img })
        );

        this.submitBtnDisabled = !this.check();
    }

    onSubmit() {
        if (this.mode === mode.add) {
            this.formOk.emit({
                ...this.form.value,
            });

            this.submitBtnDisabled = true;
            this.form.reset();
        } else this.formOk.emit(this.form.value);
    }

    onFournisseurInput(event: Event) {
        const target = event.target as HTMLInputElement;
        const text = target.value.trim().replace(/\s+/g, ' ').toLowerCase();

        if (text) {
            const selectedFournisseurs = this.form.get('fournisseurs')?.value;

            this.fournItems = this.data.fournisseurs.filter(
                (item: Fournisseur) =>
                    item.nom.startsWith(text) &&
                    !selectedFournisseurs.some(
                        (e: Fournisseur) => e.id == item.id
                    )
            );
        } else this.fournItems = [];
    }

    onAddFournisseur(fourn: Fournisseur, el: HTMLInputElement) {
        const selectedFournisseurs = this.form.get('fournisseurs')?.value;

        this.fournItems = [];
        el.value = '';

        if (
            !selectedFournisseurs?.some(
                (item: Fournisseur) => item.id == fourn.id
            )
        )
            (this.form.get('fournisseurs') as FormArray)?.push(
                new FormControl(fourn)
            );

        this.check();
    }

    onDeleteFournisseur(fourn: Fournisseur) {
        const selectedFournisseurs = this.form.get('fournisseurs')?.value;
        (this.form.get('fournisseurs') as FormArray).clear();

        selectedFournisseurs.forEach((f: Fournisseur) => {
            if (f.id != fourn.id)
                (this.form.get('fournisseurs') as FormArray).push(
                    new FormControl(f)
                );
        });

        this.check();
    }

    check(): boolean {
        const id = this.article?.id;

        this.libelleExists = this.data.articles.some(
            (a) =>
                (this.mode === mode.add || id != a.id) &&
                a.libelle.trim().replace(/\s+/g, ' ').toLowerCase() ===
                    this.form
                        .get('libelle')
                        ?.value?.trim()
                        .replace(/\s+/g, ' ')
                        .toLowerCase()
        );
        console.log(this.libelleExists);

        if (this.libelleExists) return !(this.submitBtnDisabled = true);

        const valid =
            this.form.get('libelle')?.value &&
            this.form.get('libelle')?.value.length >= 3 &&
            this.form.get('stock')?.value &&
            this.form.get('prix')?.value &&
            this.form.get('category')?.value &&
            this.form.get('fournisseurs')?.value.length;

        if (!valid) return !(this.submitBtnDisabled = true);

        return !(this.submitBtnDisabled = false);
    }

    updateRef() {
        const ref = (libelle: string, categorie: string, cl: number) =>
            `REF-${libelle.slice(0, 3)}-${categorie.slice(
                0,
                3
            )}-${cl}`.toUpperCase();

        const libelle = this.form.get('libelle'),
            category = this.data.categories.find(
                (item) => item.id == this.form.get('category')?.value
            )!;

        if (this.mode === mode.add) {
            this.form.patchValue({
                ref: ref(
                    libelle?.value ?? '',
                    category?.libelle ?? '',
                    category?.cl ?? 1
                ),
            });
        } else {
            const refElements = this.article?.ref.split('-');

            if (refElements)
                this.form.patchValue({
                    ref: ref(
                        libelle?.value ?? '',
                        category.libelle ?? '',
                        parseInt(refElements[refElements.length - 1])
                    ),
                });
        }
    }
}
