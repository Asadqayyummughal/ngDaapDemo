import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'formateAddress',
    standalone: true,
})
export class FormateAddressPipe implements PipeTransform {
    transform(address: string): string {
        if (!address) return '';
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }
}
