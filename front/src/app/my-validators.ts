import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Article } from './shared/interfaces/Article';

export class MyValidators {
    static ibrahimaSylla(artConf: Array<any>): ValidatorFn {
        return (control: AbstractControl<any>): ValidationErrors | null => {
            let novalid = false;
            const confection = control.root.get('confection')?.value;

            const needed = artConf
                .filter(
                    (art: Article) =>
                        art.libelle === 'fil' ||
                        art.libelle === 'bouton' ||
                        art.libelle === 'tissu'
                )
                .map((art: Article) => art.id)
                .forEach((conf: any) => {
                    if (!confection.map((conf: any) => conf.id).includes(conf))
                        novalid = true;
                });

            if (novalid) return { novalid: true };
            return null;
        };
    }

    static maxPct(pct: number): ValidatorFn {
        pct = pct / 100;

        return (control: AbstractControl): ValidationErrors | null => {
            const total = control.root.get('cout_fabrication')?.value,
                marge = control.value;

            if (0.3 * total < marge)
                return {
                    maxPct: true,
                };

            return null;
        };
    }
}
