import { Pipe, PipeTransform } from '@angular/core';
import {Spot} from "../services/data.service";


@Pipe({
    name: 'smartfilter',
    pure: false
})
export class FilterPipe implements PipeTransform {
    transform(items: Spot[], filter: Spot): Spot[] {
        if (!items || !filter) {
            return items;
        }
        // filter items array, items which match and return true will be kept, false will be filtered out
        return items.filter((item: Spot) => this.applyFilter(item, filter));
    }

    /**
     * Perform the filtering.
     *
     * @param {Spot} Spot The Spot to compare to the filter.
     * @param {Spot} filter The filter to apply.
     * @return {boolean} True if book satisfies filters, false if not.
     */
    applyFilter(item: Spot, filter: Spot): boolean {
        for (let field in filter) {
            if (filter[field]) {
                if (typeof filter[field] === 'string') {
                    if (item[field].toLowerCase().indexOf(filter[field].toLowerCase()) === -1) {
                        return false;
                    }
                } else if (typeof filter[field] === 'number') {
                    if (item[field] !== filter[field]) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
}