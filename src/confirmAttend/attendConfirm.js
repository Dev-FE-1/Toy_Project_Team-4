import './attendConfirm.css'
import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers-pro/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';

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
            <DateRangePicker localeText={{ start: 'Check-in', end: 'Check-out' }} />
          </div>
        </div>
      </div> 
    </div>
  `
}