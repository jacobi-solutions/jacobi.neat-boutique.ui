import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { Interface } from 'readline';
import { VendorDisplay } from 'src/app/models/vendor-display';
import { VendorSettingsService } from 'src/app/services/vendor-settings.service';
import { THEME } from 'src/theme/theme-constants';

@Component({
  selector: 'app-edit-poll-ad',
  templateUrl: './edit-poll-ad.component.html',
  styleUrls: ['./edit-poll-ad.component.scss'],
  // encapsulation: ViewEncapsulation.None,

})
export class EditPollAdComponent implements OnInit {

  @Input() vendor: VendorDisplay;
  @Input() clearForm: boolean;
  @Output() onChange: EventEmitter<any> = new EventEmitter<any>();

  public defaultLogoImg = THEME.avatar.defaultImage;
  public iconShowChart: string;
  public iconShowComments: string;
  public expandTopVoted: boolean = false;
  public expandComments: boolean = false;
  public colors: string[] = THEME.colors.list;
  public pollForm: UntypedFormGroup;
  public pollFormFields: string[];
  public minQuestions = 2;
  public maxQuestions = 5;
  public currentQuestions = 3;

  constructor(private _vendorSettingsService: VendorSettingsService) {


    this.pollFormFields = [
      'category',
      'pollQuestion',
      'pollAnswer1',
      'pollAnswer2',
      'pollAnswer3',
      'pollAnswer4',
      'pollAnswer5',
    ];

    let formInputs = {};
    this.pollFormFields.forEach((field, i) => {
      if(!formInputs.hasOwnProperty(field)) {
        if(i < 4) {
          formInputs[field] = new UntypedFormControl(null, [Validators.required, Validators.minLength(1)]);
        } else {
          formInputs[field] = new UntypedFormControl(null, []);
        }
      }
    });

    this.pollForm = new UntypedFormGroup(formInputs);
    this.pollForm.valueChanges.subscribe(values => {
      this.onChange.emit(values);
      this._vendorSettingsService.updateCurrentPollAd(this.pollForm);
    });
  }

  ngOnInit() {
    if(this.clearForm) {
      let fieldsReset = {};
      this.pollFormFields.forEach(field => fieldsReset[field] = null);
      this.pollForm.reset(fieldsReset);
    }
  }

  addAnswer() {
    this.onChange.emit(false);
    
    if(this.currentQuestions < this.maxQuestions) {
      this.currentQuestions++;
    }
  }

  removeAnswer(answer: string, position: number) {
    this.onChange.emit(false);

    if(this.currentQuestions > this.minQuestions) {
      this.pollForm.patchValue({ [answer]: null });
      const isBetweenAnswers = (this.currentQuestions > position);

      if(isBetweenAnswers) {        
        new Array(this.currentQuestions - position).fill('blank').forEach((_, i) => {
          const shiftFiled = this.pollFormFields[(position + i + 1)];
          const shiftAnswer = this.pollFormFields[(position + i + 2)];
          this.pollForm.patchValue({ [shiftFiled]: this.pollForm.value[shiftAnswer], [shiftAnswer]: null });
        });
      }

      this.currentQuestions--;
    }
  }

  toggleTopVotedChart() {
    this.expandTopVoted = !this.expandTopVoted;
    this.iconShowChart = this.expandTopVoted ? 'eye-outline' : 'eye-off-outline';
  }

  toggleComments() {
    this.expandComments = !this.expandComments;
    this.iconShowComments = this.expandComments ? 'chatbox-ellipses' : 'chatbox-ellipses-outline';
  }
}
