import { Pipe, PipeTransform } from '@angular/core';
import { IngresoEgreso } from '../models/ingreso-egreso';

@Pipe({
  name: 'ordenIngreso'
})
export class OrdenIngresoPipe implements PipeTransform {

  transform(items: IngresoEgreso[]) : IngresoEgreso[] {
    return items = items.slice().sort((a, b) =>{
      if(a.tipo === 'egreso'){
        return -1;
      }else{
        return 1;
      }
    }); 
  }
}
