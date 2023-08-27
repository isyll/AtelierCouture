import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
} from '@angular/core';
import {
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { MyValidators } from 'src/app/my-validators';
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
    article!: Article | undefined;

    @Input()
    mode!: mode;

    @Output('onSubmit')
    submitFormEvent = new EventEmitter();

    @Output('toAddMode')
    toAddMode = new EventEmitter();

    isPromo: boolean = false;

    form!: FormGroup;

    artConfSuggestions: { [inputId: number]: Article[] } = {};

    constructor(private fb: FormBuilder, private photoService: PhotoService) {
        this.form = this.fb.group({
            libelle: ['', [Validators.required]],
            category: ['', [Validators.required]],
            stock: ['', [Validators.required, Validators.min(0)]],
            marge: [
                0,
                [
                    Validators.required,
                    MyValidators.maxPct(30),
                    Validators.min(0),
                ],
            ],
            cout_fabrication: ['', [Validators.required]],
            photo: ['', [Validators.required]],
            promo: [null, [Validators.min(0), Validators.max(100)]],
            confection: this.fb.array([], [Validators.required]),
            ref: ['', Validators.required],
            total: [''],
        });

        this.addConfection();
    }

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

    get total() {
        return this.form.get('total') as FormControl;
    }

    get promo() {
        return this.form.get('promo') as FormControl;
    }

    get fabrication() {
        return this.form.get('cout_fabrication') as FormControl;
    }

    compareCat = (cat1: Categorie, cat2: Categorie) => {
        if (cat1 && cat2) return cat1.id == cat2.id;
        return false;
    };

    // donne le champs a afficher dans la liste des sugestions
    printSuggestion = (art: Article) => art.libelle;

    ngOnChanges(changes: SimpleChanges): void {
        if (this.article) {
            console.log(this.article);

            this.form.patchValue(this.article);
            this.isPromo = this.article.promo ? true : false;
            this.calculateTotal();
        } else {
            this.form.reset();
            this.isPromo = false;
        }

        if (this.data) {
            this.form.setValidators(
                // vérifier que fil, bouton, tissu sont présents dans la liste
                // des confection de l'article
                MyValidators.ibrahimaSylla(this.data.articles_confection)
            );
        }
    }

    onArtConfInput(event: Event, i: number) {
        const target = event.target as HTMLInputElement;
        const text = target.value.trim().replace(/\s+/g, ' ').toLowerCase();
        this.artConfSuggestions[i] = [];

        if (text) {
            this.artConfSuggestions[i] = this.data.articles_confection
                .filter((item) => item.libelle.startsWith(text))
                .filter(
                    (item) =>
                        !this.confection.controls.some(
                            (art) => art.get('id')?.value == item.id
                        )
                );
        }
    }

    // cette fonction est appelée dès qu'un article de confection est
    // sélectionné.
    onArtConfSelect(artConf: Article, index: number) {
        this.artConfSuggestions = [];

        const conf = this.confection.at(index);
        conf.get('id')?.setValue(artConf.id);
    }

    addConfection() {
        // on ne peut ajouter un nouveau champs que si le dernier a été
        // rempli corretement
        if (
            !this.confection.controls.some(
                (art) =>
                    art.get('id')?.value == 0 || art.get('quantite')?.value <= 0
            )
        ) {
            const conf = this.fb.group({
                id: 0,
                libelle: '',
                quantite: 0,
            });

            this.confection.push(conf);
        }
    }

    onPhotoPicked(event: Event) {
        const target = event.target as HTMLInputElement;

        this.photoService.handle(target, (img: string) =>
            this.form.patchValue({ photo: img })
        );
    }

    onSubmit() {
        const data = { ...this.form.value };
        data.category = data.category?.id;

        // reformatage des confections
        data.confection = data.confection
            .filter((item: any) => item.id != 0)
            .map((item: any) => {
                return { [item.id]: { quantite: item.quantite } };
            })
            .reduce((result: any, obj: any) => {
                return { ...result, ...obj };
            }, {});

        this.submitFormEvent.emit(data);
    }

    resetForm() {
        this.confection.clear();
        this.form.reset();
    }

    onCheckPromo(event: Event) {
        const target = event.target as HTMLInputElement;
        this.isPromo = target.checked;
        if (!this.isPromo) this.promo.reset();
        this.calculateTotal();
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

    calculateTotal() {
        let cout_fab = 0,
            marge = this.marge && !this.marge.errors ? this.marge.value : 0;
        this.confection.controls.forEach((conf) => {
            const qtt = conf.get('quantite')?.value ?? 0,
                prix = this.data.articles_confection.find(
                    (art) => art.id == conf.get('id')?.value
                )?.prix;

            if (prix) cout_fab += qtt * prix;
        });

        this.fabrication.setValue(cout_fab);

        let total = marge + cout_fab;

        if (this.isPromo && !this.promo.errors)
            total = total * (1 - this.promo.value / 100);

        this.total.setValue(Math.floor(total * 100) / 100);
    }
}
