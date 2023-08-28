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
import { ArticleConfectionAllResponse } from 'src/app/shared/interfaces/Response';
import { AddCategoryComponent } from './add-category/add-category.component';

@Component({
    selector: 'app-articles-form',
    templateUrl: './articles-form.component.html',
})
export class ArticlesShowComponent implements OnChanges {
    @ViewChild(AddCategoryComponent, { static: false })
    addCategoryComponent: AddCategoryComponent = <AddCategoryComponent>{};
    @Input()
    mode: mode = mode.add;
    @Input()
    article!: Article | undefined;
    @Input()
    data!: ArticleConfectionAllResponse;
    @Output()
    toAddModeEvent = new EventEmitter<void>();
    @Output()
    onAlert = new EventEmitter<AlertMsg>();
    @Output()
    formOk = new EventEmitter<any>();
    @Output('onCreateNewCategory')
    createNewCategoryEvent = new EventEmitter<any>();
    fournItems!: Fournisseur[];
    libelleExists = false;
    form: FormGroup;

    get fournisseurs() {
        return this.form.get('fournisseurs') as FormArray;
    }

    get libelle() {
        return this.form.get('libelle') as FormControl;
    }

    get category() {
        return this.form.get('category') as FormControl;
    }

    addFournisseur(f: Fournisseur) {
        this.fournisseurs.push(this.fb.control(f));
    }

    compareCat = (cat1: Categorie, cat2: Categorie): boolean => {
        return cat1 && cat2 ? cat1.id == cat2.id : cat1 == cat2;
    };

    printSuggestion = (f: Fournisseur) => f.nom;

    constructor(private photoService: PhotoService, private fb: FormBuilder) {
        this.form = this.fb.group({
            id: '',
            libelle: ['', Validators.required],
            prix: ['', Validators.required],
            stock: ['', Validators.required],
            category: [null, Validators.required],
            ref: ['', Validators.required],
            photo: [null, Validators.required],
            fournisseurs: this.fb.array([], [Validators.required]),
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.article) {
            this.form.patchValue(this.article);
            this.article.fournisseurs.forEach((f) => this.addFournisseur(f));
        } else this.form.reset();
    }

    onCreateNewCategory(categorie: Categorie) {
        const data = { ...categorie } as any;
        data.unite = data.unite?.id;

        this.createNewCategoryEvent.emit(data);
    }

    onPhotoPicked(event: Event) {
        const target = event.target as HTMLInputElement;

        this.photoService.handle(target, (img: string) =>
            this.form.patchValue({ photo: img })
        );
    }

    onSubmit() {
        const data = { ...this.form.value };
        data.fournisseurs = data.fournisseurs.map((f: Fournisseur) => f.id);

        this.formOk.emit(data);
    }

    resetForm() {
        this.form.reset();
        this.fournisseurs.clear();
    }
    resetAddCategoryForm() {
        this.addCategoryComponent.resetForm();
    }

    onFournisseurInput(text: string) {
        if (text) {
            this.fournItems = this.data.fournisseurs.filter(
                (item: Fournisseur) =>
                    item.nom.startsWith(text) &&
                    !this.fournisseurs.value.some(
                        (e: Fournisseur) => e.id == item.id
                    )
            );
        } else this.fournItems = [];
    }

    onAddFournisseur(fourn: Fournisseur) {
        this.fournItems = [];

        if (
            !this.fournisseurs.controls.some(
                (item) => item.value.id == fourn.id
            )
        ) {
            this.fournisseurs.push(this.fb.control(fourn));
            this.form.markAsDirty();
        }
    }

    onDeleteFournisseur(fourn: Fournisseur) {
        const index = this.fournisseurs.controls.findIndex(
            (c) => c.value.id == fourn.id
        );

        this.fournisseurs.removeAt(index);
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
                    this.category.value?.cl ?? 1
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
}
