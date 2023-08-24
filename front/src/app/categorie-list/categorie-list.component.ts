import { Component, OnInit } from '@angular/core';
import { CategorieService } from '../services/categorie.service';
import { Categorie } from '../shared/interfaces/Categorie';
import { mode } from '../shared/enums/mode';
import { DataResponse, Response } from '../shared/interfaces/Response';

@Component({
    selector: 'app-categorie-list',
    templateUrl: './categorie-list.component.html',
})
export class CategorieListComponent implements OnInit {
    data!: Categorie[];
    pageSize!: number;
    total!: number;
    p: number = 1;
    checkeds: number[] = [];
    okBtnDisabled: boolean = true;
    inputValue!: string;
    mode: mode = mode.add;
    size: number = 5;

    constructor(private categorieService: CategorieService) {}

    ngOnInit(): void {
        this.pageLoaded(this.p);
    }

    changeMode() {
        if (this.checkeds.length === 1 && this.mode === mode.edit) {
            const libelle = this.data.find(
                (item) => item.id === this.checkeds[0]
            )?.libelle;

            if (libelle) this.inputValue = libelle;
        }
    }

    refresh() {
        this.data.forEach((item) => {
            if (item.id) item.check = this.checkeds.includes(item.id);
        });
    }

    pageLoaded(page: number) {
        this.p = page;

        this.categorieService
            .paginate(page, this.size)
            .subscribe((response) => {
                this.data = response.data;
                this.refresh();

                this.pageSize = response.pagination.per_page;
                this.total = response.pagination.total;
            });
    }

    delete() {
        this.checkeds.forEach((id) =>
            this.categorieService.delete(id).subscribe((response) => {
                this.alertMsg(
                    response.message ?? 'suppression effectuée',
                    response.success ? 'success' : 'danger'
                );

                this.pageLoaded(1);
                this.checkeds = [];
            })
        );
    }

    checkHandler(event: Event) {
        const target = event.target as HTMLInputElement;
        const idd = target.getAttribute('id');

        if (idd) {
            const id = parseInt('' + idd);

            if (target.checked) {
                if (!this.checkeds.includes(id)) this.checkeds.push(id);
            } else {
                const index = this.checkeds.indexOf(id);
                if (index > -1) this.checkeds.splice(index, 1);
            }

            this.inputValue = '';

            if (this.checkeds.length === 1) {
                const elem = this.data.find(
                    (cat) => cat.id == this.checkeds[0]
                );
                if (elem) this.inputValue = elem.libelle;
            }
        }
    }

    inputChangeHandler() {
        this.okBtnDisabled = true;

        if (this.inputValue.length > 2) {
            this.categorieService
                .search(this.inputValue.trim().replace(/\s+/g, ' '))
                .subscribe((response: Response) => {
                    if (response.data === null) this.okBtnDisabled = false;
                });
        }
    }

    actionHandler() {
        const libelle = this.inputValue.trim().replace(/\s+/g, ' '),
            handle = (response: DataResponse<Categorie>) => {
                this.alertMsg(
                    response.message ??
                        `Action ${
                            response.success ? 'effectuée' : 'non effectuée'
                        }`,
                    response.success ? 'success' : 'danger'
                );
                this.pageLoaded(this.p);
                this.inputValue = '';
                this.checkeds = [];
                this.okBtnDisabled = true;
            };

        if (this.mode === 'add') {
            this.categorieService
                .create({ libelle: libelle })
                .subscribe((response: DataResponse<Categorie>) =>
                    handle(response)
                );
        } else if (this.mode === 'edit') {
            const id = this.checkeds[0];
            this.categorieService
                .update(id, { libelle: libelle })
                .subscribe((response: DataResponse<Categorie>) =>
                    handle(response)
                );
        }
    }

    checkAll(event: Event) {
        this.checkeds = [];
        const target = event.target as HTMLInputElement;

        if (target.checked) {
            this.data.forEach((item) => {
                if (item.id) this.checkeds.push(item.id);
            });
        } else this.checkeds = [];
        this.refresh();
    }

    private alertMsg(message: string, type: string) {
        const alertPlaceholder = document.getElementById('alertMsgPlaceholder');

        if (alertPlaceholder) {
            const appendAlert = (message: string, type: string) => {
                alertPlaceholder.innerHTML = '';

                const wrapper = document.createElement('div');
                wrapper.innerHTML = [
                    `<div class="alert alert-${type} alert-dismissible" role="alert">`,
                    `   <div>${message}</div>`,
                    '   <button type="button" class="btn-close" data-bs-dismiss="alert"></button>',
                    '</div>',
                ].join('');

                alertPlaceholder.append(wrapper);
            };

            appendAlert(message, type);
        }
    }
}
