import { Injectable } from '@angular/core';
import { AbstractService } from './abstract.service';
import { Categorie } from '../shared/interfaces/Categorie';

@Injectable({
    providedIn: 'root',
})
export class CategorieConfectionService extends AbstractService<Categorie> {
    url() {
        return this.base + 'categories/confection';
    }
}
