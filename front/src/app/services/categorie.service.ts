import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Categorie } from '../shared/interfaces/Categorie';
import { AbstractService } from './abstract.service';

@Injectable({
    providedIn: 'root',
})
export class CategorieService extends AbstractService<Categorie> {
    url() {
        return this.base + 'categories';
    }
}
