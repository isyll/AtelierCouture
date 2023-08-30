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
import { Unite } from 'src/app/shared/interfaces/Unite';
import { AddUniteComponent } from './add-unite/add-unite.component';
import { SuggestionsComponent } from 'src/app/suggestions/suggestions.component';

@Component({
    selector: 'app-articles-form',
    templateUrl: './articles-form.component.html',
})
export class ArticlesShowComponent implements OnChanges {
    @ViewChild(AddCategoryComponent, { static: false })
    addCategoryComponent: AddCategoryComponent = <AddCategoryComponent>{};
    @ViewChild(AddUniteComponent, { static: false })
    addUniteComponent: AddUniteComponent = <AddUniteComponent>{};
    @ViewChild(SuggestionsComponent, { static: false })
    suggestionsComponent: SuggestionsComponent = <SuggestionsComponent>{};

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
    @Output('onCreateNewUnite')
    createNewUniteEvent = new EventEmitter<any>();
    @Output('onAttachUnite')
    attachUniteEvent = new EventEmitter<any>();

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

    compareUnites = (u1: Unite, u2: Unite): boolean => {
        return u1 && u2 ? u1.id == u2.id : u1 == u2;
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
            unite: null,
        });

        this.form.get('category')?.valueChanges.subscribe((value) => {
            if (value) this.form.patchValue({ unite: value.unite });
        });

        this.form.get('unite')?.valueChanges.subscribe((value) => {
            let cat = this.form.get('category')?.value as Categorie;
            if (value && cat) {
                // si on choisi une unité différente de celle par défaut
                // elle est ajouté à la liste des unités de cette catégorie
                // si celle-ci ne s'y trouve pas déjà
                if (
                    value.id != cat.unite?.id &&
                    !cat.unites?.some((u: Unite) => u.id == value.id)
                )
                    this.attachUniteEvent.emit({
                        category: cat.id,
                        unites: [
                            value.id,
                            ...(cat.unites?.map((u) => u.id) ?? []),
                        ],
                    });
            }
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

    onCreateNewUnite(unite: Unite) {
        this.createNewUniteEvent.emit(unite);
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
        data.category = data.category.id;

        data.stock = data.stock * data.unite.conversion;

        console.log(data);

        this.formOk.emit(data);
    }

    resetForm() {
        this.form.reset();
        this.fournisseurs.clear();
    }

    addCategoryCompleted(category?: Categorie) {
        this.addCategoryComponent.resetForm();

        if (category) {
            // reformatage des unites etant donne que le
            // select attend un type Unite et que
            // les unites contiennent des ids.
            category.unite = this.data.unites.find(
                (u: any) => u.id == category.unite
            );
            category.unites = [];
            this.data.categories.push(category);
        }
    }

    addUniteCompleted(unite?: Unite) {
        console.log(unite);

        this.addUniteComponent.resetForm();

        if (unite) this.data.unites.push(unite);
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
        this.suggestionsComponent.resetInupt();

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
