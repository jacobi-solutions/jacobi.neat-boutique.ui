import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-textarea-field',
  templateUrl: './textarea-field.component.html',
  styleUrls: ['./textarea-field.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TextareaFieldComponent implements OnInit {
  @Input() formGroupInstance: UntypedFormGroup;
  @Input() inputName: string;
  @Output() inputNameChange = new EventEmitter<string>();
  @Input() inputType: string;
  @Input() label: string;
  @Input() maxlength: number;
  @Input() remHeight: number = 10;
  @Input() altStyle: string;
  @Input() charsRemaining = new EventEmitter<number>();
  // @Input() icon: string;
  @Input() value: string;
  @Input() invalidInputWarnings: { warning: string, errorType: string }[];

  public unique: string;
  public inputControl: UntypedFormControl;
  private _nativeTextarea: HTMLTextAreaElement;

  constructor(private _util: UtilService) {
    this.unique = this._util.uniqueStr();
  }

  ngOnInit() {
    this.inputControl = <UntypedFormControl>this.formGroupInstance?.controls[this.inputName];

    let validations = [];
    if(this.maxlength) {
      validations = [ Validators.minLength(this.maxlength) ];
    }

    if(this.formGroupInstance) {
      this.inputControl = <UntypedFormControl>this.formGroupInstance.controls[this.inputName];
    } else {
      this.inputName = 'textarea-' + this._util.uniqueStr();
      this.formGroupInstance = new UntypedFormGroup({
        [this.inputName]: new UntypedFormControl('', validations),
      });
      // be able to emit dynamic field name
      this.inputNameChange.emit(this.inputName);
    }

    if(this.value) {
      this.formGroupInstance.patchValue({ [this.inputName]: this.value })
    }
  }
  
  ngAfterViewChecked() {
    if(!this._nativeTextarea) {
      const ionTeaxtarea = document
        .getElementsByClassName(this.unique).item(0)
        ?.getElementsByTagName('ion-textarea').item(0);

      this._nativeTextarea = ionTeaxtarea.getElementsByTagName('textarea').item(0);
      
      ionTeaxtarea?.setAttribute('style', `height: ${ this.remHeight }rem`);
      this._nativeTextarea?.setAttribute('style', `height: ${ this.remHeight - 1.75 }rem`);
    }
  }

  public calcRemainingChars() {    
    const currentCharLength = this.formGroupInstance?.value[this.inputName].length;
    if(this.maxlength && currentCharLength) {
      this.charsRemaining.emit(this.maxlength - currentCharLength);
    }
    
  }
}
