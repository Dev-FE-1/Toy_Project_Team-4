import './attendConfirm.css'

export function loadAttendConfirm () {
  const app = document.getElementById('app')

  app.innerHTML = `
    <div class="attendConfirm">
      <div class="title-wrap">
        <h2>입퇴실 기록</h2>
        <div class="search-wrap">
          <a href="./">신청하기 > </a>
          <div class="date-range">
            <span>기간</span>
            <mat-form-field class="example-form-field">
              <mat-label>기간을 선택하세요.</mat-label>
              <mat-date-range-input
                [formGroup]="campaignOne"
                [rangePicker]="campaignOnePicker"
                [comparisonStart]="campaignTwo.value.start"
                [comparisonEnd]="campaignTwo.value.end">
                <input matStartDate placeholder="Start date" formControlName="start">
                <input matEndDate placeholder="End date" formControlName="end">
              </mat-date-range-input>
              <mat-hint>MM/DD/YYYY – MM/DD/YYYY</mat-hint>
              <mat-datepicker-toggle matIconSuffix [for]="campaignOnePicker"></mat-datepicker-toggle>
              <mat-date-range-picker #campaignOnePicker></mat-date-range-picker>
            </mat-form-field>
          </div>
        </div>
      </div>
    </div>
  `
}