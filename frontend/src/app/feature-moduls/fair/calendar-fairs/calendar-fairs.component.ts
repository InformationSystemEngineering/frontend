import { Component, OnInit } from '@angular/core';
import { FairService } from '../fair.service';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import multiMonthPlugin from '@fullcalendar/multimonth';
import { EventInput } from '@fullcalendar/core';
import { Fair } from 'src/app/model/Fair.model';

@Component({
  selector: 'app-calendar-fairs',
  templateUrl: './calendar-fairs.component.html',
  styleUrls: ['./calendar-fairs.component.css']
})
export class CalendarFairsComponent  implements OnInit {
  fairs: Fair[] = []; 

  constructor(private fairService: FairService) {}

  ngOnInit(): void {
    this.fairService.getAllFairs().subscribe({
      next: (result: Fair[]) => {
        this.fairs = result;
        console.log(this.fairs);
        this.updateCalendarEvents();
      },
      error: (error: any) => {
        console.error('Error loading fairs', error);
      },
    });
  }

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, multiMonthPlugin],
    initialView: 'multiMonthYear',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'multiMonthYear,dayGridMonth,timeGridWeek'
    },
    views: {
      timeGrid: {
        dayMaxEvents: 4
      },
      year: {
        type: 'dayGrid',
        duration: { years: 1 }
      }
    },

    eventClick: (info) => {
      // info.event sadrži sve informacije o događaju
      const fairId = info.event.id;
      const fairName = info.event.title;
      const fairStart = info.event.start;
  
      // Implementirajte logiku prikaza informacija o događaju, na primer, putem modala ili drugog prikaza
      console.log('Clicked on event:', fairId, fairName, fairStart);
      // Ovde možete implementirati logiku za prikaz dodatnih informacija
    },

    events: [] as EventInput[]
  }

  
  

  updateCalendarEvents(): void {
    const events: EventInput[] = this.fairs.map((fair) => {
        const dateObject = fair.date; // Assuming fair.date is already a Date object

        return {
            id: String(fair.id),
            title: `${fair.name} - Started: ${fair.startTime} hours`,
            start: dateObject
        };
    });

    this.calendarOptions.events = events;
}


}
