import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-input-field',
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.scss'],
})
export class InputFieldComponent implements OnInit {
  @Input() formGroupInstance: UntypedFormGroup;
  @Input() inputName: string;
  @Output() inputNameChange = new EventEmitter<string>();
  @Input() inputType: string;
  @Input() label: string;
  @Input() icon: string;
  @Input() altStyle: string;
  @Output() iconClick: EventEmitter<any> = new EventEmitter();

  @Input() invalidInputWarnings: { warning: string, errorType: string }[];
  @Input() value: any;

  public inputControl: UntypedFormControl;

  constructor(private _util: UtilService) {}

  ngOnInit() {
    if(this.formGroupInstance) {
      this.inputControl = <UntypedFormControl>this.formGroupInstance.controls[this.inputName];
    } else {
      this.inputName = 'input-' + this._util.uniqueStr();
      this.formGroupInstance = new UntypedFormGroup({
        [this.inputName]: new UntypedFormControl('', []),
      });
      // be able to emit dynamic field name
      this.inputNameChange.emit(this.inputName);
    }

    if(this.value) {
      this.formGroupInstance.patchValue({ [this.inputName]: this.value })
    }
  }

  @HostListener('click', ['$event'])
  onIconClick(event: any) {    
    const { offsetX, offsetY, target } = event; 
    const { clientHeight, clientWidth } = target;
    const clickedOnIcon = clientWidth - 60;

    if(clickedOnIcon < offsetX) {
      this.iconClick.emit(true);
    }
  }
  
}
